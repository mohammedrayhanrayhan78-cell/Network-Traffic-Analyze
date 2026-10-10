require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const Redis = require('ioredis');
const crypto = require('crypto');

const app = express();

const PORT = process.env.PORT || 3000;
// FRONTEND_ORIGIN can be one URL or several separated by commas (no trailing slash needed)
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim().replace(/\/+$/, ''))
  .filter(Boolean);
const REDIS_URL = process.env.REDIS_URL; // set by Railway: ${{Redis.REDIS_URL}}
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const UPLOAD_TTL_SECONDS = 3600;
const TOKEN_TTL_SECONDS = parseInt(process.env.TOKEN_TTL_SECONDS || '3600', 10);
const UPLOAD_RATE_MAX = parseInt(process.env.UPLOAD_RATE_MAX || '10', 10);
const GENERAL_RATE_MAX = parseInt(process.env.GENERAL_RATE_MAX || '120', 10);
const REPORT_RATE_MAX = parseInt(process.env.REPORT_RATE_MAX || '600', 10);

let TOKEN_SECRET = process.env.TOKEN_SECRET;
if (!TOKEN_SECRET) {
  TOKEN_SECRET = crypto.randomBytes(32).toString('hex');
  console.warn('WARNING: TOKEN_SECRET env var is missing. A random secret was generated, but tokens will be invalid upon restart.');
}

// family: 0 lets Railway's private network work whether it resolves to IPv4 or IPv6
const redis = REDIS_URL
  ? new Redis(REDIS_URL, { family: 0, lazyConnect: true })
  : new Redis({ host: REDIS_HOST, port: REDIS_PORT, lazyConnect: true });

redis.on('error', (err) => {
  console.error('Redis error', err);
});

redis.connect().catch(() => {}); // Attempt initial connection, error is caught and logged

// Railway sits behind a proxy: trust it so rate limits see the real visitor IP
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: FRONTEND_ORIGINS }));

app.get('/health', (req, res) => {
  res.json({ ok: true, redis: redis.status });
});

// Rate limits
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: GENERAL_RATE_MAX,
  message: { error: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: UPLOAD_RATE_MAX,
  message: { error: 'Too many uploads' },
  standardHeaders: true,
  legacyHeaders: false,
});

const reportLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: REPORT_RATE_MAX,
  message: { error: 'Too many report requests' },
  standardHeaders: true,
  legacyHeaders: false,
});


// Uploads are kept in memory and handed to the worker through Redis.
// (On Railway the API and the worker run on different machines, so a shared folder will not work.)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

const JOB_ID_REGEX = /^[A-Za-z0-9-]{8,64}$/;

function generateToken(jobId) {
  const expiresAtMs = Date.now() + (TOKEN_TTL_SECONDS * 1000);
  const payload = `${jobId}.${expiresAtMs}`;
  const payloadBase64 = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadBase64).digest('base64url');
  return `${payloadBase64}.${signature}`;
}

function verifyToken(req, res, next) {
  const token = req.query.token;
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Invalid token format' });
  }
  
  const [payloadBase64, signature] = parts;
  
  const expectedSignature = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadBase64).digest('base64url');
  
  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return res.status(401).json({ error: 'Tampered token' });
    }
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token signature' });
  }

  const payload = Buffer.from(payloadBase64, 'base64url').toString('utf8');
  const [tokenJobId, expiresAtStr] = payload.split('.');
  
  if (req.params.id && req.params.id !== tokenJobId) {
    return res.status(401).json({ error: 'Token for a different job' });
  }

  const expiresAtMs = parseInt(expiresAtStr, 10);
  if (Date.now() > expiresAtMs) {
    return res.status(401).json({ error: 'Expired token' });
  }

  next();
}

app.post('/api/upload', uploadLimiter, upload.single('file'), async (req, res) => {
  if (redis.status !== 'ready') {
    return res.status(503).json({ error: 'Redis down' });
  }

  if (!req.file || !req.file.buffer || req.file.buffer.length === 0) {
    return res.status(400).json({ error: 'Empty file' });
  }

  try {
    const buf = req.file.buffer;

    if (buf.length < 4) {
      return res.status(400).json({ error: 'File too small' });
    }

    const hex = buf.subarray(0, 4).toString('hex');
    const validMagics = ['d4c3b2a1', 'a1b2c3d4', '4d3cb2a1', 'a1b23c4d', '0a0d0d0a'];

    if (!validMagics.includes(hex)) {
      return res.status(400).json({ error: 'Invalid file magic' });
    }

    const jobId = crypto.randomUUID();

    // order matters: file first, then status, then the queue entry the worker is waiting on
    await redis.set(`upload:${jobId}`, buf, 'EX', UPLOAD_TTL_SECONDS);
    await redis.set(`job:${jobId}:status`, 'queued', 'EX', 3600);
    await redis.rpush('jobs', jobId);

    const token = generateToken(jobId);
    return res.status(202).json({ jobId, token });
  } catch (err) {
    console.error('upload failed', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Make sure to catch Multer errors (like 413)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large' });
  }
  next(err);
});

app.get('/api/jobs/:id', generalLimiter, verifyToken, async (req, res) => {
  if (!JOB_ID_REGEX.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid job ID format' });
  }

  if (redis.status !== 'ready') {
    return res.status(503).json({ error: 'Redis down' });
  }

  const id = req.params.id;
  try {
    const status = await redis.get(`job:${id}:status`);
    if (!status) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    let result = { status };
    if (status === 'failed') {
      const error = await redis.get(`job:${id}:error`);
      if (error) {
        result.error = error;
      }
    }
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/reports/:id', reportLimiter, verifyToken, async (req, res) => {
  if (!JOB_ID_REGEX.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid job ID format' });
  }

  if (redis.status !== 'ready') {
    return res.status(503).json({ error: 'Redis down' });
  }

  const id = req.params.id;
  try {
    const status = await redis.get(`job:${id}:status`);
    if (!status) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (status !== 'done') {
      return res.status(409).json({ status });
    }
    
    const report = await redis.get(`report:${id}`);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.type('json').send(report);
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Fallback error handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API listening on port ${PORT}`);
});

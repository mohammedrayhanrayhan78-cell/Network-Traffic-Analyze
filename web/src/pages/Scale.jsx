import React from 'react';
import loadTest from '../loadTest.json';

export default function Scale() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      <section style={{ background: '#FFD60A', border: '3px solid #111', borderRadius: 34, padding: 30, boxShadow: '8px 8px 0 #111' }}>
        <h1 style={{ margin: '0 0 20px 0', fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: 1, letterSpacing: '-1px', color: '#111', textShadow: '2px 2px 0 #FFFFFF' }}>
          HOW IT SCALES
        </h1>
        <p style={{ margin: 0, fontSize: 20, maxWidth: 800 }}>
          SNIFFR is built to handle heavy traffic without falling over. Here's how the architecture keeps things fast and reliable.
        </p>
      </section>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        
        <div style={{ flex: '1 1 300px', background: '#FFFFFF', border: '3px solid #111', borderRadius: 24, padding: 24, boxShadow: '6px 6px 0 #111' }}>
          <div style={{ background: '#FF5A3C', color: '#FFF', display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontFamily: "'Archivo Black', sans-serif", fontSize: 14, marginBottom: 12, border: '2px solid #111' }}>FAST UPLOAD</div>
          <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, margin: '0 0 10px 0' }}>Returns Immediately</h2>
          <p style={{ margin: 0, fontSize: 16 }}>The API accepts the file, writes it to disk, queues a job, and returns a 202 instantly. The client handles polling so the server doesn't keep connections open for long analysis tasks.</p>
        </div>
        
        <div style={{ flex: '1 1 300px', background: '#FFFFFF', border: '3px solid #111', borderRadius: 24, padding: 24, boxShadow: '6px 6px 0 #111' }}>
          <div style={{ background: '#6B4EFF', color: '#FFF', display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontFamily: "'Archivo Black', sans-serif", fontSize: 14, marginBottom: 12, border: '2px solid #111' }}>WORKER QUEUE</div>
          <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, margin: '0 0 10px 0' }}>Redis Jobs</h2>
          <p style={{ margin: 0, fontSize: 16 }}>A Python worker reads jobs from a Redis list using BLPOP. This completely decouples the heavy lifting (parsing pcaps) from the fast Express web server.</p>
        </div>

        <div style={{ flex: '1 1 300px', background: '#FFFFFF', border: '3px solid #111', borderRadius: 24, padding: 24, boxShadow: '6px 6px 0 #111' }}>
          <div style={{ background: '#1E7A1E', color: '#FFF', display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontFamily: "'Archivo Black', sans-serif", fontSize: 14, marginBottom: 12, border: '2px solid #111' }}>OPTIMIZED</div>
          <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, margin: '0 0 10px 0' }}>Headers Only</h2>
          <p style={{ margin: 0, fontSize: 16 }}>The worker only reads packet headers and ignores payloads. This saves immense amounts of memory and CPU, allowing it to process massive captures quickly.</p>
        </div>
        
        <div style={{ flex: '1 1 300px', background: '#FFFFFF', border: '3px solid #111', borderRadius: 24, padding: 24, boxShadow: '6px 6px 0 #111' }}>
          <div style={{ background: '#C8F43C', color: '#111', display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontFamily: "'Archivo Black', sans-serif", fontSize: 14, marginBottom: 12, border: '2px solid #111' }}>CLEANUP</div>
          <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, margin: '0 0 10px 0' }}>Auto-delete</h2>
          <p style={{ margin: 0, fontSize: 16 }}>Uploads are deleted automatically after processing. Redis cache entries have a TTL (Time To Live). This prevents the server's disk and memory from filling up over time.</p>
        </div>

        <div style={{ flex: '1 1 300px', background: '#FFFFFF', border: '3px solid #111', borderRadius: 24, padding: 24, boxShadow: '6px 6px 0 #111' }}>
          <div style={{ background: '#B794F6', color: '#111', display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontFamily: "'Archivo Black', sans-serif", fontSize: 14, marginBottom: 12, border: '2px solid #111' }}>PROTECTION</div>
          <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, margin: '0 0 10px 0' }}>Rate Limiting</h2>
          <p style={{ margin: 0, fontSize: 16 }}>Uploads and API requests are rate-limited per IP to prevent abuse. Tokens are used for authorization to ensure you can only view reports for files you uploaded.</p>
        </div>
      </div>

      <section style={{ background: '#111', color: '#FFF', border: '3px solid #111', borderRadius: 34, padding: 30, boxShadow: '8px 8px 0 #111' }}>
        <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 32, margin: '0 0 20px 0' }}>LOAD TEST RESULTS</h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ flex: '1 1 200px', background: '#333', border: '3px solid #555', borderRadius: 20, padding: 20 }}>
            <div style={{ fontSize: 14, color: '#AAA', marginBottom: 8, textTransform: 'uppercase' }}>Requests / Second</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 36, fontWeight: 700, color: '#C8F43C' }}>
              {loadTest.requestsPerSecond !== null ? loadTest.requestsPerSecond : 'Not measured yet'}
            </div>
          </div>
          
          <div style={{ flex: '2 1 400px', background: '#222', border: '3px solid #444', borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', gap: 12, fontFamily: "'Space Mono', monospace", fontSize: 14 }}>
            <div style={{ display: 'flex' }}><span style={{ color: '#AAA', width: 100 }}>Machine:</span> {loadTest.machine || 'N/A'}</div>
            <div style={{ display: 'flex' }}><span style={{ color: '#AAA', width: 100 }}>Date:</span> {loadTest.date || 'N/A'}</div>
            <div style={{ display: 'flex' }}><span style={{ color: '#AAA', width: 100 }}>Tool:</span> {loadTest.tool || 'N/A'}</div>
            <div style={{ display: 'flex' }}><span style={{ color: '#AAA', width: 100 }}>Endpoint:</span> GET /api/reports/:id (Cache hit)</div>
          </div>
        </div>
      </section>

    </div>
  );
}

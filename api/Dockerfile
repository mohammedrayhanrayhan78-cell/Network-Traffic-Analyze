FROM node:20-slim

WORKDIR /app

# Copy package files and install deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy source
COPY index.js ./

# Railway injects PORT automatically; default fallback for local
ENV PORT=3000

# uploads directory is a mounted volume on Railway
RUN mkdir -p /data/uploads
ENV UPLOAD_DIR=/data/uploads

EXPOSE 3000

CMD ["node", "index.js"]

FROM python:3.11-slim

WORKDIR /app

# Install system deps for dpkt / scapy
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpcap-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps
RUN pip install --no-cache-dir dpkt redis scapy

# Copy source files
COPY analyzer.py config.py worker.py ./

# Uploads directory — bind a Railway volume here
RUN mkdir -p /data/uploads
ENV UPLOAD_DIR=/data/uploads

# REDIS_URL is injected by Railway's Redis plugin automatically
# REPORT_TTL defaults to 3600 seconds
ENV REPORT_TTL=3600

CMD ["python", "worker.py"]
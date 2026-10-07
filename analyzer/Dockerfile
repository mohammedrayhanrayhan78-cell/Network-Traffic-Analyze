FROM python:3.11-slim
WORKDIR /app
RUN pip install --no-cache-dir dpkt redis
COPY analyzer.py config.py worker.py ./
ENV REDIS_HOST=redis UPLOAD_DIR=/data/uploads
CMD ["python", "worker.py"]
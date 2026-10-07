FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (needed for scapy/networking packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpcap-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose port and run Streamlit
ENV PORT=8501
EXPOSE 8501

CMD ["sh", "-c", "python -m streamlit run app.py --server.port=${PORT} --server.address=0.0.0.0 --server.headless=true"]
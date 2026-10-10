# Run Locally

Follow these exact steps to run Sniffr locally.

1. **Start Redis (Docker)**
   From the project root:
   ```bash
   docker-compose up -d
   ```

2. **Start the Python Worker**
   From the project root (using PowerShell):
   ```bash
   cd analyzer
   pip install -r requirements.txt
   $env:REDIS_HOST="localhost"
   python worker.py
   ```

3. **Start the API Server**
   From a new terminal at the project root:
   ```bash
   cd api
   npm install
   npm start
   ```

4. **Start the Web UI Dev Server**
   From a new terminal at the project root:
   ```bash
   cd web
   npm install
   npm run dev
   ```

This will run Redis on port 6379, the API on port 3000, and the Web UI on http://localhost:5173.

# Load Test Results

This test was performed using `autocannon` against a completed report endpoint (`GET /api/reports/:id?token=...`).

**Note:** The API's rate limiter `REPORT_RATE_MAX` was raised to `1000000` (and `generalLimiter` bypassed for this endpoint) in `.env` so that the rate limiter does not distort the performance result.

### Command
```bash
autocannon -c 100 -d 10 "http://localhost:3000/api/reports/a311b96c-d0df-4c60-9547-68403bca194d?token=YTMxMWI5NmMtZDBkZi00YzYwLTk1NDctNjg0MDNiY2ExOTRkLjE3OTEzNjk4OTE0MjQ.I5b0WHlOThdWQO-tnhvTZmZEo0k55kNNhAkjYaEcn0s"
```

### Environment
- **Machine**: Windows
- **OS**: Windows
- **Node Version**: v24.14.1
- **Date**: 2026-10-07

### Results
- **Requests per second (Avg)**: 4,023.9
- **Latency (Avg)**: 24.39 ms
- **Total Requests**: 40k in 10.07s

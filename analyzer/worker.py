import os, re, json, time, redis
from analyzer import analyze

r = redis.from_url(os.environ["REDIS_URL"], decode_responses=True, socket_timeout=30) if os.getenv("REDIS_URL") else redis.Redis(host=os.getenv("REDIS_HOST", "localhost"), port=int(os.getenv("REDIS_PORT", 6379)), decode_responses=True, socket_timeout=30)
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
REPORT_TTL = int(os.getenv("REPORT_TTL", 3600))
QUEUE = "jobs"


def process(job_id):
    if not re.fullmatch(r"[A-Za-z0-9-]{8,64}", job_id):
        return
    path = os.path.join(UPLOAD_DIR, job_id + ".pcap")
    r.set(f"job:{job_id}:status", "processing", ex=REPORT_TTL)
    try:
        report = analyze(path)
        r.set(f"report:{job_id}", json.dumps(report), ex=REPORT_TTL)
        r.set(f"job:{job_id}:status", "done", ex=REPORT_TTL)
    except Exception:
        r.set(f"job:{job_id}:status", "failed", ex=REPORT_TTL)
        r.set(f"job:{job_id}:error", "Could not analyze this file.", ex=REPORT_TTL)
    finally:
        try:
            os.remove(path)
        except OSError:
            pass


def main():
    print("worker started, waiting for jobs", flush=True)
    while True:
        try:
            item = r.blpop(QUEUE, timeout=5)
            if item:
                process(item[1])
        except redis.exceptions.RedisError as e:
            print(f"redis problem, retrying in 2s: {e}", flush=True)
            time.sleep(2)


if __name__ == "__main__":
    main()

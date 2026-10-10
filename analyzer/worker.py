import os, re, json, time, tempfile, redis
from analyzer import analyze



def make_client(decode):
    # Railway gives one REDIS_URL; locally we fall back to host and port
    url = os.getenv("REDIS_URL")
    if url:
        return redis.from_url(url, decode_responses=decode, socket_timeout=30)
    return redis.Redis(host=os.getenv("REDIS_HOST", "localhost"), port=int(os.getenv("REDIS_PORT", 6379)),
                       decode_responses=decode, socket_timeout=30)


r = make_client(True)    # text: statuses and reports
rb = make_client(False)  # raw bytes: the uploaded pcap file
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
REPORT_TTL = int(os.getenv("REPORT_TTL", 3600))
QUEUE = "jobs"


def load_upload(job_id):
    """Return a file path to analyze. The API puts the file in Redis; fall back to the uploads folder for local dev."""
    data = rb.get(f"upload:{job_id}")
    if data is not None:
        fd, tmp = tempfile.mkstemp(suffix=".pcap")
        with os.fdopen(fd, "wb") as f:
            f.write(data)
        return tmp
    return os.path.join(UPLOAD_DIR, job_id + ".pcap")


def process(job_id):
    if not re.fullmatch(r"[A-Za-z0-9-]{8,64}", job_id):
        return
    r.set(f"job:{job_id}:status", "processing", ex=REPORT_TTL)
    path = load_upload(job_id)
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
        try:
            rb.delete(f"upload:{job_id}")
        except redis.exceptions.RedisError:
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
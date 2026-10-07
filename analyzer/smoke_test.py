"""End-to-end check without the API: python smoke_test.py (worker must be running)."""
import os, shutil, time, uuid, json, redis

r = redis.Redis(decode_responses=True)
os.makedirs("uploads", exist_ok=True)


def run(label, src):
    job = "smoke-" + uuid.uuid4().hex[:8]
    path = f"uploads/{job}.pcap"
    shutil.copy(src, path)
    r.set(f"job:{job}:status", "queued", ex=3600)
    r.rpush("jobs", job)
    status = "queued"
    for _ in range(30):
        status = r.get(f"job:{job}:status")
        if status in ("done", "failed"):
            break
        time.sleep(0.5)
    print(f"[{label}] status={status}  file deleted={not os.path.exists(path)}")
    if status == "done":
        rep = json.loads(r.get(f"report:{job}"))
        print("   packets:", rep["totalPackets"], "alerts:", [a["type"] for a in rep["alerts"]])
    elif status == "failed":
        print("   error:", r.get(f"job:{job}:error"))


run("good file   ", "tests/demo_mixed.pcap")
run("corrupt file", "tests/corrupt.pcap")
run("empty file  ", "tests/empty.pcap")
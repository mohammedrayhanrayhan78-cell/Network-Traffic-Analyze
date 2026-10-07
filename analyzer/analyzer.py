import sys, json, time, socket, struct
from collections import Counter, deque, defaultdict
import dpkt
import config

VERSION = "0.1.0"
MAGIC_PCAP = {b"\xd4\xc3\xb2\xa1", b"\xa1\xb2\xc3\xd4", b"\x4d\x3c\xb2\xa1", b"\xa1\xb2\x3c\x4d"}
MAGIC_PCAPNG = b"\x0a\x0d\x0d\x0a"


def open_reader(f):
    magic = f.read(4)
    f.seek(0)
    try:
        if magic in MAGIC_PCAP:
            return dpkt.pcap.Reader(f)
        if magic == MAGIC_PCAPNG:
            return dpkt.pcapng.Reader(f)
    except (dpkt.NeedData, dpkt.UnpackError, struct.error):
        raise ValueError("capture header is damaged or incomplete")
    raise ValueError("not a pcap or pcapng file")


def packets(reader):
    # A capture cut off mid-file is normal (Wireshark copes too): keep what we read.
    try:
        for ts, buf in reader:
            yield ts, buf
    except (dpkt.NeedData, dpkt.UnpackError, struct.error):
        return


def parse(buf, dlt):
    try:
        if dlt == 1:
            ip = dpkt.ethernet.Ethernet(buf).data
        elif dlt == 113:
            ip = dpkt.sll.SLL(buf).data
        elif dlt == 101:
            ip = dpkt.ip.IP(buf)
        else:
            return None
    except Exception:
        return None
    if isinstance(ip, dpkt.ip.IP):
        return socket.inet_ntop(socket.AF_INET, ip.src), socket.inet_ntop(socket.AF_INET, ip.dst), ip.data
    if isinstance(ip, dpkt.ip6.IP6):
        return socket.inet_ntop(socket.AF_INET6, ip.src), socket.inet_ntop(socket.AF_INET6, ip.dst), ip.data
    return None


def analyze(path):
    t0 = time.time()
    total = tbytes = 0
    first = last = None
    protos = Counter()
    src_pk, src_by = Counter(), Counter()
    src_ports = defaultdict(set)
    pps = Counter()
    win = defaultdict(deque)
    wport = defaultdict(Counter)
    scans = {}
    rate = {}
    rate_max = {}

    with open(path, "rb") as f:
        reader = open_reader(f)
        dlt = reader.datalink()
        for ts, buf in packets(reader):
            total += 1
            tbytes += len(buf)
            if first is None:
                first = ts
            last = ts if last is None else max(last, ts)
            pps[max(0, int(ts - first))] += 1

            p = parse(buf, dlt)
            if not p:
                protos["Other"] += 1
                continue
            src, dst, l4 = p
            dport = None
            if isinstance(l4, dpkt.tcp.TCP):
                protos["TCP"] += 1
                dport = l4.dport
            elif isinstance(l4, dpkt.udp.UDP):
                protos["UDP"] += 1
                dport = l4.dport
            elif isinstance(l4, (dpkt.icmp.ICMP, dpkt.icmp6.ICMP6)):
                protos["ICMP"] += 1
            else:
                protos["Other"] += 1

            src_pk[src] += 1
            src_by[src] += len(buf)

            sec = int(ts)
            st = rate.setdefault(src, [None, 0])
            if st[0] != sec:
                st[0], st[1] = sec, 0
            st[1] += 1
            if st[1] > rate_max.get(src, 0):
                rate_max[src] = st[1]

            if dport is not None:
                src_ports[src].add(dport)
                dq = win[src]
                c = wport[src]
                dq.append((ts, dport))
                c[dport] += 1
                while dq and ts - dq[0][0] > config.PORT_SCAN_WINDOW_SECONDS:
                    _, op = dq.popleft()
                    c[op] -= 1
                    if c[op] == 0:
                        del c[op]
                n = len(c)
                if n >= config.PORT_SCAN_PORTS and n > scans.get(src, {}).get("observed", 0):
                    scans[src] = {"destination": dst, "ports": sorted(c)[:20],
                                  "observed": n, "protocol": "TCP" if isinstance(l4, dpkt.tcp.TCP) else "UDP"}

    alerts = []
    for src, s in scans.items():
        alerts.append({
            "severity": "high", "type": "potential_port_scan", "source": src,
            "destination": s["destination"], "protocol": s["protocol"], "ports": s["ports"],
            "observed": s["observed"], "threshold": config.PORT_SCAN_PORTS,
            "window": config.PORT_SCAN_WINDOW_SECONDS,
            "explanation": f"{src} contacted {s['observed']} distinct ports within {config.PORT_SCAN_WINDOW_SECONDS} seconds, which is possible port scanning.",
            "nextStep": "Check whether this host is expected to scan the network. If not, review its other traffic and consider blocking it."})
    for src, m in rate_max.items():
        if m > config.MAX_PACKETS_PER_SECOND:
            alerts.append({
                "severity": "medium", "type": "high_request_rate", "source": src,
                "destination": None, "protocol": None, "ports": [],
                "observed": m, "threshold": config.MAX_PACKETS_PER_SECOND, "window": 1,
                "explanation": f"{src} sent {m} packets in one second, above the limit of {config.MAX_PACKETS_PER_SECOND}. This is a possible flood or heavy transfer.",
                "nextStep": "Check whether this is a backup, download or other expected heavy traffic. If not, investigate this source."})

    duration = round(last - first, 3) if first is not None else 0
    seconds = (max(pps) + 1) if pps else 0
    return {
        "totalPackets": total,
        "totalBytes": tbytes,
        "durationSeconds": duration,
        "protocols": [{"name": k, "packets": v, "percent": round(100 * v / total, 2)} for k, v in protos.most_common()],
        "topSources": [{"ip": ip, "packets": n, "bytes": src_by[ip], "uniquePorts": len(src_ports[ip])}
                       for ip, n in src_pk.most_common(config.TOP_SOURCES)],
        "packetsPerSecond": [pps.get(i, 0) for i in range(seconds)],
        "alerts": alerts,
        "processing": {"seconds": round(time.time() - t0, 3), "analyzerVersion": VERSION},
    }


if __name__ == "__main__":
    print(json.dumps(analyze(sys.argv[1]), indent=2))
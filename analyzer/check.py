"""Compare analyzer output with the Wireshark answer key: python check.py file.pcap"""
import sys
from analyzer import analyze
r = analyze(sys.argv[1])
p = {x["name"]: x["packets"] for x in r["protocols"]}
print("total packets :", r["totalPackets"])
print("TCP / UDP     :", p.get("TCP", 0), "/", p.get("UDP", 0))
print("busiest source:", r["topSources"][0]["ip"] if r["topSources"] else None)
print("alerts        :", [a["type"] for a in r["alerts"]])
print("seconds taken :", r["processing"]["seconds"])
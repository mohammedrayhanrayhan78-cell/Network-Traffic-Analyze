"""Builds a mixed demo capture and the report.json that Friend 3 uses as fake data."""
import json
from scapy.all import Ether, IP, TCP, UDP, ICMP, DNS, DNSQR, wrpcap
from analyzer import analyze

pk, t = [], 5000.0
def add(p, ts):
    p.time = ts
    pk.append(p)

for i in range(60):   # normal browsing + dns + ping from a laptop
    add(Ether()/IP(src="192.168.1.20", dst="142.250.77.14")/TCP(sport=50000+i, dport=443), t + i*0.5)
for i in range(15):
    add(Ether()/IP(src="192.168.1.20", dst="8.8.8.8")/UDP(sport=51000+i, dport=53)/DNS(qd=DNSQR(qname="example.com")), t + i*2)
for i in range(6):
    add(Ether()/IP(src="192.168.1.30", dst="192.168.1.1")/ICMP(), t + i*5)
for port in range(1, 181):   # port scan: 180 ports in 18s
    add(Ether()/IP(src="192.168.1.99", dst="192.168.1.10")/TCP(sport=44444, dport=port, flags="S"), t + 10 + port*0.1)
for i in range(1400):        # flood: 1400 packets inside one second
    add(Ether()/IP(src="192.168.1.77", dst="192.168.1.10")/UDP(sport=40000, dport=9999), t + 20 + i/1500)

pk.sort(key=lambda p: p.time)
wrpcap("tests/demo_mixed.pcap", pk)
rep = analyze("tests/demo_mixed.pcap")
json.dump(rep, open("report.json", "w"), indent=2)
print("packets:", rep["totalPackets"], "alerts:", [a["type"] for a in rep["alerts"]])
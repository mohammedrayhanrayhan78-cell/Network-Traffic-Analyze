from scapy.all import Ether, IP, TCP, UDP, DNS, DNSQR, wrpcap
normal = []
for i in range(20):
    p = Ether()/IP(src="10.0.0.2", dst="93.184.216.34")/TCP(sport=40000+i, dport=80)
    p.time = 1000 + i
    normal.append(p)
for i in range(5):
    p = Ether()/IP(src="10.0.0.2", dst="8.8.8.8")/UDP(sport=50000+i, dport=53)/DNS(qd=DNSQR(qname="example.com"))
    p.time = 1020 + i
    normal.append(p)
wrpcap("tests/normal.pcap", normal)
scan = []
for port in range(1, 151):
    p = Ether()/IP(src="10.0.0.5", dst="10.0.0.9")/TCP(sport=44444, dport=port, flags="S")
    p.time = 2000 + port * 0.1
    scan.append(p)
wrpcap("tests/portscan.pcap", scan)
open("tests/empty.pcap", "wb").close()
open("tests/corrupt.pcap", "wb").write(b"this is not a pcap file at all")
print("samples ready")

import os
import pandas as pd
from scapy.all import rdpcap


def analyze_pcap(file_path):
    """
    Reads a PCAP file and extracts basic network traffic information.
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PCAP file not found: {file_path}")

    print(f"Reading PCAP file: {file_path}")

    packets = rdpcap(file_path)

    data = []

    for packet in packets:
        row = {
            "timestamp": float(packet.time),
            "length": len(packet),
            "protocol": "OTHER",
            "source": "",
            "destination": ""
        }

        if packet.haslayer("IP"):
            row["source"] = packet["IP"].src
            row["destination"] = packet["IP"].dst

            if packet.haslayer("TCP"):
                row["protocol"] = "TCP"

            elif packet.haslayer("UDP"):
                row["protocol"] = "UDP"

            elif packet.haslayer("ICMP"):
                row["protocol"] = "ICMP"

            else:
                row["protocol"] = "IP"

        elif packet.haslayer("ARP"):
            row["protocol"] = "ARP"
            row["source"] = packet["ARP"].psrc
            row["destination"] = packet["ARP"].pdst

        data.append(row)

    df = pd.DataFrame(data)

    print(f"Total packets analyzed: {len(df)}")

    return df


if __name__ == "__main__":
    print("Traffic Analyzer - Analyzer Module")
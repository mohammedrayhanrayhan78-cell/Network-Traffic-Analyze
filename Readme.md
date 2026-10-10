# 🔎 Network Traffic Analyzer

A beginner-friendly cybersecurity and networking project that analyzes captured network traffic from PCAP files and converts raw packet data into useful statistics, visualizations, and simple anomaly alerts.

The project is designed to make network traffic easier to understand by answering questions such as:

- How many packets are present?
- How much data was transferred?
- Which protocols are being used?
- What is the average packet size?
- Are there unusually large packets?
- What does the traffic look like visually?

---

# 🎯 Project Overview

Network communication is made up of small units of data called **packets**.

A packet can contain information such as:

- Source IP address
- Destination IP address
- Network protocol
- Packet size
- Timestamp

Instead of manually inspecting thousands of packets, this project automatically reads a captured network file and summarizes the traffic.

### Basic workflow

```text
🦈 Wireshark
     │
     ▼
📁 PCAP File
     │
     ▼
🐍 Python + Scapy
     │
     ▼
🔍 Packet Analysis
     │
     ├───────────────┐
     ▼               ▼
📊 Statistics    🚨 Anomaly Detection
     │               │
     └───────┬───────┘
             ▼
       📈 Visualizations
             │
             ▼
        📄 CSV Reports
🧒 What Is a Network Packet?

A network packet is a small unit of data transmitted between devices.

For example:

        📦 PACKET
   ┌──────────────────┐
   │ Source            │
   │ 192.168.1.10      │
   │                   │
   │ Destination       │
   │ 8.8.8.8           │
   │                   │
   │ Protocol          │
   │ TCP               │
   │                   │
   │ Size              │
   │ 512 bytes         │
   └──────────────────┘

Our analyzer extracts this information from captured packets and organizes it into a structured dataset.

🎯 What Does This Project Do?

The Network Traffic Analyzer takes a .pcap network capture and performs several types of analysis.

Main features
📦 Count total packets
💾 Calculate total traffic volume
📏 Calculate average packet size
🌐 Identify common network protocols
📊 Calculate protocol distribution
🚨 Detect unusually large packets
📈 Generate traffic visualizations
📄 Export analyzed packet information to CSV
📄 Export detected anomalies to CSV
🦈 Step 1 — Capture Network Traffic

Network traffic can be captured using Wireshark.

Wireshark records packets travelling through a network interface and allows the capture to be saved as a PCAP file.

Example:

🌐 Network
    │
    ▼
📦 📦 📦 📦 📦 📦
    │
    ▼
🦈 Wireshark
    │
    ▼
📁 traffic.pcap

The saved PCAP file becomes the input for our Python analyzer.

⚠️ Only capture and analyze network traffic that you are authorized to inspect.

🐍 Step 2 — Python and Scapy

Python is used as the main programming language.

The project uses Scapy to read and inspect packets stored inside the PCAP file.

Scapy allows the program to access information such as:

📦 Packet
 │
 ├── Timestamp
 ├── Length
 ├── Source IP
 ├── Destination IP
 └── Protocol

The extracted information is then converted into a pandas DataFrame for analysis.

🔍 Step 3 — Packet Analysis

For every packet, the analyzer extracts basic information.

The current analyzer records:

Information	Description
Timestamp	Time associated with the packet
Length	Size of the packet in bytes
Protocol	Detected network protocol
Source	Source IP address
Destination	Destination IP address

Supported protocol identification currently includes:

TCP
UDP
ICMP
IP
ARP
OTHER
📊 Step 4 — Traffic Statistics

After the packets are extracted, the project calculates basic traffic statistics.

Total Packets

The total number of packets contained in the PCAP file.

Total Bytes

The total amount of captured network data.

Average Packet Size

The average size of all analyzed packets.

Protocol Distribution

The number of packets belonging to each detected protocol.

Example:

Protocol Distribution

TCP      █████████████████
UDP      ██████████
ICMP     ████
ARP      ███████
OTHER    ███

The actual values depend on the PCAP file being analyzed.

🚨 Step 5 — Basic Anomaly Detection

The project includes a simple rule-based anomaly detector.

The current implementation identifies unusually large packets as suspicious.

For example:

Normal packet
     │
     ▼
📦 500 bytes
     │
     ▼
✓ Normal

Compared with:

Large packet
     │
     ▼
📦 2040 bytes
     │
     ▼
⚠️ Suspicious

The system records suspicious packets in a separate CSV file.

Important

An anomaly does not automatically mean that an attack has occurred.

It simply means that the packet matches a rule that has been defined as unusual and deserves further investigation.

📈 Step 6 — Visualizations

The project uses matplotlib to generate charts from the analyzed traffic.

Currently, three visualizations are produced.

1. Protocol Distribution

Shows how many packets belong to each protocol.

TCP
UDP
ICMP
ARP
OTHER
2. Packet Size Distribution

Shows how packet sizes are distributed throughout the capture.

3. Traffic Over Time

Shows how network traffic changes throughout the captured period.

These charts make large amounts of packet data easier to understand.

🐼 Step 7 — pandas

The extracted packet information is organized using pandas.

Conceptually, the data looks like:

Timestamp	Length	Protocol	Source	Destination
...	72	UDP	192.168.1.10	8.8.8.8
...	512	TCP	192.168.1.10	1.1.1.1
...	98	ICMP	192.168.1.20	192.168.1.1

Using pandas makes it easier to:

Count packets
Group protocols
Calculate statistics
Filter suspicious packets
Export results to CSV
🗂️ Project Structure

The project is organized into separate modules:

Network-Traffic-Analyze/
│
├── 📁 data/
│   └── traffic.pcap
│
├── 📁 output/
│   ├── anomalies.csv
│   ├── traffic_analysis.csv
│   ├── protocol_distribution.png
│   ├── packet_size_distribution.png
│   └── traffic_over_time.png
│
├── 📁 src/
│   ├── analyzer.py
│   ├── anomaly_detector.py
│   ├── main.py
│   ├── requirements.txt
│   ├── statistics.py
│   └── visualizer.py
│
└── 📖 Readme.md
🧩 Project Modules
analyzer.py

Responsible for reading the PCAP file and extracting packet-level information.

PCAP
 ↓
Scapy
 ↓
Packet information
 ↓
pandas DataFrame
statistics.py

Responsible for calculating traffic statistics such as:

Total packets
Total bytes
Average packet size
Protocol distribution
anomaly_detector.py

Responsible for identifying packets that match the project's anomaly rule.

Currently, the main rule focuses on unusually large packets.

visualizer.py

Responsible for generating traffic charts using matplotlib.

The current visualizations are:

protocol_distribution.png
packet_size_distribution.png
traffic_over_time.png
main.py

Acts as the main entry point of the project.

It connects the different modules:

PCAP
 ↓
Analyzer
 ↓
Statistics
 ↓
Anomaly Detection
 ↓
Visualization
 ↓
Reports
⚙️ Technologies Used
Technology	Purpose
🐍 Python	Main programming language
🕷️ Scapy	Packet reading and inspection
🐼 pandas	Data organization and analysis
📊 matplotlib	Data visualization
🦈 Wireshark	Network packet capture
📦 PCAP	Network traffic capture format
📦 Installation

Make sure Python is installed.

Install the required libraries:

pip install -r src/requirements.txt

The requirements currently include:

scapy
pandas
matplotlib
▶️ Running the Project

Place a PCAP file inside the data folder.

For example:

data/
└── traffic.pcap

Then run:

python src/main.py

The program will read the PCAP file and analyze the captured packets.

📄 Example Terminal Output

A typical analysis looks like:

======================================
       NETWORK TRAFFIC ANALYZER
======================================

Reading PCAP file: data\traffic.pcap
Total packets analyzed: 167092

========== TRAFFIC STATISTICS ==========
Total Packets       : 167092
Total Bytes         : 25946647
Average Packet Size : 155.28 bytes

Protocol Distribution:
  TCP       : ...
  UDP       : ...
  ICMP      : ...
  ARP       : ...
  OTHER     : ...
========================================

========== ANOMALY DETECTION ==========
Anomalies detected: ...

========== VISUALIZATIONS ==========
Created: output\protocol_distribution.png
Created: output\packet_size_distribution.png
Created: output\traffic_over_time.png
====================================

========== ANALYSIS COMPLETE ==========
Traffic data saved to : output\traffic_analysis.csv
Anomalies saved to     : output\anomalies.csv
=======================================

The actual numbers depend on the PCAP file used.

📁 Output Files

After running the analyzer, the output directory contains the analysis results.

traffic_analysis.csv

Contains packet-level information extracted from the PCAP.

Example:

timestamp,length,protocol,source,destination
...,72,UDP,192.168.1.10,8.8.8.8
...,512,TCP,192.168.1.10,1.1.1.1
anomalies.csv

Contains packets identified as suspicious by the anomaly detector.

Example:

timestamp,length,protocol,source,destination
...,2040,TCP,192.168.1.20,192.168.1.10
📊 Generated Charts

The analyzer generates:

output/
│
├── protocol_distribution.png
├── packet_size_distribution.png
└── traffic_over_time.png

These charts provide a visual summary of the captured traffic.

🌐 Planned Web Dashboard

A web dashboard can be added on top of the existing analysis engine.

The planned workflow is:

📁 Upload PCAP
       │
       ▼
🔍 Analyze Traffic
       │
       ▼
┌─────────────────────────────┐
│     NETWORK DASHBOARD       │
│                             │
│ 📦 Total Packets            │
│ 💾 Total Traffic            │
│ 📊 Protocol Distribution    │
│ 📏 Packet Sizes             │
│ 🚨 Anomaly Count            │
│ 📈 Traffic Over Time        │
│ 📄 Analysis Results         │
└─────────────────────────────┘

The dashboard will provide a more user-friendly way to demonstrate the analyzer without requiring users to read terminal output.

🎯 Project Goals

The main goal of this project is to make network traffic analysis easier to understand.

Instead of looking at thousands of raw packets:

📦 📦 📦 📦 📦 📦 📦 📦 📦

the analyzer converts them into:

📊 Statistics
📈 Charts
🚨 Alerts
📄 Reports
🛡️ Security and Ethics

This project is intended for:

Learning
Cybersecurity education
Network analysis
Defensive security research
Authorized testing

Only capture or analyze network traffic that you have permission to inspect.

Do not use the project to monitor networks, devices, or users without authorization.

🚀 Future Improvements

The current version focuses on basic PCAP analysis.

Possible future improvements include:

🌐 Web dashboard
📡 Live packet capture
🔎 More advanced anomaly detection
📊 Interactive charts
📄 JSON report generation
🔢 Port analysis
🌍 GeoIP visualization
🤖 Machine-learning-based anomaly detection

These are future extensions and are not required for the current basic analyzer.

🧠 What We Learn

This project combines several important concepts:

🌐 Networking
      +
🐍 Python
      +
📦 Packet Analysis
      +
🐼 Data Analysis
      +
📊 Visualization
      +
🛡️ Basic Cybersecurity

The project provides practical experience with:

Network packets
TCP/IP protocols
PCAP files
Python programming
Scapy
pandas
Data visualization
Basic anomaly detection
⭐ Project Summary

The entire project can be remembered using one simple pipeline:

🦈 CAPTURE
     ↓
📁 PCAP
     ↓
🔍 ANALYZE
     ↓
📊 CALCULATE
     ↓
🚨 DETECT
     ↓
📈 VISUALIZE
     ↓
📄 REPORT

Network Traffic Analyzer turns raw captured network traffic into information that is easier for people to understand.

👨‍💻 Project

Network Traffic Analyzer

Built using:

Python • Scapy • pandas • matplotlib • Wireshark

## Live demo

- Website (Netlify): https://sniffr-traffic-analyzer.netlify.app
- Website (Railway): https://sniffr-web-production.up.railway.app
- API health check: https://sniffr-api-production.up.railway.app/health


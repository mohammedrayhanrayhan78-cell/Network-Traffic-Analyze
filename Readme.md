🔎 Network Traffic Analyzer

A beginner-friendly network security project that captures or analyzes
network packets and turns raw traffic into simple, useful information.

📌 What Is This Project?

When devices communicate over a network, they continuously send small
pieces of data called packets.

Think of a packet like a small envelope moving through the internet:

💻 Computer
     │
     │  📦 Packet
     ▼
🌐 Network
     │
     │  📦 Packet
     ▼
🖥️ Server

A packet contains useful information such as:

Where it came from

Where it is going

Which protocol it uses

How large it is

Which port is being used

Other information depending on the protocol

Our project takes these packets and answers a simple question:

"What is happening inside this network?"

🎯 Project Goal

The goal of the Network Traffic Analyzer is to read network traffic
and automatically produce a simple security-oriented analysis.

The analyzer focuses on:

┌──────────────────────────────────────────┐
│          NETWORK TRAFFIC ANALYZER        │
├──────────────────────────────────────────┤
│                                          │
│  📦 Packet Capture                       │
│          ↓                               │
│  🔍 Packet Analysis                      │
│          ↓                               │
│  📊 Protocol Statistics                  │
│          ↓                               │
│  👥 Top Talkers                          │
│          ↓                               │
│  📏 Packet Size Analysis                │
│          ↓                               │
│  🚨 Simple Anomaly Detection             │
│          ↓                               │
│  📈 Reports & Charts                     │
│                                          │
└──────────────────────────────────────────┘

🧠 Network Traffic in Very Simple Terms

Imagine a busy road.

🚗   🚕   🚌   🚗   🚓   🚚
 ───────────────────────────→
             ROAD

A network is similar:

📦   📦   📦   📦   📦
 ───────────────────────────→
           NETWORK

Each packet is like a vehicle.

The analyzer checks those packets to understand:

Network Question                      What We Look At

What type of traffic is present?      Protocol
Who is communicating the most?        Source/Destination IP
How big are the packets?              Packet size
Which services are being contacted?   Ports
Does something look unusual?          Traffic patterns

🏗️ System Architecture

The complete project can be understood as five simple stages.

flowchart LR
    A["📡 Network Traffic"] --> B["📦 PCAP Capture"]
    B --> C["🐍 Python + Scapy"]
    C --> D["🔍 Packet Analysis"]
    D --> E["📊 pandas"]
    D --> F["🚨 Anomaly Detection"]
    E --> G["📈 matplotlib"]
    F --> G
    G --> H["📄 Final Report"]

In simple words:

Network traffic gives us packets.

PCAP stores those packets.

Scapy reads the packets.

Python processes the information.

pandas helps organize the data.

matplotlib turns the data into charts.

The analyzer also checks for simple suspicious patterns.

🧰 Technologies Used

🦈 Wireshark

Wireshark is used to inspect network packets visually.

It allows us to see things such as:

Packet
 ├── Source IP
 ├── Destination IP
 ├── Protocol
 ├── Source Port
 ├── Destination Port
 └── Packet Length

Wireshark is especially useful when we want to manually inspect and
understand the captured traffic.

🐍 Python

Python is the main programming language used for the analysis.

Instead of manually checking thousands of packets, Python can process
them automatically.

1000+ packets
      │
      ▼
   Python
      │
      ▼
Statistics + Detection + Reports

🕷️ Scapy

Scapy is a Python library that allows us to work directly with network
packets.

For example, it can read a .pcap capture file and let our program
inspect individual packets.

Conceptually:

packet
   │
   ├── source IP
   ├── destination IP
   ├── protocol
   ├── ports
   └── size

🐼 pandas

pandas helps convert packet information into structured data.

For example:

Packet #   Source       Destination    Protocol    Size
-------------------------------------------------------
1          192.168.1.5  8.8.8.8        UDP         72
2          192.168.1.5  1.1.1.1        TCP         512
3          192.168.1.8  192.168.1.5    ICMP        98

This makes counting, grouping, filtering, and analyzing traffic much
easier.

📊 matplotlib

matplotlib converts our analysis into visual charts.

For example:

Protocol Distribution

TCP   ████████████████████
UDP   ███████████
DNS   ███████
ICMP  ███

A visual representation is much easier to understand than thousands of
raw packets.

📦 What Is a PCAP File?

A PCAP file is basically a saved recording of network traffic.

Think of it like a video recording, but instead of recording people, it
records packets.

LIVE NETWORK
     │
     │
     ▼
📦 Packets
     │
     ▼
📝 PCAP FILE
     │
     ▼
🐍 Our Analyzer
     │
     ▼
📊 Results

This is useful because we don't need to keep a live network running
while developing the project.

We can simply use sample .pcap files.

🔬 What Does the Analyzer Actually Do?

1. Read the Capture

The program starts by loading a .pcap file.

traffic.pcap
     │
     ▼
   Scapy
     │
     ▼
Packet 1
Packet 2
Packet 3
...
Packet N

2. Identify Protocols

The analyzer checks which protocols appear in the traffic.

Common examples include:

TCP

UDP

ICMP

DNS

The result can be summarized like:

TCP   → 60%
UDP   → 25%
DNS   → 10%
ICMP  → 5%

The exact values depend on the capture file being analyzed.

🌐 Understanding TCP, UDP, ICMP and DNS

TCP

TCP is used when reliable communication is important.

Computer ─────── TCP ───────> Server
          reliable connection

Examples include many web and application connections.

UDP

UDP is designed for faster communication without the same connection
guarantees as TCP.

Computer ─────── UDP ───────> Server
             fast delivery

ICMP

ICMP is commonly used for network control and diagnostic messages.

A familiar example is:

ping
  │
  ▼
ICMP

DNS

DNS helps translate domain names into IP addresses.

google.com
     │
     ▼
    DNS
     │
     ▼
IP address

👥 Top Talkers

A top talker is simply an IP address that appears frequently in the
traffic.

Imagine a classroom where everyone is talking.

Student A → ███████████████
Student B → ████████
Student C → ████
Student D → ██

The analyzer performs a similar calculation for IP addresses.

Example output:

Top Source IPs

192.168.1.10  → 1250 packets
192.168.1.15  →  830 packets
192.168.1.20  →  420 packets

This helps us understand which devices are generating the most traffic.

📏 Packet Size Analysis

Packets can have different sizes.

The analyzer records their sizes and can summarize them visually.

Packet Size

Small     ███████████████
Medium    ██████████
Large     ████

This can help us understand the general shape of the traffic and
identify unusual packet-size patterns.

🚨 Simple Anomaly Detection

The project also contains basic rules for identifying traffic that
deserves attention.

One example is a possible port scan pattern.

Imagine one IP contacting many different ports:

                 ┌── Port 21
                 ├── Port 22
                 ├── Port 23
Attacker ────────┼── Port 80
                 ├── Port 443
                 ├── Port 8080
                 └── ...

If one IP contacts an unusually large number of ports, the analyzer can
raise an alert.

For example:

⚠️ ALERT

Source IP: 192.168.1.50
Unique ports contacted: 137

Possible port scanning behavior detected.

Important

This is a simple rule-based alert, not proof that an attack has
occurred.

A legitimate application can also create unusual traffic.

🔄 Complete Data Flow

Here is the entire project in one diagram:

flowchart TD
    A["📡 Network Traffic"] --> B["🦈 Wireshark / PCAP"]
    B --> C["📦 traffic.pcap"]
    C --> D["🐍 Scapy"]
    D --> E["🔎 Extract Packet Information"]

    E --> F["🌐 Protocol Analysis"]
    E --> G["👥 IP Analysis"]
    E --> H["📏 Packet Size Analysis"]
    E --> I["🚨 Anomaly Detection"]

    F --> J["🐼 pandas"]
    G --> J
    H --> J

    J --> K["📊 matplotlib"]
    I --> K

    K --> L["📈 Charts + Report"]

📊 Expected Output

After analyzing a capture file, the project can produce information such
as:

========================================
       NETWORK TRAFFIC ANALYZER
========================================

File: traffic.pcap

Total Packets: 5000

Protocol Distribution
---------------------
TCP     : 3000
UDP     : 1200
DNS     : 600
ICMP    : 200

Top Source IPs
---------------------
192.168.1.10 : 1250
192.168.1.15 : 830
192.168.1.20 : 420

Top Destination IPs
---------------------
8.8.8.8       : 700
1.1.1.1       : 450
192.168.1.1   : 400

Anomaly Detection
---------------------
⚠️ 192.168.1.50 contacted 137 unique ports

========================================

The numbers above are illustrative examples. Actual results depend
on the PCAP file being analyzed.

📈 Visual Reports

The analyzer can generate charts such as:

Protocol Distribution

TCP   ████████████████████
UDP   ███████████
DNS   ███████
ICMP  ███

Top Source IPs

192.168.1.10  █████████████████
192.168.1.15  ███████████
192.168.1.20  ██████

Packet Sizes

Size Range       Packets

0–250 bytes      ███████████████
251–500 bytes    █████████
501–750 bytes    █████
751+ bytes       ██

These can be generated as proper charts using matplotlib.

🗂️ Suggested Project Structure

network-traffic-analyzer/
│
├── 📁 data/
│   └── traffic.pcap
│
├── 📁 src/
│   ├── analyzer.py
│   ├── protocols.py
│   ├── statistics.py
│   ├── anomaly_detector.py
│   └── visualizer.py
│
├── 📁 output/
│   ├── protocol_distribution.png
│   ├── top_talkers.png
│   └── packet_sizes.png
│
├── requirements.txt
├── README.md
└── main.py

The exact structure can be changed as the project develops.

⚙️ Installation

Install the required Python libraries:

pip install scapy pandas matplotlib

You can also store them in requirements.txt:

scapy
pandas
matplotlib

Then install everything using:

pip install -r requirements.txt

▶️ Running the Analyzer

A simple project workflow can look like:

python main.py data/traffic.pcap

The program then:

PCAP
 │
 ▼
Read packets
 │
 ▼
Extract information
 │
 ▼
Analyze traffic
 │
 ├── Protocols
 ├── IP addresses
 ├── Packet sizes
 └── Suspicious patterns
 │
 ▼
Generate charts
 │
 ▼
Display / save results

🔐 Security and Ethics

This project is intended for learning, defensive analysis, and
authorized network testing.

Only capture or analyze traffic that you are authorized to inspect.

For development, using sample PCAP files or a controlled local lab is a
safe way to learn packet analysis.

🧩 What We Learn From This Project

This project connects several important networking concepts together:

TCP/IP
  │
  ├── IP addresses
  ├── Ports
  ├── TCP / UDP
  ├── ICMP
  └── DNS
       │
       ▼
   Packet Capture
       │
       ▼
      Scapy
       │
       ▼
     Python
       │
       ├── pandas
       ├── Analysis
       └── Detection
             │
             ▼
         matplotlib
             │
             ▼
       Visual Reports

Instead of only learning networking theory, we can actually see the
packets and turn them into data.

🚀 Future Improvements

Possible improvements include:

Real-time packet capture

More protocol detection

Better port-scan detection

Request-rate monitoring

IP reputation checking

GeoIP visualization

Interactive dashboards

Exporting reports to CSV/JSON

More advanced anomaly detection

A web interface for uploading PCAP files

🏁 Project Summary

The Network Traffic Analyzer turns raw network packets into
understandable information.

📦 RAW PACKETS
      ↓
🔍 ANALYSIS
      ↓
📊 STATISTICS
      ↓
📈 VISUALIZATION
      ↓
🚨 ANOMALY ALERTS

The main idea is simple:

Capture → Understand → Analyze → Visualize → Detect

This project gives us a practical way to understand what is happening
inside network traffic while connecting computer networking, Python
programming, data analysis, visualization, and basic cybersecurity.

🔎 Network Traffic Analyzer

📡 See what is happening inside network traffic --- in a simple way.

A beginner-friendly cybersecurity and networking project that reads
captured network packets, understands what they contain, analyzes the
traffic, and turns the results into clean charts and simple alerts.

🌐 The Big Idea

Imagine a huge road full of vehicles.

🚗   🚕   🚌   🚚   🚓   🚗   🛵   🚑
──────────────────────────────────────────→
                 🛣️ ROAD

Now imagine that the internet is a road and the packets are the
vehicles.

📦   📦   📦   📦   📦   📦   📦
────────────────────────────────────→
              🌐 NETWORK

Our project looks at those packets and asks:

Who is talking? What are they using? How much traffic is there? Does
anything look unusual?

🧒 First: What Is a Packet?

A packet is a small piece of information traveling through a
network.

Think of it like sending a tiny parcel.

             📦 PACKET
        ┌─────────────────┐
        │ 👤 FROM         │
        │ 192.168.1.10    │
        │                 │
        │ 🎯 TO           │
        │ 8.8.8.8         │
        │                 │
        │ 🌐 PROTOCOL     │
        │ TCP             │
        │                 │
        │ 📏 SIZE         │
        │ 512 bytes       │
        └─────────────────┘

A packet can contain information that helps us understand:

👤 Who sent it

🎯 Where it is going

🌐 Which protocol it uses

🔢 Which ports are involved

📏 How large it is

Our job is to inspect these packets and turn them into useful
information.

🎯 What Are We Building?

We are building a Network Traffic Analyzer.

             📦 RAW PACKETS
                    │
                    ▼
              🔍 INSPECT
                    │
                    ▼
             🧠 UNDERSTAND
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      🌐 WHAT?    👥 WHO?     📏 HOW BIG?
        │           │           │
        └───────────┼───────────┘
                    ▼
                 📊 ANALYZE
                    │
                    ▼
              🚨 CHECK FOR
              UNUSUAL PATTERNS
                    │
                    ▼
               📈 RESULTS

The project takes a network capture and produces useful information such
as:

📊 Protocol breakdown
👥 Top source IPs
🎯 Top destination IPs
📏 Packet-size information
🚨 Simple anomaly alerts
📈 Visual charts

🗺️ The Entire Project in One Picture

flowchart LR
    A["🌐 Network"] --> B["📦 Packets"]
    B --> C["🦈 Wireshark / PCAP"]
    C --> D["🐍 Python + Scapy"]
    D --> E["🔍 Extract Information"]

    E --> F["🌐 Protocols"]
    E --> G["👥 IP Addresses"]
    E --> H["📏 Packet Sizes"]
    E --> I["🚨 Traffic Patterns"]

    F --> J["🐼 pandas"]
    G --> J
    H --> J

    J --> K["📊 matplotlib"]
    I --> K

    K --> L["📈 Charts"]
    K --> M["🚨 Alerts"]

🦈 Step 1 --- Capture the Traffic

Before analyzing traffic, we need the traffic itself.

One way to inspect or capture network packets is Wireshark.

Think of Wireshark as a camera pointed at the network.

🌐 NETWORK
    │
    │ 📦 📦 📦 📦 📦
    ▼
🦈 WIRESHARK
    │
    ▼
📝 SAVED CAPTURE

We can save that capture as a .pcap file.

📦 What Is a PCAP File?

Don't worry about the name.

A PCAP file is basically a recording of network packets.

Think about a video:

🎥 VIDEO
   │
   └── records what happened

PCAP does something similar:

🦈 WIRESHARK
     │
     │ records packets
     ▼
📁 traffic.pcap
     │
     └── contains captured packets

Instead of needing a live network every time, our Python program can
simply read the saved file.

📁 traffic.pcap
      │
      ▼
🐍 OUR PROGRAM
      │
      ▼
📊 ANALYSIS

This makes development much easier.

🐍 Step 2 --- Python Reads the Packets

Python is the brain of our analyzer.

📁 traffic.pcap
       │
       ▼
    🐍 PYTHON
       │
       ▼
   📦 📦 📦 📦

But Python alone doesn't make packet analysis convenient.

That's where Scapy comes in.

🕷️ Step 3 --- Scapy

Scapy is a Python library for working with network packets.

Think of Scapy as a pair of special glasses.

Without it:

📦📦📦📦📦
"Lots of packets..."

With Scapy:

📦 → 👤 Source IP
   → 🎯 Destination IP
   → 🌐 Protocol
   → 🔢 Ports
   → 📏 Size

So Scapy helps our Python program open a packet and inspect its
contents.

🧩 What Information Do We Take From a Packet?

We can imagine every packet going through a small inspection machine:

                  📦 PACKET
                     │
                     ▼
              ┌──────────────┐
              │ 🔍 INSPECTOR │
              └──────┬───────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
     👤 SOURCE    🎯 DEST.     🌐 PROTOCOL
        │            │            │
        └────────────┼────────────┘
                     │
              ┌──────┴──────┐
              ▼             ▼
           🔢 PORTS       📏 SIZE

This extracted information becomes the raw material for our analysis.

🌐 Step 4 --- Understanding Protocols

A protocol is simply a set of rules that tells computers how to
communicate.

Think of different protocols as different ways of communicating.

                  🌐 NETWORK
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
       TCP           UDP           ICMP
       🔒            ⚡             📡
   reliable        faster        diagnostic

We are particularly interested in traffic such as:

🔒 TCP

TCP focuses on reliable communication.

💻 ──────── TCP ────────> 🖥️
       "Let's communicate reliably."

⚡ UDP

UDP is commonly used when low overhead and speed are useful.

💻 ───────── UDP ────────> 🖥️
            ⚡

📡 ICMP

ICMP is commonly used for network control and diagnostic messages.

For example:

💻 ─── ping ───> 🖥️
       │
       ▼
     ICMP

📖 DNS

DNS helps translate a domain name into an IP address.

"example.com"
      │
      ▼
     DNS
      │
      ▼
"93.184.x.x"

📊 Step 5 --- Protocol Distribution

After reading many packets, we can count how many packets belong to each
protocol.

For example:

TCP   ████████████████████
UDP   ███████████
DNS   ███████
ICMP  ███

This answers:

"What kind of traffic is inside this capture?"

The actual numbers depend on the PCAP file we analyze.

👥 Step 6 --- Who Is Talking the Most?

Every packet has a source and destination.

💻 A ───────────────> 🖥️ B
   source              destination

If one IP appears again and again, it may be generating a lot of
traffic.

We call frequently communicating devices top talkers.

Imagine a classroom:

👨 Student A   ███████████████
👩 Student B   ████████
👨 Student C   ████
👩 Student D   ██

Our analyzer does the same thing with IP addresses.

Example:

TOP SOURCE IPs

192.168.1.10   ███████████████
192.168.1.15   █████████
192.168.1.20   █████

This helps us understand which devices are communicating most
frequently.

📏 Step 7 --- Packet Sizes

Packets are not always the same size.

📦     Small
📦📦   Medium
📦📦📦 Large

Our analyzer can collect packet sizes and summarize them.

Packet Size

0–250 bytes      ███████████████
251–500 bytes    █████████
501–750 bytes    █████
751+ bytes       ██

This gives us another way to understand the traffic.

🐼 Step 8 --- pandas

Now we have a lot of information.

Imagine hundreds or thousands of packets:

📦 📦 📦 📦 📦 📦 📦 📦 📦 📦
📦 📦 📦 📦 📦 📦 📦 📦 📦 📦
📦 📦 📦 📦 📦 📦 📦 📦 📦 📦

Trying to manually count everything would be painful.

That's where pandas helps.

We can organize the information into a table:

┌────┬──────────────┬──────────────┬──────────┬──────┐
│ #  │ Source       │ Destination  │ Protocol │ Size │
├────┼──────────────┼──────────────┼──────────┼──────┤
│ 1  │ 192.168.1.10 │ 8.8.8.8      │ UDP      │ 72   │
│ 2  │ 192.168.1.10 │ 1.1.1.1      │ TCP      │ 512  │
│ 3  │ 192.168.1.20 │ 192.168.1.1  │ ICMP     │ 98   │
└────┴──────────────┴──────────────┴──────────┴──────┘

Now counting and grouping the data becomes much easier.

📊 Step 9 --- matplotlib

Numbers are useful.

But pictures are often easier to understand.

That's why we use matplotlib.

🐍 Python
   │
   ▼
🐼 pandas
   │
   ▼
📊 matplotlib
   │
   ├── Protocol Chart
   ├── Top IP Chart
   └── Packet Size Chart

For example:

Protocol Distribution

TCP    ███████████████████
UDP    ███████████
DNS    ██████
ICMP   ███

The actual charts generated by the project can be much cleaner and more
detailed than this simple illustration.

🚨 Step 10 --- Finding Something Unusual

Now comes the security part.

We don't want to say:

"This is definitely an attack."

Instead, we can say:

"This traffic looks unusual and deserves attention."

One simple example is a possible port scan.

🚪 What Is a Port?

Think of a computer like a building.

              🏢 COMPUTER
        ┌────────────────────┐
        │ 🚪 Port 22         │
        │ 🚪 Port 53         │
        │ 🚪 Port 80         │
        │ 🚪 Port 443        │
        │ 🚪 Port 8080       │
        └────────────────────┘

Different network services can listen on different ports.

A normal connection might look like:

💻 ───────────> 🚪 Port 443

But imagine one IP trying many different doors:

                 ┌── 🚪 21
                 ├── 🚪 22
                 ├── 🚪 23
                 ├── 🚪 25
💻 ──────────────┼── 🚪 53
                 ├── 🚪 80
                 ├── 🚪 443
                 ├── 🚪 8080
                 └── 🚪 ...

That pattern can resemble port scanning.

🚨 Simple Anomaly Rule

Our analyzer can use a simple threshold.

For example:

One IP
  │
  ▼
Contacts many different ports
  │
  ▼
100+ unique ports
  │
  ▼
🚨 ALERT

Example output:

╔════════════════════════════════════╗
║          ⚠️ ALERT                  ║
╠════════════════════════════════════╣
║ Source IP: 192.168.1.50            ║
║ Unique ports: 137                  ║
║                                    ║
║ Possible port scanning pattern     ║
║ detected.                          ║
╚════════════════════════════════════╝

⚠️ Important

This does not automatically mean an attack happened.

It simply means:

"This traffic matches a pattern that we decided is worth
checking."

🔄 Complete Analysis Pipeline

Everything now comes together:

                    🌐 NETWORK
                        │
                        ▼
                  📦 PACKETS
                        │
                        ▼
                🦈 WIRESHARK
                        │
                        ▼
                  📁 .PCAP FILE
                        │
                        ▼
                 🐍 PYTHON
                        │
                        ▼
                    🕷️ SCAPY
                        │
                        ▼
              🔍 EXTRACT INFORMATION
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
   🌐 Protocols      👥 IPs          📏 Sizes
       │                │                │
       └────────────────┼────────────────┘
                        ▼
                    🐼 PANDAS
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
          📊 Statistics       🚨 Detection
              │                   │
              └─────────┬─────────┘
                        ▼
                   📈 MATPLOTLIB
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
           📊 CHARTS            🚨 ALERTS

🏗️ Project Architecture

flowchart TD
    A["🌐 Network Traffic"] --> B["🦈 Wireshark"]
    B --> C["📁 traffic.pcap"]

    C --> D["🐍 Python"]
    D --> E["🕷️ Scapy"]

    E --> F["📦 Extract Packet Data"]

    F --> G["🌐 Protocol Analysis"]
    F --> H["👥 Source / Destination IP"]
    F --> I["📏 Packet Size"]
    F --> J["🔢 Port Activity"]

    G --> K["🐼 pandas"]
    H --> K
    I --> K
    J --> L["🚨 Anomaly Detector"]

    K --> M["📊 matplotlib"]
    L --> M

    M --> N["📈 Visual Reports"]
    M --> O["🚨 Alerts"]

🗂️ Project Structure

A clean project can be organized like this:

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
├── 🐍 main.py
├── 📄 requirements.txt
└── 📖 README.md

The exact structure can change as the implementation develops.

⚙️ Technologies

Technology          Simple Explanation

🦈 Wireshark    Helps capture and inspect network packets
🐍 Python       Main programming language
🕷️ Scapy        Reads and inspects packets
🐼 pandas       Organizes and analyzes packet data
📊 matplotlib   Creates charts and visualizations
📦 PCAP         Stores captured network packets

🧪 Running the Project

Install the required libraries:

pip install scapy pandas matplotlib

Or:

pip install -r requirements.txt

Then the analyzer can be run against a capture file:

python main.py data/traffic.pcap

The general flow is:

📁 traffic.pcap
       │
       ▼
🐍 python main.py
       │
       ▼
🕷️ Scapy reads packets
       │
       ▼
🔍 Analyzer extracts information
       │
       ├──────────────┐
       ▼              ▼
    📊 Stats       🚨 Alerts
       │              │
       └──────┬───────┘
              ▼
         📈 Results

📄 Example Output

A terminal report can look something like:

╔══════════════════════════════════════════╗
║       🔎 NETWORK TRAFFIC ANALYZER        ║
╚══════════════════════════════════════════╝

📁 File: traffic.pcap

📦 Total Packets: 5000

🌐 Protocol Distribution
────────────────────────
TCP   : 3000
UDP   : 1200
DNS   :  600
ICMP  :  200

👥 Top Source IPs
────────────────────────
192.168.1.10 : 1250
192.168.1.15 :  830
192.168.1.20 :  420

🎯 Top Destination IPs
────────────────────────
8.8.8.8      : 700
1.1.1.1      : 450
192.168.1.1  : 400

🚨 Anomaly Detection
────────────────────────
⚠️ 192.168.1.50 contacted 137 unique ports

📊 Charts generated successfully.

Note: These numbers are only examples to show what the output can
look like. Actual values come from the PCAP file being analyzed.

🛡️ Why This Project Is Useful

This project connects several concepts that are often learned
separately:

       🌐 NETWORKING
             │
       ┌─────┴─────┐
       ▼           ▼
   TCP / UDP     IP / Ports
       │           │
       └─────┬─────┘
             ▼
        📦 PACKETS
             │
             ▼
          🐍 PYTHON
             │
       ┌─────┴─────┐
       ▼           ▼
    🕷️ Scapy    🐼 pandas
       │           │
       └─────┬─────┘
             ▼
        📊 matplotlib
             │
       ┌─────┴─────┐
       ▼           ▼
     Charts      Alerts

Instead of only reading about networking, we can actually look at
network traffic and turn it into data.

🚀 Future Improvements

Once the basic analyzer works, it can be extended with:

                    🚀 FUTURE
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
   📡 Live Capture   🌍 GeoIP       📊 Dashboard
       │               │                │
       ▼               ▼                ▼
   Real-time       IP locations     Web UI
    analysis
       │
       ├───────────────┐
       ▼               ▼
   🤖 Advanced      📄 Export
    detection       CSV / JSON

Possible additions:

📡 Real-time packet capture

📊 Interactive dashboard

🌍 IP/GeoIP visualization

📄 CSV and JSON reports

🚨 More anomaly rules

📈 Request-rate monitoring

🔎 More protocol analysis

🤖 More advanced anomaly detection

🔐 Security & Ethics

This project should be used for learning, defensive analysis, and
authorized testing.

Only capture or inspect traffic that you have permission to analyze.

For learning and development, using:

🧪 Local Lab
     +
📦 Sample PCAP
     +
🐍 Python

is a safe way to practice packet analysis.

🧠 What We Actually Learn

By completing this project, we connect:

🌐 Networking
      +
🐍 Python
      +
📦 Packet Analysis
      +
📊 Data Analysis
      +
📈 Visualization
      +
🛡️ Basic Security

And the entire project can be remembered with one simple sentence:

📦 Capture → 🔍 Understand → 📊 Analyze → 🚨 Detect → 📈 Visualize

⭐ Final Picture

                 🌐 NETWORK
                     │
                     ▼
               📦 📦 📦 📦
                  PACKETS
                     │
                     ▼
                 🦈 PCAP
                     │
                     ▼
              🐍 PYTHON + 🕷️ SCAPY
                     │
                     ▼
              🔍 UNDERSTAND DATA
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
        🌐 WHAT?   👥 WHO?    📏 HOW BIG?
          │          │          │
          └──────────┼──────────┘
                     ▼
                  🐼 PANDAS
                     │
             ┌───────┴───────┐
             ▼               ▼
          📊 ANALYZE       🚨 CHECK
             │               │
             └───────┬───────┘
                     ▼
                📈 MATPLOTLIB
                     │
             ┌───────┴───────┐
             ▼               ▼
          📊 CHARTS         🚨 ALERTS

🎯 The goal is simple:

Take complicated-looking network traffic and turn it into something
a human can understand.

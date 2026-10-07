import os
import sys
import tempfile

import streamlit as st
import pandas as pd


# =========================================================
# PROJECT SETUP
# =========================================================

sys.path.append(
    os.path.join(os.path.dirname(__file__), "src")
)

from analyzer import analyze_pcap
from traffic_statistics import calculate_statistics
from anomaly_detector import detect_anomalies


# =========================================================
# PAGE CONFIGURATION
# =========================================================

st.set_page_config(
    page_title="NetVision | Network Traffic Analyzer",
    page_icon="🔎",
    layout="wide",
    initial_sidebar_state="expanded"
)


# =========================================================
# CUSTOM CSS
# =========================================================

st.markdown(
    """
    <style>

    /* =========================================
       MAIN BACKGROUND
       ========================================= */

    .stApp {
        background:
            radial-gradient(
                circle at 0% 0%,
                rgba(59, 130, 246, 0.18),
                transparent 30%
            ),
            radial-gradient(
                circle at 100% 0%,
                rgba(139, 92, 246, 0.16),
                transparent 30%
            ),
            radial-gradient(
                circle at 50% 100%,
                rgba(236, 72, 153, 0.10),
                transparent 35%
            ),
            linear-gradient(
                135deg,
                #f4f8ff 0%,
                #f7f5ff 50%,
                #fff7fc 100%
            );
    }


    /* =========================================
       MAIN CONTENT
       ========================================= */

    .block-container {
        max-width: 1450px;
        padding-top: 2.5rem;
        padding-bottom: 3rem;
    }


    /* =========================================
       SIDEBAR
       ========================================= */

    section[data-testid="stSidebar"] {
        background:
            linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.92),
                rgba(241, 246, 255, 0.88)
            );

        border-right: 1px solid rgba(148, 163, 184, 0.16);

        box-shadow:
            5px 0 25px rgba(37, 99, 235, 0.06);
    }


    /* =========================================
       HEADINGS
       ========================================= */

    h1 {
        color: #172554 !important;
        font-weight: 800 !important;
        letter-spacing: -1px;
    }

    h2 {
        color: #1e3a8a !important;
        font-weight: 750 !important;
    }

    h3 {
        color: #1e3a8a !important;
        font-weight: 700 !important;
    }

    p {
        color: #475569;
    }


    /* =========================================
       GLASS CONTAINERS
       ========================================= */

    div[data-testid="stVerticalBlockBorderWrapper"] {
        background:
            linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.72),
                rgba(255, 255, 255, 0.52)
            );

        border: 1px solid rgba(255, 255, 255, 0.95);

        border-radius: 22px;

        box-shadow:
            0 10px 35px rgba(30, 64, 175, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);

        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
    }


    /* =========================================
       METRIC CARDS
       ========================================= */

    div[data-testid="stMetric"] {
        background:
            linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.82),
                rgba(255, 255, 255, 0.58)
            );

        border: 1px solid rgba(255, 255, 255, 0.95);

        border-radius: 18px;

        padding: 20px;

        box-shadow:
            0 8px 25px rgba(30, 64, 175, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);

        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
    }

    div[data-testid="stMetricLabel"] {
        color: #64748b !important;
        font-weight: 650 !important;
    }

    div[data-testid="stMetricValue"] {
        color: #172554 !important;
        font-weight: 800 !important;
    }


    /* =========================================
       FILE UPLOADER
       ========================================= */

    section[data-testid="stFileUploaderDropzone"] {
        background:
            rgba(255, 255, 255, 0.70);

        border: 2px dashed rgba(37, 99, 235, 0.35);

        border-radius: 20px;

        padding: 20px;

        box-shadow:
            0 8px 25px rgba(37, 99, 235, 0.05);
    }


    /* =========================================
       BUTTONS
       ========================================= */

    .stButton > button {
        border-radius: 12px;

        border: none;

        background:
            linear-gradient(
                135deg,
                #2563eb,
                #7c3aed
            );

        color: white;

        font-weight: 700;

        box-shadow:
            0 7px 20px rgba(79, 70, 229, 0.22);

        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
    }


    .stButton > button:hover {
        transform: translateY(-2px);

        box-shadow:
            0 11px 28px rgba(79, 70, 229, 0.32);
    }


    /* =========================================
       DOWNLOAD BUTTONS
       ========================================= */

    .stDownloadButton > button {
        border-radius: 12px;

        border: 1px solid rgba(37, 99, 235, 0.18);

        background:
            rgba(255, 255, 255, 0.78);

        color: #1d4ed8;

        font-weight: 650;
    }


    .stDownloadButton > button:hover {
        background: rgba(255, 255, 255, 0.96);

        border-color: rgba(37, 99, 235, 0.40);
    }


    /* =========================================
       DATAFRAMES
       ========================================= */

    div[data-testid="stDataFrame"] {
        border-radius: 15px;

        overflow: hidden;

        border: 1px solid rgba(148, 163, 184, 0.12);
    }


    /* =========================================
       ALERTS
       ========================================= */

    div[data-testid="stAlert"] {
        border-radius: 14px;
    }


    /* =========================================
       DIVIDERS
       ========================================= */

    hr {
        border: none;

        height: 1px;

        background:
            linear-gradient(
                90deg,
                transparent,
                rgba(99, 102, 241, 0.25),
                transparent
            );

        margin: 28px 0;
    }


    /* =========================================
       SPINNER
       ========================================= */

    div[data-testid="stSpinner"] {
        color: #2563eb;
    }

    </style>
    """,
    unsafe_allow_html=True
)


# =========================================================
# SIDEBAR
# =========================================================

with st.sidebar:

    st.title("🔎 NetVision")

    st.caption(
        "Network Traffic Intelligence"
    )

    st.divider()

    st.subheader("📂 Analysis")

    st.write(
        "Upload a network capture and analyze "
        "its traffic characteristics."
    )

    st.divider()

    st.subheader("🧠 Modules")

    st.write("📦 Packet Analysis")
    st.write("🌐 Protocol Detection")
    st.write("📊 Traffic Statistics")
    st.write("🚨 Anomaly Detection")
    st.write("📈 Traffic Visualization")
    st.write("📥 CSV Reports")

    st.divider()

    st.subheader("🛠️ Technology")

    st.write("Python")
    st.write("Scapy")
    st.write("Pandas")
    st.write("Streamlit")

    st.divider()

    st.caption(
        "Network Traffic Analyzer • Project Dashboard"
    )


# =========================================================
# HERO SECTION
# =========================================================

st.title("🔎 Network Traffic Analyzer")

st.write(
    "Analyze, visualize and investigate network traffic "
    "from PCAP and PCAPNG capture files."
)

st.write("")


# =========================================================
# FILE UPLOAD
# =========================================================

with st.container(border=True):

    st.subheader("📁 Traffic Capture")

    st.write(
        "Upload a Wireshark capture file to begin analysis."
    )

    uploaded_file = st.file_uploader(
        "Choose a PCAP file",
        type=["pcap", "pcapng"],
        help="Supported formats: PCAP and PCAPNG"
    )


# =========================================================
# PROCESS UPLOADED FILE
# =========================================================

if uploaded_file is not None:

    st.success(
        f"Capture loaded: {uploaded_file.name}"
    )

    st.write("")

    analyze_button = st.button(
        "🚀 Analyze Network Traffic",
        type="primary",
        use_container_width=True
    )

    if analyze_button:

        progress = st.progress(0)

        status = st.empty()

        temp_file = None

        try:

            # ---------------------------------------------
            # Determine original file extension
            # ---------------------------------------------

            original_extension = os.path.splitext(
                uploaded_file.name
            )[1].lower()

            if original_extension not in [
                ".pcap",
                ".pcapng"
            ]:
                original_extension = ".pcapng"


            # ---------------------------------------------
            # Create temporary capture file
            # ---------------------------------------------

            status.info(
                "📁 Preparing capture file..."
            )

            temp = tempfile.NamedTemporaryFile(
                mode="wb",
                suffix=original_extension,
                delete=False
            )

            temp_file = temp.name

            temp.write(
                uploaded_file.getvalue()
            )

            temp.close()

            progress.progress(10)


            # ---------------------------------------------
            # Read PCAP
            # ---------------------------------------------

            status.info(
                "📡 Reading network packets..."
            )

            progress.progress(20)

            df = analyze_pcap(
                temp_file
            )


            # ---------------------------------------------
            # Calculate statistics
            # ---------------------------------------------

            status.info(
                "📊 Calculating traffic statistics..."
            )

            progress.progress(55)

            statistics = calculate_statistics(
                df
            )


            # ---------------------------------------------
            # Detect anomalies
            # ---------------------------------------------

            status.info(
                "🚨 Detecting potentially unusual packets..."
            )

            progress.progress(75)

            anomalies = detect_anomalies(
                df
            )


            # ---------------------------------------------
            # Store results
            # ---------------------------------------------

            progress.progress(100)

            st.session_state["df"] = df

            st.session_state[
                "statistics"
            ] = statistics

            st.session_state[
                "anomalies"
            ] = anomalies

            st.session_state[
                "uploaded_filename"
            ] = uploaded_file.name

            status.success(
                "✅ Network traffic analysis completed!"
            )


        except Exception as e:

            progress.empty()

            status.error(
                f"❌ Analysis failed: {e}"
            )


        finally:

            # ---------------------------------------------
            # Remove temporary file
            # ---------------------------------------------

            if temp_file is not None:

                try:

                    os.remove(
                        temp_file
                    )

                except OSError:

                    pass


# =========================================================
# DISPLAY RESULTS
# =========================================================

if "df" in st.session_state:

    df = st.session_state["df"]

    statistics = st.session_state[
        "statistics"
    ]

    anomalies = st.session_state[
        "anomalies"
    ]


    # =====================================================
    # ANALYZED FILE
    # =====================================================

    st.divider()

    filename = st.session_state.get(
        "uploaded_filename",
        "Network capture"
    )

    st.caption(
        f"Analyzed capture: **{filename}**"
    )


    # =====================================================
    # TRAFFIC OVERVIEW
    # =====================================================

    st.header("📊 Traffic Overview")

    total_packets = statistics.get(
        "total_packets",
        len(df)
    )

    total_bytes = statistics.get(
        "total_bytes",
        int(df["length"].sum())
    )

    average_packet_size = statistics.get(
        "average_packet_size",
        float(df["length"].mean())
    )

    anomaly_count = len(
        anomalies
    )


    # ---------------------------------------------
    # Human-readable traffic size
    # ---------------------------------------------

    if total_bytes >= 1024 * 1024:

        traffic_size = (
            f"{total_bytes / (1024 * 1024):.2f} MB"
        )

    elif total_bytes >= 1024:

        traffic_size = (
            f"{total_bytes / 1024:.2f} KB"
        )

    else:

        traffic_size = (
            f"{total_bytes:,} B"
        )


    # =====================================================
    # KPI CARDS
    # =====================================================

    col1, col2, col3, col4 = st.columns(4)

    with col1:

        st.metric(
            label="📦 Total Packets",
            value=f"{total_packets:,}"
        )

    with col2:

        st.metric(
            label="💾 Total Traffic",
            value=traffic_size
        )

    with col3:

        st.metric(
            label="📏 Average Packet",
            value=f"{average_packet_size:.1f} B"
        )

    with col4:

        st.metric(
            label="🚨 Anomalies",
            value=f"{anomaly_count:,}"
        )


    # =====================================================
    # PROTOCOL INTELLIGENCE
    # =====================================================

    st.divider()

    st.header("🌐 Protocol Intelligence")

    protocol_counts = (
        df["protocol"]
        .value_counts()
    )


    chart_col, table_col = st.columns(
        [2, 1]
    )


    # ---------------------------------------------
    # Protocol chart
    # ---------------------------------------------

    with chart_col:

        with st.container(border=True):

            st.subheader(
                "Protocol Distribution"
            )

            st.bar_chart(
                protocol_counts,
                use_container_width=True
            )


    # ---------------------------------------------
    # Protocol table
    # ---------------------------------------------

    with table_col:

        with st.container(border=True):

            st.subheader(
                "Protocol Breakdown"
            )

            protocol_table = (
                protocol_counts
                .reset_index()
            )

            protocol_table.columns = [
                "Protocol",
                "Packets"
            ]

            st.dataframe(
                protocol_table,
                use_container_width=True,
                hide_index=True
            )


    # =====================================================
    # PACKET SIZE ANALYSIS
    # =====================================================

    st.divider()

    st.header("📏 Packet Size Analysis")

    st.write(
        "Distribution of packet sizes observed "
        "in the network capture."
    )


    with st.container(border=True):

        packet_sizes = (
            df["length"]
            .value_counts()
            .sort_index()
        )

        st.bar_chart(
            packet_sizes,
            use_container_width=True
        )


    # =====================================================
    # TRAFFIC TIMELINE
    # =====================================================

    st.divider()

    st.header("📈 Traffic Timeline")

    st.write(
        "Packet sizes observed throughout "
        "the capture."
    )


    traffic_df = df[
        [
            "timestamp",
            "length"
        ]
    ].copy()


    traffic_df["timestamp"] = pd.to_datetime(
        traffic_df["timestamp"],
        unit="s"
    )


    traffic_df = traffic_df.set_index(
        "timestamp"
    )


    with st.container(border=True):

        st.line_chart(
            traffic_df["length"],
            use_container_width=True
        )


    # =====================================================
    # ANOMALY DETECTION
    # =====================================================

    st.divider()

    st.header("🚨 Anomaly Detection")


    if anomalies.empty:

        st.success(
            "🟢 No potentially unusual packets "
            "were detected."
        )

    else:

        st.warning(
            f"🟠 {len(anomalies):,} potentially unusual "
            "packets detected based on the configured "
            "packet-size threshold."
        )


        with st.container(border=True):

            st.dataframe(
                anomalies,
                use_container_width=True,
                hide_index=True
            )


    # =====================================================
    # PACKET EXPLORER
    # =====================================================

    st.divider()

    st.header("📦 Packet Explorer")

    st.write(
        "Inspect packet-level information extracted "
        "from the capture."
    )


    with st.container(border=True):

        st.dataframe(
            df,
            use_container_width=True,
            hide_index=True,
            height=450
        )


    # =====================================================
    # EXPORT REPORTS
    # =====================================================

    st.divider()

    st.header("📥 Export Reports")


    csv_data = (
        df.to_csv(
            index=False
        )
        .encode("utf-8")
    )


    anomaly_csv = (
        anomalies.to_csv(
            index=False
        )
        .encode("utf-8")
    )


    download1, download2 = st.columns(2)


    with download1:

        st.download_button(
            label="📄 Download Traffic Analysis",
            data=csv_data,
            file_name="traffic_analysis.csv",
            mime="text/csv",
            use_container_width=True
        )


    with download2:

        st.download_button(
            label="🚨 Download Anomaly Report",
            data=anomaly_csv,
            file_name="anomalies.csv",
            mime="text/csv",
            use_container_width=True
        )


    # =====================================================
    # FOOTER
    # =====================================================

    st.divider()

    st.caption(
        "🔎 NetVision • Network Traffic Analyzer "
        "• Built with Python, Scapy, Pandas & Streamlit"
    )


# =========================================================
# EMPTY STATE
# =========================================================

else:

    st.write("")

    with st.container(border=True):

        st.subheader(
            "📡 Ready to Analyze"
        )

        st.write(
            "Upload a PCAP or PCAPNG capture above "
            "to visualize network traffic, inspect "
            "protocols, detect potentially unusual "
            "packets and generate reports."
        )

        st.info(
            "👆 Start by uploading your Wireshark capture."
        )
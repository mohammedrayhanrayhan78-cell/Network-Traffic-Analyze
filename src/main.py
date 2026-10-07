import os

from analyzer import analyze_pcap
from traffic_statistics import calculate_statistics, print_statistics
from anomaly_detector import detect_anomalies, print_anomalies
from visualizer import create_visualizations


def main():
    print("\n======================================")
    print("       NETWORK TRAFFIC ANALYZER")
    print("======================================\n")

    # PCAP file location
    pcap_file = os.path.join("data", "traffic.pcap")

    # Check whether PCAP exists
    if not os.path.exists(pcap_file):
        print(f"ERROR: PCAP file not found!")
        print(f"Expected location: {pcap_file}")
        print("\nPlease place a PCAP file inside the data folder.")
        return

    try:
        # Step 1: Analyze packets
        df = analyze_pcap(pcap_file)

        # Step 2: Calculate statistics
        statistics = calculate_statistics(df)
        print_statistics(statistics)

        # Step 3: Detect anomalies
        anomalies = detect_anomalies(df)
        print_anomalies(anomalies)

        # Step 4: Create visualizations
        create_visualizations(df, "output")

        # Step 5: Save analyzed data
        output_csv = os.path.join("output", "traffic_analysis.csv")
        df.to_csv(output_csv, index=False)

        # Save anomalies
        anomaly_csv = os.path.join("output", "anomalies.csv")
        anomalies.to_csv(anomaly_csv, index=False)

        print("========== ANALYSIS COMPLETE ==========")
        print(f"Traffic data saved to : {output_csv}")
        print(f"Anomalies saved to     : {anomaly_csv}")
        print("=======================================\n")

    except Exception as e:
        print("\nERROR while analyzing traffic:")
        print(e)


if __name__ == "__main__":
    main()
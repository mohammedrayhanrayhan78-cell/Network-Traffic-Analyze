import os
import matplotlib.pyplot as plt


def create_visualizations(df, output_dir="output"):
    """
    Creates visualizations for network traffic analysis.
    """

    if df.empty:
        print("No data available for visualization.")
        return

    os.makedirs(output_dir, exist_ok=True)

    # 1. Protocol distribution
    protocol_counts = df["protocol"].value_counts()

    plt.figure(figsize=(8, 5))
    protocol_counts.plot(kind="bar")
    plt.title("Network Traffic by Protocol")
    plt.xlabel("Protocol")
    plt.ylabel("Number of Packets")
    plt.tight_layout()

    protocol_path = os.path.join(
        output_dir,
        "protocol_distribution.png"
    )

    plt.savefig(protocol_path)
    plt.close()

    # 2. Packet size distribution
    plt.figure(figsize=(8, 5))
    plt.hist(df["length"], bins=20)
    plt.title("Packet Size Distribution")
    plt.xlabel("Packet Size (bytes)")
    plt.ylabel("Number of Packets")
    plt.tight_layout()

    packet_size_path = os.path.join(
        output_dir,
        "packet_size_distribution.png"
    )

    plt.savefig(packet_size_path)
    plt.close()

    # 3. Traffic over time
    plt.figure(figsize=(10, 5))
    plt.plot(df["timestamp"], df["length"])
    plt.title("Network Traffic Over Time")
    plt.xlabel("Timestamp")
    plt.ylabel("Packet Size (bytes)")
    plt.tight_layout()

    traffic_path = os.path.join(
        output_dir,
        "traffic_over_time.png"
    )

    plt.savefig(traffic_path)
    plt.close()

    print("\n========== VISUALIZATIONS ==========")
    print(f"Created: {protocol_path}")
    print(f"Created: {packet_size_path}")
    print(f"Created: {traffic_path}")
    print("====================================\n")


if __name__ == "__main__":
    print("Traffic Analyzer - Visualization Module")
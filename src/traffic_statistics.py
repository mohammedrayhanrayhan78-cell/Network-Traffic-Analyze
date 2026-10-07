import pandas as pd


def calculate_statistics(df):
    """
    Calculates basic statistics from analyzed network traffic.
    """

    if df.empty:
        return {
            "total_packets": 0,
            "total_bytes": 0,
            "average_packet_size": 0,
            "protocol_counts": {}
        }

    total_packets = len(df)
    total_bytes = int(df["length"].sum())
    average_packet_size = float(df["length"].mean())

    protocol_counts = df["protocol"].value_counts().to_dict()

    statistics = {
        "total_packets": total_packets,
        "total_bytes": total_bytes,
        "average_packet_size": round(average_packet_size, 2),
        "protocol_counts": protocol_counts
    }

    return statistics


def print_statistics(statistics):
    """
    Prints traffic statistics in a readable format.
    """

    print("\n========== TRAFFIC STATISTICS ==========")

    print(f"Total Packets       : {statistics['total_packets']}")
    print(f"Total Bytes         : {statistics['total_bytes']}")
    print(f"Average Packet Size : {statistics['average_packet_size']} bytes")

    print("\nProtocol Distribution:")

    for protocol, count in statistics["protocol_counts"].items():
        print(f"  {protocol:<10}: {count}")

    print("========================================\n")


if __name__ == "__main__":
    print("Traffic Analyzer - Statistics Module")
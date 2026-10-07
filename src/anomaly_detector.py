import pandas as pd


def detect_anomalies(df, threshold=1500):
    """
    Detects potentially suspicious packets based on packet size.

    Packets larger than the specified threshold are marked as anomalies.
    """

    if df.empty:
        return pd.DataFrame(columns=df.columns)

    anomalies = df[df["length"] > threshold].copy()

    return anomalies


def print_anomalies(anomalies):
    """
    Prints detected anomalies in a readable format.
    """

    print("\n========== ANOMALY DETECTION ==========")

    if anomalies.empty:
        print("No anomalies detected.")
    else:
        print(f"Anomalies detected: {len(anomalies)}")
        print("\nSuspicious Packets:")

        for _, packet in anomalies.iterrows():
            print(
                f"Time: {packet['timestamp']} | "
                f"Source: {packet['source']} | "
                f"Destination: {packet['destination']} | "
                f"Protocol: {packet['protocol']} | "
                f"Size: {packet['length']} bytes"
            )

    print("=======================================\n")


if __name__ == "__main__":
    print("Traffic Analyzer - Anomaly Detection Module")
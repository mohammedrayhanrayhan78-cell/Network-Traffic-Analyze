import os, shutil, struct
import worker
from analyzer import analyze

HERE = os.path.dirname(__file__)


def sample(name):
    return os.path.join(HERE, name)


def test_normal_traffic():
    rep = analyze(sample("normal.pcap"))
    assert rep["totalPackets"] == 25
    assert rep["alerts"] == []


def test_port_scan_alert():
    rep = analyze(sample("portscan.pcap"))
    assert rep["totalPackets"] == 150
    assert any(a["type"] == "potential_port_scan" for a in rep["alerts"])


def test_empty_file_rejected():
    try:
        analyze(sample("empty.pcap"))
        assert False, "should have raised"
    except ValueError:
        pass


def test_corrupt_file_rejected():
    try:
        analyze(sample("corrupt.pcap"))
        assert False, "should have raised"
    except ValueError:
        pass


def test_worker_good_job(tmp_path):
    worker.UPLOAD_DIR = str(tmp_path)
    shutil.copy(sample("normal.pcap"), tmp_path / "testjob-good.pcap")
    worker.process("testjob-good")
    assert worker.r.get("job:testjob-good:status") == "done"
    assert worker.r.get("report:testjob-good") is not None
    assert not (tmp_path / "testjob-good.pcap").exists()


def test_worker_fails_cleanly(tmp_path):
    worker.UPLOAD_DIR = str(tmp_path)
    shutil.copy(sample("corrupt.pcap"), tmp_path / "testjob-bad1.pcap")
    worker.process("testjob-bad1")
    assert worker.r.get("job:testjob-bad1:status") == "failed"
    assert not (tmp_path / "testjob-bad1.pcap").exists()


def test_truncated_file_keeps_packets(tmp_path):
    data = open(sample("normal.pcap"), "rb").read()
    cut = tmp_path / "cut.pcap"
    cut.write_bytes(data[:-20])
    rep = analyze(str(cut))
    assert rep["totalPackets"] >= 24


def test_header_only_file_rejected(tmp_path):
    data = open(sample("normal.pcap"), "rb").read()
    bad = tmp_path / "hdr.pcap"
    bad.write_bytes(data[:10])
    try:
        analyze(str(bad))
        assert False, "should have raised"
    except ValueError:
        pass


def test_high_request_rate_alert(tmp_path):
    from scapy.all import Ether, IP, UDP, wrpcap
    pk = []
    for i in range(1500):
        p = Ether() / IP(src="10.0.0.7", dst="10.0.0.1") / UDP(dport=9999)
        p.time = 3000 + i / 2000
        pk.append(p)
    f = tmp_path / "flood.pcap"
    wrpcap(str(f), pk)
    rep = analyze(str(f))
    assert any(a["type"] == "high_request_rate" for a in rep["alerts"])


def test_pcapng_supported(tmp_path):
    from scapy.all import Ether, IP, TCP, PcapNgWriter
    f = tmp_path / "t.pcapng"
    w = PcapNgWriter(str(f))
    for i in range(5):
        p = Ether() / IP(src="10.0.0.2", dst="1.1.1.1") / TCP(dport=443)
        p.time = 1000 + i
        w.write(p)
    w.close()
    assert analyze(str(f))["totalPackets"] == 5


def test_alert_has_required_fields_and_safe_wording():
    rep = analyze(sample("portscan.pcap"))
    need = {"severity", "type", "source", "destination", "protocol", "ports",
            "observed", "threshold", "window", "explanation", "nextStep"}
    for a in rep["alerts"]:
        assert need <= set(a)
        assert "attacker" not in (a["explanation"] + a["nextStep"]).lower()
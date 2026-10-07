import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import demoReport from '../report-demo.json';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Report() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      if (id === 'demo') {
        setReport(demoReport);
        setLoading(false);
        return;
      }

      if (!token) {
        setError({ status: 401, message: 'Missing token' });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/reports/${id}?token=${token}`);
        if (!res.ok) {
          if (res.status === 401) {
            throw { status: 401, message: 'Invalid or expired token' };
          } else if (res.status === 404) {
            throw { status: 404, message: 'Report not found' };
          } else {
            const data = await res.json().catch(() => ({}));
            throw { status: res.status, message: data.error || 'Failed to load report' };
          }
        }
        const data = await res.json();
        setReport(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchReport();
  }, [id, token]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: 32 }}>
        LOADING REPORT...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#FF5A3C', border: '3px solid #111', borderRadius: 28, padding: 30, boxShadow: '8px 8px 0 #111' }}>
        <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 40, margin: '0 0 20px 0' }}>ERROR</h1>
        <p style={{ fontSize: 20, margin: 0 }}>{error.message}</p>
        <div style={{ marginTop: 30 }}>
          <Link to="/" className="pill" style={{ display: 'inline-flex', padding: '10px 20px', background: '#FFFFFF', border: '3px solid #111', borderRadius: 12, textDecoration: 'none', fontFamily: "'Archivo Black', sans-serif", boxShadow: '3px 3px 0 #111' }}>BACK TO UPLOAD</Link>
        </div>
      </div>
    );
  }

  if (!report) return null;

  // Chart configuration
  const chartHeight = 150;
  const chartWidth = 800; // flexible, but we use a viewBox
  const maxPPS = Math.max(...report.packetsPerSecond, 1); // Avoid div by 0
  
  const points = report.packetsPerSecond.map((val, i) => {
    const x = (i / Math.max(report.packetsPerSecond.length - 1, 1)) * chartWidth;
    const y = chartHeight - ((val / maxPPS) * chartHeight);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      {/* Stat Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ flex: '1 1 200px', background: '#FFFFFF', border: '3px solid #111', borderRadius: 20, padding: 20, boxShadow: '6px 6px 0 #111' }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Total Packets</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 32, fontWeight: 700 }}>{report.totalPackets.toLocaleString()}</div>
        </div>
        <div style={{ flex: '1 1 200px', background: '#FFFFFF', border: '3px solid #111', borderRadius: 20, padding: 20, boxShadow: '6px 6px 0 #111' }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Total Bytes</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 32, fontWeight: 700 }}>{report.totalBytes.toLocaleString()}</div>
        </div>
        <div style={{ flex: '1 1 200px', background: '#FFFFFF', border: '3px solid #111', borderRadius: 20, padding: 20, boxShadow: '6px 6px 0 #111' }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Duration</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 32, fontWeight: 700 }}>{report.durationSeconds.toFixed(2)}s</div>
        </div>
        <div style={{ flex: '1 1 200px', background: '#FFD60A', border: '3px solid #111', borderRadius: 20, padding: 20, boxShadow: '6px 6px 0 #111' }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Processing Time</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 32, fontWeight: 700 }}>{report.processing.seconds.toFixed(2)}s</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
        
        {/* Chart */}
        <div style={{ flex: '2 1 500px', background: '#FFFFFF', border: '3px solid #111', borderRadius: 28, padding: 24, boxShadow: '8px 8px 0 #111' }}>
          <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, marginTop: 0, marginBottom: 20 }}>PACKETS PER SECOND</h2>
          <div style={{ width: '100%', border: '2px solid #111', background: '#f5f5f5', borderRadius: 12, overflow: 'hidden' }}>
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" style={{ width: '100%', height: 200, display: 'block' }}>
              <polyline points={points} fill="none" stroke="#6B4EFF" strokeWidth="3" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Protocols */}
        <div style={{ flex: '1 1 300px', background: '#B794F6', border: '3px solid #111', borderRadius: 28, padding: 24, boxShadow: '8px 8px 0 #111' }}>
          <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, marginTop: 0, marginBottom: 20, color: '#111' }}>PROTOCOLS</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {report.protocols.map(p => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 60, fontWeight: 700 }}>{p.name}</div>
                <div style={{ flex: 1, height: 16, background: '#FFFFFF', border: '2px solid #111', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${p.percent}%`, height: '100%', background: '#FF5A3C' }}></div>
                </div>
                <div style={{ width: 50, textAlign: 'right', fontFamily: "'Space Mono', monospace", fontSize: 14 }}>{p.percent.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div>
        <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 32, marginTop: 20, marginBottom: 20 }}>POTENTIAL ALERTS</h2>
        {report.alerts.length === 0 ? (
          <div style={{ background: '#1E7A1E', color: '#FFFFFF', border: '3px solid #111', borderRadius: 20, padding: 20, fontSize: 18, fontWeight: 700 }}>
            No potential alerts found in this capture. Looks clean!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {report.alerts.map((alert, i) => (
              <div key={i} style={{ background: alert.severity === 'high' ? '#FF5A3C' : '#FFD60A', border: '3px solid #111', borderRadius: 20, padding: 24, boxShadow: '6px 6px 0 #111', display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'inline-block', background: '#FFFFFF', border: '3px solid #111', borderRadius: 999, padding: '4px 12px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>
                    Severity: {alert.severity}
                  </div>
                  <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, margin: '0 0 10px 0' }}>{alert.type}</h3>
                  <p style={{ margin: '0 0 10px 0', fontSize: 16, lineHeight: 1.4 }}>{alert.explanation}</p>
                  <div style={{ fontWeight: 700, marginTop: 10 }}>Next step: {alert.nextStep}</div>
                </div>
                <div style={{ flex: '1 1 300px', background: '#FFFFFF', border: '3px solid #111', borderRadius: 16, padding: 16, fontFamily: "'Space Mono', monospace", fontSize: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div><strong>Source:</strong> {alert.source}</div>
                  <div><strong>Destination:</strong> {alert.destination}</div>
                  <div><strong>Protocol:</strong> {alert.protocol}</div>
                  <div><strong>Ports:</strong> {alert.ports.join(', ')}</div>
                  <div><strong>Observed:</strong> {alert.observed} (Threshold: {alert.threshold} in {alert.window})</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Talkers */}
      <div>
        <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 32, marginTop: 20, marginBottom: 20 }}>TOP SOURCES</h2>
        <div style={{ background: '#FFFFFF', border: '3px solid #111', borderRadius: 20, overflow: 'hidden', boxShadow: '6px 6px 0 #111' }}>
          <div style={{ display: 'flex', background: '#111', color: '#FFF', padding: '12px 20px', fontWeight: 700, fontFamily: "'Archivo Black', sans-serif" }}>
            <div style={{ flex: 2 }}>IP ADDRESS</div>
            <div style={{ flex: 1, textAlign: 'right' }}>PACKETS</div>
            <div style={{ flex: 1, textAlign: 'right' }}>BYTES</div>
            <div style={{ flex: 1, textAlign: 'right' }}>UNIQUE PORTS</div>
          </div>
          {report.topSources.map((s, i) => (
            <div key={s.ip} style={{ display: 'flex', padding: '12px 20px', borderTop: i > 0 ? '2px solid #eee' : 'none', fontFamily: "'Space Mono', monospace", fontSize: 15 }}>
              <div style={{ flex: 2 }}>{s.ip}</div>
              <div style={{ flex: 1, textAlign: 'right' }}>{s.packets.toLocaleString()}</div>
              <div style={{ flex: 1, textAlign: 'right' }}>{s.bytes.toLocaleString()}</div>
              <div style={{ flex: 1, textAlign: 'right' }}>{s.uniquePorts}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

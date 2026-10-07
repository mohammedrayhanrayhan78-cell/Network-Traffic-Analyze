import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Upload from './pages/Upload';
import Report from './pages/Report';
import Scale from './pages/Scale';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: '#C8F43C', padding: '24px 20px 64px', fontFamily: "'DM Sans', system-ui, sans-serif", color: '#111', fontSize: '17px', lineHeight: 1.45 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
          
          <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '14px 18px', background: '#FFFFFF', border: '3px solid #111', borderRadius: 26, boxShadow: '6px 6px 0 #111' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#111', fontFamily: "'Archivo Black', sans-serif", fontSize: 28, letterSpacing: '-0.5px' }}>
              <span style={{ width: 42, height: 42, background: '#FF5A3C', border: '3px solid #111', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3"></rect><path d="M3.5 7l8.5 6 8.5-6"></path></svg>
              </span>
              SNIFFR
            </Link>
            <nav aria-label="Main" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <Link className="pill" to="/" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 46, padding: '0 20px', background: '#B794F6', border: '3px solid #111', borderRadius: 16, boxShadow: '3px 3px 0 #111', textDecoration: 'none', fontFamily: "'Archivo Black', sans-serif", fontSize: 15 }}>UPLOAD</Link>
              <Link className="pill" to="/report/demo" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 46, padding: '0 20px', background: '#FFFFFF', border: '3px solid #111', borderRadius: 16, boxShadow: '3px 3px 0 #111', textDecoration: 'none', fontFamily: "'Archivo Black', sans-serif", fontSize: 15 }}>REPORT</Link>
              <Link className="pill" to="/scale" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 46, padding: '0 20px', background: '#FFFFFF', border: '3px solid #111', borderRadius: 16, boxShadow: '3px 3px 0 #111', textDecoration: 'none', fontFamily: "'Archivo Black', sans-serif", fontSize: 15 }}>HOW IT SCALES</Link>
            </nav>
          </header>

          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/report/:id" element={<Report />} />
            <Route path="/scale" element={<Scale />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

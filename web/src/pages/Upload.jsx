import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, uploading, polling, error
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    if (selectedFile.size > 50 * 1024 * 1024) {
      setErrorMessage('File too large (max 50 MB)');
      return false;
    }
    const name = selectedFile.name.toLowerCase();
    if (!name.endsWith('.pcap') && !name.endsWith('.pcapng')) {
      setErrorMessage('Only .pcap and .pcapng files are allowed');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const pollJob = async (jobId, token) => {
    try {
      const res = await fetch(`${API_URL}/api/jobs/${jobId}?token=${token}`);
      if (!res.ok) {
        throw new Error(`Polling failed with status ${res.status}`);
      }
      const data = await res.json();
      if (data.status === 'done') {
        navigate(`/report/${jobId}?token=${token}`);
      } else if (data.status === 'failed') {
        setStatus('error');
        setErrorMessage(data.error || 'Job failed');
      } else {
        setTimeout(() => pollJob(jobId, token), 1000);
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Network error');
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setStatus('uploading');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 413) {
          throw new Error('File too large');
        } else if (res.status === 429) {
          throw new Error('Too many requests, please slow down');
        } else {
          throw new Error(data?.error || `Upload failed with status ${res.status}`);
        }
      }

      setStatus('polling');
      pollJob(data.jobId, data.token);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message || 'Network error');
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, alignItems: 'stretch' }}>
      
      <section style={{ flex: '1.5 1 560px', minWidth: 0, display: 'flex', background: '#FFD60A', border: '3px solid #111', borderRadius: 34, boxShadow: '8px 8px 0 #111', overflow: 'hidden' }}>
        <div style={{ flex: 1, minWidth: 0, padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ 
              background: '#1E7A1E', 
              border: '3px solid #111', 
              borderRadius: 26, 
              padding: 22, 
              display: 'flex', 
              flexWrap: 'wrap', 
              alignItems: 'center', 
              gap: 20, 
              outline: isDragging ? '4px solid #6B4EFF' : '3px dashed rgba(255,255,255,0.7)', 
              outlineOffset: -12, 
              color: '#FFFFFF' 
            }}
          >
            <svg width="150" height="120" viewBox="0 0 150 120" fill="none" aria-hidden="true" style={{ flex: 'none' }}>
              <path d="M26 22h50l9 9H26z" fill="#FFFFFF" stroke="#111" strokeWidth="3" strokeLinejoin="round"></path>
              <path d="M10 30a8 8 0 0 1 8-8h38l12 14h64a8 8 0 0 1 8 8v58a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8z" fill="#FFD60A" stroke="#111" strokeWidth="4" strokeLinejoin="round"></path>
              <path d="M10 52h130" stroke="#111" strokeWidth="4"></path>
            </svg>
            <div style={{ flex: '1 1 220px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22, lineHeight: 1.1 }}>
                {file ? file.name : 'DRAG YOUR CAPTURE HERE'}
              </div>
              <div style={{ fontSize: 16 }}>.pcap or .pcapng files only, size-limited</div>
              <div style={{ display: 'flex', gap: 10 }} aria-hidden="true">
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#FF5A3C', border: '3px solid #111' }}></span>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#C8F43C', border: '3px solid #111' }}></span>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#111', border: '3px solid #111' }}></span>
              </div>
            </div>
          </div>
          
          <h1 style={{ margin: 0, fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(40px, 6vw, 76px)', lineHeight: 0.95, letterSpacing: '-1px', color: '#111', textShadow: '3px 3px 0 #FFFFFF' }}>
            <span style={{ display: 'block' }}>DROP A .PCAP.</span>
            <span style={{ display: 'block' }}>CATCH THE WEIRD STUFF.</span>
          </h1>
          <p style={{ margin: 0, maxWidth: 560, fontSize: 18 }}>
            SNIFFR reads the packet headers in your capture, charts who talked to whom, and flags anything that looks like a port scan or a flood.
          </p>
          
          {errorMessage && (
            <div style={{ background: '#FF5A3C', color: '#FFFFFF', padding: '10px 14px', border: '3px solid #111', borderRadius: 16, fontWeight: 700 }}>
              {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <button 
              className="pill" 
              onClick={handleAnalyze}
              disabled={!file || status === 'uploading' || status === 'polling'}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minHeight: 54, padding: '0 24px', background: '#C8F43C', color: '#111', border: '3px solid #111', borderRadius: 16, boxShadow: '4px 4px 0 #111', fontFamily: "'Archivo Black', sans-serif", fontSize: 18, cursor: (!file || status === 'uploading' || status === 'polling') ? 'not-allowed' : 'pointer', opacity: (!file || status === 'uploading' || status === 'polling') ? 0.7 : 1 }}
            >
              ANALYZE CAPTURE
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"></path></svg>
            </button>
            <label className="pill" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', minHeight: 54, padding: '0 24px', background: '#FFFFFF', color: '#111', border: '3px solid #111', borderRadius: 16, boxShadow: '4px 4px 0 #111', fontFamily: "'Archivo Black', sans-serif", fontSize: 18, cursor: 'pointer' }}>
              CHOOSE FILE
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".pcap,.pcapng" 
                onChange={handleFileChange}
                aria-label="Choose a pcap file" 
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
              />
            </label>
          </div>
        </div>
        <div style={{ width: 58, flex: 'none', borderLeft: '3px solid #111', background: '#FFC300', display: 'flex', alignItems: 'center', justifyContent: 'center', writingMode: 'vertical-rl', fontFamily: "'Archivo Black', sans-serif", fontSize: 24, letterSpacing: 2 }}>
          STEP 1 · UPLOAD
        </div>
      </section>

      <aside style={{ flex: '1 1 340px', minWidth: 0, background: '#FF5A3C', border: '3px solid #111', borderRadius: 34, boxShadow: '8px 8px 0 #111', padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ alignSelf: 'flex-start', background: '#FFFFFF', border: '3px solid #111', borderRadius: 999, padding: '8px 18px', fontFamily: "'Archivo Black', sans-serif", fontSize: 16 }}>WHAT HAPPENS NEXT</div>
        <div style={{ alignSelf: 'flex-start', maxWidth: '92%', background: '#FFFFFF', border: '3px solid #111', borderRadius: '24px 24px 24px 6px', boxShadow: '4px 4px 0 #111', padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ flex: 'none', width: 30, height: 30, borderRadius: '50%', background: '#FFD60A', border: '3px solid #111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: 14 }}>1</span>
          <span>Your file is checked, then stored briefly.</span>
        </div>
        <div style={{ alignSelf: 'flex-end', maxWidth: '92%', background: '#FFFFFF', border: '3px solid #111', borderRadius: '24px 24px 6px 24px', boxShadow: '4px 4px 0 #111', padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ flex: 'none', width: 30, height: 30, borderRadius: '50%', background: '#C8F43C', border: '3px solid #111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: 14 }}>2</span>
          <span>A worker reads packet headers only.</span>
        </div>
        <div style={{ alignSelf: 'flex-start', maxWidth: '92%', background: '#FFFFFF', border: '3px solid #111', borderRadius: '24px 24px 24px 6px', boxShadow: '4px 4px 0 #111', padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ flex: 'none', width: 30, height: 30, borderRadius: '50%', background: '#B794F6', border: '3px solid #111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: 14 }}>3</span>
          <span>You get charts and plain-English alerts.</span>
        </div>
        
        {status === 'polling' && (
          <div style={{ marginTop: 'auto', fontWeight: 700, fontSize: 16 }}>analyzing your capture…</div>
        )}
      </aside>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22 }}>
        <div style={{ flex: '1 1 250px', minWidth: 0, background: '#FFD60A', border: '3px solid #111', borderRadius: 28, boxShadow: '6px 6px 0 #111', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ alignSelf: 'flex-start', background: '#FFFFFF', border: '3px solid #111', borderRadius: 999, padding: '2px 12px', fontFamily: "'Archivo Black', sans-serif", fontSize: 14 }}>01</span>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22 }}>HEADERS ONLY</div>
          <div>Passwords and cookies hide in packet payloads. We read headers and drop the rest.</div>
        </div>
        <div style={{ flex: '1 1 250px', minWidth: 0, background: '#FFFFFF', border: '3px solid #111', borderRadius: 28, boxShadow: '6px 6px 0 #111', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ alignSelf: 'flex-start', background: '#C8F43C', border: '3px solid #111', borderRadius: 999, padding: '2px 12px', fontFamily: "'Archivo Black', sans-serif", fontSize: 14 }}>02</span>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22 }}>AUTO-DELETE</div>
          <div>Uploaded captures are removed shortly after the analysis finishes.</div>
        </div>
        <div style={{ flex: '1 1 250px', minWidth: 0, background: '#6B4EFF', color: '#FFFFFF', border: '3px solid #111', borderRadius: 28, boxShadow: '6px 6px 0 #111', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ alignSelf: 'flex-start', background: '#FFFFFF', color: '#111', border: '3px solid #111', borderRadius: 999, padding: '2px 12px', fontFamily: "'Archivo Black', sans-serif", fontSize: 14 }}>03</span>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22 }}>RATE LIMITED</div>
          <div>Too many uploads from one address get slowed down instead of served.</div>
        </div>
        <div style={{ flex: '1 1 250px', minWidth: 0, background: '#FF5A3C', border: '3px solid #111', borderRadius: 28, boxShadow: '6px 6px 0 #111', padding: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ alignSelf: 'flex-start', background: '#FFFFFF', border: '3px solid #111', borderRadius: 999, padding: '2px 12px', fontFamily: "'Archivo Black', sans-serif", fontSize: 14 }}>04</span>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22 }}>CHECKED UPLOADS</div>
          <div>File type and size are verified before any parsing starts.</div>
        </div>
      </div>
    </div>
  );
}

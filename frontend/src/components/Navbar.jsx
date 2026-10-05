import React from 'react';
import { QrCode, Server, Sparkles } from 'lucide-react';

export default function Navbar({ isBackendOnline }) {
  return (
    <header className="navbar">
      <div className="nav-brand">
        <div className="brand-icon-box">
          <QrCode size={24} />
        </div>
        <div>
          <div className="brand-title">
            <span className="gradient-text">QR Craft</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: 0 }}>
            Spring Boot & React Generator
          </p>
        </div>
      </div>

      <div className="nav-badges">
        <div className={`badge ${isBackendOnline ? 'badge-success' : 'badge-danger'}`} title={isBackendOnline ? 'Spring Boot API is reachable' : 'Spring Boot API is offline'}>
          <span className={`status-dot ${isBackendOnline ? '' : 'offline'}`}></span>
          <span>{isBackendOnline ? 'Backend Online (8080)' : 'Backend Disconnected'}</span>
        </div>
        <div className="badge badge-primary">
          <Server size={12} />
          <span>REST API</span>
        </div>
      </div>
    </header>
  );
}

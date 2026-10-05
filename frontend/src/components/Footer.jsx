import React from 'react';
import { Code2, Cpu, Zap, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Code2 size={18} style={{ color: 'var(--primary)' }} />
          <span>QR Code Generator — Spring Boot & React</span>
        </div>
        <div className="footer-tags">
          <span className="badge badge-primary">Java 21</span>
          <span className="badge badge-primary">Spring Boot 3.3.4</span>
          <span className="badge badge-primary">Google ZXing 3.5.3</span>
          <span className="badge badge-primary">React 18 & Vite</span>
          <span className="badge badge-primary">In-Memory ArrayList</span>
          <span className="badge badge-primary">REST API</span>
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', maxWidth: '600px', margin: 0 }}>
          Lightweight architecture: No external database, authentication, or Docker required. History is kept in server memory during runtime.
        </p>
      </div>
    </footer>
  );
}

import React, { useState } from 'react';
import { Download, Copy, Check, ExternalLink, QrCode, HardDriveDownload } from 'lucide-react';

export default function QrDisplay({ currentQr, onNotify }) {
  const [copiedText, setCopiedText] = useState(false);

  // Download directly from client base64 string
  const handleDownloadClient = () => {
    if (!currentQr) return;
    try {
      const link = document.createElement('a');
      link.href = currentQr.qrImageBase64;
      const sanitizedName = (currentQr.text || 'qrcode')
        .slice(0, 15)
        .replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `qrcode_${sanitizedName}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onNotify('QR code downloaded as PNG!', 'success');
    } catch (err) {
      console.error('Download error:', err);
      onNotify('Failed to download QR code', 'error');
    }
  };

  // Direct backend endpoint download
  const handleDownloadApi = () => {
    if (!currentQr?.id) return;
    const downloadEndpoint = `/api/qrcode/download/${currentQr.id}`;
    const link = document.createElement('a');
    link.href = downloadEndpoint;
    link.setAttribute('download', `qrcode-${currentQr.id.slice(0, 8)}.png`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onNotify('Downloading via Spring Boot API endpoint...', 'info');
  };

  // Copy encoded content
  const handleCopyText = async () => {
    if (!currentQr?.text) return;
    try {
      await navigator.clipboard.writeText(currentQr.text);
      setCopiedText(true);
      onNotify('Content text copied to clipboard!', 'success');
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="glass-card display-card">
      {currentQr ? (
        <div className="fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="qr-canvas-box">
            <img
              src={currentQr.qrImageBase64}
              alt="Generated QR Code"
              className="qr-image"
              style={{
                width: Math.min(260, currentQr.size || 260),
                height: Math.min(260, currentQr.size || 260),
              }}
            />
          </div>

          <div className="qr-meta-text" title={currentQr.text}>
            {currentQr.text}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            <span>{currentQr.size} × {currentQr.size} px</span>
            <span>•</span>
            <span>PNG Format</span>
            <span>•</span>
            <span>Level H Correction</span>
          </div>

          <div className="display-actions">
            <button
              id="btn-download-png"
              type="button"
              className="btn btn-primary"
              onClick={handleDownloadClient}
            >
              <Download size={16} />
              <span>Download PNG</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCopyText}
              title="Copy original text"
            >
              {copiedText ? <Check size={16} style={{ color: 'var(--success)' }} /> : <Copy size={16} />}
              <span>{copiedText ? 'Copied!' : 'Copy Text'}</span>
            </button>

            {currentQr.id && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleDownloadApi}
                title="Download directly from backend REST endpoint"
              >
                <HardDriveDownload size={16} />
                <span>API Download</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="qr-placeholder-box">
          <QrCode size={56} className="placeholder-icon" />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Ready to Generate
          </h3>
          <p style={{ fontSize: '0.85rem', maxWidth: '240px', lineHeight: 1.4 }}>
            Enter your text or link on the left and click Generate to see your QR code.
          </p>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { History, Trash2, Download, ExternalLink, RefreshCw, Clock, Layers } from 'lucide-react';

export default function QrHistory({ history, onSelectQr, onClearHistory, onRefresh, onNotify, isLoading }) {

  const formatTimestamp = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Recently';
    }
  };

  const handleDownload = (item, e) => {
    e.stopPropagation();
    try {
      const link = document.createElement('a');
      link.href = item.qrImageBase64;
      const cleanName = (item.text || 'qrcode')
        .slice(0, 15)
        .replace(/[^a-zA-Z0-9]/g, '_');
      link.download = `qrcode_${cleanName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onNotify('Downloaded from history as PNG!', 'success');
    } catch (err) {
      console.error(err);
      onNotify('Download failed', 'error');
    }
  };

  return (
    <section className="history-section">
      <div className="history-header">
        <div className="history-title-group">
          <History size={22} style={{ color: 'var(--primary)' }} />
          <h2 className="history-title">Recent QR Codes</h2>
          <span className="badge badge-primary">
            <Layers size={12} />
            <span>Java ArrayList ({history.length})</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh history from Spring Boot"
          >
            <RefreshCw size={14} className={isLoading ? 'spinner' : ''} />
            <span>Refresh</span>
          </button>

          {history.length > 0 && (
            <button
              id="btn-clear-history"
              type="button"
              className="btn btn-danger btn-sm"
              onClick={onClearHistory}
              title="Clear in-memory history list"
            >
              <Trash2 size={14} />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="glass-card empty-history">
          <Clock size={36} style={{ marginBottom: '0.75rem', opacity: 0.35, color: '#a5b4fc' }} />
          <p style={{ fontWeight: 600, color: 'var(--text-muted)' }}>No QR codes generated yet</p>
          <p style={{ fontSize: '0.85rem' }}>
            Generate your first QR code above! It will be temporarily cached in the Spring Boot in-memory <code>ArrayList</code>.
          </p>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((item) => (
            <div
              key={item.id}
              className="history-card"
              onClick={() => onSelectQr(item)}
              style={{ cursor: 'pointer' }}
              title="Click to view in main preview"
            >
              <div className="history-thumb-box">
                <img
                  src={item.qrImageBase64}
                  alt="Thumbnail"
                  className="history-thumb"
                />
              </div>

              <div className="history-info">
                <div className="history-text" title={item.text}>
                  {item.text}
                </div>
                <div className="history-time">
                  <Clock size={12} />
                  <span>{formatTimestamp(item.createdAt)} • {item.size}px</span>
                </div>
                <div className="history-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.25rem 0.55rem', fontSize: '0.78rem' }}
                    onClick={(e) => handleDownload(item, e)}
                    title="Download this PNG"
                  >
                    <Download size={12} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

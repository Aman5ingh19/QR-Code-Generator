import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import QrGeneratorForm from './components/QrGeneratorForm';
import QrDisplay from './components/QrDisplay';
import QrHistory from './components/QrHistory';
import Footer from './components/Footer';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const API_BASE = '/api/qrcode';

export default function App() {
  const [currentQr, setCurrentQr] = useState(null);
  const [history, setHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [toasts, setToasts] = useState([]);

  // Toast notifier helper
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // Fetch history from Spring Boot REST API
  const fetchHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const res = await fetch(`${API_BASE}/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
        setIsBackendOnline(true);
      } else {
        console.error('History fetch failed:', res.statusText);
      }
    } catch (err) {
      console.warn('Backend currently unreachable:', err.message);
      setIsBackendOnline(false);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  // Generate QR code by calling Spring Boot REST API
  const handleGenerate = async ({ text, size }) => {
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, size }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message = errorData.message || 'Failed to generate QR code';
        showToast(message, 'error');
        return;
      }

      const qrData = await res.json();
      setCurrentQr(qrData);
      setIsBackendOnline(true);
      showToast('QR Code generated successfully!', 'success');

      // Update history list
      fetchHistory();
    } catch (err) {
      console.error('Generate error:', err);
      setIsBackendOnline(false);
      showToast('Cannot connect to Spring Boot backend (port 8080). Make sure it is running.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Clear history on backend
  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear your temporary QR code history?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/history`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setHistory([]);
        showToast('History cleared from server memory', 'info');
      } else {
        showToast('Failed to clear history', 'error');
      }
    } catch (err) {
      console.error('Clear history error:', err);
      showToast('Could not reach backend to clear history', 'error');
    }
  };

  // Initial load
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="app-container">
      <Navbar isBackendOnline={isBackendOnline} />

      <main className="main-content">
        <header className="hero-header">
          <h1 className="hero-title">
            Generate & Download <span className="gradient-text">Instant QR Codes</span>
          </h1>
          <p className="hero-subtitle">
            Craft high-resolution, custom QR codes for URLs, Wi-Fi networks, text, and contact cards in milliseconds.
          </p>
        </header>

        <div className="generator-grid">
          <QrGeneratorForm
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
          <QrDisplay
            currentQr={currentQr}
            onNotify={showToast}
          />
        </div>

        <QrHistory
          history={history}
          onSelectQr={(item) => {
            setCurrentQr(item);
            window.scrollTo({ top: 120, behavior: 'smooth' });
          }}
          onClearHistory={handleClearHistory}
          onRefresh={fetchHistory}
          onNotify={showToast}
          isLoading={isHistoryLoading}
        />
      </main>

      <Footer />

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'success' && <CheckCircle size={18} />}
            {toast.type === 'error' && <AlertCircle size={18} />}
            {toast.type === 'info' && <Info size={18} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

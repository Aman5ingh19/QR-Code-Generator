import React, { useState } from 'react';
import { Sparkles, Sliders, Type, Globe, Wifi, Mail, User, X, RefreshCw } from 'lucide-react';

const PRESETS = [
  { label: 'URL / Link', icon: Globe, value: 'https://github.com' },
  { label: 'Wi-Fi Network', icon: Wifi, value: 'WIFI:S:MyHomeWiFi;T:WPA;P:SecretPassword123;;' },
  { label: 'Email', icon: Mail, value: 'mailto:contact@example.com?subject=Hello%20from%20QR%20Craft' },
  { label: 'Contact (vCard)', icon: User, value: 'BEGIN:VCARD\nVERSION:3.0\nN:Smith;John\nFN:John Smith\nTEL;TYPE=CELL:+1234567890\nEMAIL:john@example.com\nEND:VCARD' },
  { label: 'Plain Text', icon: Type, value: 'Hello! This is a QR code generated with Spring Boot and React.' }
];

export default function QrGeneratorForm({ onGenerate, isGenerating }) {
  const [text, setText] = useState('https://github.com');
  const [size, setSize] = useState(300);
  const [activePreset, setActivePreset] = useState('URL / Link');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || isGenerating) return;
    onGenerate({ text: text.trim(), size: Number(size) });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSelectPreset = (preset) => {
    setActivePreset(preset.label);
    setText(preset.value);
  };

  return (
    <div className="glass-card form-card">
      <div className="form-header">
        <h2 className="form-title">Enter Content</h2>
        <span className="badge badge-primary">ZXing Engine</span>
      </div>

      <div className="presets-container">
        {PRESETS.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.label}
              type="button"
              className={`preset-chip ${activePreset === p.label ? 'active' : ''}`}
              onClick={() => handleSelectPreset(p)}
            >
              <Icon size={13} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
          <label htmlFor="qr-content-input" className="input-label">
            Text or Destination URL
          </label>
          <textarea
            id="qr-content-input"
            className="input-field"
            placeholder="Type any URL, text, phone number, or credentials here..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setActivePreset('');
            }}
            onKeyDown={handleKeyDown}
            rows={4}
            maxLength={2000}
            required
          />
          {text && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{
                position: 'absolute',
                top: '32px',
                right: '10px',
                padding: '4px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.08)'
              }}
              title="Clear input"
              onClick={() => {
                setText('');
                setActivePreset('');
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="char-counter">
          {text.length} / 2000 characters (Ctrl+Enter to generate)
        </div>

        <div className="slider-group">
          <div className="slider-header">
            <span className="input-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sliders size={14} /> Resolution Size
            </span>
            <span className="slider-value">{size} × {size} px</span>
          </div>
          <input
            id="qr-size-slider"
            type="range"
            min="150"
            max="600"
            step="25"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="custom-range"
          />
        </div>

        <button
          id="btn-generate-qr"
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%' }}
          disabled={!text.trim() || isGenerating}
        >
          {isGenerating ? (
            <>
              <RefreshCw size={18} className="spinner" />
              <span>Generating with Spring Boot...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Generate QR Code</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

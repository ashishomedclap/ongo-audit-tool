'use client';

import React, { useState } from 'react';
import { Search, Loader2, ArrowRight, CheckCircle2, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';

interface CustomUrlScanBarProps {
  onScanComplete?: (page: any) => void;
  placeholder?: string;
  toolName?: string;
  presetUrls?: { label: string; url: string }[];
}

export default function CustomUrlScanBar({
  onScanComplete,
  placeholder = "Enter custom URL to scan (e.g., https://ongoweightloss.com/tools/bmi-calculator/ or competitor URL)...",
  toolName = "Page",
  presetUrls = [
    { label: 'BMI Calculator (New)', url: 'https://ongoweightloss.com/tools/bmi-calculator/' },
    { label: 'Clinical Studies (New)', url: 'https://ongoweightloss.com/resources/glp-1/clinical-studies/' },
    { label: 'Virginia Clinic (New)', url: 'https://ongoweightloss.com/locations/virginia/' },
    { label: 'Editorial Team (New)', url: 'https://ongoweightloss.com/editorial-team/' },
    { label: 'Nutrition Guide', url: 'https://ongoweightloss.com/resources/nutrition-guide/' }
  ]
}: CustomUrlScanBarProps) {
  const [urlInput, setUrlInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleScan = async (targetUrl?: string) => {
    const toScan = (targetUrl || urlInput).trim();
    if (!toScan) return;

    setScanning(true);
    setErrorMsg(null);
    setScanResult(null);

    try {
      const res = await fetch('/api/scan-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'scan-single',
          url: toScan
        })
      });

      const data = await res.json();
      if (!data.success || !data.page) {
        setErrorMsg(data.error || 'Failed to inspect URL');
      } else {
        setScanResult(data.page);
        if (onScanComplete) {
          onScanComplete(data.page);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error scanning URL');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '16px 20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '2px 8px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 700,
            background: '#e0f2fe',
            color: '#0369a1'
          }}>
            <Search size={12} />
            URL Inspector &amp; Live Scanner
          </span>
          <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
            Audit any custom URL on-the-fly for {toolName} analysis
          </span>
        </div>

        {/* Quick Preset Chips */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b' }}>Quick Test:</span>
          {presetUrls.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setUrlInput(preset.url);
                handleScan(preset.url);
              }}
              disabled={scanning}
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: '#f1f5f9',
                color: '#1e293b',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.12s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input & Action Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleScan();
        }}
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={placeholder}
            disabled={scanning}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              fontSize: '0.84rem',
              color: '#0f1715',
              outline: 'none',
              transition: 'border-color 0.15s ease'
            }}
            onFocus={(e) => { e.target.style.borderColor = '#15803d'; }}
            onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; }}
          />
        </div>

        <button
          type="submit"
          disabled={scanning || !urlInput.trim()}
          className="gsc-btn-primary"
          style={{
            padding: '9px 18px',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: scanning || !urlInput.trim() ? 0.6 : 1,
            cursor: scanning || !urlInput.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {scanning ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              Scan Custom URL
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      {/* Real-Time Scan Result Drawer */}
      {scanResult && (
        <div style={{
          marginTop: '12px',
          padding: '12px 14px',
          backgroundColor: '#f0fdf4',
          borderRadius: '8px',
          border: '1px solid #bbf7d0',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} color="#15803d" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>
                Page Audited Successfully (HTTP {scanResult.statusCode || 200})
              </span>
            </div>
            <a
              href={scanResult.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.74rem',
                color: '#15803d',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Open Live Page <ExternalLink size={11} />
            </a>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#14532d', fontWeight: 600 }}>
            <strong>Title:</strong> {scanResult.title || '(No title tag)'} <span style={{ fontSize: '0.72rem', color: '#64748b' }}>({scanResult.title_length} chars)</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: '#166534' }}>
            <strong>Meta Description:</strong> {scanResult.description || '(No description)'} <span style={{ fontSize: '0.72rem', color: '#64748b' }}>({scanResult.description_length} chars)</span>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '0.72rem', color: '#166534', flexWrap: 'wrap' }}>
            <span><strong>H1:</strong> {scanResult.h1 || 'None'}</span>
            <span>&bull;</span>
            <span><strong>Images:</strong> {scanResult.totalImages} ({scanResult.missingAlt} missing alt)</span>
            <span>&bull;</span>
            <span><strong>Internal Links:</strong> {scanResult.internalLinksCount}</span>
            <span>&bull;</span>
            <span><strong>Category:</strong> {scanResult.category}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div style={{
          marginTop: '10px',
          padding: '8px 12px',
          backgroundColor: '#fef2f2',
          borderRadius: '6px',
          border: '1px solid #fecaca',
          color: '#991b1b',
          fontSize: '0.78rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <AlertCircle size={14} />
          {errorMsg}
        </div>
      )}
    </div>
  );
}


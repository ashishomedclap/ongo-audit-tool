'use client';

import React, { useState } from 'react';
import { 
  RefreshCw, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Loader2, 
  Layers, 
  ExternalLink, 
  ArrowRight,
  Database,
  Search,
  Sparkles
} from 'lucide-react';

interface MasterSiteScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete?: (data: any) => void;
}

export default function MasterSiteScanModal({
  isOpen,
  onClose,
  onScanComplete
}: MasterSiteScanModalProps) {
  const [sitemapUrl, setSitemapUrl] = useState('https://ongoweightloss.com/sitemap.xml');
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [result, setResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunScan = async () => {
    setScanning(true);
    setErrorMsg(null);
    setResult(null);
    setScanStep('Connecting to sitemap and crawling live URLs...');

    try {
      setScanStep('Auditing page status codes, title tags, meta descriptions, and image alt tags...');
      const res = await fetch('/api/scan-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'scan-all',
          sitemapUrl: sitemapUrl.trim()
        })
      });

      const data = await res.json();
      if (!data.success) {
        setErrorMsg(data.error || 'Website scan failed');
      } else {
        setResult(data);
        if (onScanComplete) {
          onScanComplete(data);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error scanning website');
    } finally {
      setScanning(false);
      setScanStep('');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '16px',
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="gsc-badge-healthy">
                <span className="gsc-pulse-dot" />
                Live Crawler &amp; Database Sync
              </span>
              <span className="gsc-badge-neutral">
                sitemap.xml + Discovered Links
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f1715', margin: 0 }}>
              Master Website Scanner &amp; Tools Database Engine
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '4px 0 0 0' }}>
              Crawl the entire live website, detect newly published pages, audit metadata &amp; images, and refresh all 19 tools with the latest live inventory.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: '4px',
              borderRadius: '6px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Input Configuration */}
        <div>
          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px', display: 'block' }}>
            Target Sitemap XML or Website Domain:
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Globe size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                value={sitemapUrl}
                onChange={(e) => setSitemapUrl(e.target.value)}
                disabled={scanning}
                placeholder="https://ongoweightloss.com/sitemap.xml"
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '0.84rem',
                  color: '#0f1715',
                  fontWeight: 600
                }}
              />
            </div>

            <button
              onClick={handleRunScan}
              disabled={scanning || !sitemapUrl.trim()}
              className="gsc-btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 20px',
                fontSize: '0.84rem',
                opacity: scanning ? 0.7 : 1,
                cursor: scanning ? 'not-allowed' : 'pointer'
              }}
            >
              {scanning ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Scanning Site...
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  Run Master Site Scan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Scan Status / Progress */}
        {scanning && (
          <div style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Loader2 size={20} className="animate-spin" color="#15803d" />
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f1715' }}>
                Full Website Scan in Progress
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                {scanStep}
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            padding: '12px 14px',
            backgroundColor: '#fef2f2',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        {/* Scan Results Card */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px'
            }}>
              <div className="gsc-scorecard" style={{ borderTop: '3px solid #10b981', padding: '12px 16px' }}>
                <div className="gsc-scorecard-label">Total Live Pages</div>
                <div className="gsc-scorecard-value" style={{ color: '#15803d', fontSize: '1.6rem' }}>
                  {result.totalPages}
                </div>
                <div className="gsc-scorecard-sub">All HTTP 200 Live</div>
              </div>

              <div className="gsc-scorecard" style={{ borderTop: '3px solid #3b82f6', padding: '12px 16px' }}>
                <div className="gsc-scorecard-label">New Pages Added</div>
                <div className="gsc-scorecard-value" style={{ color: '#1d4ed8', fontSize: '1.6rem' }}>
                  {result.newPagesCount}
                </div>
                <div className="gsc-scorecard-sub">Discovered in Scan</div>
              </div>

              <div className="gsc-scorecard" style={{ borderTop: '3px solid #8b5cf6', padding: '12px 16px' }}>
                <div className="gsc-scorecard-label">Database Status</div>
                <div className="gsc-scorecard-value" style={{ color: '#6d28d9', fontSize: '1.6rem' }}>
                  Synced
                </div>
                <div className="gsc-scorecard-sub">All 19 Tools Updated</div>
              </div>
            </div>

            {/* List of Newly Discovered Pages */}
            {result.newPages && result.newPages.length > 0 && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                  Recently Discovered &amp; Added Pages ({result.newPages.length}):
                </div>
                <div style={{
                  maxHeight: '160px',
                  overflowY: 'auto',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  padding: '6px'
                }}>
                  {result.newPages.map((p: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        padding: '6px 10px',
                        fontSize: '0.74rem',
                        borderBottom: idx < result.newPages.length - 1 ? '1px solid #f1f5f9' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span style={{ fontWeight: 600, color: '#0f1715' }}>{p.url}</span>
                      <span style={{ color: '#64748b', fontSize: '0.7rem' }}>{p.title?.slice(0, 45)}...</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="gsc-btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <RefreshCw size={13} />
                Refresh Application View
              </button>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div style={{ fontSize: '0.72rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
          Ongo Live Site Scanner crawls sitemap.xml, checks canonical tags, and extracts internal links to ensure zero unindexed pages or orphan URLs exist.
        </div>
      </div>
    </div>
  );
}


'use client';

import React, { useState } from 'react';
import { 
  Tag, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Globe, 
  Smartphone, 
  Monitor, 
  RefreshCw, 
  Check, 
  Copy,
  AlertTriangle
} from 'lucide-react';
import { OngoMetaItem } from '@/lib/data';
import { MetaAuditResult } from '@/app/api/audit-meta/route';

interface MetaAuditorTabProps {
  ongoMeta: Record<string, OngoMetaItem>;
}

export default function MetaAuditorTab({ ongoMeta }: MetaAuditorTabProps) {
  const [activeMode, setActiveMode] = useState<'benchmark' | 'live'>('benchmark');
  
  const [auditUrl, setAuditUrl] = useState('https://ongoweightloss.com/');
  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<MetaAuditResult | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleRunAudit = async (targetUrl: string) => {
    setAuditing(true);
    setAuditError(null);
    setAuditUrl(targetUrl);
    setActiveMode('live');

    try {
      const res = await fetch('/api/audit-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      const data = await res.json();
      if (data.success) {
        setAuditResult(data.audit);
      } else {
        setAuditError(data.error || 'Failed to audit URL');
      }
    } catch {
      setAuditError('Failed to connect to meta audit API');
    } finally {
      setAuditing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Header Bento Box */}
      <div className="bento-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Meta Tag Auditor & SERP Simulator
            </h1>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
              Side-by-side title and description optimization scorecard for Ongo and live URL crawler
            </p>
          </div>

          {/* Segmented Mode Selector */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255, 255, 255, 0.03)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setActiveMode('benchmark')}
              style={{
                padding: '5px 12px',
                fontSize: '0.78rem',
                borderRadius: '6px',
                border: 'none',
                background: activeMode === 'benchmark' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: activeMode === 'benchmark' ? '#fafafa' : 'var(--text-tertiary)',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Ongo Optimization Benchmark
            </button>
            <button
              onClick={() => setActiveMode('live')}
              style={{
                padding: '5px 12px',
                fontSize: '0.78rem',
                borderRadius: '6px',
                border: 'none',
                background: activeMode === 'live' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: activeMode === 'live' ? '#fafafa' : 'var(--text-tertiary)',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Live URL Inspector
            </button>
          </div>
        </div>

        {/* Live URL Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunAudit(auditUrl);
          }}
          style={{ display: 'flex', gap: '8px' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <Globe size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Enter any page URL to audit (e.g. https://ongoweightloss.com/pricing/ or competitor)..."
              value={auditUrl}
              onChange={(e) => setAuditUrl(e.target.value)}
              className="input-minimal"
              style={{ paddingLeft: '34px' }}
            />
          </div>
          <button type="submit" className="btn-minimal-primary" disabled={auditing} style={{ minWidth: '120px' }}>
            {auditing ? 'Auditing...' : 'Audit Live HTML'}
          </button>
        </form>
      </div>

      {/* MODE A: Ongo Benchmark & Page Optimization */}
      {activeMode === 'benchmark' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Ongo Core Pages Audit (11 Live URLs)
            </span>
            <span className="badge-minimal">Current vs Recommended</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(ongoMeta).map(([url, meta], idx) => {
              const currentTitleLen = meta.title?.length || 0;
              const recTitleLen = meta.recommendedTitle?.length || 0;
              const currentDescLen = meta.description?.length || 0;
              const recDescLen = meta.recommendedDescription?.length || 0;

              return (
                <div key={url} className="bento-card" style={{ padding: '20px' }}>
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                        #{idx + 1}
                      </span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--text-primary)', fontSize: '0.825rem', fontFamily: 'var(--font-mono)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        {url} <ExternalLink size={10} />
                      </a>
                    </div>

                    <button
                      onClick={() => handleRunAudit(url)}
                      className="btn-minimal-secondary"
                      style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                    >
                      Audit Live
                    </button>
                  </div>

                  {/* Bento comparison panels */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
                    {/* Current Meta */}
                    <div style={{ background: 'var(--bg-canvas)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Current Title
                        </span>
                        <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                          {currentTitleLen} chars
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        {meta.title}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Current Description
                        </span>
                        <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                          {currentDescLen} chars
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
                        {meta.description}
                      </div>
                    </div>

                    {/* Recommended Meta */}
                    <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-primary)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} /> Recommended Title
                        </span>
                        <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                          {recTitleLen} chars (Optimal)
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{meta.recommendedTitle}</span>
                        <button
                          onClick={() => handleCopy(meta.recommendedTitle || '')}
                          style={{ background: 'transparent', border: 'none', color: copiedText === meta.recommendedTitle ? '#34d399' : 'var(--text-muted)', cursor: 'pointer' }}
                        >
                          {copiedText === meta.recommendedTitle ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-primary)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={11} /> Recommended Description
                        </span>
                        <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                          {recDescLen} chars (Optimal)
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, display: 'flex', justifyContent: 'space-between' }}>
                        <span>{meta.recommendedDescription}</span>
                        <button
                          onClick={() => handleCopy(meta.recommendedDescription || '')}
                          style={{ background: 'transparent', border: 'none', color: copiedText === meta.recommendedDescription ? '#34d399' : 'var(--text-muted)', cursor: 'pointer' }}
                        >
                          {copiedText === meta.recommendedDescription ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>

                      {meta.primaryKeyword && (
                        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                          Keywords: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{meta.primaryKeyword}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE B: Live URL Inspector Output */}
      {activeMode === 'live' && auditResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Stats Bar */}
          <div className="bento-card" style={{ padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="badge-minimal badge-minimal-neutral" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                Score: {auditResult.score} / 100
              </span>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {auditResult.finalUrl}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
              <span>HTTP {auditResult.statusCode}</span>
              <span>&bull;</span>
              <span>{auditResult.responseTimeMs}ms</span>
            </div>
          </div>

          {/* Minimal SERP Simulator */}
          <div className="bento-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Google Search Result Preview
              </span>
              <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-canvas)', padding: '2px', borderRadius: '5px' }}>
                <button
                  onClick={() => setSerpDevice('desktop')}
                  style={{
                    padding: '3px 6px',
                    fontSize: '0.7rem',
                    border: 'none',
                    background: serpDevice === 'desktop' ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: serpDevice === 'desktop' ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setSerpDevice('mobile')}
                  style={{
                    padding: '3px 6px',
                    fontSize: '0.7rem',
                    border: 'none',
                    background: serpDevice === 'mobile' ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: serpDevice === 'mobile' ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Simulated Result Box */}
            <div style={{
              background: '#18181b',
              borderRadius: '8px',
              padding: '14px 16px',
              maxWidth: serpDevice === 'mobile' ? '380px' : '600px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>
                {auditResult.finalUrl}
              </div>
              <div style={{ fontSize: '1.05rem', color: '#60a5fa', fontWeight: 400, marginBottom: '4px', lineHeight: 1.3 }}>
                {auditResult.title || 'Missing Title Tag'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#d4d4d8', lineHeight: 1.4 }}>
                {auditResult.description || 'Missing meta description tag.'}
              </div>
            </div>
          </div>

          {/* Technical signals & Recommendations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            <div className="bento-card" style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                On-Page Technical Tags
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Title Tag:</span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{auditResult.titleLength} chars</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Meta Description:</span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{auditResult.descriptionLength} chars</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>Canonical URL:</span>
                  <span style={{ color: auditResult.hasCanonical ? '#34d399' : '#fb7185' }}>{auditResult.hasCanonical ? 'Declared' : 'Missing'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>OpenGraph Image:</span>
                  <span style={{ color: auditResult.openGraph.image ? '#34d399' : '#fb7185' }}>{auditResult.openGraph.image ? 'Present' : 'Missing'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>H1 Headings:</span>
                  <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{auditResult.h1Count} found</span>
                </div>
              </div>
            </div>

            <div className="bento-card" style={{ padding: '18px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
                Actionable SEO Recommendations
              </h3>
              {auditResult.recommendations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {auditResult.recommendations.map((rec, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--text-tertiary)', marginTop: '2px' }}>&bull;</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: '#34d399' }}>
                  All primary on-page meta tags are well optimized.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

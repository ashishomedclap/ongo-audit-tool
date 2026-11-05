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
  AlertTriangle,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { OngoMetaItem } from '@/lib/data';
import { MetaAuditResult } from '@/app/api/audit-meta/route';
import ContextCue from './ContextCue';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ContextCue
        level={3}
        toolNumber={13}
        useCase="Rewrite robotic, symbol-heavy SERP titles into natural human search queries that maximize CTR."
        badge="Metadata Optimization"
        title="SERP Snippet Optimization & Real-Time HTML Auditor"
        about="This page is a real-time Google SERP Snippet Simulator and Meta Tag Optimization Auditor designed specifically for Ongo Weight Loss. It validates meta titles and meta descriptions against Google's desktop and mobile character/pixel display limits, checks for essential clinical authority signals (E-E-A-T), and audits live competitor URLs on the fly."
        whatYouCanDo={[
          {
            action: "Simulate Google Search Snippets",
            description: "View desktop Google SERP previews showing exactly how Ongo's current live titles and descriptions display to searching patients."
          },
          {
            action: "Review Side-by-Side Recommendations",
            description: "Compare current metadata against search-optimized titles and descriptions engineered with doctor-led authority, $179+ pricing hooks, and conversion CTAs."
          },
          {
            action: "1-Click Copy Optimized Tags",
            description: "Click the copy icon next to any recommended title or description to immediately paste it into Ongo's Next.js page metadata configurations."
          },
          {
            action: "Audit Any Competitor URL Live",
            description: "Switch to 'Live Competitor URL Auditor', enter any URL (e.g. joinmochi.com, henrymeds.com), and fetch live titles, descriptions, and OpenGraph tags in real-time."
          },
          {
            action: "Verify E-E-A-T Medical Compliance",
            description: "Check for board-certified MD credentials, 50-state licensing disclosures, and pharmacy sterility badges that impact Google's healthcare search ranking."
          }
        ]}
        tip="Click the Copy icon next to any Recommended Title or Description to paste it directly into Ongo's Next.js metadata configs."
      />

      {/* Sleek Minimalist Tool Header */}
      <div className="tool-header-dark" style={{ padding: '16px 22px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                background: 'rgba(52, 126, 93, 0.25)',
                color: '#74c69d',
                border: '1px solid rgba(116, 198, 157, 0.3)'
              }}>
                <Tag size={11} /> Meta &amp; SERP
              </span>
              <span className="badge-minimal-forest" style={{ fontSize: '0.7rem' }}>
                11 Benchmark Pages
              </span>
            </div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
              Meta Tags &amp; Google SERP Simulator
            </h1>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
              Side-by-side title and description CTR scorecard · Live HTML inspector · E-E-A-T badges
            </p>
          </div>

          {/* Segmented Mode Selector */}
          <div style={{ 
            display: 'flex', 
            gap: '4px', 
            background: 'rgba(255, 255, 255, 0.08)', 
            padding: '3px', 
            borderRadius: '9999px', 
            border: '1px solid rgba(255, 255, 255, 0.15)' 
          }}>
            <button
              onClick={() => setActiveMode('benchmark')}
              style={{
                padding: '5px 12px',
                fontSize: '0.75rem',
                borderRadius: '9999px',
                border: 'none',
                background: activeMode === 'benchmark' ? '#347e5d' : 'transparent',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.15s ease'
              }}
            >
              Ongo Optimization Benchmark
            </button>
            <button
              onClick={() => setActiveMode('live')}
              style={{
                padding: '5px 12px',
                fontSize: '0.75rem',
                borderRadius: '9999px',
                border: 'none',
                background: activeMode === 'live' ? '#347e5d' : 'transparent',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.15s ease'
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
            <Globe size={14} color="#74c69d" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Enter any page URL to audit (e.g. https://ongoweightloss.com/pricing/ or competitor)..."
              value={auditUrl}
              onChange={(e) => setAuditUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                fontSize: '0.82rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                color: '#ffffff',
                outline: 'none'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={auditing}
            className="btn-minimal-emerald"
            style={{
              padding: '8px 16px',
              fontSize: '0.78rem',
              whiteSpace: 'nowrap'
            }}
          >
            {auditing ? 'Auditing...' : 'Audit Live HTML'}
          </button>
        </form>
      </div>

      {/* MODE A: Ongo Benchmark & Page Optimization */}
      {activeMode === 'benchmark' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              Ongo Core Pages Audit (11 Live URLs)
            </span>
            <span className="badge-minimal badge-minimal-coral">Current vs Search-Optimal</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(ongoMeta).map(([url, meta], idx) => {
              const currentTitleLen = meta.title?.length || 0;
              const recTitleLen = meta.recommendedTitle?.length || 0;
              const currentDescLen = meta.description?.length || 0;
              const recDescLen = meta.recommendedDescription?.length || 0;

              return (
                <div key={url} className="bento-card" style={{ padding: '22px', border: '1px solid var(--border-medium)' }}>
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--color-primary-dark)', fontWeight: 700 }}>
                        PAGE #{idx + 1}
                      </span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--color-primary-dark)', fontSize: '0.865rem', fontFamily: 'var(--font-mono)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        {url} <ExternalLink size={11} color="var(--color-accent)" />
                      </a>
                    </div>

                    <button
                      onClick={() => handleRunAudit(url)}
                      className="btn-minimal-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                    >
                      Audit Live
                    </button>
                  </div>

                  {/* Bento comparison panels */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                    {/* Current Meta */}
                    <div style={{ background: 'var(--bg-canvas)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-primary-dark)', textTransform: 'uppercase', fontWeight: 700 }}>
                          Current Title
                        </span>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                          {currentTitleLen} chars
                        </span>
                      </div>
                      <div style={{ fontSize: '0.865rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.4 }}>
                        {meta.title}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-primary-dark)', textTransform: 'uppercase', fontWeight: 700 }}>
                          Current Description
                        </span>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                          {currentDescLen} chars
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                        {meta.description}
                      </div>
                    </div>

                    {/* Recommended Meta */}
                    <div style={{ background: '#ffffff', padding: '16px', borderRadius: 'var(--radius-sm)', border: '2px solid #b7e4c7', boxShadow: '0 4px 14px rgba(27, 67, 50, 0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-primary-dark)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={12} color="var(--color-accent)" /> Recommended Title
                        </span>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#1b4332', fontWeight: 700 }}>
                          {recTitleLen} chars (Optimal)
                        </span>
                      </div>
                      <div style={{ fontSize: '0.865rem', color: 'var(--color-primary-dark)', fontWeight: 700, marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <span>{meta.recommendedTitle}</span>
                        <button
                          onClick={() => handleCopy(meta.recommendedTitle || '')}
                          title="Copy Recommended Title"
                          style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-medium)', borderRadius: '4px', color: copiedText === meta.recommendedTitle ? '#1b4332' : 'var(--text-tertiary)', cursor: 'pointer', padding: '3px 6px' }}
                        >
                          {copiedText === meta.recommendedTitle ? <Check size={12} color="#347e5d" /> : <Copy size={12} />}
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-primary-dark)', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={12} color="var(--color-accent)" /> Recommended Description
                        </span>
                        <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#1b4332', fontWeight: 700 }}>
                          {recDescLen} chars (Optimal)
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <span>{meta.recommendedDescription}</span>
                        <button
                          onClick={() => handleCopy(meta.recommendedDescription || '')}
                          title="Copy Recommended Description"
                          style={{ background: 'var(--bg-canvas)', border: '1px solid var(--border-medium)', borderRadius: '4px', color: copiedText === meta.recommendedDescription ? '#1b4332' : 'var(--text-tertiary)', cursor: 'pointer', padding: '3px 6px' }}
                        >
                          {copiedText === meta.recommendedDescription ? <Check size={12} color="#347e5d" /> : <Copy size={12} />}
                        </button>
                      </div>

                      {meta.primaryKeyword && (
                        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.73rem', color: 'var(--text-tertiary)' }}>
                          Target Keywords: <span style={{ color: 'var(--color-primary-dark)', fontWeight: 700 }}>{meta.primaryKeyword}</span>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Stats Bar */}
          <div className="bento-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-medium)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="badge-minimal badge-minimal-neutral" style={{ fontSize: '0.885rem', fontWeight: 800, padding: '4px 12px' }}>
                SEO Health: {auditResult.score} / 100
              </span>
              <span style={{ fontSize: '0.825rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                {auditResult.finalUrl}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
              <span>HTTP {auditResult.statusCode}</span>
              <span>&bull;</span>
              <span>{auditResult.responseTimeMs}ms</span>
            </div>
          </div>

          {/* Authentic Google SERP Simulator */}
          <div className="bento-card" style={{ padding: '22px', border: '1px solid var(--border-medium)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                Simulated Google Search Result Card
              </span>
              <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-canvas)', padding: '3px', borderRadius: '9999px', border: '1px solid var(--border-subtle)' }}>
                <button
                  onClick={() => setSerpDevice('desktop')}
                  style={{
                    padding: '3px 10px',
                    fontSize: '0.72rem',
                    border: 'none',
                    background: serpDevice === 'desktop' ? '#1b4332' : 'transparent',
                    color: serpDevice === 'desktop' ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    borderRadius: '9999px',
                    fontWeight: 700
                  }}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setSerpDevice('mobile')}
                  style={{
                    padding: '3px 10px',
                    fontSize: '0.72rem',
                    border: 'none',
                    background: serpDevice === 'mobile' ? '#1b4332' : 'transparent',
                    color: serpDevice === 'mobile' ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    borderRadius: '9999px',
                    fontWeight: 700
                  }}
                >
                  Mobile
                </button>
              </div>
            </div>

            {/* Simulated Google Card (Realistic White SERP format) */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '16px 20px',
              maxWidth: serpDevice === 'mobile' ? '390px' : '620px',
              border: '1px solid #dfe1e5',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: '#202124' }}>
                  G
                </div>
                <div style={{ fontSize: '0.75rem', color: '#202124', fontFamily: 'var(--font-sans)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {auditResult.finalUrl}
                </div>
              </div>
              <div style={{ fontSize: '1.15rem', color: '#1a0dab', fontWeight: 400, marginBottom: '4px', lineHeight: 1.3, textDecoration: 'none', cursor: 'pointer' }}>
                {auditResult.title || 'Missing Title Tag'}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#4d5156', lineHeight: 1.5 }}>
                {auditResult.description || 'Missing meta description tag.'}
              </div>
            </div>
          </div>

          {/* Technical signals & Recommendations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div className="bento-card" style={{ padding: '20px', border: '1px solid var(--border-medium)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '14px' }}>
                On-Page Technical Signals
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Title Tag Length:</span>
                  <span style={{ color: 'var(--color-primary-dark)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{auditResult.titleLength} chars</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Description Length:</span>
                  <span style={{ color: 'var(--color-primary-dark)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{auditResult.descriptionLength} chars</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Canonical Tag:</span>
                  <span style={{ color: auditResult.hasCanonical ? '#1b4332' : '#991b1b', fontWeight: 700 }}>{auditResult.hasCanonical ? 'Declared' : 'Missing'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>OpenGraph Image:</span>
                  <span style={{ color: auditResult.openGraph.image ? '#1b4332' : '#991b1b', fontWeight: 700 }}>{auditResult.openGraph.image ? 'Present' : 'Missing'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>H1 Headings:</span>
                  <span style={{ color: 'var(--color-primary-dark)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{auditResult.h1Count} found</span>
                </div>
              </div>
            </div>

            <div className="bento-card" style={{ padding: '20px', border: '1px solid var(--border-medium)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '14px' }}>
                Actionable SEO Recommendations
              </h3>
              {auditResult.recommendations.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {auditResult.recommendations.map((rec, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>&bull;</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.825rem', color: '#1b4332', fontWeight: 600 }}>
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

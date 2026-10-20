'use client';

import React, { useState } from 'react';
import { 
  Tags, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ExternalLink, 
  Sparkles, 
  Globe, 
  Smartphone, 
  Monitor, 
  RefreshCw, 
  ArrowRight,
  ShieldCheck,
  Check,
  Copy
} from 'lucide-react';
import { OngoMetaItem } from '@/lib/data';
import { MetaAuditResult } from '@/app/api/audit-meta/route';

interface MetaAuditorTabProps {
  ongoMeta: Record<string, OngoMetaItem>;
}

export default function MetaAuditorTab({ ongoMeta }: MetaAuditorTabProps) {
  const [activeMode, setActiveMode] = useState<'benchmark' | 'live'>('benchmark');
  
  // Live audit state
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header Panel */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                <Tags size={20} />
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                Meta Tag Auditor & On-Page SEO Engine
              </h1>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Analyze title tags, meta descriptions, OpenGraph, H1s, and Google SERP snippets for Ongo and competitors
            </p>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setActiveMode('benchmark')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                fontSize: '0.85rem',
                borderRadius: '6px',
                border: 'none',
                background: activeMode === 'benchmark' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: activeMode === 'benchmark' ? '#34d399' : 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <Sparkles size={14} />
              Ongo Optimization Benchmark
            </button>
            <button
              onClick={() => setActiveMode('live')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                fontSize: '0.85rem',
                borderRadius: '6px',
                border: 'none',
                background: activeMode === 'live' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: activeMode === 'live' ? '#38bdf8' : 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              <Globe size={14} />
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
          style={{ display: 'flex', gap: '10px' }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <Globe size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Enter any page URL to audit (e.g. https://ongoweightloss.com/pricing/ or https://joinmochi.com)..."
              value={auditUrl}
              onChange={(e) => setAuditUrl(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '40px' }}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={auditing} style={{ minWidth: '130px' }}>
            {auditing ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Auditing...
              </>
            ) : (
              'Audit Live HTML'
            )}
          </button>
        </form>
      </div>

      {/* MODE A: Ongo Benchmark & Page Optimization */}
      {activeMode === 'benchmark' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                Ongo Weight Loss Core Pages — Meta Optimization Scorecard
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Side-by-side comparison of current live metadata vs recommended search-optimized tags
              </p>
            </div>
            <span className="badge badge-success">11 Pages Audited</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(ongoMeta).map(([url, meta], idx) => {
              const currentTitleLen = meta.title?.length || 0;
              const recTitleLen = meta.recommendedTitle?.length || 0;
              const currentDescLen = meta.description?.length || 0;
              const recDescLen = meta.recommendedDescription?.length || 0;

              return (
                <div key={url} className="glass-panel" style={{ padding: '24px' }}>
                  {/* URL Header */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)' }}>
                        PAGE #{idx + 1}
                      </span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', wordBreak: 'break-all' }}
                      >
                        {url} <ExternalLink size={12} />
                      </a>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleRunAudit(url)}
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      >
                        Audit Live HTML
                      </button>
                    </div>
                  </div>

                  {/* Comparison Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
                    {/* Current Meta */}
                    <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                          Current Live Title
                        </span>
                        <span style={{ fontSize: '0.75rem', color: currentTitleLen >= 50 && currentTitleLen <= 65 ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
                          {currentTitleLen} chars {currentTitleLen < 45 ? '(Short)' : currentTitleLen > 65 ? '(Long)' : '(Optimal)'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, marginBottom: '14px', lineHeight: 1.4 }}>
                        {meta.title}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                          Current Live Description
                        </span>
                        <span style={{ fontSize: '0.75rem', color: currentDescLen >= 140 && currentDescLen <= 165 ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
                          {currentDescLen} chars {currentDescLen < 120 ? '(Short)' : currentDescLen > 165 ? '(Long)' : '(Optimal)'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        {meta.description}
                      </div>
                    </div>

                    {/* Recommended Meta */}
                    <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={12} /> Recommended Title
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>
                          {recTitleLen} chars (Optimal)
                        </span>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, marginBottom: '14px', lineHeight: 1.4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span>{meta.recommendedTitle}</span>
                        <button
                          onClick={() => handleCopy(meta.recommendedTitle || '')}
                          title="Copy recommended title"
                          style={{ background: 'transparent', border: 'none', color: copiedText === meta.recommendedTitle ? '#34d399' : 'var(--text-dim)', cursor: 'pointer', marginLeft: '6px' }}
                        >
                          {copiedText === meta.recommendedTitle ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Sparkles size={12} /> Recommended Description
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>
                          {recDescLen} chars (Optimal)
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span>{meta.recommendedDescription}</span>
                        <button
                          onClick={() => handleCopy(meta.recommendedDescription || '')}
                          title="Copy recommended description"
                          style={{ background: 'transparent', border: 'none', color: copiedText === meta.recommendedDescription ? '#34d399' : 'var(--text-dim)', cursor: 'pointer', marginLeft: '6px' }}
                        >
                          {copiedText === meta.recommendedDescription ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>

                      {meta.primaryKeyword && (
                        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          Target Keywords:{' '}
                          <span style={{ color: '#38bdf8', fontWeight: 600 }}>{meta.primaryKeyword}</span>
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
      {activeMode === 'live' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {auditError && (
            <div className="glass-panel" style={{ padding: '20px', border: '1px solid rgba(244, 63, 94, 0.4)', background: 'rgba(244, 63, 94, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb7185', fontWeight: 600 }}>
                <AlertCircle size={18} />
                Audit Error: {auditError}
              </div>
            </div>
          )}

          {auditResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Score & Health Top Bar */}
              <div className="glass-panel" style={{
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                alignItems: 'center'
              }}>
                {/* Score Circle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    background: auditResult.score >= 80 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                      : auditResult.score >= 60 
                      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                      : 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{auditResult.score}</span>
                    <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>/ 100</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                      SEO Meta Score
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {auditResult.score >= 80 ? 'Well Optimized' : auditResult.score >= 60 ? 'Needs Improvement' : 'Critical Issues Detected'}
                    </p>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>RESPONSE TIME</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>
                    {auditResult.responseTimeMs} ms
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>INDEXABILITY</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: auditResult.isIndexable ? '#34d399' : '#fb7185' }}>
                    {auditResult.isIndexable ? 'Indexable' : 'Noindex'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>H1 HEADINGS</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: auditResult.h1Count === 1 ? '#34d399' : '#fbbf24' }}>
                    {auditResult.h1Count} found
                  </div>
                </div>
              </div>

              {/* SERP Preview Simulator */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Search size={16} color="#38bdf8" />
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                      Google Search Result Preview Simulator
                    </h3>
                  </div>

                  <div style={{ display: 'flex', gap: '4px', background: 'rgba(255, 255, 255, 0.05)', padding: '2px', borderRadius: '6px' }}>
                    <button
                      onClick={() => setSerpDevice('desktop')}
                      style={{
                        padding: '4px 8px',
                        border: 'none',
                        borderRadius: '4px',
                        background: serpDevice === 'desktop' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        color: serpDevice === 'desktop' ? '#fff' : 'var(--text-dim)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem'
                      }}
                    >
                      <Monitor size={12} /> Desktop
                    </button>
                    <button
                      onClick={() => setSerpDevice('mobile')}
                      style={{
                        padding: '4px 8px',
                        border: 'none',
                        borderRadius: '4px',
                        background: serpDevice === 'mobile' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        color: serpDevice === 'mobile' ? '#fff' : 'var(--text-dim)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem'
                      }}
                    >
                      <Smartphone size={12} /> Mobile
                    </button>
                  </div>
                </div>

                {/* Simulated Google Search Box */}
                <div style={{
                  background: '#202124',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  maxWidth: serpDevice === 'mobile' ? '420px' : '650px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  {/* Google snippet domain header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 800, color: '#000' }}>
                      O
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#dadce0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {auditResult.finalUrl}
                    </div>
                  </div>

                  {/* Title */}
                  <div style={{
                    fontSize: serpDevice === 'mobile' ? '1rem' : '1.25rem',
                    color: '#8ab4f8',
                    fontWeight: 400,
                    lineHeight: 1.3,
                    marginBottom: '6px',
                    cursor: 'pointer'
                  }}>
                    {auditResult.title || 'No Title Found'}
                  </div>

                  {/* Description */}
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#bdc1c6',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: serpDevice === 'mobile' ? 3 : 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {auditResult.description || 'No meta description found. Search engines will generate automatic snippets from visible content.'}
                  </div>
                </div>
              </div>

              {/* In-depth Meta Tag Inspector Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '20px'
              }}>
                {/* Title & Description Check */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
                    Title & Description Evaluation
                  </h3>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Page Title</span>
                      <span style={{ fontSize: '0.75rem', color: auditResult.titleStatus === 'optimal' ? '#34d399' : '#fbbf24', fontWeight: 700 }}>
                        {auditResult.titleLength} characters
                      </span>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', color: '#fff', marginBottom: '6px' }}>
                      {auditResult.title || '<Missing Title Tag>'}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {auditResult.titleRecommendation}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Meta Description</span>
                      <span style={{ fontSize: '0.75rem', color: auditResult.descriptionStatus === 'optimal' ? '#34d399' : '#fbbf24', fontWeight: 700 }}>
                        {auditResult.descriptionLength} characters
                      </span>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>
                      {auditResult.description || '<Missing Meta Description>'}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      {auditResult.descriptionRecommendation}
                    </p>
                  </div>
                </div>

                {/* Technical Signals & OpenGraph */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
                    OpenGraph & Technical Tags
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Canonical URL:</span>
                      <span style={{ color: auditResult.hasCanonical ? '#34d399' : '#fb7185', fontWeight: 600 }}>
                        {auditResult.hasCanonical ? 'Declared' : 'Missing'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>og:title:</span>
                      <span style={{ color: auditResult.openGraph.title ? '#fff' : '#fb7185', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {auditResult.openGraph.title || 'Missing'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>og:image:</span>
                      <span style={{ color: auditResult.openGraph.image ? '#34d399' : '#fb7185' }}>
                        {auditResult.openGraph.image ? 'Present' : 'Missing'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                      <span style={{ color: 'var(--text-muted)' }}>twitter:card:</span>
                      <span style={{ color: auditResult.twitterCard.card ? '#38bdf8' : '#fb7185' }}>
                        {auditResult.twitterCard.card || 'Missing'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                      <span style={{ color: 'var(--text-muted)' }}>H1 Heading Text:</span>
                      <span style={{ color: '#fff', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {auditResult.h1Tags[0] || 'None'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actionable Recommendations */}
              {auditResult.recommendations.length > 0 && (
                <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fbbf24', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={18} /> Actionable SEO Recommendations
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {auditResult.recommendations.map((rec, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: '#e2e8f0' }}>
                        <span style={{ color: '#fbbf24', marginTop: '2px' }}>•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

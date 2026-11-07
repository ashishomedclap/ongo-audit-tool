'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Globe,
  FileText,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Layers,
  Copy,
  Check,
  Download,
  ExternalLink,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  Link2,
  Bot,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  Code2,
  AlignLeft,
  Server,
  Sparkles,
  Zap
} from 'lucide-react';
import ContextCue from './ContextCue';
import { ContentExtractorResult } from '@/app/api/content-extractor/route';
import { ONGO_SITEMAP_URLS, SitemapUrlEntry } from '@/lib/sitemap-urls';

const QUICK_PICK_URLS = [
  { label: 'Semaglutide Guide', url: 'https://ongoweightloss.com/services/glp-1/compounded-semaglutide' },
  { label: 'Tirzepatide Page', url: 'https://ongoweightloss.com/services/glp-1/compounded-tirzepatide' },
  { label: 'Ongo Homepage', url: 'https://ongoweightloss.com' },
  { label: 'Pricing Plans', url: 'https://ongoweightloss.com/pricing' },
  { label: 'Medical Team', url: 'https://ongoweightloss.com/medical-team' },
  { label: 'FAQ Page', url: 'https://ongoweightloss.com/faq' }
];

function getCategoryColor(category: string): string {
  switch (category) {
    case 'Medication & Clinical':
      return '#8b5cf6';
    case 'Pricing & Plans':
      return '#059669';
    case 'Medical Team & E-E-A-T':
      return '#0284c7';
    case 'Blog & Education':
      return '#d97706';
    case 'Clinical Resources':
      return '#ec4899';
    case 'Local Telehealth':
      return '#10b981';
    case 'Core & Landing':
      return '#6366f1';
    default:
      return 'var(--text-secondary)';
  }
}

export default function ContentExtractorTab() {
  const [inputUrl, setInputUrl] = useState('https://ongoweightloss.com/services/glp-1/compounded-semaglutide');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sitemapCategoryFilter, setSitemapCategoryFilter] = useState('ALL');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContentExtractorResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'reader' | 'markdown' | 'plain'>('reader');
  const [copiedType, setCopiedType] = useState<'md' | 'text' | null>(null);

  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const runExtraction = async (urlToAudit: string) => {
    if (!urlToAudit.trim()) return;
    setLoading(true);
    setErrorMessage(null);
    setDropdownOpen(false);

    try {
      const res = await fetch('/api/content-extractor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToAudit.trim() })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setResult(data.result);
      } else {
        setErrorMessage(data.error || 'Failed to extract page content.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network request failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runExtraction(inputUrl);
  }, []);

  const handleSelectSitemap = (entry: SitemapUrlEntry) => {
    setInputUrl(entry.url);
    setDropdownOpen(false);
    runExtraction(entry.url);
  };

  const handleCopyMarkdown = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.content.markdown);
    setCopiedType('md');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyText = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.content.cleanText);
    setCopiedType('text');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadMarkdown = () => {
    if (!result) return;
    const blob = new Blob([result.content.markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const cleanFilename = (result.domain + (result.path === '/' ? '-home' : result.path.replace(/\//g, '-')))
      .replace(/[^a-zA-Z0-9-_]/g, '') + '.md';
    link.setAttribute('download', cleanFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter sitemap URLs
  const filteredSitemapUrls = useMemo(() => {
    const term = inputUrl.trim().toLowerCase();
    return ONGO_SITEMAP_URLS.filter(item => {
      const matchesCategory = sitemapCategoryFilter === 'ALL' || item.category === sitemapCategoryFilter;
      if (!term || term === 'https://' || term === 'http://') {
        return matchesCategory;
      }
      const matchesSearch =
        item.url.toLowerCase().includes(term) ||
        item.path.toLowerCase().includes(term) ||
        item.title.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [inputUrl, sitemapCategoryFilter]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setDropdownOpen(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % Math.max(1, filteredSitemapUrls.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + filteredSitemapUrls.length) % Math.max(1, filteredSitemapUrls.length));
    } else if (e.key === 'Enter') {
      if (dropdownOpen && filteredSitemapUrls[highlightedIndex]) {
        e.preventDefault();
        handleSelectSitemap(filteredSitemapUrls[highlightedIndex]);
      } else {
        runExtraction(inputUrl);
      }
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  };

  const SITEMAP_CATEGORIES = useMemo(() => {
    const counts: Record<string, number> = {};
    ONGO_SITEMAP_URLS.forEach(u => {
      counts[u.category] = (counts[u.category] || 0) + 1;
    });
    return [
      { id: 'ALL', label: 'All Pages', count: ONGO_SITEMAP_URLS.length },
      { id: 'Medication & Clinical', label: 'Clinical & Meds', count: counts['Medication & Clinical'] || 0 },
      { id: 'Pricing & Plans', label: 'Pricing', count: counts['Pricing & Plans'] || 0 },
      { id: 'Medical Team & E-E-A-T', label: 'Medical Team', count: counts['Medical Team & E-E-A-T'] || 0 },
      { id: 'Blog & Education', label: 'Blog & Guides', count: counts['Blog & Education'] || 0 },
      { id: 'Clinical Resources', label: 'Resources & Tools', count: counts['Clinical Resources'] || 0 },
      { id: 'Local Telehealth', label: 'Locations', count: counts['Local Telehealth'] || 0 },
      { id: 'Company & Support', label: 'Company & FAQ', count: counts['Company & Support'] || 0 },
      { id: 'Legal & Policies', label: 'Policies', count: counts['Legal & Policies'] || 0 }
    ].filter(c => c.id === 'ALL' || c.count > 0);
  }, []);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 8px' }}>
      {/* Context Cue Banner */}
      <ContextCue
        title="Clean Content Extractor & HTTP Indexability Auditor"
        level={1}
        toolNumber={29}
        badge="Boilerplate Stripper & Technical SEO"
        useCase="Strips bloated navigation, footers, scripts, and popups to extract clean readable Markdown/Text, while diagnosing HTTP status codes, meta robots, X-Robots-Tag, and canonical indexability."
      />

      {/* URL Input & Sitemap Combobox */}
      <div
        className="glass-card"
        style={{
          padding: '24px',
          borderRadius: '18px',
          margin: '24px 0 28px 0',
          overflow: 'visible',
          position: 'relative',
          zIndex: dropdownOpen ? 1000 : 1
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Inspect URL Indexability & Extract Clean Readable Content
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>
            Check if search engines and AI bots can index this URL, view the exact HTTP status code, and strip all noise to extract clean readable Markdown.
          </p>
        </div>

        {/* Input bar */}
        <div
          ref={comboboxRef}
          style={{
            position: 'relative',
            marginBottom: '16px',
            zIndex: dropdownOpen ? 1100 : 2
          }}
        >
          <div style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{
              flex: '1 1 360px',
              display: 'flex',
              alignItems: 'center',
              position: 'relative'
            }}>
              <Globe
                size={16}
                color="var(--text-tertiary)"
                style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }}
              />

              <input
                ref={inputRef}
                type="url"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setDropdownOpen(true);
                  setHighlightedIndex(0);
                }}
                onFocus={() => setDropdownOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Enter URL or search sitemap..."
                style={{
                  width: '100%',
                  padding: '12px 100px 12px 40px',
                  borderRadius: '12px',
                  border: dropdownOpen ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  outline: 'none',
                  boxShadow: dropdownOpen ? '0 0 0 3px rgba(139, 92, 246, 0.15)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              />

              {/* Clear and Toggle buttons */}
              <div style={{
                position: 'absolute',
                right: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {inputUrl.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setInputUrl('');
                      inputRef.current?.focus();
                      setDropdownOpen(true);
                    }}
                    title="Clear URL"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      border: 'none',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={13} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    inputRef.current?.focus();
                  }}
                  title="Toggle sitemap"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    background: dropdownOpen ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: dropdownOpen ? '#8b5cf6' : 'var(--text-tertiary)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  <span>Sitemap</span>
                  {dropdownOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => runExtraction(inputUrl)}
              disabled={loading || !inputUrl.trim()}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                fontSize: '13px',
                fontWeight: 700,
                borderRadius: '12px',
                whiteSpace: 'nowrap'
              }}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Inspecting & Extracting...' : 'Extract & Audit Page'}
            </button>
          </div>

          {/* Sitemap Autofill Dropdown Panel */}
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                zIndex: 9999,
                backgroundColor: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid rgba(139, 92, 246, 0.45)',
                boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(139, 92, 246, 0.25)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                overflow: 'hidden'
              }}
            >
              {/* Category Filter Tabs */}
              <div style={{
                padding: '12px 14px',
                borderBottom: '1px solid var(--border-subtle)',
                backgroundColor: 'rgba(139, 92, 246, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 800, color: '#8b5cf6' }}>
                    <Layers size={14} />
                    <span>Ongo Sitemap Pages ({filteredSitemapUrls.length} matches)</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    Click any URL to inspect indexability &bull; &uarr;&darr; to navigate
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  maxHeight: '75px',
                  overflowY: 'auto'
                }}>
                  {SITEMAP_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSitemapCategoryFilter(cat.id);
                        setHighlightedIndex(0);
                      }}
                      style={{
                        padding: '3px 9px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: sitemapCategoryFilter === cat.id ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
                        backgroundColor: sitemapCategoryFilter === cat.id ? 'rgba(139, 92, 246, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                        color: sitemapCategoryFilter === cat.id ? '#8b5cf6' : 'var(--text-secondary)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {cat.label} ({cat.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable List */}
              <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '6px' }}>
                {filteredSitemapUrls.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>
                    No sitemap URL matched &ldquo;{inputUrl}&rdquo;. You can still click &ldquo;Extract & Audit Page&rdquo; to test this URL directly.
                  </div>
                ) : (
                  filteredSitemapUrls.map((item, idx) => {
                    const isHighlighted = idx === highlightedIndex;
                    const isCurrent = inputUrl.trim().toLowerCase() === item.url.toLowerCase();
                    const catColor = getCategoryColor(item.category);

                    return (
                      <div
                        key={item.url}
                        onClick={() => handleSelectSitemap(item)}
                        onMouseEnter={() => setHighlightedIndex(idx)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          gap: '12px',
                          marginBottom: '4px',
                          backgroundColor: isCurrent ? 'rgba(139, 92, 246, 0.15)' : (isHighlighted ? 'rgba(255, 255, 255, 0.05)' : 'transparent'),
                          border: isCurrent ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: `${catColor}20`,
                              color: catColor
                            }}>
                              {item.category}
                            </span>
                            <span style={{
                              fontSize: '13px',
                              fontWeight: 700,
                              color: isCurrent ? '#8b5cf6' : 'var(--text-primary)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {item.title}
                            </span>
                          </div>

                          <div style={{
                            fontSize: '11px',
                            color: 'var(--text-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <Link2 size={11} />
                            <span style={{ fontFamily: 'monospace' }}>{item.url}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#8b5cf6' }}>
                            Audit &rarr;
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* 1-Click Priority Quick Picks */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>
            ⚡ 1-Click Quick Picks:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {QUICK_PICK_URLS.map((pick, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputUrl(pick.url);
                  runExtraction(pick.url);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: inputUrl === pick.url ? '1px solid #8b5cf6' : '1px solid var(--border-subtle)',
                  backgroundColor: inputUrl === pick.url ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  color: inputUrl === pick.url ? '#8b5cf6' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {pick.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div style={{
          padding: '14px 18px',
          borderRadius: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          fontSize: '13px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertTriangle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Results Workspace */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
          {/* 1. Technical Health & Indexability Verdict Banner */}
          <div className="glass-card" style={{
            padding: '20px 24px',
            borderRadius: '16px',
            borderLeft: result.indexability.verdictSeverity === 'success'
              ? '5px solid #059669'
              : (result.indexability.verdictSeverity === 'danger' ? '5px solid #ef4444' : '5px solid #d97706')
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: result.indexability.verdictSeverity === 'success'
                      ? 'rgba(5, 150, 105, 0.15)'
                      : (result.indexability.verdictSeverity === 'danger' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(217, 119, 6, 0.15)'),
                    color: result.indexability.verdictSeverity === 'success'
                      ? '#059669'
                      : (result.indexability.verdictSeverity === 'danger' ? '#ef4444' : '#d97706')
                  }}>
                    {result.indexability.verdictLabel}
                  </span>

                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: result.http.statusCode === 200 ? 'rgba(5, 150, 105, 0.12)' : 'rgba(217, 119, 6, 0.12)',
                    color: result.http.statusCode === 200 ? '#059669' : '#d97706',
                    fontFamily: 'monospace'
                  }}>
                    HTTP {result.http.statusCode} {result.http.statusText}
                  </span>

                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {result.http.latencyMs}ms TTFB
                  </span>
                </div>

                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 6px 0' }}>
                  {result.indexability.verdictSummary}
                </h2>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontFamily: 'monospace' }}>{result.url}</span>
                  <a href={result.url} target="_blank" rel="noreferrer" style={{ color: '#8b5cf6', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Warnings Pill Count */}
              {result.warnings.length > 0 && (
                <div style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#ef4444',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertTriangle size={14} />
                  <span>{result.warnings.length} Technical Alert{result.warnings.length > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            {/* Warnings list if any */}
            {result.warnings.length > 0 && (
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                {result.warnings.map((w, idx) => (
                  <div key={idx} style={{ fontSize: '12px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    &bull; {w}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Technical Directives 4-Card Matrix */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px'
          }}>
            {/* Meta Robots */}
            <div className="glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Meta Robots Directive
                </span>
                {result.indexability.metaRobots.hasNoindex ? (
                  <XCircle size={16} color="#ef4444" />
                ) : (
                  <CheckCircle2 size={16} color="#059669" />
                )}
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: 800,
                color: result.indexability.metaRobots.hasNoindex ? '#ef4444' : '#059669',
                fontFamily: 'monospace',
                marginBottom: '4px'
              }}>
                {result.indexability.metaRobots.raw}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Googlebot: <strong style={{ color: result.indexability.googlebotDirective.hasNoindex ? '#ef4444' : 'var(--text-primary)' }}>{result.indexability.googlebotDirective.raw}</strong>
              </div>
            </div>

            {/* Canonical Tag */}
            <div className="glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Canonical Tag
                </span>
                <Link2 size={16} color={result.indexability.canonical.isSelfReferential ? '#059669' : '#d97706'} />
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: 800,
                color: result.indexability.canonical.isSelfReferential ? '#059669' : '#d97706',
                marginBottom: '4px'
              }}>
                {result.indexability.canonical.isSelfReferential ? 'Self-Referential (Optimal)' : 'Canonicalized to Alternate'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                {result.indexability.canonical.url || 'No canonical tag found'}
              </div>
            </div>

            {/* AI & Search Bots */}
            <div className="glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  AI & Search Bot Permissions
                </span>
                <Bot size={16} color="#8b5cf6" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {result.indexability.robotsTxt.botRules.slice(0, 3).map((b, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{b.bot}:</span>
                    <span style={{ fontWeight: 700, color: b.allowed ? '#059669' : '#ef4444' }}>
                      {b.allowed ? '✓ Allowed' : '✗ Blocked'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* HTTP Headers */}
            <div className="glass-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  HTTP Headers
                </span>
                <Server size={16} color="#0284c7" />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div>Server: <strong>{result.http.server}</strong></div>
                <div>X-Robots-Tag: <strong>{result.http.xRobotsTag}</strong></div>
                <div>Cache: <strong>{result.http.cacheControl}</strong></div>
              </div>
            </div>
          </div>

          {/* 3. Clean Readable Content Studio */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '18px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Boilerplate-Stripped Content
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>&bull; Zero Ads, Nav, or Scripts</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                  {result.content.h1 || result.content.title}
                </h3>
                {result.content.metaDescription && (
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, maxWidth: '800px', lineHeight: 1.5 }}>
                    <strong>Meta:</strong> {result.content.metaDescription}
                  </p>
                )}
              </div>

              {/* Content Metrics */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>WORD COUNT</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {result.content.wordCount.toLocaleString()} words
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>READING TIME</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#059669' }}>
                    ~{result.content.estimatedReadingTimeMin} min
                  </div>
                </div>
              </div>
            </div>

            {/* View Mode Switcher & Copy Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              padding: '8px 12px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setViewMode('reader')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: viewMode === 'reader' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                    backgroundColor: viewMode === 'reader' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                    color: viewMode === 'reader' ? '#8b5cf6' : 'var(--text-secondary)'
                  }}
                >
                  <BookOpen size={13} />
                  Reader View
                </button>

                <button
                  onClick={() => setViewMode('markdown')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: viewMode === 'markdown' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                    backgroundColor: viewMode === 'markdown' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                    color: viewMode === 'markdown' ? '#8b5cf6' : 'var(--text-secondary)'
                  }}
                >
                  <Code2 size={13} />
                  Markdown View
                </button>

                <button
                  onClick={() => setViewMode('plain')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: viewMode === 'plain' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                    backgroundColor: viewMode === 'plain' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                    color: viewMode === 'plain' ? '#8b5cf6' : 'var(--text-secondary)'
                  }}
                >
                  <AlignLeft size={13} />
                  Plain Text
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleCopyMarkdown}
                  className="btn-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    borderRadius: '8px'
                  }}
                >
                  {copiedType === 'md' ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                  {copiedType === 'md' ? 'Markdown Copied!' : 'Copy Markdown'}
                </button>

                <button
                  onClick={handleCopyText}
                  className="btn-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    borderRadius: '8px'
                  }}
                >
                  {copiedType === 'text' ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                  {copiedType === 'text' ? 'Text Copied!' : 'Copy Plain Text'}
                </button>

                <button
                  onClick={handleDownloadMarkdown}
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    borderRadius: '8px',
                    fontWeight: 700
                  }}
                >
                  <Download size={13} />
                  Download .md
                </button>
              </div>
            </div>

            {/* Display Body according to viewMode */}
            {viewMode === 'reader' && (
              <div style={{
                padding: '24px',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                maxHeight: '520px',
                overflowY: 'auto',
                lineHeight: 1.8,
                fontSize: '14px',
                color: 'var(--text-primary)'
              }}>
                <div style={{ maxWidth: '840px', margin: '0 auto' }}>
                  {result.content.cleanText.split('\n\n').map((para, i) => {
                    if (para.startsWith('•')) {
                      return (
                        <div key={i} style={{ paddingLeft: '16px', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                          {para}
                        </div>
                      );
                    }
                    if (para.startsWith('"') && para.endsWith('"')) {
                      return (
                        <blockquote key={i} style={{
                          borderLeft: '3px solid #8b5cf6',
                          margin: '16px 0',
                          padding: '8px 16px',
                          color: '#8b5cf6',
                          fontStyle: 'italic',
                          backgroundColor: 'rgba(139, 92, 246, 0.05)',
                          borderRadius: '0 8px 8px 0'
                        }}>
                          {para}
                        </blockquote>
                      );
                    }
                    return (
                      <p key={i} style={{ marginBottom: '16px' }}>
                        {para}
                      </p>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === 'markdown' && (
              <div style={{
                position: 'relative',
                borderRadius: '12px',
                backgroundColor: '#0f172a',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden'
              }}>
                <textarea
                  readOnly
                  rows={20}
                  value={result.content.markdown}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'transparent',
                    color: '#e2e8f0',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: '12px',
                    lineHeight: 1.6,
                    border: 'none',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}

            {viewMode === 'plain' && (
              <div style={{
                position: 'relative',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden'
              }}>
                <textarea
                  readOnly
                  rows={20}
                  value={result.content.cleanText}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    border: 'none',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

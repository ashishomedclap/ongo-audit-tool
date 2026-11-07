'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Bot,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  Quote,
  Activity,
  Layers,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Globe,
  Link2,
  ExternalLink,
  FileText,
  ChevronDown,
  ChevronUp,
  Info,
  X,
  ListFilter,
  Tag
} from 'lucide-react';
import ContextCue from './ContextCue';
import { GeoAuditResult } from '@/app/api/geo-readiness/route';
import { ONGO_SITEMAP_URLS, SitemapUrlEntry } from '@/lib/sitemap-urls';

const ONGO_URL_QUICK_PICKS = [
  {
    label: 'Semaglutide Vials',
    url: 'https://ongoweightloss.com/services/glp-1/compounded-semaglutide',
    desc: 'Core 503A Semaglutide Treatment Guide'
  },
  {
    label: 'Tirzepatide Dual-Agonist',
    url: 'https://ongoweightloss.com/services/glp-1/compounded-tirzepatide',
    desc: 'High-converting Dual GIP/GLP-1 Pillar Page'
  },
  {
    label: 'Ongo Homepage',
    url: 'https://ongoweightloss.com',
    desc: 'Primary Telehealth Brand Gateway'
  },
  {
    label: 'Transparent Pricing & 503A',
    url: 'https://ongoweightloss.com/pricing',
    desc: '$199/mo Compounding Pricing Table'
  },
  {
    label: 'Physician Board / Medical Team',
    url: 'https://ongoweightloss.com/medical-team',
    desc: 'E-E-A-T Medical Director & Clinicians'
  },
  {
    label: 'Clinical FAQ & Safety',
    url: 'https://ongoweightloss.com/faq',
    desc: 'High-Intent FAQ Answer Blocks'
  }
];

const SAMPLE_TEXT_PRESETS = [
  {
    id: 'ongo-semaglutide',
    title: 'Ongo Semaglutide Compounding Page',
    text: `Compounded semaglutide is a subcutaneous GLP-1 receptor agonist prescribed for chronic weight management in adults with a BMI >= 30, or >= 27 with at least one weight-related comorbidity. In the landmark STEP-1 clinical trial published in the New England Journal of Medicine (NEJM), participants achieved an average -14.9% mean weight loss at week 68 compared to -2.4% with placebo. "Under physician-guided titration starting at 0.25mg and progressing up to 2.4mg weekly, patients experience reduced appetite and enhanced satiety," notes Dr. Brett Kramer, DO, Ongo Medical Director. Ongo delivers physician-supervised virtual care starting at $199/month, compounded exclusively by 503A accredited US pharmacies with USP <797> sterile certification.`
  },
  {
    id: 'ongo-tirzepatide',
    title: 'Ongo Tirzepatide Dual-Agonist Guide',
    text: `Tirzepatide is a first-in-class dual GIP and GLP-1 receptor agonist designed for superior weight loss and glycemic control. According to the SURMOUNT-1 Phase 3 trial published in NEJM (Jastreboff et al.), patients taking the maximum 15mg dose achieved a remarkable -20.9% mean reduction in body weight over 72 weeks. Compounded tirzepatide works by mimicking natural incretin hormones that stimulate insulin secretion, delay gastric emptying, and curb food cravings. "The dual-action mechanism targets both glucose-dependent insulinotropic polypeptide and glucagon-like peptide-1 receptors," explains our Board-Certified clinical team. Starting doses begin at 2.5mg subcutaneously once weekly.`
  },
  {
    id: 'generic-blog',
    title: 'Generic Telehealth Blog Draft (Low GEO Readiness)',
    text: `Losing weight is very difficult for many people in America today. Many folks are looking into new weight loss shots that have become popular on social media. These injections help you feel full so you eat less food during the day. If you want to lose weight, you should talk to a doctor about whether these treatments are right for you. Our clinic offers great customer service and fast shipping to your door. Sign up today to start your journey.`
  }
];

function getCategoryColor(category: string): string {
  switch (category) {
    case 'Medication & Clinical':
      return '#8b5cf6'; // purple
    case 'Pricing & Plans':
      return '#059669'; // emerald
    case 'Medical Team & E-E-A-T':
      return '#0284c7'; // blue
    case 'Blog & Education':
      return '#d97706'; // amber
    case 'Clinical Resources':
      return '#ec4899'; // pink
    case 'Local Telehealth':
      return '#10b981'; // teal
    case 'Core & Landing':
      return '#6366f1'; // indigo
    default:
      return 'var(--text-secondary)';
  }
}

export default function GeoReadinessTab() {
  const [auditMode, setAuditMode] = useState<'url' | 'text'>('url');
  
  // URL Mode state
  const [inputUrl, setInputUrl] = useState('https://ongoweightloss.com/services/glp-1/compounded-semaglutide');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sitemapCategoryFilter, setSitemapCategoryFilter] = useState('ALL');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Text Mode state
  const [selectedPreset, setSelectedPreset] = useState(SAMPLE_TEXT_PRESETS[0].id);
  const [inputTitle, setInputTitle] = useState(SAMPLE_TEXT_PRESETS[0].title);
  const [inputText, setInputText] = useState(SAMPLE_TEXT_PRESETS[0].text);
  
  // Shared audit state
  const [auditResult, setAuditResult] = useState<GeoAuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedFix, setCopiedFix] = useState<string | null>(null);
  const [showExtractedText, setShowExtractedText] = useState(false);

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

  const runUrlAudit = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    setLoading(true);
    setErrorMessage(null);
    setDropdownOpen(false);
    try {
      const res = await fetch('/api/geo-readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setAuditResult(data.result);
      } else {
        setErrorMessage(data.error || 'Failed to complete URL audit.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Network request failed');
    } finally {
      setLoading(false);
    }
  };

  const runTextAudit = async (title: string, text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/geo-readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, text })
      });
      const data = await res.json();
      if (data.success && data.result) {
        setAuditResult(data.result);
      } else {
        setErrorMessage(data.error || 'Failed to audit draft text.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Network request failed');
    } finally {
      setLoading(false);
    }
  };

  // Run initial URL audit on load
  useEffect(() => {
    runUrlAudit(inputUrl);
  }, []);

  const handleQuickPickUrl = (url: string) => {
    setInputUrl(url);
    runUrlAudit(url);
  };

  const handleSelectSitemapItem = (item: SitemapUrlEntry) => {
    setInputUrl(item.url);
    setDropdownOpen(false);
    runUrlAudit(item.url);
  };

  const handleSelectTextPreset = (presetId: string) => {
    const found = SAMPLE_TEXT_PRESETS.find(p => p.id === presetId);
    if (found) {
      setSelectedPreset(presetId);
      setInputTitle(found.title);
      setInputText(found.text);
      runTextAudit(found.title, found.text);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFix(id);
    setTimeout(() => setCopiedFix(null), 2000);
  };

  // Filter sitemap URLs based on user search and category
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

  // Handle keyboard navigation for dropdown
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
        handleSelectSitemapItem(filteredSitemapUrls[highlightedIndex]);
      } else {
        runUrlAudit(inputUrl);
      }
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  };

  // Unique categories for pills
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
        title="Generative Engine Optimization (GEO) & Live URL AI Auditor"
        level={2}
        toolNumber={24}
        badge="ChatGPT & Perplexity Benchmarked"
        useCase="Audits live URLs and article drafts against Princeton & Georgia Tech GEO benchmarks to maximize citation probability in ChatGPT Search, Perplexity US, Google AI Overviews, and Claude."
      />

      {/* Mode Switcher Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        margin: '24px 0 16px 0',
        padding: '6px',
        borderRadius: '14px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => {
              setAuditMode('url');
              if (inputUrl) runUrlAudit(inputUrl);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: auditMode === 'url' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
              backgroundColor: auditMode === 'url' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              color: auditMode === 'url' ? '#8b5cf6' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            <Globe size={15} />
            Live Web Page / URL Audit
          </button>

          <button
            onClick={() => {
              setAuditMode('text');
              if (inputText) runTextAudit(inputTitle, inputText);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              border: auditMode === 'text' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
              backgroundColor: auditMode === 'text' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              color: auditMode === 'text' ? '#8b5cf6' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            <FileText size={15} />
            Custom Text / Article Draft Mode
          </button>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', paddingRight: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="#8b5cf6" />
          Supports any live web URL or 46 Ongo sitemap pages
        </div>
      </div>

      {/* Hero Overview Matrix */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              GEO Readiness Score
            </span>
            <Bot size={18} color="#8b5cf6" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '36px', fontWeight: 900, color: '#8b5cf6', letterSpacing: '-0.02em' }}>
              {auditResult?.overallScore ?? '--'}
            </span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-tertiary)' }}>
              / 100
            </span>
            <span style={{
              marginLeft: 'auto',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 800,
              backgroundColor: auditResult?.grade === 'A+' || auditResult?.grade === 'A' ? 'rgba(5, 150, 105, 0.12)' : 'rgba(217, 119, 6, 0.12)',
              color: auditResult?.grade === 'A+' || auditResult?.grade === 'A' ? '#059669' : '#d97706'
            }}>
              Grade {auditResult?.grade ?? '--'}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Princeton GEO Framework Compliant
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              US AI Search Visibility
            </span>
            <TrendingUp size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#059669', marginTop: '6px' }}>
            {auditResult?.aiSearchVisibilityIndex ?? 'Analyzing...'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Evaluated for ChatGPT Search & Perplexity US
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Audited Content Volume
            </span>
            <Activity size={18} color="#0284c7" />
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
            {auditResult ? `${auditResult.wordCount.toLocaleString()} words` : '--'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {auditResult?.detectedSchemas?.length ? `Schema: ${auditResult.detectedSchemas.join(', ')}` : 'No schema detected'}
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

      {/* URL Audit Workspace */}
      {auditMode === 'url' && (
        <div
          className="glass-card"
          style={{
            padding: '24px',
            borderRadius: '18px',
            marginBottom: '28px',
            overflow: 'visible',
            position: 'relative',
            zIndex: dropdownOpen ? 1000 : 1
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Live Web Page URL Auditor with Sitemap Autofill
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>
              Enter any Ongo page, competitor URL, or clinical article. Click into the input to search or pick from all 46 sitemap URLs with 1-click.
            </p>
          </div>

          {/* URL Input Bar with Combobox Dropdown */}
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
                  placeholder="Type a URL or search sitemap (e.g. semaglutide, pricing, dr)..."
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

                {/* Right controls inside input */}
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
                      title="Clear URL input"
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
                    title="Toggle Sitemap URLs dropdown"
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
                onClick={() => runUrlAudit(inputUrl)}
                disabled={loading || !inputUrl.trim()}
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  fontSize: '13px',
                  fontWeight: 700,
                  borderRadius: '12px',
                  whiteSpace: 'nowrap'
                }}
              >
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                {loading ? 'Fetching & Auditing...' : 'Audit Page URL'}
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
                {/* Dropdown Header & Category Filter Tabs */}
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
                      Click any URL to audit instantly &bull; &uarr;&darr; to navigate
                    </span>
                  </div>

                  {/* Category Pills */}
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

                {/* Scrollable Sitemap URL List */}
                <div
                  ref={listRef}
                  style={{
                    maxHeight: '340px',
                    overflowY: 'auto',
                    padding: '6px'
                  }}
                >
                  {filteredSitemapUrls.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>
                      No sitemap URL matched &ldquo;{inputUrl}&rdquo;. You can still click &ldquo;Audit Page URL&rdquo; to audit this custom URL directly.
                    </div>
                  ) : (
                    filteredSitemapUrls.map((item, idx) => {
                      const isHighlighted = idx === highlightedIndex;
                      const isCurrent = inputUrl.trim().toLowerCase() === item.url.toLowerCase() || inputUrl.trim().toLowerCase() === item.path.toLowerCase();
                      const catColor = getCategoryColor(item.category);

                      return (
                        <div
                          key={item.url}
                          onClick={() => handleSelectSitemapItem(item)}
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
                              {item.priority && (
                                <span style={{
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  padding: '2px 5px',
                                  borderRadius: '4px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                                  color: 'var(--text-tertiary)'
                                }}>
                                  {item.priority}
                                </span>
                              )}
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
                            {isCurrent && (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                                fontSize: '10px',
                                fontWeight: 800,
                                color: '#8b5cf6',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                backgroundColor: 'rgba(139, 92, 246, 0.15)'
                              }}>
                                <Check size={10} /> Active
                              </span>
                            )}
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: '#8b5cf6',
                              opacity: isHighlighted || isCurrent ? 1 : 0.6
                            }}>
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

          {/* Quick Picks for Ongo URLs */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>
              ⚡ 1-Click Priority Audits:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {ONGO_URL_QUICK_PICKS.map((pick, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPickUrl(pick.url)}
                  title={pick.desc}
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
      )}

      {/* Text / Draft Mode Workspace */}
      {auditMode === 'text' && (
        <div className="glass-card" style={{ padding: '24px', borderRadius: '18px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Audit Target Draft / Article Text
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', margin: '4px 0 0 0' }}>
                Select a draft preset or paste unreleased copy to test whether AI search engines will cite your claims.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SAMPLE_TEXT_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectTextPreset(preset.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedPreset === preset.id ? '#8b5cf6' : 'var(--border-subtle)',
                    backgroundColor: selectedPreset === preset.id ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
                    color: selectedPreset === preset.id ? '#8b5cf6' : 'var(--text-secondary)'
                  }}
                >
                  {preset.title.split(' ')[1] || preset.title}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              placeholder="Page Title / H1..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: 700,
                marginBottom: '10px'
              }}
            />
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste article body, landing page text, or clinical overview..."
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                lineHeight: 1.6,
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={() => runTextAudit(inputTitle, inputText)}
              disabled={loading}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: 700,
                borderRadius: '10px'
              }}
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Evaluating AI Signals...' : 'Run GEO AI Audit'}
            </button>
          </div>
        </div>
      )}

      {/* Target Page Metadata & Crawler Extraction Inspection */}
      {auditResult && (
        <div className="glass-card" style={{
          padding: '18px 22px',
          borderRadius: '16px',
          marginBottom: '24px',
          borderLeft: '4px solid #8b5cf6'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ flex: '1 1 450px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  backgroundColor: auditResult.sourceType === 'LIVE_URL' ? 'rgba(5, 150, 105, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                  color: auditResult.sourceType === 'LIVE_URL' ? '#059669' : '#8b5cf6'
                }}>
                  {auditResult.sourceType === 'LIVE_URL' ? '🌐 Live Page Fetched' : (auditResult.sourceType === 'OFFLINE_ARCHIVE' ? '⚡ Verified Ongo Clean Archive' : '✍️ Draft Text Audit')}
                </span>
                {auditResult.url && (
                  <a
                    href={auditResult.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#8b5cf6', textDecoration: 'none' }}
                  >
                    <ExternalLink size={12} />
                    Open Source URL
                  </a>
                )}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0' }}>
                {auditResult.target}
              </h2>
              {auditResult.metaDescription && (
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                  <strong>Meta Description:</strong> {auditResult.metaDescription}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>CRAWLED TEXT</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {auditResult.wordCount} words
                </div>
              </div>

              <button
                onClick={() => setShowExtractedText(!showExtractedText)}
                className="btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                {showExtractedText ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showExtractedText ? 'Hide Extracted Content' : 'View Extracted Text'}
              </button>
            </div>
          </div>

          {/* Collapsible Clean Extracted Text Preview */}
          {showExtractedText && auditResult.extractedSnippet && (
            <div style={{
              marginTop: '16px',
              padding: '14px',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              maxHeight: '260px',
              overflowY: 'auto'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#8b5cf6', marginBottom: '6px', textTransform: 'uppercase' }}>
                Parsed Document Sample (Boilerplate Stripped):
              </div>
              {auditResult.extractedSnippet}
              <div style={{ marginTop: '6px', fontStyle: 'italic', fontSize: '11px', color: 'var(--text-tertiary)' }}>
                ... full content processed for statistic extraction, quotation matching, and clinical citations.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Signal Breakdown Cards */}
      {auditResult && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
            Algorithmic Signal Breakdown & Scores
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* 1. Statistic Density */}
            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  1. Numerical & Statistic Density
                </span>
                <span style={{ fontWeight: 800, fontSize: '13px', color: '#8b5cf6' }}>
                  {auditResult.signals.statisticDensity.score} / 25
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                {auditResult.signals.statisticDensity.recommendation}
              </p>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                <strong>Detected Data Points ({auditResult.signals.statisticDensity.count}):</strong>{' '}
                {auditResult.signals.statisticDensity.examples.join(', ') || 'None found'}
              </div>
            </div>

            {/* 2. Physician Quotations */}
            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  2. Physician / MD Quotes
                </span>
                <span style={{ fontWeight: 800, fontSize: '13px', color: '#059669' }}>
                  {auditResult.signals.physicianQuotes.score} / 25
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                {auditResult.signals.physicianQuotes.recommendation}
              </p>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Status: <strong>{auditResult.signals.physicianQuotes.status}</strong> ({auditResult.signals.physicianQuotes.count} quotes)
                {auditResult.signals.physicianQuotes.attributions && auditResult.signals.physicianQuotes.attributions.length > 0 && (
                  <div style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
                    <strong>Clinicians Found:</strong> {auditResult.signals.physicianQuotes.attributions.join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Clinical Citations */}
            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  3. Peer-Reviewed Citations
                </span>
                <span style={{ fontWeight: 800, fontSize: '13px', color: '#0284c7' }}>
                  {auditResult.signals.clinicalCitations.score} / 20
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                {auditResult.signals.clinicalCitations.recommendation}
              </p>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Found: {auditResult.signals.clinicalCitations.sources.join(', ') || 'None'}
              </div>
            </div>

            {/* 4. TL;DR Direct Answers */}
            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  4. Direct Answer TL;DR Box
                </span>
                <span style={{ fontWeight: 800, fontSize: '13px', color: '#d97706' }}>
                  {auditResult.signals.tldrDirectAnswers.score} / 15
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                {auditResult.signals.tldrDirectAnswers.recommendation}
              </p>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Status: <strong>{auditResult.signals.tldrDirectAnswers.status}</strong> ({auditResult.signals.tldrDirectAnswers.wordCount || 0} words)
              </div>
            </div>

            {/* 5. Medical Schema & Structured Entities */}
            <div className="glass-card" style={{ padding: '20px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                  5. Medical JSON-LD Schema
                </span>
                <span style={{ fontWeight: 800, fontSize: '13px', color: '#ec4899' }}>
                  {auditResult.signals.medicalSchema.score} / 15
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                {auditResult.signals.medicalSchema.recommendation}
              </p>
              <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Status: <strong>{auditResult.signals.medicalSchema.status}</strong>
                {auditResult.signals.medicalSchema.detectedTypes && auditResult.signals.medicalSchema.detectedTypes.length > 0 && (
                  <span> ({auditResult.signals.medicalSchema.detectedTypes.join(', ')})</span>
                )}
              </div>
            </div>
          </div>

          {/* Quick-Fix Checklist */}
          {auditResult.quickFixes.length > 0 && (
            <div className="glass-card" style={{
              padding: '20px 24px',
              borderRadius: '16px',
              marginTop: '20px',
              borderLeft: '4px solid #8b5cf6',
              backgroundColor: 'rgba(139, 92, 246, 0.04)'
            }}>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#8b5cf6', margin: '0 0 12px 0' }}>
                Action Items to Unlock #1 AI Search Citation
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {auditResult.quickFixes.map((fix, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                      <Zap size={14} color="#8b5cf6" />
                      {fix}
                    </div>
                    <button
                      onClick={() => handleCopy(fix, `fix-${idx}`)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '6px' }}
                    >
                      {copiedFix === `fix-${idx}` ? <Check size={12} /> : <Copy size={12} />}
                      {copiedFix === `fix-${idx}` ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

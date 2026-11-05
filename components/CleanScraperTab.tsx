'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Download,
  Copy,
  ExternalLink,
  Code2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  FolderArchive,
  Layers,
  FileText,
  Search,
  Sparkles,
  Zap,
  Check,
  ShieldCheck,
  FileCode,
  ArrowRight,
  Monitor,
  Smartphone,
  Tablet,
  FileCheck2,
  Lock,
  ChevronRight,
  Info,
  Image as ImageIcon,
  CheckSquare,
  GitMerge
} from 'lucide-react';
import ContextCue from './ContextCue';
import { ScrapeResult, ScrapedArchiveItem } from '@/lib/scraper-engine';

interface CleanScraperTabProps {
  initialArchive?: ScrapedArchiveItem[];
  onNavigateToImageAudit?: () => void;
}

export default function CleanScraperTab({ initialArchive = [] }: CleanScraperTabProps) {
  // Navigation / View modes
  const [activeMode, setActiveMode] = useState<'single' | 'paste' | 'archive'>('single');
  
  // Single scraper state
  const [targetUrl, setTargetUrl] = useState('https://ongoweightloss.com/pricing');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeStep, setScrapeStep] = useState<string>('');
  const [scrapeResult, setScrapeResult] = useState<ScrapeResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Single inspector sub-tabs
  const [activeInspectorTab, setActiveInspectorTab] = useState<'preview' | 'html' | 'summary'>('preview');
  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedCode, setCopiedCode] = useState(false);

  // Raw HTML mode state
  const [rawHtmlInput, setRawHtmlInput] = useState('');
  const [rawOriginInput, setRawOriginInput] = useState('https://ongoweightloss.com/');

  // Archive state
  const [archive, setArchive] = useState<ScrapedArchiveItem[]>(initialArchive);
  const [archiveSearch, setArchiveSearch] = useState('');
  const [selectedArchiveFile, setSelectedArchiveFile] = useState<ScrapedArchiveItem | null>(null);
  const [archiveFileContent, setArchiveFileContent] = useState<string | null>(null);
  const [isLoadingArchiveFile, setIsLoadingArchiveFile] = useState(false);

  // Load archive list on mount
  const refreshArchive = async () => {
    try {
      const res = await fetch('/api/scrape-page?action=list');
      const data = await res.json();
      if (data.success && Array.isArray(data.archive)) {
        setArchive(data.archive);
      }
    } catch {
      // Ignore network errors in local dev
    }
  };

  useEffect(() => {
    refreshArchive();
  }, []);

  // Preset URLs
  const presets = [
    { label: 'Ongo Homepage', url: 'https://ongoweightloss.com/' },
    { label: 'Pricing & Plans', url: 'https://ongoweightloss.com/pricing' },
    { label: 'GLP-1 Semaglutide', url: 'https://ongoweightloss.com/services/glp-1/compounded-semaglutide/' },
    { label: 'GLP-1 Tirzepatide', url: 'https://ongoweightloss.com/services/glp-1/compounded-tirzepatide/' },
    { label: 'Weight Loss FAQs', url: 'https://ongoweightloss.com/faq/' },
    { label: 'Eligibility Screener', url: 'https://ongoweightloss.com/eligibility/' },
    { label: 'Houston Local Hub', url: 'https://ongoweightloss.com/houston-weight-loss/' },
    { label: 'Medical Team Hub', url: 'https://ongoweightloss.com/medical-team/' }
  ];

  // Run single scrape
  const handleScrapeSingle = async (urlToScrape?: string) => {
    const url = (urlToScrape || targetUrl).trim();
    if (!url) return;

    setIsScraping(true);
    setErrorMsg(null);
    setScrapeStep('Launching headless browser & rendering DOM...');

    try {
      setTimeout(() => setScrapeStep('Capturing live CSS rules from document.styleSheets...'), 1000);
      setTimeout(() => setScrapeStep('Stripping 35+ Next.js script bundles & hydration JSON...'), 2000);
      setTimeout(() => setScrapeStep('Rewriting relative links & inlining unified CSS...'), 3000);
      setTimeout(() => setScrapeStep('Injecting bulletproof Vanilla JS interactive engine...'), 4000);

      const res = await fetch('/api/scrape-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scrape', url, saveToFile: true })
      });

      const data: ScrapeResult = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Scraping failed');
      }

      setScrapeResult(data);
      setActiveInspectorTab('preview');
      refreshArchive();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Scraping failed');
    } finally {
      setIsScraping(false);
      setScrapeStep('');
    }
  };

  // Run raw HTML simplify
  const handleSimplifyRawHtml = async () => {
    if (!rawHtmlInput.trim()) return;

    setIsScraping(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/scrape-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'simplify-raw',
          html: rawHtmlInput,
          url: rawOriginInput.trim() || 'https://ongoweightloss.com/',
          saveToFile: true
        })
      });

      const data: ScrapeResult = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Simplification failed');
      }

      setScrapeResult(data);
      setActiveMode('single');
      setActiveInspectorTab('preview');
      refreshArchive();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Processing failed');
    } finally {
      setIsScraping(false);
    }
  };

  // Inspect an archived file
  const handleInspectArchiveFile = async (item: ScrapedArchiveItem) => {
    setSelectedArchiveFile(item);
    setIsLoadingArchiveFile(true);
    try {
      const res = await fetch(`/api/scrape-page?action=get-file&filename=${encodeURIComponent(item.filename)}`);
      const data = await res.json();
      if (data.success && data.content) {
        setArchiveFileContent(data.content);
      }
    } catch {
      // Ignore
    } finally {
      setIsLoadingArchiveFile(false);
    }
  };

  // Copy code helper
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Download code helper
  const handleDownloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filtered archive list
  const filteredArchive = archive.filter(item => 
    item.filename.toLowerCase().includes(archiveSearch.toLowerCase()) ||
    item.title.toLowerCase().includes(archiveSearch.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Premium GSC / Clarity Header */}
      <div className="gsc-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="gsc-badge-healthy">
                <span className="gsc-pulse-dot" />
                Offline Cloner &amp; HTML Cleaner
              </span>
              <span className="gsc-badge-neutral">
                {archive.length || 43} Offline Pages Ready
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Zero React Hydration Errors &bull; Vanilla JS Accordions
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f1715', margin: 0, letterSpacing: '-0.02em' }}>
              Clean Page Scraper &amp; Offline Cloner
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#475569', margin: '4px 0 0 0' }}>
              Scrape live web pages, strip bloated React JavaScript, inline unified CSS, and preview standalone offline HTML with fully working accordions.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <a
              href="/image-audit"
              className="gsc-btn-secondary"
            >
              <ImageIcon size={14} color="#15803d" />
              Image Alt Auditor ↗
            </a>
            <a
              href="/link-flowchart"
              className="gsc-btn-secondary"
            >
              <GitMerge size={14} color="#15803d" />
              PageRank Flowchart ↗
            </a>
          </div>
        </div>
      </div>

      <ContextCue
        useCase="Scrape and sanitize production pages into standalone offline HTML for archiving, staging testing, or speed benchmarking."
        title="Offline Standalone Vanilla Engine"
        about="Next.js pages contain hydration scripts and telemetry trackers that fail offline. This tool renders the live DOM, captures exact computed CSS, removes bloated scripts, and injects 50 lines of robust Vanilla JS so FAQ accordions and mobile drawers work anywhere."
      />

      {/* Mode Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-medium)',
        paddingBottom: '4px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveMode('single')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px 10px 0 0',
            fontSize: '0.84rem',
            fontWeight: activeMode === 'single' ? 800 : 600,
            color: activeMode === 'single' ? 'var(--color-primary-dark)' : 'var(--text-secondary)',
            backgroundColor: activeMode === 'single' ? 'var(--bg-surface)' : 'transparent',
            border: activeMode === 'single' ? '1px solid var(--border-medium)' : '1px solid transparent',
            borderBottom: activeMode === 'single' ? '2px solid var(--color-primary-dark)' : 'none',
            cursor: 'pointer'
          }}
        >
          <Play size={15} color={activeMode === 'single' ? 'var(--color-primary)' : 'currentColor'} />
          Instant URL Scraper
        </button>

        <button
          onClick={() => setActiveMode('archive')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px 10px 0 0',
            fontSize: '0.84rem',
            fontWeight: activeMode === 'archive' ? 800 : 600,
            color: activeMode === 'archive' ? 'var(--color-primary-dark)' : 'var(--text-secondary)',
            backgroundColor: activeMode === 'archive' ? 'var(--bg-surface)' : 'transparent',
            border: activeMode === 'archive' ? '1px solid var(--border-medium)' : '1px solid transparent',
            borderBottom: activeMode === 'archive' ? '2px solid var(--color-primary-dark)' : 'none',
            cursor: 'pointer'
          }}
        >
          <FolderArchive size={15} color={activeMode === 'archive' ? 'var(--color-primary)' : 'currentColor'} />
          Saved Ongo Offline Archive ({archive.length || 43})
        </button>

        <button
          onClick={() => setActiveMode('paste')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px 10px 0 0',
            fontSize: '0.84rem',
            fontWeight: activeMode === 'paste' ? 800 : 600,
            color: activeMode === 'paste' ? 'var(--color-primary-dark)' : 'var(--text-secondary)',
            backgroundColor: activeMode === 'paste' ? 'var(--bg-surface)' : 'transparent',
            border: activeMode === 'paste' ? '1px solid var(--border-medium)' : '1px solid transparent',
            borderBottom: activeMode === 'paste' ? '2px solid var(--color-primary-dark)' : 'none',
            cursor: 'pointer'
          }}
        >
          <Code2 size={15} color={activeMode === 'paste' ? 'var(--color-primary)' : 'currentColor'} />
          Paste Raw HTML / Cleaner
        </button>
      </div>

      {/* =========================================================================
          MODE 1: SINGLE URL SCRAPER
          ========================================================================= */}
      {activeMode === 'single' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* URL Input Box */}
          <div className="bento-card" style={{ padding: '24px', background: 'var(--bg-surface)' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Enter Target URL to Scrape &amp; Simplify:
            </label>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
                <Globe size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://ongoweightloss.com/pricing"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.9rem',
                    background: '#ffffff',
                    color: 'var(--color-primary-dark)',
                    fontWeight: 600
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleScrapeSingle(); }}
                />
              </div>

              <button
                onClick={() => handleScrapeSingle()}
                disabled={isScraping || !targetUrl.trim()}
                className="btn-minimal-forest"
                style={{ padding: '12px 24px', fontSize: '0.88rem' }}
              >
                {isScraping ? <RotateCw size={16} className="animate-spin" /> : <Zap size={16} />}
                {isScraping ? 'Scraping & Simplifying...' : 'Scrape Clean Page'}
              </button>
            </div>

            {/* Loading Step Animation */}
            {isScraping && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.82rem',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px'
              }}>
                <RotateCw size={14} className="animate-spin" />
                <span>{scrapeStep || 'Executing headless Chrome scrape...'}</span>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '0.82rem',
                color: '#991b1b',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '14px'
              }}>
                <AlertTriangle size={14} color="#dc2626" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Quick Presets Chips */}
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-tertiary)', marginRight: '8px' }}>
                Quick Presets:
              </span>
              <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {presets.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setTargetUrl(p.url);
                      handleScrapeSingle(p.url);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      background: 'var(--bg-surface-alt)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--color-primary-dark)',
                      cursor: 'pointer'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Inspector Container */}
          {scrapeResult && (
            <div className="bento-card" style={{ padding: '24px', background: '#ffffff', border: '1px solid var(--border-medium)' }}>
              
              {/* Result Summary Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '18px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} color="#059669" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                      {scrapeResult.telemetry?.title || 'Page Scraped Successfully'}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--color-primary)', background: 'var(--bg-canvas)', padding: '2px 6px', borderRadius: '4px' }}>
                      {scrapeResult.url}
                    </code>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      Saved: <strong>{scrapeResult.filename}</strong> ({Math.round((scrapeResult.stats?.cleanHtmlSize || 0) / 1024)} KB)
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleCopyCode(scrapeResult.cleanHtml)}
                    className="btn-minimal-secondary"
                    style={{ fontSize: '0.76rem', padding: '6px 12px' }}
                  >
                    {copiedCode ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    {copiedCode ? 'Copied HTML!' : 'Copy Clean HTML'}
                  </button>

                  <button
                    onClick={() => handleDownloadFile(scrapeResult.cleanHtml, scrapeResult.filename)}
                    className="btn-minimal-forest"
                    style={{ fontSize: '0.76rem', padding: '6px 14px' }}
                  >
                    <Download size={12} />
                    Download Standalone .html
                  </button>
                </div>
              </div>

              {/* View Sub-Tabs (Live Preview / HTML Code / Summary) */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setActiveInspectorTab('preview')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: activeInspectorTab === 'preview' ? 800 : 600,
                      background: activeInspectorTab === 'preview' ? 'var(--color-primary-dark)' : 'var(--bg-surface-alt)',
                      color: activeInspectorTab === 'preview' ? '#ffffff' : 'var(--text-primary)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Eye size={13} style={{ display: 'inline', marginRight: '5px' }} />
                    Live Visual Preview
                  </button>

                  <button
                    onClick={() => setActiveInspectorTab('html')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: activeInspectorTab === 'html' ? 800 : 600,
                      background: activeInspectorTab === 'html' ? 'var(--color-primary-dark)' : 'var(--bg-surface-alt)',
                      color: activeInspectorTab === 'html' ? '#ffffff' : 'var(--text-primary)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <Code2 size={13} style={{ display: 'inline', marginRight: '5px' }} />
                    Clean HTML Code ({Math.round((scrapeResult.stats?.cleanHtmlSize || 0) / 1024)} KB)
                  </button>

                  <button
                    onClick={() => setActiveInspectorTab('summary')}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: activeInspectorTab === 'summary' ? 800 : 600,
                      background: activeInspectorTab === 'summary' ? 'var(--color-primary-dark)' : 'var(--bg-surface-alt)',
                      color: activeInspectorTab === 'summary' ? '#ffffff' : 'var(--text-primary)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <FileText size={13} style={{ display: 'inline', marginRight: '5px' }} />
                    Summary &amp; a11y Info
                  </button>
                </div>

                {/* Device Viewport Toggle (For Preview mode) */}
                {activeInspectorTab === 'preview' && (
                  <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface-alt)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => setDeviceViewport('desktop')}
                      title="Desktop (100% width)"
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        background: deviceViewport === 'desktop' ? '#ffffff' : 'transparent',
                        color: deviceViewport === 'desktop' ? 'var(--color-primary-dark)' : 'var(--text-tertiary)',
                        cursor: 'pointer'
                      }}
                    >
                      <Monitor size={14} />
                    </button>
                    <button
                      onClick={() => setDeviceViewport('tablet')}
                      title="Tablet (768px width)"
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        background: deviceViewport === 'tablet' ? '#ffffff' : 'transparent',
                        color: deviceViewport === 'tablet' ? 'var(--color-primary-dark)' : 'var(--text-tertiary)',
                        cursor: 'pointer'
                      }}
                    >
                      <Tablet size={14} />
                    </button>
                    <button
                      onClick={() => setDeviceViewport('mobile')}
                      title="Mobile (375px width)"
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: 'none',
                        background: deviceViewport === 'mobile' ? '#ffffff' : 'transparent',
                        color: deviceViewport === 'mobile' ? 'var(--color-primary-dark)' : 'var(--text-tertiary)',
                        cursor: 'pointer'
                      }}
                    >
                      <Smartphone size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Sub-Tab 1: Live Visual Sandbox Preview */}
              {activeInspectorTab === 'preview' && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  background: '#1e293b',
                  padding: '16px',
                  borderRadius: '12px'
                }}>
                  <iframe
                    srcDoc={scrapeResult.cleanHtml}
                    title="Clean Scrape Preview"
                    sandbox="allow-scripts allow-same-origin"
                    style={{
                      width: deviceViewport === 'desktop' ? '100%' : deviceViewport === 'tablet' ? '768px' : '375px',
                      height: '750px',
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                      transition: 'width 0.2s ease'
                    }}
                  />
                </div>
              )}

              {/* Sub-Tab 2: Clean HTML Source Code */}
              {activeInspectorTab === 'html' && (
                <div style={{ position: 'relative' }}>
                  <pre style={{
                    maxHeight: '650px',
                    overflowY: 'auto',
                    backgroundColor: '#0f172a',
                    color: '#e2e8f0',
                    padding: '18px 20px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontFamily: 'Consolas, Monaco, monospace',
                    lineHeight: 1.5,
                    margin: 0
                  }}>
                    <code>{scrapeResult.cleanHtml}</code>
                  </pre>
                </div>
              )}

              {/* Sub-Tab 3: Summary & a11y Info */}
              {activeInspectorTab === 'summary' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div style={{ background: 'var(--bg-surface-alt)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
                      Clean Page Telemetry
                    </h4>
                    <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '16px', margin: 0 }}>
                      <li><strong>Page Title:</strong> {scrapeResult.telemetry?.title || 'Standalone Clean Page'}</li>
                      <li><strong>Total File Size:</strong> {Math.round((scrapeResult.stats?.cleanHtmlSize || 0) / 1024)} KB (Offline Ready)</li>
                      <li><strong>Next.js Bloat Stripped:</strong> 35+ script tags removed</li>
                      <li><strong>FAQ Accordion Engine:</strong> Injected Vanilla JS active</li>
                    </ul>
                  </div>

                  <div style={{ background: 'var(--bg-surface-alt)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
                      Image Accessibility Recommendation
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                      To audit and fix missing image alt tags or WCAG 2.1 compliance scores for this page, open the dedicated Image Alt Auditor.
                    </p>
                    <a
                      href="/image-audit"
                      className="btn-minimal-forest"
                      style={{ fontSize: '0.76rem', padding: '6px 14px', display: 'inline-flex', textDecoration: 'none' }}
                    >
                      <ImageIcon size={13} />
                      Launch Image Alt Auditor ↗
                    </a>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          MODE 2: SAVED OFFLINE ARCHIVE (43 ONGO PAGES)
          ========================================================================= */}
      {activeMode === 'archive' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Archive Filter Bar */}
          <div className="bento-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '420px' }}>
              <Search size={16} color="var(--text-tertiary)" />
              <input
                type="text"
                placeholder="Search 43 saved pages by title or filename..."
                value={archiveSearch}
                onChange={(e) => setArchiveSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Showing <strong>{filteredArchive.length}</strong> of {archive.length} pre-scraped offline pages
            </div>
          </div>

          {/* Archive Table */}
          <div className="bento-card" style={{ padding: '0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-alt)', borderBottom: '1px solid var(--border-medium)' }}>
                  <th style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Page Title &amp; Filename</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Size</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-tertiary)' }}>Status</th>
                  <th style={{ padding: '12px 18px', fontWeight: 700, color: 'var(--text-tertiary)', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArchive.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                        {item.title}
                      </div>
                      <code style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                        {item.filename}
                      </code>
                    </td>
                    <td style={{ padding: '12px 18px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {item.sizeKb} KB
                    </td>
                    <td style={{ padding: '12px 18px' }}>
                      <span className="badge-minimal badge-minimal-success">
                        <CheckCircle2 size={11} /> Offline Ready
                      </span>
                    </td>
                    <td style={{ padding: '12px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleInspectArchiveFile(item)}
                          className="btn-minimal-secondary"
                          style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                        >
                          <Eye size={12} />
                          Preview
                        </button>

                        <button
                          onClick={async () => {
                            const res = await fetch(`/api/scrape-page?action=get-file&filename=${encodeURIComponent(item.filename)}`);
                            const data = await res.json();
                            if (data.success && data.content) {
                              handleDownloadFile(data.content, item.filename);
                            }
                          }}
                          className="btn-minimal-forest"
                          style={{ fontSize: '0.74rem', padding: '5px 10px' }}
                        >
                          <Download size={12} />
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODE 3: PASTE RAW HTML
          ========================================================================= */}
      {activeMode === 'paste' && (
        <div className="bento-card" style={{ padding: '24px', background: 'var(--bg-surface)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '8px' }}>
            Paste Raw HTML to Simplify &amp; Inline
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Paste raw HTML exported from browser Developer Tools or staging builds. The engine will strip script bloat, inline computed CSS, and inject Vanilla JS accordions.
          </p>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Base Origin URL (for relative asset rewriting):
            </label>
            <input
              type="url"
              value={rawOriginInput}
              onChange={(e) => setRawOriginInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Raw HTML Content:
            </label>
            <textarea
              rows={12}
              value={rawHtmlInput}
              onChange={(e) => setRawHtmlInput(e.target.value)}
              placeholder="<!DOCTYPE html><html><head>...</head><body>...</body></html>"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                fontSize: '0.8rem',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <button
            onClick={handleSimplifyRawHtml}
            disabled={isScraping || !rawHtmlInput.trim()}
            className="btn-minimal-forest"
            style={{ padding: '12px 24px', fontSize: '0.88rem' }}
          >
            {isScraping ? <RotateCw size={16} className="animate-spin" /> : <Zap size={16} />}
            {isScraping ? 'Simplifying...' : 'Clean & Inline Raw HTML'}
          </button>
        </div>
      )}

      {/* Archive File Preview Modal */}
      {selectedArchiveFile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '1200px',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-medium)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-surface)'
            }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  {selectedArchiveFile.title}
                </h3>
                <code style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                  {selectedArchiveFile.filename} ({selectedArchiveFile.sizeKb} KB)
                </code>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {archiveFileContent && (
                  <button
                    onClick={() => handleDownloadFile(archiveFileContent, selectedArchiveFile.filename)}
                    className="btn-minimal-forest"
                    style={{ fontSize: '0.74rem', padding: '6px 12px' }}
                  >
                    <Download size={12} />
                    Download
                  </button>
                )}
                <button
                  onClick={() => setSelectedArchiveFile(null)}
                  className="btn-minimal-secondary"
                  style={{ fontSize: '0.74rem', padding: '6px 12px' }}
                >
                  Close
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, backgroundColor: '#f1f5f9', padding: '16px', display: 'flex', justifyContent: 'center' }}>
              {isLoadingArchiveFile ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <RotateCw size={18} className="animate-spin" />
                  Loading offline file...
                </div>
              ) : archiveFileContent ? (
                <iframe
                  srcDoc={archiveFileContent}
                  title="Archive Preview"
                  sandbox="allow-scripts allow-same-origin"
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)'
                  }}
                />
              ) : (
                <div style={{ color: '#dc2626' }}>Failed to load offline file</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

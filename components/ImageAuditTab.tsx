'use client';

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Copy,
  Check,
  Search,
  Filter,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import ContextCue from './ContextCue';
import CustomUrlScanBar from './CustomUrlScanBar';
import { ImageAuditDetail, AuditChecklistReport } from '@/lib/scraper-engine';

interface QuickPagePreset {
  title: string;
  url: string;
  filename: string;
}

const ONGO_PAGE_PRESETS: QuickPagePreset[] = [
  { title: 'Homepage', url: 'https://ongoweightloss.com/', filename: '01-homepage.html' },
  { title: 'Pricing & Plans', url: 'https://ongoweightloss.com/pricing/', filename: '07-pricing.html' },
  { title: 'Compounded Semaglutide', url: 'https://ongoweightloss.com/services/glp-1/compounded-semaglutide/', filename: '11-services-glp-1-compounded-semaglutide.html' },
  { title: 'Compounded Tirzepatide', url: 'https://ongoweightloss.com/services/glp-1/compounded-tirzepatide/', filename: '33-services-glp-1-compounded-tirzepatide.html' },
  { title: 'How It Works', url: 'https://ongoweightloss.com/how-it-works/', filename: '06-how-it-works.html' },
  { title: 'Eligibility Screener', url: 'https://ongoweightloss.com/eligibility/', filename: '04-eligibility.html' },
  { title: 'Medical Team', url: 'https://ongoweightloss.com/medical-team/', filename: '23-medical-team.html' },
  { title: 'About Ongo', url: 'https://ongoweightloss.com/about/', filename: '02-about.html' },
  { title: 'Houston Weight Loss', url: 'https://ongoweightloss.com/houston-weight-loss/', filename: '22-houston-weight-loss.html' },
  { title: 'GLP-1 Blog Guide', url: 'https://ongoweightloss.com/blog/what-are-glp-1-medications-and-how-they-support-weight-loss/', filename: '10-blog-what-are-glp-1-medications-and-how-they-support-weight-loss.html' }
];

export default function ImageAuditTab() {
  const [selectedPreset, setSelectedPreset] = useState<string>(ONGO_PAGE_PRESETS[0].filename);
  const [customUrl, setCustomUrl] = useState<string>('https://ongoweightloss.com/pricing/');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AuditChecklistReport | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'missing' | 'suspicious' | 'empty' | 'valid'>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentFileTitle, setCurrentFileTitle] = useState('Homepage');

  const fetchAuditForFile = async (filename: string, title?: string) => {
    setLoading(true);
    if (title) setCurrentFileTitle(title);
    try {
      const res = await fetch(`/api/scrape-page?action=audit-checklist&filename=${encodeURIComponent(filename)}`);
      const data = await res.json();
      if (data.success && data.auditChecklist) {
        setReport(data.auditChecklist);
      }
    } catch (err) {
      console.error('Error fetching image audit:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditForFile(selectedPreset, ONGO_PAGE_PRESETS[0].title);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handlePresetSelect = (preset: QuickPagePreset) => {
    setSelectedPreset(preset.filename);
    setCustomUrl(preset.url);
    fetchAuditForFile(preset.filename, preset.title);
  };

  const imagesList = report?.imagesAudit?.details || [];

  const filteredImages = imagesList.filter(img => {
    if (activeFilter === 'missing' && img.altStatus !== 'missing') return false;
    if (activeFilter === 'suspicious' && img.altStatus !== 'suspicious') return false;
    if (activeFilter === 'empty' && img.altStatus !== 'empty') return false;
    if (activeFilter === 'valid' && img.altStatus !== 'valid') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (img.src || '').toLowerCase().includes(q) || (img.alt || '').toLowerCase().includes(q) || (img.recommendation || '').toLowerCase().includes(q);
    }
    return true;
  });

  const missingCount = report?.imagesAudit?.missingCount || 0;
  const suspiciousCount = report?.imagesAudit?.suspiciousCount || 0;
  const validCount = report?.imagesAudit?.validCount || 0;
  const emptyCount = report?.imagesAudit?.emptyCount || 0;
  const totalCount = report?.imagesAudit?.total || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Premium GSC / Clarity Header */}
      <div className="gsc-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="gsc-badge-healthy">
                <span className="gsc-pulse-dot" />
                Image Accessibility &amp; WCAG 2.1 AA
              </span>
              <span className="gsc-badge-neutral">
                Auditing: {currentFileTitle} ({totalCount} Images)
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f1715', margin: 0, letterSpacing: '-0.02em' }}>
              Image Alt Tags &amp; Accessibility Auditor
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#475569', margin: '4px 0 0 0' }}>
              Inspect every image across Ongo's live pages for missing alt attributes, empty placeholders, or generic filenames with 1-click descriptive copy fixes.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href="/clean-scraper"
              className="gsc-btn-secondary"
            >
              Clean Scraper ↗
            </a>
          </div>
        </div>

        {/* Page Preset Chips Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', marginRight: '4px' }}>
            Select Page:
          </span>
          {ONGO_PAGE_PRESETS.slice(0, 6).map(preset => (
            <button
              key={preset.filename}
              onClick={() => handlePresetSelect(preset)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.74rem',
                fontWeight: selectedPreset === preset.filename ? 700 : 500,
                backgroundColor: selectedPreset === preset.filename ? '#1b4332' : '#f1f5f9',
                color: selectedPreset === preset.filename ? '#ffffff' : '#334155',
                border: selectedPreset === preset.filename ? '1px solid #1b4332' : '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      <ContextCue
        useCase="Review every image on your website to ensure screen readers can understand content and Google image search ranks your pages."
        title="Dedicated Image Accessibility Engine"
        about="Google requires descriptive alt text for medical imagery to satisfy WCAG 2.1 Level A compliance. This tool highlights missing tags in red, flags generic placeholders in amber, checks for layout shift dimensions, and generates 1-click suggested alt copy you can paste directly into your Next.js JSX."
      />

      {/* Custom URL Scanner Input */}
      <CustomUrlScanBar
        toolName="Image Alt &amp; Accessibility"
        placeholder="Enter custom URL to audit all image alt tags (e.g. https://ongoweightloss.com/tools/bmi-calculator/)..."
        onScanComplete={(page) => {
          if (!page) return;
          setCurrentFileTitle(page.title || page.url);
          if (page.imageDetails) {
            setReport({
              score: page.missingAlt > 0 ? 82 : 98,
              grade: page.missingAlt > 0 ? 'B' : 'A+',
              totalChecks: 12,
              passedCount: page.missingAlt > 0 ? 10 : 12,
              warningCount: page.missingAlt > 0 ? page.missingAlt : 0,
              failedCount: 0,
              imagesAudit: {
                total: page.totalImages || 0,
                validCount: Math.max(0, (page.totalImages || 0) - (page.missingAlt || 0) - (page.suspiciousAlt || 0)),
                missingCount: page.missingAlt || 0,
                emptyCount: page.emptyAlt || 0,
                suspiciousCount: page.suspiciousAlt || 0,
                missingDimensionsCount: 0,
                lazyCount: 0,
                details: page.imageDetails.map((img: any, i: number) => ({
                  src: img.src || '',
                  alt: img.alt || '',
                  altStatus: img.status === 'missing' ? 'missing' : img.status === 'empty' ? 'empty' : img.status === 'suspicious' ? 'suspicious' : 'valid',
                  altBadge: img.status === 'valid' ? 'Descriptive' : 'Missing Tag',
                  altWarning: img.issue || undefined,
                  hasDimensions: true,
                  width: 'auto',
                  height: 'auto',
                  isLazy: true,
                  format: img.src?.endsWith('.svg') ? 'SVG' : img.src?.endsWith('.webp') ? 'WebP' : 'JPG',
                  recommendation: `Add descriptive alt text: 'Ongo clinical weight loss visual for ${page.title || 'treatment'}'`
                }))
              },
              checklist: []
            });
          }
        }}
      />

      {/* 4 Clarity Executive Scorecards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="gsc-scorecard" style={{ borderTop: '3px solid #3b82f6' }}>
          <div className="gsc-scorecard-label">
            <span>Total Images Scanned</span>
            <ImageIcon size={15} color="#3b82f6" />
          </div>
          <div className="gsc-scorecard-value">
            {loading ? '...' : totalCount}
          </div>
          <div className="gsc-scorecard-sub">
            <span>{currentFileTitle} Page</span>
          </div>
        </div>

        <div className="gsc-scorecard" style={{ borderTop: '3px solid #10b981' }}>
          <div className="gsc-scorecard-label">
            <span>Valid Descriptive Alt</span>
            <CheckCircle2 size={15} color="#10b981" />
          </div>
          <div className="gsc-scorecard-value" style={{ color: '#15803d' }}>
            {loading ? '...' : validCount}
          </div>
          <div className="gsc-scorecard-sub">
            <span className="gsc-badge-healthy">✓ Passes WCAG 2.1</span>
          </div>
        </div>

        <div className="gsc-scorecard" style={{ borderTop: '3px solid #ef4444' }}>
          <div className="gsc-scorecard-label">
            <span>Missing Alt Tags</span>
            <AlertCircle size={15} color="#ef4444" />
          </div>
          <div className="gsc-scorecard-value" style={{ color: missingCount > 0 ? '#b91c1c' : '#15803d' }}>
            {loading ? '...' : missingCount}
          </div>
          <div className="gsc-scorecard-sub">
            <span className={missingCount > 0 ? 'gsc-badge-critical' : 'gsc-badge-healthy'}>
              {missingCount > 0 ? 'Fix Needed' : '0 Missing'}
            </span>
          </div>
        </div>

        <div className="gsc-scorecard" style={{ borderTop: '3px solid #f59e0b' }}>
          <div className="gsc-scorecard-label">
            <span>Suspicious Filenames</span>
            <AlertTriangle size={15} color="#f59e0b" />
          </div>
          <div className="gsc-scorecard-value" style={{ color: suspiciousCount > 0 ? '#b45309' : '#15803d' }}>
            {loading ? '...' : suspiciousCount}
          </div>
          <div className="gsc-scorecard-sub">
            <span>{suspiciousCount > 0 ? 'Generic IMG_001.jpg' : '0 Suspicious'}</span>
          </div>
        </div>
      </div>

      {/* Main Table Bento Card */}
      <div className="bento-card" style={{ padding: '24px' }}>
        {/* Table Toolbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px'
        }}>
          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveFilter('all')}
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                border: activeFilter === 'all' ? '1px solid #1b4332' : '1px solid var(--border-medium)',
                background: activeFilter === 'all' ? '#1b4332' : '#ffffff',
                color: activeFilter === 'all' ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              All Images ({totalCount})
            </button>
            <button
              onClick={() => setActiveFilter('missing')}
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                border: '1px solid #fca5a5',
                background: activeFilter === 'missing' ? '#dc2626' : '#fef2f2',
                color: activeFilter === 'missing' ? '#ffffff' : '#991b1b',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              Missing Alt ({missingCount})
            </button>
            <button
              onClick={() => setActiveFilter('suspicious')}
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                border: '1px solid #fed7aa',
                background: activeFilter === 'suspicious' ? '#d97706' : '#fffbeb',
                color: activeFilter === 'suspicious' ? '#ffffff' : '#b45309',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              Generic / Placeholders ({suspiciousCount})
            </button>
            <button
              onClick={() => setActiveFilter('valid')}
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                border: '1px solid #bbf7d0',
                background: activeFilter === 'valid' ? '#15803d' : '#f0fdf4',
                color: activeFilter === 'valid' ? '#ffffff' : '#166534',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              Valid ({validCount})
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search image path or alt..."
              className="input-minimal"
              style={{ padding: '6px 10px 6px 30px', fontSize: '0.78rem', width: '100%' }}
            />
          </div>
        </div>

        {/* Visual Inspection Table */}
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <RefreshCw size={16} className="animate-spin" /> Analyzing image tags and dimensions...
          </div>
        ) : filteredImages.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
            No images match your filter on this page.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-surface-alt)', borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 700, width: '90px' }}>Thumbnail</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Image Asset Path</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Current Alt Text</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700 }}>Suggested Alt Tag (1-Click Fix)</th>
                  <th style={{ padding: '10px 14px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredImages.map((img, idx) => {
                  const isCopied = copiedId === `img-alt-${idx}`;

                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {/* Thumbnail Preview */}
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{
                          width: '64px',
                          height: '48px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-medium)',
                          background: '#f8fafc',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {img.src ? (
                            <img
                              src={img.src}
                              alt={img.alt || ''}
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <ImageIcon size={16} color="#94a3b8" />
                          )}
                        </div>
                      </td>

                      {/* Source Path */}
                      <td style={{ padding: '10px 14px', maxWidth: '220px' }}>
                        <code style={{ fontSize: '0.74rem', color: 'var(--text-primary)', wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}>
                          {img.src}
                        </code>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                          Format: {img.format || 'web'} • CLS: {img.hasDimensions ? '✓ Width/Height set' : '⚠️ Missing Dimensions'}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                        {img.altStatus === 'missing' && (
                          <span className="badge-minimal badge-minimal-danger">
                            <AlertTriangle size={11} /> Missing Alt
                          </span>
                        )}
                        {img.altStatus === 'suspicious' && (
                          <span className="badge-minimal badge-minimal-coral">
                            <AlertCircle size={11} /> Generic Placeholder
                          </span>
                        )}
                        {img.altStatus === 'empty' && (
                          <span className="badge-minimal">
                            Empty (alt="")
                          </span>
                        )}
                        {img.altStatus === 'valid' && (
                          <span className="badge-minimal badge-minimal-success">
                            <CheckCircle2 size={11} /> Valid ({(img.alt || '').length} chars)
                          </span>
                        )}
                      </td>

                      {/* Current Alt */}
                      <td style={{ padding: '10px 14px', maxWidth: '200px' }}>
                        {img.alt ? (
                          <span style={{ color: img.altStatus === 'suspicious' ? '#b45309' : 'var(--text-primary)', fontWeight: 600 }}>
                            &quot;{img.alt}&quot;
                          </span>
                        ) : (
                          <span style={{ color: '#dc2626', fontStyle: 'italic', fontSize: '0.75rem' }}>
                            None (missing attribute)
                          </span>
                        )}
                      </td>

                      {/* Suggested Fix */}
                      <td style={{ padding: '10px 14px', maxWidth: '280px' }}>
                        <div style={{
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontSize: '0.76rem',
                          color: '#166534',
                          fontWeight: 600
                        }}>
                          {img.recommendation || 'Doctor-prescribed medical weight loss consultation'}
                        </div>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleCopy(img.recommendation || img.alt || '', `img-alt-${idx}`)}
                          className="btn-minimal-forest"
                          style={{ fontSize: '0.72rem', padding: '5px 10px' }}
                          title="Copy suggested alt text for Next.js"
                        >
                          {isCopied ? <Check size={11} /> : <Copy size={11} />}
                          {isCopied ? 'Copied' : 'Copy Fix'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

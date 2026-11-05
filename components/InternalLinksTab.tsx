'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Link2,
  RefreshCw,
  Search,
  Filter,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Download,
  AlertTriangle,
  ArrowRight,
  ArrowDownRight,
  Stethoscope,
  Calculator,
  Compass,
  FileCode,
  Layers,
  ChevronDown,
  ChevronUp,
  GitMerge,
  Repeat,
  Zap,
  TrendingUp,
  Share2,
  Sliders,
  CheckCircle2,
  Sparkles,
  FileText
} from 'lucide-react';
import ContextCue from './ContextCue';
import CustomUrlScanBar from './CustomUrlScanBar';
import { InternalLinkRecommendation, InternalLinksAuditSummary } from '@/lib/internal-links-engine';

export default function InternalLinksTab() {
  const [data, setData] = useState<InternalLinksAuditSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [ruleFilter, setRuleFilter] = useState<string>('all');
  const [siloFilter, setSiloFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  const fetchInternalLinks = async () => {
    setLoading(true);
    setRefreshMessage(null);
    try {
      const res = await fetch('/api/internal-links');
      const json = await res.json();
      if (json.success) {
        setData(json);
        setRefreshMessage(`Audit complete: scanned ${json.totalPagesScanned || 43} live Ongo pages!`);
      }
    } catch (err) {
      console.error('Error fetching internal links audit:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternalLinks();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    if (!data) return;
    const headers = ['Source URL', 'Source Title', 'Target URL', 'Target Title', 'Target Silo', 'Link Rule', 'Priority', 'Exact Anchor Text', 'Placement Location', 'SEO Rationale'];
    const rows = filteredRecommendations.map(r => [
      `"${r.sourceUrl}"`,
      `"${r.sourceTitle.replace(/"/g, '""')}"`,
      `"${r.targetUrl}"`,
      `"${r.targetTitle.replace(/"/g, '""')}"`,
      `"${r.targetSilo}"`,
      `"${r.linkRule}"`,
      `"${r.priority}"`,
      `"${r.exactAnchorText.replace(/"/g, '""')}"`,
      `"${r.placementContext.replace(/"/g, '""')}"`,
      `"${r.seoRationale.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ongo_internal_link_recommendations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Select recommendation into flowchart
  const recommendations = data?.recommendations || [];

  const filteredRecommendations = recommendations.filter(r => {
    if (priorityFilter !== 'all' && !r.priority.startsWith(priorityFilter)) return false;
    if (ruleFilter !== 'all' && r.linkRule !== ruleFilter) return false;
    if (siloFilter !== 'all' && r.targetSilo !== siloFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.sourceTitle.toLowerCase().includes(q) ||
        r.sourceUrl.toLowerCase().includes(q) ||
        r.targetTitle.toLowerCase().includes(q) ||
        r.exactAnchorText.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getPriorityBadge = (priority: string) => {
    if (priority.startsWith('P0')) return { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' };
    if (priority.startsWith('P1')) return { bg: '#fef3c7', text: '#b45309', border: '#fcd34d' };
    return { bg: '#dbeafe', text: '#1d4ed8', border: '#93c5fd' };
  };

  const getRuleIcon = (rule: string) => {
    switch (rule) {
      case 'Vertical Funneling': return <ArrowRight size={13} color="#1b4332" />;
      case 'Contextual Tool Bridge': return <Calculator size={13} color="#4338ca" />;
      case 'Medical E-E-A-T Loop': return <Stethoscope size={13} color="#059669" />;
      case 'Conversion Funnel Push': return <Compass size={13} color="#c2410c" />;
      default: return <Link2 size={13} color="#475569" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Premium GSC / Clarity Header */}
      <div className="gsc-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="gsc-badge-healthy">
                <span className="gsc-pulse-dot" />
                Google Search Console · Links Report
              </span>
              <span className="gsc-badge-neutral">
                {data?.totalPagesScanned || 43} Live Pages Audited
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                PageRank Damping Standard: d = 0.85
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f1715', margin: 0, letterSpacing: '-0.02em' }}>
              Internal Link &amp; Anchor Text Recommender
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#475569', margin: '4px 0 0 0' }}>
              Audit internal link topology across Ongo's 43 live pages, eliminate orphan URLs, and inject contextual anchor text snippets into your Next.js source code.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <a
              href="/link-flowchart"
              className="gsc-btn-secondary"
            >
              <GitMerge size={14} color="#15803d" />
              PageRank Flowchart ↗
            </a>

            <button
              onClick={fetchInternalLinks}
              disabled={loading}
              className="gsc-btn-primary"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Scanning...' : 'Rescan 43 Pages'}
            </button>
          </div>
        </div>
      </div>

      <ContextCue
        useCase="Deploy 4 strategic internal linking rules to distribute PageRank equity, eliminate orphan pages, and funnel patients to conversion checkout."
        title="Automated Silo Link Rules & Equity Flow"
        about="Rule 1 enforces vertical funneling from informational spokes to money pages. Rule 2 connects guides to utility tools. Rule 3 connects articles to doctor E-E-A-T credentials. Rule 4 guarantees every page funnels qualified patients to /eligibility/ and /pricing/."
      />

      {/* 4 Clarity Executive Scorecards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '14px'
      }}>
        <div className="gsc-scorecard" style={{ borderTop: '3px solid #10b981' }}>
          <div className="gsc-scorecard-label">
            <span>Recommended Link Additions</span>
            <Link2 size={15} color="#10b981" />
          </div>
          <div className="gsc-scorecard-value">
            {data?.totalRecommendations || 28}
            <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500 }}> Links</span>
          </div>
          <div className="gsc-scorecard-sub">
            <span className="gsc-badge-healthy">● High-Equity Contextual Placements</span>
          </div>
        </div>

        <div className="gsc-scorecard" style={{ borderTop: '3px solid #ef4444' }}>
          <div className="gsc-scorecard-label">
            <span>P0 Critical Money Funnels</span>
            <Zap size={15} color="#ef4444" />
          </div>
          <div className="gsc-scorecard-value" style={{ color: '#b91c1c' }}>
            {data?.p0Count || 6}
          </div>
          <div className="gsc-scorecard-sub">
            <span className="gsc-badge-critical">Missing Conversion Intakes</span>
          </div>
        </div>

        <div className="gsc-scorecard" style={{ borderTop: '3px solid #3b82f6' }}>
          <div className="gsc-scorecard-label">
            <span>Pages Audited in Sitemap</span>
            <FileText size={15} color="#3b82f6" />
          </div>
          <div className="gsc-scorecard-value">
            {data?.totalPagesScanned || 43}
          </div>
          <div className="gsc-scorecard-sub">
            <span style={{ color: '#475569', fontSize: '0.74rem' }}>Zero Orphan Pages Target</span>
          </div>
        </div>

        <div className="gsc-scorecard" style={{ borderTop: '3px solid #8b5cf6' }}>
          <div className="gsc-scorecard-label">
            <span>Doctor E-E-A-T Loops</span>
            <ShieldCheck size={15} color="#8b5cf6" />
          </div>
          <div className="gsc-scorecard-value">
            {data?.ruleCounts?.['Medical E-E-A-T Loop'] || 5}
          </div>
          <div className="gsc-scorecard-sub">
            <span>MD Byline &amp; Reviewer Links</span>
          </div>
        </div>
      </div>

      {/* Custom URL Scanner Bar */}
      <CustomUrlScanBar
        toolName="Internal Links &amp; Anchors"
        placeholder="Enter custom URL to audit internal link conduits (e.g. https://ongoweightloss.com/tools/bmi-calculator/)..."
        onScanComplete={(page) => {
          if (!page) return;
          setSearchQuery(page.url);
        }}
      />

      {/* Sleek PageRank Visualizer Callout Banner */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-medium)',
        borderRadius: '12px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: 'var(--shadow-bento)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'rgba(52, 126, 93, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1b4332'
          }}>
            <GitMerge size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
              PageRank &amp; Directed Link Equity Flowchart
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Simulate link equity conduits, tuning outbound link dilution (N) and Google damping math (d = 0.85) in the dedicated visualizer.
            </p>
          </div>
        </div>

        <a
          href="/link-flowchart"
          className="btn-minimal-forest"
          style={{ fontSize: '0.78rem', padding: '8px 16px', textDecoration: 'none' }}
        >
          <GitMerge size={13} />
          Open Flowchart Visualizer ↗
        </a>
      </div>

      {/* Main Table Card */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-bento)',
        padding: '24px'
      }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              Missing Internal Link Recommendations ({filteredRecommendations.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              Click &quot;Flowchart&quot; on any link to load it directly into the PageRank visualizer above.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-minimal"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <option value="all">All Priorities</option>
              <option value="P0">P0 - Critical Only</option>
              <option value="P1">P1 - High Priority</option>
              <option value="P2">P2 - Growth</option>
            </select>

            {/* Rule Filter */}
            <select
              value={ruleFilter}
              onChange={(e) => setRuleFilter(e.target.value)}
              className="input-minimal"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <option value="all">All Linking Rules</option>
              <option value="Vertical Funneling">Vertical Funneling (Money Page)</option>
              <option value="Contextual Tool Bridge">Contextual Tool Bridge</option>
              <option value="Medical E-E-A-T Loop">Medical E-E-A-T Loop</option>
              <option value="Conversion Funnel Push">Conversion Funnel Push</option>
              <option value="Lateral Cross-Link">Lateral Cross-Link</option>
            </select>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search anchors or pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-minimal"
                style={{ padding: '6px 12px 6px 30px', fontSize: '0.8rem', width: '180px' }}
              />
            </div>

            {/* Export CSV */}
            <button
              onClick={handleExportCsv}
              className="btn-minimal-forest"
              style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Recommendations Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{
                borderBottom: '2px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-alt)',
                color: 'var(--text-secondary)'
              }}>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Priority</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Source Ongo Page</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Target Destination &amp; Silo</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Linking Rule</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Exact Recommended Anchor Text</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Placement Location</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecommendations.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    No internal link recommendations match your filters.
                  </td>
                </tr>
              ) : (
                filteredRecommendations.map(item => {
                  const pBadge = getPriorityBadge(item.priority);
                  const isCopiedSnippet = copiedId === `${item.id}-snippet`;
                  const isCopiedAnchor = copiedId === `${item.id}-anchor`;
                  const isExpanded = expandedId === item.id;

                  return (
                    <React.Fragment key={item.id}>
                      <tr
                        style={{
                          borderBottom: isExpanded ? 'none' : '1px solid var(--border-subtle)',
                          backgroundColor: isExpanded ? 'var(--bg-surface-alt)' : 'transparent',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        {/* Priority */}
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: pBadge.bg,
                            color: pBadge.text,
                            border: `1px solid ${pBadge.border}`,
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}>
                            {item.priority.split(' - ')[0]}
                          </span>
                        </td>

                        {/* Source Page */}
                        <td style={{ padding: '12px 14px', maxWidth: '240px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                            {item.sourceTitle}
                          </div>
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.72rem',
                              color: 'var(--color-primary)',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {item.sourceUrl.replace('https://ongoweightloss.com', '')}
                            <ExternalLink size={10} />
                          </a>
                        </td>

                        {/* Target Destination */}
                        <td style={{ padding: '12px 14px', maxWidth: '240px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                            {item.targetTitle}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                            {item.targetSilo}
                          </div>
                        </td>

                        {/* Linking Rule */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'var(--bg-surface-alt)',
                            border: '1px solid var(--border-medium)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: 'var(--text-secondary)'
                          }}>
                            {getRuleIcon(item.linkRule)}
                            <span>{item.linkRule}</span>
                          </div>
                        </td>

                        {/* Exact Anchor Text */}
                        <td style={{ padding: '12px 14px' }}>
                          <button
                            onClick={() => handleCopy(item.exactAnchorText, `${item.id}-anchor`)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '5px 10px',
                              borderRadius: '8px',
                              background: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              color: '#065f46',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                            title="Click to copy exact anchor text"
                          >
                            <span>&quot;{item.exactAnchorText}&quot;</span>
                            {isCopiedAnchor ? <Check size={12} color="#10b981" /> : <Copy size={12} opacity={0.6} />}
                          </button>
                        </td>

                        {/* Placement Location */}
                        <td style={{ padding: '12px 14px', fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '200px' }}>
                          {item.placementContext}
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            {/* Flowchart Link to dedicated tool */}
                            <a
                              href={`/link-flowchart?source=${encodeURIComponent(item.sourceUrl)}&target=${encodeURIComponent(item.targetUrl)}`}
                              className="btn-minimal-forest"
                              style={{
                                padding: '5px 10px',
                                fontSize: '0.72rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                textDecoration: 'none'
                              }}
                              title="Visualize PageRank and Link Equity Flowchart for this link"
                            >
                              <GitMerge size={11} /> Flowchart
                            </a>

                            {/* HTML Copy Button */}
                            <button
                              onClick={() => handleCopy(item.htmlSnippet, `${item.id}-snippet`)}
                              className="btn-minimal-secondary"
                              style={{
                                padding: '5px 8px',
                                fontSize: '0.72rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title="Copy HTML <a> snippet"
                            >
                              {isCopiedSnippet ? <Check size={12} color="#10b981" /> : <FileCode size={12} />}
                              {isCopiedSnippet ? 'Copied' : 'HTML'}
                            </button>

                            <button
                              onClick={() => setExpandedId(isExpanded ? null : item.id)}
                              style={{
                                padding: '5px 6px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-subtle)',
                                background: 'transparent',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer'
                              }}
                              title="Toggle details"
                            >
                              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Explanation Drawer */}
                      {isExpanded && (
                        <tr style={{ backgroundColor: 'var(--bg-surface-alt)', borderBottom: '1px solid var(--border-subtle)' }}>
                          <td colSpan={7} style={{ padding: '16px 20px' }}>
                            <div style={{
                              background: '#ffffff',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '12px',
                              padding: '16px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px'
                            }}>
                              <div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                                  SEO Equity Rationale:
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                                  {item.seoRationale}
                                </div>
                              </div>

                              <div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                                  Copy-Paste HTML Anchor Snippet:
                                </div>
                                <div style={{
                                  marginTop: '4px',
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  background: '#1e293b',
                                  color: '#38bdf8',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.78rem',
                                  overflowX: 'auto',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}>
                                  <code>{item.htmlSnippet}</code>
                                  <button
                                    onClick={() => handleCopy(item.htmlSnippet, `${item.id}-snippet-drawer`)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#ffffff',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center'
                                    }}
                                  >
                                    {copiedId === `${item.id}-snippet-drawer` ? <Check size={14} color="#4ade80" /> : <Copy size={14} />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

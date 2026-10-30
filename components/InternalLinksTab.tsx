'use client';

import React, { useState, useEffect } from 'react';
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
  Stethoscope,
  Calculator,
  Compass,
  FileCode,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import ContextCue from './ContextCue';
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
        setRefreshMessage(`Audit complete: scanned ${json.totalPagesScanned} live Ongo pages!`);
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
        r.exactAnchorText.toLowerCase().includes(q) ||
        r.linkRule.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getPriorityBadge = (p: string) => {
    if (p.startsWith('P0')) {
      return { bg: 'rgba(231, 111, 81, 0.12)', text: '#c2410c', border: '#fdba74' };
    }
    if (p.startsWith('P1')) {
      return { bg: 'rgba(217, 119, 6, 0.12)', text: '#b45309', border: '#fcd34d' };
    }
    return { bg: 'rgba(8, 145, 178, 0.12)', text: '#0e7490', border: '#67e8f9' };
  };

  const getRuleIcon = (rule: string) => {
    switch (rule) {
      case 'Vertical Funneling':
        return <Compass size={13} color="var(--color-primary)" />;
      case 'Contextual Tool Bridge':
        return <Calculator size={13} color="var(--accent-purple)" />;
      case 'Medical E-E-A-T Loop':
        return <Stethoscope size={13} color="#059669" />;
      case 'Conversion Funnel Push':
        return <ArrowRight size={13} color="var(--color-accent)" />;
      default:
        return <Link2 size={13} color="var(--text-secondary)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
        borderRadius: '20px',
        padding: '32px 36px',
        color: '#ffffff',
        boxShadow: '0 12px 32px -4px rgba(27, 67, 50, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '960px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#d8f3dc'
            }}>
              <Link2 size={13} color="#74c69d" />
              Silo Equity Loop Engine
            </span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(231, 111, 81, 0.2)',
              border: '1px solid rgba(231, 111, 81, 0.4)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#ffcbbd'
            }}>
              The 4 Linking Rules
            </span>
          </div>

          <h1 style={{
            fontSize: '1.9rem',
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: '10px',
            color: '#ffffff'
          }}>
            Internal Link & Anchor Text Recommender
          </h1>

          <p style={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.85)',
            marginBottom: '24px'
          }}>
            Scans Ongo's 34 live pages against our 8-Silo Content Blueprint. Flags missing internal links and generates exact copy-paste anchor text snippets to pass PageRank directly to your high-margin commercial treatments and onboarding funnel.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={fetchInternalLinks}
              disabled={loading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #e76f51 0%, #d95d3f 100%)',
                color: '#ffffff',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(231, 111, 81, 0.4)',
                transition: 'all 0.15s ease'
              }}
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Auditing Pages...' : 'Rescan Live Pages'}
            </button>

            {refreshMessage && (
              <span style={{ fontSize: '0.82rem', color: '#d8f3dc', fontWeight: 600 }}>
                {refreshMessage}
              </span>
            )}
          </div>
        </div>
      </div>

      <ContextCue
        title="Automated Silo Link Rules"
        about="Never place internal links randomly. Rule 1 enforces vertical funneling from informational spokes to money pages. Rule 2 connects guides to high-dwell utility tools. Rule 3 connects articles to doctor E-E-A-T credentials. Rule 4 guarantees every page funnels qualified patients to /weightloss-onboard/."
      />

      {/* KPI Bento Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          background: 'var(--bg-surface)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-bento)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Pages Audited
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            {data?.totalPagesScanned || 34}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Live Ongo Pages in Sitemap
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-bento)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Total Link Gaps
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-accent)' }}>
            {data?.totalRecommendations || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Missing Anchor Opportunities
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-bento)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
            P0 Critical Priority
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#dc2626' }}>
            {data?.p0Count || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Missing Treatment & Intake CTAs
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-bento)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
            E-E-A-T Doctor Loops
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#059669' }}>
            {data?.ruleCounts?.['Medical E-E-A-T Loop'] || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Physician Byline Links Needed
          </div>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          padding: '20px',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-bento)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
            Tool Bridges
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
            {data?.ruleCounts?.['Contextual Tool Bridge'] || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Calculators & Screener Links
          </div>
        </div>
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
              Each recommendation includes the exact anchor text, target destination, and copyable HTML code tag.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-input)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
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
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-input)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
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
                style={{
                  padding: '6px 12px 6px 30px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.8rem',
                  outline: 'none',
                  width: '180px'
                }}
              />
            </div>

            {/* Export CSV */}
            <button
              onClick={handleExportCsv}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid var(--color-primary)',
                background: 'var(--color-primary-soft)',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--color-primary-dark)',
                cursor: 'pointer'
              }}
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
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Target Destination & Silo</th>
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
                            <span>"{item.exactAnchorText}"</span>
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
                            <button
                              onClick={() => handleCopy(item.htmlSnippet, `${item.id}-snippet`)}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-medium)',
                                background: isCopiedSnippet ? '#dcfce7' : 'var(--bg-surface)',
                                color: isCopiedSnippet ? '#15803d' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 600
                              }}
                              title="Copy HTML <a> snippet"
                            >
                              {isCopiedSnippet ? <Check size={12} /> : <FileCode size={12} />}
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


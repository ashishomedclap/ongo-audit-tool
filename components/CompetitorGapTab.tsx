'use client';

import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  TrendingUp,
  Download,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Filter,
  Search,
  FileText,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart3
} from 'lucide-react';
import ContextCue from './ContextCue';
import { CompetitorGapItem, CompetitorGapAnalysisResult } from '@/lib/competitor-gap-engine';

export default function CompetitorGapTab() {
  const [data, setData] = useState<CompetitorGapAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [siloFilter, setSiloFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/competitor-gap');
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error('Error fetching competitor gap analysis:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    setLocalStatuses(prev => ({
      ...prev,
      [id]: newStatus
    }));
  };

  const handleCopyWriterBrief = (item: CompetitorGapItem) => {
    const brief = `=== ONGO SEO WRITER BRIEF ===
TOPIC: ${item.topicName}
TARGET URL SLUG: ${item.targetSlug}
TARGET SILO: ${item.targetSilo}
PRIORITY: ${item.priority}
RECOMMENDED H1: ${item.recommendedH1}
RECOMMENDED META TITLE: ${item.recommendedMetaTitle}
RECOMMENDED META DESCRIPTION: ${item.recommendedMetaDescription}
TARGET WORD COUNT: ${item.recommendedWordCount} words
PRIMARY TARGET KEYWORDS: ${item.primaryKeywords.join(', ')}
COMPETITOR BENCHMARK: ${item.competitorSaturationCount}/100 competitors (${item.competitorTotalUrls.toLocaleString()} ranking URLs)
COMPETITOR URL EXAMPLES:
${item.topCompetitorExamples.map(e => `- ${e.competitor} (${e.domain}): ${e.sampleUrl}`).join('\n')}
DOWNSTREAM INTERNAL LINK CONVERSION: Link within first 150 words and final CTA to ${item.funnelDestination}
==============================`;
    handleCopy(brief, `${item.id}-brief`);
  };

  const handleExportCsv = () => {
    if (!data) return;
    const headers = [
      'Topic Name',
      'Target Slug',
      'Silo',
      'Priority',
      'Competitor Saturation',
      'Total Competitor URLs',
      'Recommended H1',
      'Meta Title',
      'Meta Description',
      'Word Count',
      'Target Keywords',
      'Funnel Destination',
      'Roadmap Status'
    ];
    const rows = filteredRoadmap.map(i => [
      `"${i.topicName.replace(/"/g, '""')}"`,
      `"${i.targetSlug}"`,
      `"${i.targetSilo}"`,
      `"${i.priority}"`,
      `"${i.competitorSaturationCount}%"`,
      `"${i.competitorTotalUrls}"`,
      `"${i.recommendedH1.replace(/"/g, '""')}"`,
      `"${i.recommendedMetaTitle.replace(/"/g, '""')}"`,
      `"${i.recommendedMetaDescription.replace(/"/g, '""')}"`,
      `"${i.recommendedWordCount}"`,
      `"${i.primaryKeywords.join('; ')}"`,
      `"${i.funnelDestination}"`,
      `"${localStatuses[i.id] || i.roadmapStatus}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ongo_content_roadmap_competitor_gaps_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const roadmap = data?.roadmap || [];

  const filteredRoadmap = roadmap.filter(item => {
    if (priorityFilter !== 'all' && !item.priority.startsWith(priorityFilter)) return false;
    if (siloFilter !== 'all' && item.targetSilo !== siloFilter) return false;
    const currentStatus = localStatuses[item.id] || item.roadmapStatus;
    if (statusFilter !== 'all' && currentStatus !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.topicName.toLowerCase().includes(q) ||
        item.targetSlug.toLowerCase().includes(q) ||
        item.primaryKeywords.some(k => k.toLowerCase().includes(q)) ||
        item.recommendedH1.toLowerCase().includes(q)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ready':
        return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
      case 'Drafting':
        return { bg: '#fef3c7', text: '#b45309', border: '#fde68a' };
      case 'In Brief':
        return { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' };
      default:
        return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
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
                Competitor Big Data Gap Mining
              </span>
              <span className="gsc-badge-neutral">
                33,108 Competitor URLs vs. 43 Ongo Pages
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f1715', margin: 0, letterSpacing: '-0.02em' }}>
              Competitor Content Gap &amp; Organic Roadmap
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#475569', margin: '4px 0 0 0' }}>
              Discover high-demand patient topic vacuums published across 100 competitors that are missing from Ongo's 43 live pages, complete with ready-to-write writer briefs.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleExportCsv}
              className="gsc-btn-secondary"
              title="Download content roadmap to CSV"
            >
              <Download size={14} />
              Export Roadmap CSV
            </button>
          </div>
        </div>
      </div>

      <ContextCue
        level={2}
        toolNumber={6}
        useCase="Compare 33,000+ competitor URLs against Ongo to uncover missing clinical topics, formats, and patient intent clusters."
        title="Content Gap Strategy"
        about="Competitors like OrderlyMeds, Mochi, and Ro generate 60%+ of their organic patients through middle-of-funnel comparison and dosing pages. Ongo currently has 43 live production pages. Launching the 6 P0 Roadmap pages below instantly plugs our biggest organic traffic leaks."
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
            Competitor URLs Wired
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            {(data?.totalCompetitorUrlsAnalyzed || 33108).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Across 100 Competitor Sitemaps
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
            Ongo Live Pages
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--color-primary)' }}>
            {data?.ongoLivePagesCount || 34}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Currently Indexed in Sitemap
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
            P0 Immediate Gaps
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#dc2626' }}>
            {data?.p0Count || 6}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Critical High-Converting Vacuums
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
            P1 High Growth Gaps
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#d97706' }}>
            {data?.p1Count || 5}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Side Effects & Food Guides
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
            P2 Strategic Niches
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            {data?.p2Count || 4}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Oral GLP-1 & Peptides
          </div>
        </div>
      </div>

      {/* Silo Deficit Summary Cards */}
      {data?.siloCoverageBreakdown && (
        <div style={{
          background: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-bento)',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
            Silo Deficit Diagnostic: Competitors vs. Ongo
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '18px' }}>
            Benchmark comparison showing competitor average content depth versus Ongo's live coverage in each of the 8 silos.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '12px'
          }}>
            {Object.entries(data.siloCoverageBreakdown).map(([siloName, item]) => {
              const isVacuum = item.ongoCount === 0;
              return (
                <div
                  key={siloName}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: isVacuum ? '#fff5f5' : 'var(--bg-surface-alt)',
                    border: isVacuum ? '1px solid #fecaca' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {siloName}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      background: isVacuum ? '#fee2e2' : '#dcfce7',
                      color: isVacuum ? '#b91c1c' : '#15803d'
                    }}>
                      {item.gapScore}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Ongo: <strong style={{ color: isVacuum ? '#dc2626' : 'var(--color-primary)' }}>{item.ongoCount} pages</strong> &bull; Competitors Avg: <strong>{item.competitorAvg} pages</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Roadmap Table Card */}
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
              Actionable Content Roadmap ({filteredRoadmap.length} High-Impact Pages)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
              Prioritized pages ready to write and deploy with complete writer briefs and competitor intelligence.
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
              <option value="P0">P0 - Immediate Gaps</option>
              <option value="P1">P1 - High Growth</option>
              <option value="P2">P2 - Strategic Niches</option>
            </select>

            {/* Silo Filter */}
            <select
              value={siloFilter}
              onChange={(e) => setSiloFilter(e.target.value)}
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
              <option value="all">All Silos</option>
              <option value="Silo 1: Core Commercial Treatments">Silo 1: Treatments</option>
              <option value="Silo 2: Interactive Self-Service Tools">Silo 2: Interactive Tools</option>
              <option value="Silo 3: Medication Comparisons">Silo 3: Comparisons</option>
              <option value="Silo 4: Clinical Dosing & Administration">Silo 4: Dosing</option>
              <option value="Silo 6: Programmatic 50-State Telehealth">Silo 6: Local Telehealth</option>
              <option value="Silo 7: Side Effects & Nutrition">Silo 7: Side Effects</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
              <option value="all">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Brief">In Brief</option>
              <option value="Drafting">Drafting</option>
              <option value="Ready">Ready</option>
            </select>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search topics or keywords..."
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
          </div>
        </div>

        {/* Roadmap Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{
                borderBottom: '2px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-alt)',
                color: 'var(--text-secondary)'
              }}>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Priority</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Roadmap Topic & Target URL</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Target Silo</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Competitor Saturation</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Recommended H1 & Meta Title</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Word Count</th>
                <th style={{ padding: '12px 14px', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoadmap.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    No roadmap items match your selected filters.
                  </td>
                </tr>
              ) : (
                filteredRoadmap.map(item => {
                  const pBadge = getPriorityBadge(item.priority);
                  const currentStatus = localStatuses[item.id] || item.roadmapStatus;
                  const sBadge = getStatusBadge(currentStatus);
                  const isCopiedBrief = copiedId === `${item.id}-brief`;
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

                        {/* Topic Name & Target Slug */}
                        <td style={{ padding: '12px 14px', maxWidth: '260px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>
                            {item.topicName}
                          </div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                            {item.targetSlug}
                          </div>
                        </td>

                        {/* Silo */}
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-primary-dark)',
                            fontWeight: 600,
                            background: 'rgba(52, 126, 93, 0.08)',
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}>
                            {item.targetSilo.split(':')[1]?.trim() || item.targetSilo}
                          </span>
                        </td>

                        {/* Competitor Saturation */}
                        <td style={{ padding: '12px 14px' }}>
                          <div style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.8rem' }}>
                            {item.competitorSaturationCount}% of Competitors
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                            {item.competitorTotalUrls.toLocaleString()} URLs indexed
                          </div>
                        </td>

                        {/* Recommended Title */}
                        <td style={{ padding: '12px 14px', fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                            H1: {item.recommendedH1}
                          </div>
                          <div style={{ color: 'var(--text-tertiary)' }}>
                            Title: {item.recommendedMetaTitle}
                          </div>
                        </td>

                        {/* Word Count */}
                        <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {item.recommendedWordCount.toLocaleString()} words
                        </td>

                        {/* Status Switcher */}
                        <td style={{ padding: '12px 14px' }}>
                          <select
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: `1px solid ${sBadge.border}`,
                              background: sBadge.bg,
                              color: sBadge.text,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            <option value="Not Started">Not Started</option>
                            <option value="In Brief">In Brief</option>
                            <option value="Drafting">Drafting</option>
                            <option value="Ready">Ready</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <button
                              onClick={() => handleCopyWriterBrief(item)}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-medium)',
                                background: isCopiedBrief ? '#dcfce7' : 'var(--bg-surface)',
                                color: isCopiedBrief ? '#15803d' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 600
                              }}
                              title="Copy Full Content Brief for Writers"
                            >
                              {isCopiedBrief ? <Check size={12} /> : <FileText size={12} />}
                              {isCopiedBrief ? 'Copied Brief' : 'Writer Brief'}
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

                      {/* Expandable Intelligence Drawer */}
                      {isExpanded && (
                        <tr style={{ backgroundColor: 'var(--bg-surface-alt)', borderBottom: '1px solid var(--border-subtle)' }}>
                          <td colSpan={8} style={{ padding: '16px 20px' }}>
                            <div style={{
                              background: '#ffffff',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '12px',
                              padding: '16px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px'
                            }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                                    Meta Description Blueprint:
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.5 }}>
                                    {item.recommendedMetaDescription}
                                  </div>
                                </div>

                                <div>
                                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                                    Target Keyword Intent:
                                  </div>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                                    {item.primaryKeywords.map((kw, i) => (
                                      <span key={i} style={{
                                        padding: '3px 8px',
                                        borderRadius: '6px',
                                        background: 'rgba(52, 126, 93, 0.1)',
                                        color: 'var(--color-primary-dark)',
                                        fontSize: '0.72rem',
                                        fontWeight: 600
                                      }}>
                                        {kw}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Competitor URL Benchmarks */}
                              <div>
                                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                                  Live Competitor Benchmark URLs (from 33,108 dataset):
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                  {item.topCompetitorExamples.map((ex, i) => (
                                    <a
                                      key={i}
                                      href={ex.sampleUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        background: 'var(--bg-surface-alt)',
                                        border: '1px solid var(--border-medium)',
                                        fontSize: '0.75rem',
                                        color: 'var(--text-secondary)',
                                        textDecoration: 'none'
                                      }}
                                    >
                                      <strong style={{ color: 'var(--color-primary-dark)' }}>{ex.competitor}:</strong>
                                      <span>{ex.sampleUrl.replace('https://', '').split('/')[1] || ex.domain}</span>
                                      <ExternalLink size={10} />
                                    </a>
                                  ))}
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


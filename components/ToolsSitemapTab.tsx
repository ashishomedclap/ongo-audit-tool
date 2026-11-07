'use client';

import React, { useState } from 'react';
import {
  Compass,
  Search,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Link2,
  GitCompare,
  Globe,
  Users,
  Tag,
  Layers,
  FileText,
  SplitSquareVertical,
  Stethoscope,
  BarChart2,
  Activity,
  ArrowRight,
  ShieldCheck,
  FolderTree,
  Filter,
  BookOpen,
  CheckCircle2,
  Zap,
  FileCode,
  Award,
  HelpCircle,
  AlertTriangle,
  Trash2,
  GitMerge,
  Image as ImageIcon,
  CheckSquare,
  FileCheck2,
  Radar,
  ShieldAlert,
  Bot,
  FlaskConical,
  Scale
} from 'lucide-react';
import ContextCue from './ContextCue';
import { TOOLS_DIRECTORY, TOOL_CATEGORIES, ToolDefinition, getToolsByRank } from '@/lib/tools-sitemap';
import { TabType } from './Navbar';

interface ToolsSitemapTabProps {
  onSelectTab: (tab: TabType) => void;
}

export default function ToolsSitemapTab({ onSelectTab }: ToolsSitemapTabProps) {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'ranked' | 'hierarchical'>('ranked');
  const [selectedTier, setSelectedTier] = useState<'all' | 'tier1' | 'tier2' | 'tier3'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleExportSitemapCsv = () => {
    const headers = ['Rank', 'Rank Tier', 'Recommendation', 'Recommendation Reason', 'Level', 'Tool Name', 'Path', 'What It Does In Detail', 'How To Use It', 'Why To Use It', 'Key Metrics'];
    const rows = getToolsByRank().map(t => [
      `"#${t.rank}"`,
      `"${t.rankTier}"`,
      `"${t.recommendation}"`,
      `"${t.recommendationReason.replace(/"/g, '""')}"`,
      `"Level ${t.level}"`,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.path}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.howToUse.replace(/"/g, '""')}"`,
      `"${t.whyToUse.replace(/"/g, '""')}"`,
      `"${t.keyMetrics}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ongo_suite_tools_ranked_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getIcon = (iconName: string, size = 18) => {
    switch (iconName) {
      case 'BarChart2': return <BarChart2 size={size} />;
      case 'BookOpen': return <BookOpen size={size} />;
      case 'Compass': return <Compass size={size} />;
      case 'Sparkles': return <Sparkles size={size} />;
      case 'Link2': return <Link2 size={size} />;
      case 'GitCompare': return <GitCompare size={size} />;
      case 'Globe': return <Globe size={size} />;
      case 'Users': return <Users size={size} />;
      case 'Search': return <Search size={size} />;
      case 'SplitSquareVertical': return <SplitSquareVertical size={size} />;
      case 'Stethoscope': return <Stethoscope size={size} />;
      case 'Tag': return <Tag size={size} />;
      case 'Image': return <ImageIcon size={size} />;
      case 'GitMerge': return <GitMerge size={size} />;
      case 'Layers': return <Layers size={size} />;
      case 'FileText': return <FileText size={size} />;
      case 'FileCode': return <FileCode size={size} />;
      case 'FileCheck2': return <FileCheck2 size={size} />;
      case 'Radar': return <Radar size={size} />;
      case 'ShieldAlert': return <ShieldAlert size={size} />;
      case 'Bot': return <Bot size={size} />;
      case 'FlaskConical': return <FlaskConical size={size} />;
      case 'Scale': return <Scale size={size} />;
      default: return <Activity size={size} />;
    }
  };

  // Filter tools
  const rankedTools = getToolsByRank().filter(tool => {
    if (selectedTier === 'tier1' && tool.rankTier !== 'Tier 1: Essential Core') return false;
    if (selectedTier === 'tier2' && tool.rankTier !== 'Tier 2: High Value Strategy') return false;
    if (selectedTier === 'tier3' && tool.rankTier !== 'Tier 3: Specialized / Review') return false;
    if (viewMode === 'hierarchical' && activeCategory !== 'all' && tool.category !== activeCategory) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.shortName.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.howToUse.toLowerCase().includes(q) ||
        tool.whyToUse.toLowerCase().includes(q) ||
        tool.path.toLowerCase().includes(q) ||
        tool.keywords.some(k => k.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const tier1Count = TOOLS_DIRECTORY.filter(t => t.rankTier === 'Tier 1: Essential Core').length;
  const tier2Count = TOOLS_DIRECTORY.filter(t => t.rankTier === 'Tier 2: High Value Strategy').length;
  const tier3Count = TOOLS_DIRECTORY.filter(t => t.rankTier === 'Tier 3: Specialized / Review').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Premium GSC / Clarity Header */}
      <div className="gsc-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="gsc-badge-healthy">
                <span className="gsc-pulse-dot" />
                Intelligence Suite Directory
              </span>
              <span className="gsc-badge-neutral">
                {TOOLS_DIRECTORY.length} Dedicated Tools Ranked #1 to #{TOOLS_DIRECTORY.length}
              </span>
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f1715', margin: 0, letterSpacing: '-0.02em' }}>
              Ongo Weight Loss Suite Sitemap &amp; Tool Rank Guide
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#475569', margin: '4px 0 0 0' }}>
              Comprehensive catalog detailing each tool's dedicated single purpose, step-by-step how-to-use guide, strategic rationale, and 1-click launch links.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleExportSitemapCsv}
              className="gsc-btn-secondary"
              title="Download full tools directory to CSV"
            >
              <Download size={14} />
              Export Sitemap CSV
            </button>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '480px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '12px',
              top: 'calc(50% + 5px)',
              transform: 'translateY(-50%)',
              color: '#64748b',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools, use cases, ranking, or recommendations..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              fontSize: '0.82rem',
              color: '#0f1715',
              fontWeight: 500
            }}
          />
        </div>
      </div>

      <ContextCue
        useCase="Review what each tool does in detail, how and why to use it, and its ranked business value to decide what to keep, merge, or remove."
        title="Tools Ranking & Simplification Guide"
        about="Tier 1 tools are essential organic traffic drivers and core engines. Tier 2 tools provide high-value strategy and E-E-A-T clinical compliance. Tier 3 tools are specialized candidates you can merge or remove to keep the suite simple."
      />

      {/* Tier KPI Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {/* Tier 1 Card */}
        <div
          onClick={() => setSelectedTier(selectedTier === 'tier1' ? 'all' : 'tier1')}
          className="bento-card"
          style={{
            padding: '16px 20px',
            cursor: 'pointer',
            border: selectedTier === 'tier1' ? '2px solid #15803d' : '1px solid var(--border-subtle)',
            background: selectedTier === 'tier1' ? '#f0fdf4' : 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge-minimal badge-minimal-success" style={{ fontWeight: 800 }}>
              Tier 1: Essential Core ({tier1Count})
            </span>
            <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700 }}>Must Keep</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginTop: '8px' }}>
            Ranks #1 – #5: Core Engines
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
            Clean Scraper, Competitor Gap Roadmap, Google Autocomplete Harvester, Ongo Live Pages, and Internal Linking.
          </p>
        </div>

        {/* Tier 2 Card */}
        <div
          onClick={() => setSelectedTier(selectedTier === 'tier2' ? 'all' : 'tier2')}
          className="bento-card"
          style={{
            padding: '16px 20px',
            cursor: 'pointer',
            border: selectedTier === 'tier2' ? '2px solid #347e5d' : '1px solid var(--border-subtle)',
            background: selectedTier === 'tier2' ? '#f4fbf7' : 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge-minimal badge-minimal-neutral" style={{ fontWeight: 800 }}>
              Tier 2: High Value Strategy ({tier2Count})
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 700 }}>Keep</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginTop: '8px' }}>
            Ranks #6 – #11: Strategy &amp; Trust
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
            7 Books Library, 100-Competitor Directory, 217-Page Silo Plan, Doctors E-E-A-T, Meta Auditor, Overview.
          </p>
        </div>

        {/* Tier 3 Card */}
        <div
          onClick={() => setSelectedTier(selectedTier === 'tier3' ? 'all' : 'tier3')}
          className="bento-card"
          style={{
            padding: '16px 20px',
            cursor: 'pointer',
            border: selectedTier === 'tier3' ? '2px solid #d97706' : '1px solid var(--border-subtle)',
            background: selectedTier === 'tier3' ? '#fffbeb' : 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge-minimal badge-minimal-coral" style={{ fontWeight: 800 }}>
              Tier 3: Specialized / Review ({tier3Count})
            </span>
            <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 700 }}>Review to Merge/Remove</span>
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginTop: '8px' }}>
            Ranks #12 – #15: Consolidation
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
            Moat Patterns, Keyword Matrix, Strategic Reports, and Raw Competitor Sitemaps.
          </p>
        </div>
      </div>

      {/* Toolbar: View Switcher & Filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        borderBottom: '1px solid var(--border-medium)',
        paddingBottom: '12px'
      }}>
        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setViewMode('ranked')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: viewMode === 'ranked' ? '1px solid #1b4332' : '1px solid var(--border-medium)',
              background: viewMode === 'ranked' ? '#1b4332' : '#ffffff',
              color: viewMode === 'ranked' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Award size={13} /> Ranked Priority Guide (#1 – #15)
          </button>

          <button
            onClick={() => setViewMode('hierarchical')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: viewMode === 'hierarchical' ? '1px solid #1b4332' : '1px solid var(--border-medium)',
              background: viewMode === 'hierarchical' ? '#1b4332' : '#ffffff',
              color: viewMode === 'hierarchical' ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Layers size={13} /> Hierarchical Level View (L1, L2, L3)
          </button>
        </div>

        {/* Tier Filter Buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedTier('all')}
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              border: '1px solid var(--border-medium)',
              background: selectedTier === 'all' ? '#1b4332' : 'transparent',
              color: selectedTier === 'all' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            All (15)
          </button>
          <button
            onClick={() => setSelectedTier('tier1')}
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              border: '1px solid #bbf7d0',
              background: selectedTier === 'tier1' ? '#15803d' : '#f0fdf4',
              color: selectedTier === 'tier1' ? '#ffffff' : '#166534',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            Tier 1: Core ({tier1Count})
          </button>
          <button
            onClick={() => setSelectedTier('tier2')}
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              border: '1px solid #c7d2fe',
              background: selectedTier === 'tier2' ? '#4338ca' : '#eef2ff',
              color: selectedTier === 'tier2' ? '#ffffff' : '#3730a3',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            Tier 2: Strategy ({tier2Count})
          </button>
          <button
            onClick={() => setSelectedTier('tier3')}
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              border: '1px solid #fed7aa',
              background: selectedTier === 'tier3' ? '#c2410c' : '#fff7ed',
              color: selectedTier === 'tier3' ? '#ffffff' : '#9a3412',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            Tier 3: Review ({tier3Count})
          </button>
        </div>
      </div>

      {/* Main Tools List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {rankedTools.map(tool => {
          const isCopied = copiedId === tool.id;

          const recommendationColor = 
            tool.recommendation === 'KEEP (Core Asset)' ? { bg: '#dcfce7', text: '#15803d', border: '#86efac', icon: <CheckCircle2 size={13} /> } :
            tool.recommendation === 'KEEP (High Value)' ? { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc', icon: <CheckCircle2 size={13} /> } :
            tool.recommendation === 'CONSIDER MERGING' ? { bg: '#fef3c7', text: '#b45309', border: '#fcd34d', icon: <GitMerge size={13} /> } :
            { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5', icon: <Trash2 size={13} /> };

          return (
            <div
              key={tool.id}
              className="bento-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                borderLeft: tool.rank <= 5 ? '4px solid #1b4332' : tool.rank <= 11 ? '4px solid #347e5d' : '4px solid #d97706'
              }}
            >
              {/* Header Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Rank Badge */}
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: tool.rank <= 5 ? 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)' : tool.rank <= 11 ? '#347e5d' : '#d97706',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}>
                    <span style={{ fontSize: '0.62rem', opacity: 0.85, textTransform: 'uppercase' }}>Rank</span>
                    <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>#{tool.rank}</span>
                  </div>

                  {/* Icon & Title */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                        {tool.name}
                      </h2>
                      <span className="badge-minimal" style={{ fontFamily: 'var(--font-mono)' }}>
                        {tool.levelLabel}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
                      <code style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', background: 'var(--bg-canvas)', padding: '2px 6px', borderRadius: '4px' }}>
                        {tool.path}
                      </code>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>•</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-primary-dark)', fontWeight: 600 }}>
                        {tool.keyMetrics}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendation Pill */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  background: recommendationColor.bg,
                  color: recommendationColor.text,
                  border: `1px solid ${recommendationColor.border}`,
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}>
                  {recommendationColor.icon}
                  {tool.recommendation}
                </div>
              </div>

              {/* 4 In-Depth Information Bento Blocks */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {/* 1. What it does in detail */}
                <div style={{
                  background: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary-dark)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FileText size={12} color="#1b4332" /> 1. What It Does In Detail
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {tool.description} {tool.valueProp}
                  </p>
                </div>

                {/* 2. How to use it */}
                <div style={{
                  background: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Zap size={12} color="#0284c7" /> 2. How To Use It
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {tool.howToUse}
                  </p>
                </div>

                {/* 3. Why to use it (How it helps) */}
                <div style={{
                  background: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#15803d', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <HelpCircle size={12} color="#16a34a" /> 3. Why To Use It (How It Helps Ongo)
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {tool.whyToUse}
                  </p>
                </div>

                {/* 4. Recommendation Rationale */}
                <div style={{
                  background: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: recommendationColor.text, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckSquare size={12} color={recommendationColor.text} /> 4. Decision Recommendation
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    <strong>{tool.recommendation}:</strong> {tool.recommendationReason}
                  </p>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => handleCopy(window.location.origin + tool.path, tool.id)}
                    className="btn-minimal-secondary"
                    style={{ fontSize: '0.76rem', padding: '5px 10px' }}
                  >
                    {isCopied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    {isCopied ? 'Copied' : `Copy Path (${tool.path})`}
                  </button>
                  <a
                    href={tool.path}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-minimal-secondary"
                    style={{ fontSize: '0.76rem', padding: '5px 10px', textDecoration: 'none' }}
                    title="Open in new window"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>

                <button
                  onClick={() => onSelectTab(tool.id as TabType)}
                  className="btn-minimal-forest"
                  style={{ fontSize: '0.82rem', padding: '8px 18px' }}
                >
                  Launch {tool.shortName} <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
  Zap
} from 'lucide-react';
import ContextCue from './ContextCue';
import { TOOLS_DIRECTORY, TOOL_CATEGORIES, ToolDefinition } from '@/lib/tools-sitemap';
import { TabType } from './Navbar';

interface ToolsSitemapTabProps {
  onSelectTab: (tab: TabType) => void;
}

export default function ToolsSitemapTab({ onSelectTab }: ToolsSitemapTabProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleExportSitemapCsv = () => {
    const headers = ['Level', 'Category', 'Tool Name', 'Path', 'Use Case', 'Badge', 'Description', 'Key Metrics'];
    const rows = TOOLS_DIRECTORY.map(t => [
      `"Level ${t.level}"`,
      `"${t.categoryLabel}"`,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.path}"`,
      `"${t.useCase.replace(/"/g, '""')}"`,
      `"${t.badge || ''}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.keyMetrics}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ongo_suite_tools_sitemap_l1_l2_l3_${new Date().toISOString().slice(0, 10)}.csv`);
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
      case 'Layers': return <Layers size={size} />;
      case 'FileText': return <FileText size={size} />;
      default: return <Activity size={size} />;
    }
  };

  const filteredTools = TOOLS_DIRECTORY.filter(tool => {
    if (activeCategory !== 'all' && tool.category !== activeCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.shortName.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.useCase.toLowerCase().includes(q) ||
        tool.path.toLowerCase().includes(q) ||
        tool.keywords.some(k => k.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Strategic Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1b4332 0%, #081c15 100%)',
        borderRadius: '20px',
        padding: '32px 36px',
        color: '#ffffff',
        boxShadow: '0 12px 32px -4px rgba(27, 67, 50, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
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
              <FolderTree size={13} color="#74c69d" />
              Hierarchical Sitemap
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
              Level 1, 2, 3 Use-Case Architecture (14 Tools)
            </span>
          </div>

          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: '10px',
            color: '#ffffff'
          }}>
            Master Suite Sitemap & Use-Case Directory
          </h1>

          <p style={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.85)',
            marginBottom: '24px'
          }}>
            Organized sequentially across <strong>Level 1 (Foundation & Baseline)</strong>, <strong>Level 2 (SEO Research & Content Engine)</strong>, and <strong>Level 3 (Architecture, Linking & Governance)</strong>. Click any card to launch the tool, copy its route path, or inspect its functional role in Ongo's organic growth roadmap.
          </p>

          {/* Quick Search & Export */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#2d6a4f',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search across all levels, use cases, or paths..."
                style={{
                  width: '100%',
                  padding: '11px 16px 11px 40px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#ffffff',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: '#1b4332',
                  outline: 'none'
                }}
              />
            </div>

            <button
              onClick={handleExportSitemapCsv}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 20px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #e76f51 0%, #d95d3f 100%)',
                color: '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Download size={14} />
              Export Sitemap (CSV)
            </button>
          </div>
        </div>
      </div>

      <ContextCue
        useCase="Explore the full visual directory across all 3 levels, ordered use cases, and 14 intelligence tools."
        title="Ordered Workflow: Level 1 ➔ Level 2 ➔ Level 3"
        about="Start with Level 1 to baseline Ongo's live pages and absorb the 7 onboarding books. Progress to Level 2 to discover content vacuums and harvest high-intent questions. Finally, execute Level 3 to construct topic silos, pass internal link equity, and enforce E-E-A-T doctor compliance."
      />

      {/* Category Filter Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '12px'
      }}>
        <button
          onClick={() => setActiveCategory('all')}
          style={{
            padding: '8px 18px',
            borderRadius: '9999px',
            border: activeCategory === 'all' ? '2px solid #1b4332' : '1px solid #cbd5e1',
            background: activeCategory === 'all' ? '#1b4332' : '#ffffff',
            color: activeCategory === 'all' ? '#ffffff' : '#334155',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          All 3 Levels (14 Tools)
        </button>

        {TOOL_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '8px 18px',
              borderRadius: '9999px',
              border: activeCategory === cat.id ? `2px solid ${cat.accentColor}` : '1px solid #cbd5e1',
              background: activeCategory === cat.id ? cat.accentColor : '#ffffff',
              color: activeCategory === cat.id ? '#ffffff' : '#334155',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Level {cat.level} ({cat.tools.length})
          </button>
        ))}
      </div>

      {/* Grouped Category Sections */}
      {TOOL_CATEGORIES.map(category => {
        const categoryTools = filteredTools.filter(t => t.category === category.id);
        if (categoryTools.length === 0) return null;

        return (
          <div key={category.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Section Level Header */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  background: category.accentColor,
                  color: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 800
                }}>
                  LEVEL 0{category.level}
                </span>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {category.name}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '2px 0 0 0' }}>
                    <strong>Use Case:</strong> {category.useCase}
                  </p>
                </div>
              </div>

              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#475569',
                background: '#e2e8f0',
                padding: '3px 10px',
                borderRadius: '9999px'
              }}>
                {categoryTools.length} Tools
              </span>
            </div>

            {/* Grid of Tool Cards in this Level */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '18px'
            }}>
              {categoryTools.map(tool => {
                const isCopied = copiedId === tool.id;

                return (
                  <div
                    key={tool.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      padding: '22px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '14px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = category.accentColor;
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.07)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div>
                      {/* Card Top Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          backgroundColor: '#f1f5f9',
                          color: '#1b4332',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getIcon(tool.categoryIcon, 20)}
                        </div>

                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 7px',
                            borderRadius: '6px',
                            background: '#f1f5f9',
                            color: '#475569'
                          }}>
                            L{tool.level}
                          </span>
                          {tool.badge && (
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              background: tool.badgeBg || '#e8f5e9',
                              color: tool.badgeColor || '#1b4332'
                            }}>
                              {tool.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Tool Name */}
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                        {tool.name}
                      </h4>

                      {/* Explicit Use Case Callout */}
                      <div style={{
                        background: '#f8fafc',
                        borderLeft: `3px solid ${category.accentColor}`,
                        padding: '6px 10px',
                        borderRadius: '0 6px 6px 0',
                        fontSize: '12px',
                        color: '#334155',
                        marginBottom: '10px',
                        lineHeight: 1.4
                      }}>
                        <strong>Use Case:</strong> {tool.useCase}
                      </div>

                      <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                        {tool.description}
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div style={{
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <code style={{
                          fontSize: '11px',
                          color: '#64748b',
                          background: '#f1f5f9',
                          padding: '3px 6px',
                          borderRadius: '4px'
                        }}>
                          {tool.path}
                        </code>
                        <button
                          onClick={() => handleCopy(window.location.origin + tool.path, tool.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: isCopied ? '#16a34a' : '#94a3b8',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="Copy full URL"
                        >
                          {isCopied ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>

                      <button
                        onClick={() => onSelectTab(tool.id as TabType)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#1b4332',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2d6a4f')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1b4332')}
                      >
                        Launch
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
  Filter
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
    const headers = ['Category', 'Tool Name', 'Path', 'Badge', 'Description', 'Key Metrics', 'Keywords'];
    const rows = TOOLS_DIRECTORY.map(t => [
      `"${t.categoryLabel}"`,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.path}"`,
      `"${t.badge || ''}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.keyMetrics}"`,
      `"${t.keywords.join(', ')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ongo_suite_tools_sitemap_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getIcon = (iconName: string, size = 18) => {
    switch (iconName) {
      case 'BarChart2': return <BarChart2 size={size} />;
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
              <FolderTree size={13} color="#74c69d" />
              Suite Architecture
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
              13 Integrated In-House SEO Tools
            </span>
          </div>

          <h1 style={{
            fontSize: '1.9rem',
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: '10px',
            color: '#ffffff'
          }}>
            Dashboard Tools Sitemap & Access Index
          </h1>

          <p style={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.85)',
            marginBottom: '24px'
          }}>
            Complete visual sitemap and architectural directory of every custom SEO tool built for Ongo Weight Loss. Click any tool card to launch it instantly, copy its dedicated URL path, or review its functional role in the 8-Silo organic acquisition strategy.
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
                  color: 'var(--color-primary-dark)',
                  pointerEvents: 'none'
                }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools by name, intent, or path..."
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
              Export Tools Sitemap (CSV)
            </button>
          </div>
        </div>
      </div>

      <ContextCue
        title="13 In-House Proprietary Tools"
        about="Each tool in this suite operates with zero monthly subscription cost ($0 SaaS). Use the categorized directory below to jump into live page audits, Google PAA harvesting, automated internal link recommendations, or the 33,108-URL competitor gap comparator."
      />

      {/* Category Filter Tabs */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px'
      }}>
        <button
          onClick={() => setActiveCategory('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '9999px',
            border: activeCategory === 'all' ? '2px solid var(--color-primary)' : '1px solid var(--border-medium)',
            background: activeCategory === 'all' ? 'var(--color-primary-dark)' : 'var(--bg-surface)',
            color: activeCategory === 'all' ? '#ffffff' : 'var(--text-secondary)',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          All 13 Tools
        </button>

        {TOOL_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: activeCategory === cat.id ? `2px solid ${cat.accentColor}` : '1px solid var(--border-medium)',
              background: activeCategory === cat.id ? cat.accentColor : 'var(--bg-surface)',
              color: activeCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {cat.name} ({cat.tools.length})
          </button>
        ))}
      </div>

      {/* Grouped Category Sections */}
      {TOOL_CATEGORIES.map(category => {
        const categoryTools = filteredTools.filter(t => t.category === category.id);
        if (categoryTools.length === 0) return null;

        return (
          <div key={category.id} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '8px',
                height: '24px',
                borderRadius: '4px',
                backgroundColor: category.accentColor
              }} />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                  {category.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  {category.shortDescription}
                </p>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px'
            }}>
              {categoryTools.map(tool => {
                const isCopied = copiedId === tool.id;

                return (
                  <div
                    key={tool.id}
                    style={{
                      background: 'var(--bg-surface)',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-bento)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '14px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                  >
                    <div>
                      {/* Top Bar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--color-primary-soft)',
                          color: 'var(--color-primary-dark)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getIcon(tool.categoryIcon, 20)}
                        </div>

                        {tool.badge && (
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            backgroundColor: tool.badgeBg || 'var(--color-primary-soft)',
                            color: tool.badgeColor || 'var(--color-primary-dark)'
                          }}>
                            {tool.badge}
                          </span>
                        )}
                      </div>

                      {/* Title & Path */}
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
                        {tool.name}
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        <code style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: 'var(--color-primary)',
                          background: 'rgba(52, 126, 93, 0.08)',
                          padding: '2px 8px',
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
                            color: 'var(--text-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '2px'
                          }}
                          title="Copy direct URL path"
                        >
                          {isCopied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                        </button>
                      </div>

                      {/* Description */}
                      <p style={{ fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        {tool.description}
                      </p>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                        &bull; {tool.valueProp}
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '12px'
                    }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                        {tool.keyMetrics}
                      </span>

                      <button
                        onClick={() => onSelectTab(tool.id as TabType)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'var(--color-primary-soft)',
                          color: 'var(--color-primary-dark)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span>Launch Tool</span>
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


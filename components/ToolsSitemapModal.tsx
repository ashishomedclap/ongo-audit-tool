'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  ExternalLink,
  Sparkles,
  Link2,
  GitCompare,
  Compass,
  Globe,
  Users,
  Tag,
  Layers,
  FileText,
  SplitSquareVertical,
  Stethoscope,
  BarChart2,
  ArrowRight,
  Activity,
  Check,
  Copy,
  ChevronRight
} from 'lucide-react';
import { TOOLS_DIRECTORY, TOOL_CATEGORIES, ToolDefinition } from '@/lib/tools-sitemap';
import { TabType } from './Navbar';

interface ToolsSitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tab: TabType) => void;
  activeTab: TabType;
}

export default function ToolsSitemapModal({
  isOpen,
  onClose,
  onSelectTool,
  activeTab
}: ToolsSitemapModalProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyPath = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.origin + path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 1800);
  };

  const getIcon = (iconName: string, size = 16) => {
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
    if (selectedCategory !== 'all' && tool.category !== selectedCategory) return false;
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
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(15, 33, 26, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1020px',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.45)',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Search */}
        <div style={{
          padding: '24px 28px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: '#fbfaf7'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-primary-soft)',
                  color: 'var(--color-primary-dark)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  Suite Architecture & Sitemap
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  13 Specialized In-House Tools
                </span>
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-dark)', marginTop: '4px' }}>
                Master Tools Sitemap & Quick Access Directory
              </h2>
            </div>

            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '1px solid var(--border-medium)',
                background: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)'
              }}
              title="Close (Esc)"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-primary-dark)',
                pointerEvents: 'none'
              }}
            />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tool name, SEO intent, or keyword (e.g. harvester, internal links, gap, sitemaps, pricing)..."
              style={{
                width: '100%',
                padding: '13px 44px 13px 46px',
                borderRadius: '12px',
                border: '1.5px solid var(--border-medium)',
                fontSize: '0.9rem',
                color: 'var(--text-primary)',
                background: '#ffffff',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-tertiary)'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                border: selectedCategory === 'all' ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                background: selectedCategory === 'all' ? 'var(--color-primary-dark)' : '#ffffff',
                color: selectedCategory === 'all' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              All Categories ({TOOLS_DIRECTORY.length})
            </button>
            {TOOL_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  border: selectedCategory === cat.id ? `1px solid ${cat.accentColor}` : '1px solid var(--border-subtle)',
                  background: selectedCategory === cat.id ? cat.accentColor : '#ffffff',
                  color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {cat.name} ({cat.tools.length})
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid (Scrollable Body) */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 28px',
          backgroundColor: 'var(--bg-canvas)'
        }}>
          {filteredTools.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-tertiary)' }}>
              <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>No tools matched "{search}"</div>
              <div style={{ fontSize: '0.82rem' }}>Try searching for "harvester", "links", "gap", or "meta"</div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '14px'
            }}>
              {filteredTools.map(tool => {
                const isActive = activeTab === tool.id;
                const isCopied = copiedPath === tool.path;

                return (
                  <div
                    key={tool.id}
                    onClick={() => {
                      onSelectTool(tool.id as TabType);
                      onClose();
                    }}
                    style={{
                      backgroundColor: isActive ? '#f0fdf4' : '#ffffff',
                      border: isActive ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '14px',
                      padding: '18px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                      transition: 'all 0.15s ease',
                      boxShadow: 'var(--shadow-bento)'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.borderColor = 'var(--color-primary-light)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    <div>
                      {/* Top Row: Icon + Badges */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '10px',
                          backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-primary-soft)',
                          color: isActive ? '#ffffff' : 'var(--color-primary-dark)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getIcon(tool.categoryIcon, 17)}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {tool.badge && (
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              backgroundColor: tool.badgeBg || 'var(--color-primary-soft)',
                              color: tool.badgeColor || 'var(--color-primary-dark)'
                            }}>
                              {tool.badge}
                            </span>
                          )}
                          {isActive && (
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              backgroundColor: 'var(--color-primary)',
                              color: '#ffffff'
                            }}>
                              Active
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Tool Title & Slug */}
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
                        {tool.name}
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginBottom: '8px'
                      }}>
                        <code style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: 'var(--color-primary)',
                          background: 'rgba(52, 126, 93, 0.08)',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {tool.path}
                        </code>
                        <button
                          onClick={(e) => handleCopyPath(e, tool.path)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '2px'
                          }}
                          title="Copy direct URL"
                        >
                          {isCopied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                        </button>
                      </div>

                      {/* Description */}
                      <p style={{
                        fontSize: '0.78rem',
                        lineHeight: 1.45,
                        color: 'var(--text-secondary)',
                        margin: 0
                      }}>
                        {tool.description}
                      </p>
                    </div>

                    {/* Bottom CTA & Metrics */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '10px',
                      marginTop: '4px'
                    }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                        {tool.keyMetrics}
                      </span>

                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: 'var(--color-accent)'
                      }}>
                        <span>Open Tool</span>
                        <ChevronRight size={13} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 28px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.76rem',
          color: 'var(--text-tertiary)'
        }}>
          <div>
            Press <kbd style={{ padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-surface-alt)', border: '1px solid var(--border-medium)', fontFamily: 'var(--font-mono)' }}>Esc</kbd> to exit or click any tool to jump instantly.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Shortcut:</span>
            <kbd style={{ padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-surface-alt)', border: '1px solid var(--border-medium)', fontFamily: 'var(--font-mono)' }}>⌘K / Ctrl+K</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}


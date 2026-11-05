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
  ChevronRight,
  BookOpen,
  FolderTree,
  GitMerge,
  FileCode,
  Image as ImageIcon,
  FileCheck2
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
  const [selectedLevel, setSelectedLevel] = useState<number | 'all'>('all');
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
      case 'FileCode': return <FileCode size={size} />;
      case 'Layers': return <Layers size={size} />;
      case 'FileText': return <FileText size={size} />;
      case 'FileCheck2': return <FileCheck2 size={size} />;
      default: return <Activity size={size} />;
    }
  };

  const filteredTools = TOOLS_DIRECTORY.filter(tool => {
    if (selectedLevel !== 'all' && tool.level !== selectedLevel) return false;
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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 100
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '820px',
        maxHeight: '85vh',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FolderTree size={20} color="#74c69d" />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                Master Tools Sitemap · Level 1, 2, 3 Index
              </h2>
              <span style={{ fontSize: '12px', color: '#d8f3dc' }}>
                Jump to any of Ongo's 14 proprietary SEO audit and growth tools
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar & Level Filters */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            padding: '4px 14px',
            marginBottom: '12px'
          }}>
            <Search size={16} color="#64748b" style={{ marginRight: '10px' }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search tools by name, use case, or path (e.g. books, gap, sitemaps, PAA)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                padding: '8px 0',
                fontSize: '14px',
                color: '#1b4332'
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '12px' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Level Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedLevel('all')}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                border: 'none',
                background: selectedLevel === 'all' ? '#1b4332' : '#e2e8f0',
                color: selectedLevel === 'all' ? '#ffffff' : '#475569',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              All Levels (14)
            </button>
            {[1, 2, 3].map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: selectedLevel === lvl ? '#1b4332' : '#e2e8f0',
                  color: selectedLevel === lvl ? '#ffffff' : '#475569',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Level {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Tools List */}
        <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredTools.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              No tools matching "{search}".
            </div>
          ) : (
            filteredTools.map(tool => {
              const isActive = activeTab === tool.id;
              const isCopied = copiedPath === tool.path;

              return (
                <div
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id as TabType)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: isActive ? '1px solid #74c69d' : '1px solid #f1f5f9',
                    backgroundColor: isActive ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? '#1b4332' : '#f1f5f9',
                      color: isActive ? '#ffffff' : '#1b4332',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {getIcon(tool.categoryIcon, 18)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 800, background: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: '4px' }}>
                          L{tool.level}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                          {tool.name}
                        </span>
                        {tool.badge && (
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '9999px',
                            background: tool.badgeBg || '#e2e8f0',
                            color: tool.badgeColor || '#334155'
                          }}>
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <strong>Use Case:</strong> {tool.useCase}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '12px' }}>
                    <button
                      onClick={(e) => handleCopyPath(e, tool.path)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isCopied ? '#16a34a' : '#94a3b8',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Copy URL path"
                    >
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <ChevronRight size={16} color="#94a3b8" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

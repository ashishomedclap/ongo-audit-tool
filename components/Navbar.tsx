'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart2, 
  Globe, 
  Users, 
  Search, 
  Tag, 
  Layers, 
  FileText,
  SplitSquareVertical,
  ExternalLink,
  Stethoscope,
  Compass,
  Sparkles,
  Link2,
  GitCompare,
  GitMerge,
  Image as ImageIcon,
  FolderTree,
  ChevronDown,
  LayoutGrid,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Activity,
  CheckCircle2,
  FileCode,
  FileCheck2,
  RefreshCw,
  Sun,
  Moon,
  Radar,
  X,
  ChevronRight,
  Zap,
  MessageSquare,
  ShieldAlert,
  Bot,
  FlaskConical,
  Scale
} from 'lucide-react';
import OngoLogo from './OngoLogo';
import ToolsSitemapModal from './ToolsSitemapModal';
import MasterSiteScanModal from './MasterSiteScanModal';
import { TOOLS_DIRECTORY, TOOL_CATEGORIES, ToolDefinition } from '@/lib/tools-sitemap';

export type TabType = 
  | 'overview' 
  | 'books'
  | 'ongo-pages'
  | 'clean-scraper' 
  | 'image-audit'
  | 'keywords-harvester' 
  | 'link-flowchart'
  | 'internal-links' 
  | 'competitor-gap' 
  | 'sitemaps' 
  | 'competitors' 
  | 'keywords' 
  | 'patterns' 
  | 'compliance' 
  | 'doctor-eeat'
  | 'state-licensing'
  | 'content-matcher'
  | 'industry-radar'
  | 'pagespeed-benchmark'
  | 'reddit-sentiment'
  | 'meta' 
  | 'architecture' 
  | 'reports'
  | 'suite-sitemap'
  | 'fda-shortages'
  | 'clinical-citations'
  | 'geo-readiness'
  | 'clinical-trials'
  | 'readability-audit'
  | 'content-extractor';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType, bookSlug?: string) => void;
  stats?: {
    totalCompetitors: number;
    activeSitemaps: number;
    totalUrls: number;
  };
}

export default function Navbar({ activeTab, setActiveTab, stats }: NavbarProps) {
  const [sitemapModalOpen, setSitemapModalOpen] = useState(false);
  const [masterScanModalOpen, setMasterScanModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'level-1' | 'level-2' | 'level-3' | 'usa-suite' | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const navRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect and synchronize theme
  useEffect(() => {
    const currentTheme = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') ||
      (localStorage.getItem('ongo-theme') as 'light' | 'dark') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(currentTheme);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('ongo-theme')) {
        const next = e.matches ? 'dark' : 'light';
        setTheme(next);
        document.documentElement.setAttribute('data-theme', next);
      }
    };
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('ongo-theme', nextTheme);
    } catch (e) {}
  };

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        navRef.current && 
        !navRef.current.contains(target) && 
        (!dropdownRef.current || !dropdownRef.current.contains(target))
      ) {
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Find active tool details
  const activeTool = TOOLS_DIRECTORY.find(t => t.id === activeTab);

  const getToolIcon = (iconName: string, size = 15) => {
    switch (iconName) {
      case 'BarChart2': return <BarChart2 size={size} />;
      case 'BookOpen': return <BookOpen size={size} />;
      case 'Compass': return <Compass size={size} />;
      case 'Users': return <Users size={size} />;
      case 'Globe': return <Globe size={size} />;
      case 'GitCompare': return <GitCompare size={size} />;
      case 'Sparkles': return <Sparkles size={size} />;
      case 'Search': return <Search size={size} />;
      case 'SplitSquareVertical': return <SplitSquareVertical size={size} />;
      case 'Link2': return <Link2 size={size} />;
      case 'Layers': return <Layers size={size} />;
      case 'Stethoscope': return <Stethoscope size={size} />;
      case 'Tag': return <Tag size={size} />;
      case 'Image': return <ImageIcon size={size} />;
      case 'GitMerge': return <GitMerge size={size} />;
      case 'FileText': return <FileText size={size} />;
      case 'FileCode': return <FileCode size={size} />;
      case 'FileCheck2': return <FileCheck2 size={size} />;
      case 'Radar': return <Radar size={size} />;
      case 'Zap': return <Zap size={size} />;
      case 'MessageSquare': return <MessageSquare size={size} />;
      case 'ShieldAlert': return <ShieldAlert size={size} />;
      case 'Bot': return <Bot size={size} />;
      case 'FlaskConical': return <FlaskConical size={size} />;
      case 'Scale': return <Scale size={size} />;
      default: return <Activity size={size} />;
    }
  };

  const levelCategories = [
    {
      id: 'level-1' as const,
      levelNum: 1,
      name: 'Level 1: Foundation & Baseline',
      shortLabel: 'L1 Foundation',
      compactLabel: 'L1',
      useCase: 'Audit Ongo 56 live URLs, clone clean offline pages, test image alt tags, study 7 books & benchmark 100 competitors',
      accentColor: '#347e5d',
      tools: TOOLS_DIRECTORY.filter(t => t.level === 1)
    },
    {
      id: 'level-2' as const,
      levelNum: 2,
      name: 'Level 2: Content & Keywords Engine',
      shortLabel: 'L2 Content',
      compactLabel: 'L2',
      useCase: 'Discover 33k topic vacuums with writer briefs, harvest Google PAA ($0), compare moats & analyze 54k keyword volumes',
      accentColor: '#d97706',
      tools: TOOLS_DIRECTORY.filter(t => t.level === 2)
    },
    {
      id: 'level-3' as const,
      levelNum: 3,
      name: 'Level 3: Silos, Equity Flow & Trust',
      shortLabel: 'L3 Silos',
      compactLabel: 'L3',
      useCase: 'Scale 6 topic silos, visualize PageRank equity flowcharts, audit MD E-E-A-T credentials & executive reports',
      accentColor: '#e76f51',
      tools: TOOLS_DIRECTORY.filter(t => t.level === 3)
    },
    {
      id: 'usa-suite' as const,
      levelNum: 'USA',
      name: 'USA Federal Telehealth & AI Suite',
      shortLabel: '🇺🇸 USA Suite',
      compactLabel: 'USA',
      useCase: 'US FDA Drug Shortages Database, Section 503A Safe Harbor, PubMed NLM Citations, Princeton GEO, NIH ClinicalTrials.gov & HTTP Indexability',
      accentColor: '#059669',
      tools: TOOLS_DIRECTORY.filter(t => ['fda-shortages', 'geo-readiness', 'clinical-citations', 'clinical-trials', 'readability-audit', 'content-extractor'].includes(t.id))
    }
  ];

  const activeCategory = levelCategories.find(c => c.id === openDropdown);

  return (
    <>
      <style jsx global>{`
        .nav-label-compact {
          display: none;
        }
        .nav-label-full {
          display: inline;
        }
        .nav-text-desktop {
          display: inline;
        }

        @keyframes megamenuSlideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -6px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .nav-megamenu-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        @media (max-width: 680px) {
          .nav-megamenu-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .nav-megamenu-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .nav-megamenu-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .nav-megamenu-scroll::-webkit-scrollbar-thumb {
          background: rgba(116, 198, 157, 0.28);
          border-radius: 9999px;
        }
        .nav-megamenu-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(116, 198, 157, 0.48);
        }

        @media (max-width: 1200px) {
          .nav-label-full {
            display: none !important;
          }
          .nav-label-compact {
            display: inline !important;
          }
          .nav-text-desktop {
            display: none !important;
          }
        }

        @media (max-width: 820px) {
          .nav-center-scroll {
            justify-content: flex-start !important;
            overflow-x: auto !important;
            max-width: calc(100vw - 190px) !important;
            scrollbar-width: none;
            -ms-overflow-style: none;
            -webkit-overflow-scrolling: touch;
          }
          .nav-center-scroll::-webkit-scrollbar {
            display: none;
          }
        }

        @media (max-width: 580px) {
          .nav-brand-logo {
            width: 32px !important;
            overflow: hidden !important;
          }
          .nav-center-scroll {
            max-width: calc(100vw - 145px) !important;
          }
        }
      `}</style>

      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        backgroundColor: 'rgba(15, 44, 36, 0.94)', /* Deep Imperial Racing Green */
        borderBottom: '1px solid rgba(116, 198, 157, 0.22)',
        boxShadow: '0 4px 24px -2px rgba(10, 28, 22, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.16)'
      }}>
        <div style={{
          maxWidth: '1560px',
          margin: '0 auto',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          minWidth: 0,
          position: 'relative'
        }}>
          {/* Brand: Genuine Ongo Logo */}
          <div className="nav-brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
              title="Ongo Weight Loss Executive Intelligence Suite"
            >
              <OngoLogo variant="dark" height={32} />
            </button>
            {activeTool && activeTab !== 'overview' && (
              <div className="nav-text-desktop" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                fontSize: '11px',
                color: '#d8f3dc',
                fontWeight: 600
              }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.35)' }}>/</span>
                <span>{activeTool.shortName}</span>
              </div>
            )}
          </div>

          {/* Center: Reorganized Level 1, 2, 3 Use-Case Segmented Navigation */}
          <div ref={navRef} className="nav-center-scroll" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 1 auto',
            minWidth: 0
          }}>
            <nav 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                background: 'rgba(10, 28, 22, 0.82)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '9999px',
                padding: '3px 4px',
                whiteSpace: 'nowrap',
                position: 'relative',
                flexShrink: 0,
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.45), 0 1px 0 rgba(255, 255, 255, 0.12)'
              }}
            >
              {/* Level 1, Level 2, Level 3 Categorized Menus */}
              {levelCategories.map((cat) => {
                const isLevelActive = cat.tools.some(t => t.id === activeTab);
                const isOpen = openDropdown === cat.id;

                return (
                  <div key={cat.id} style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(isOpen ? null : cat.id)}
                      aria-expanded={isOpen}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 9px',
                        fontSize: '0.78rem',
                        fontWeight: isLevelActive ? 700 : 500,
                        color: isLevelActive ? '#ffffff' : '#d8f3dc',
                        background: isLevelActive 
                          ? 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)' 
                          : isOpen ? 'rgba(255, 255, 255, 0.16)' : 'transparent',
                        border: isLevelActive 
                          ? '1px solid #74c69d' 
                          : isOpen ? '1px solid rgba(255, 255, 255, 0.35)' : '1px solid transparent',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        whiteSpace: 'nowrap',
                        boxShadow: isOpen ? '0 0 10px rgba(116, 198, 157, 0.3)' : 'none'
                      }}
                      title={cat.useCase}
                    >
                      <span style={{
                        background: isLevelActive 
                          ? (cat.id === 'usa-suite' ? '#34d399' : '#74c69d')
                          : (cat.id === 'usa-suite' ? 'rgba(52, 211, 153, 0.28)' : 'rgba(255, 255, 255, 0.18)'),
                        color: isLevelActive ? '#081c15' : '#ffffff',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        fontSize: '9px',
                        fontWeight: 800
                      }}>
                        {typeof cat.levelNum === 'number' ? `L${cat.levelNum}` : cat.levelNum}
                      </span>
                      <span className="nav-label-full">{cat.shortLabel}</span>
                      <span className="nav-label-compact">{cat.compactLabel}</span>
                      {cat.id === 'usa-suite' && (
                        <span style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: '#34d399',
                          display: 'inline-block'
                        }} />
                      )}
                      <ChevronDown size={11} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s ease' }} />
                    </button>
                  </div>
                );
              })}

              {/* Dedicated Industry Radar Quick Pill */}
              <button
                onClick={() => {
                  setOpenDropdown(null);
                  setActiveTab('industry-radar');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 9px',
                  fontSize: '0.78rem',
                  fontWeight: activeTab === 'industry-radar' ? 700 : 600,
                  color: activeTab === 'industry-radar' ? '#ffffff' : '#bae6fd',
                  background: activeTab === 'industry-radar' 
                    ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' 
                    : 'rgba(2, 132, 199, 0.22)',
                  border: '1px solid rgba(56, 189, 248, 0.45)',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'industry-radar' ? '0 2px 8px rgba(2, 132, 199, 0.4)' : 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
                title="Open Industry Radar (FDA Shortages, 503A Compounding GFI, Live Competitor Prices)"
              >
                <Radar size={12} />
                <span className="nav-label-full">Radar</span>
                <span className="nav-label-compact">Rad</span>
                <span style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: '#38bdf8',
                  display: 'inline-block'
                }} />
              </button>

              {/* Master Sitemap Button directly in the pill menu */}
              <button
                onClick={() => {
                  setOpenDropdown(null);
                  setActiveTab('suite-sitemap');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 9px',
                  fontSize: '0.78rem',
                  fontWeight: activeTab === 'suite-sitemap' ? 700 : 600,
                  color: activeTab === 'suite-sitemap' ? '#ffffff' : '#d8f3dc',
                  background: activeTab === 'suite-sitemap' 
                    ? 'linear-gradient(135deg, #e76f51 0%, #ee8a4f 100%)' 
                    : 'rgba(231, 111, 81, 0.22)',
                  border: '1px solid rgba(231, 111, 81, 0.45)',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'suite-sitemap' ? '0 2px 8px rgba(231, 111, 81, 0.4)' : 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
                title="Open Visual Master Sitemap (All 29 Tools)"
              >
                <FolderTree size={12} />
                <span className="nav-label-full">Sitemap</span>
                <span className="nav-label-compact">29</span>
              </button>
            </nav>
          </div>

          {/* Active Level Executive Mega-Menu Dropdown (Expanded Generous Width) */}
          {activeCategory && (
            <div
              ref={dropdownRef}
              className="nav-megamenu-dropdown nav-megamenu-scroll"
              role="dialog"
              aria-label={`${activeCategory.name} Navigation Menu`}
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'min(880px, calc(100vw - 28px))',
                maxHeight: 'min(640px, calc(100vh - 84px))',
                overflowY: 'auto',
                backgroundColor: theme === 'dark' ? 'rgba(14, 25, 20, 0.97)' : 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(28px) saturate(180%)',
                WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                borderRadius: '20px',
                border: theme === 'dark' ? '1px solid rgba(116, 198, 157, 0.28)' : '1px solid rgba(27, 67, 50, 0.16)',
                boxShadow: theme === 'dark' 
                  ? '0 28px 72px -12px rgba(0, 0, 0, 0.85), 0 10px 30px -4px rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.14)' 
                  : '0 24px 64px -10px rgba(15, 44, 36, 0.22), 0 8px 24px -4px rgba(15, 44, 36, 0.08), inset 0 1px 1px 0 rgba(255, 255, 255, 1)',
                padding: '16px 18px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                color: theme === 'dark' ? '#f2f7f4' : '#0a1411',
                animation: 'megamenuSlideDown 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {/* Dropdown Header: Level Title + Tools Count + Close Button */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '10px',
                borderBottom: theme === 'dark' ? '1px solid rgba(116, 198, 157, 0.16)' : '1px solid rgba(27, 67, 50, 0.10)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
                    color: '#d8f3dc',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    border: '1px solid #74c69d'
                  }}>
                    L{activeCategory.levelNum}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                    color: theme === 'dark' ? '#f2f7f4' : '#0f2c24',
                    textTransform: 'uppercase'
                  }}>
                    {activeCategory.name}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: theme === 'dark' ? 'rgba(34, 197, 94, 0.18)' : '#eaf6ee',
                    color: theme === 'dark' ? '#86efac' : '#1b4332',
                    border: theme === 'dark' ? '1px solid rgba(116, 198, 157, 0.3)' : '1px solid rgba(45, 106, 79, 0.2)'
                  }}>
                    {activeCategory.tools.length} Specialized Audits
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(null)}
                    aria-label="Close dropdown"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                      border: 'none',
                      color: theme === 'dark' ? '#9cb1a5' : '#64748b',
                      cursor: 'pointer',
                      transition: 'all 0.12s ease'
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Executive Objective Callout Banner */}
              <div style={{
                padding: '10px 14px',
                borderRadius: '12px',
                background: theme === 'dark'
                  ? 'linear-gradient(135deg, rgba(20, 45, 34, 0.75) 0%, rgba(35, 30, 18, 0.5) 100%)'
                  : 'linear-gradient(135deg, rgba(234, 246, 238, 0.95) 0%, rgba(254, 243, 199, 0.45) 100%)',
                border: theme === 'dark' ? '1px solid rgba(116, 198, 157, 0.24)' : '1px solid rgba(45, 106, 79, 0.16)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '7px',
                  background: 'linear-gradient(135deg, #c59b27 0%, #fbbf24 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(197, 155, 39, 0.35)'
                }}>
                  <Sparkles size={13} style={{ color: '#0f2c24' }} />
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '11.5px',
                  lineHeight: 1.45,
                  color: theme === 'dark' ? '#d8f3dc' : '#1f3b2d'
                }}>
                  <strong style={{ color: theme === 'dark' ? '#fbbf24' : '#92400e', marginRight: '4px' }}>EXECUTIVE SCOPE:</strong>
                  {activeCategory.useCase}
                </p>
              </div>

              {/* 2-Column Responsive Tools Grid */}
              <div className="nav-megamenu-grid">
                {activeCategory.tools.map(tool => {
                  const isCurrent = activeTab === tool.id;
                  const isBooks = tool.id === 'books';

                  return (
                    <div
                      key={tool.id}
                      style={{
                        gridColumn: isBooks ? '1 / -1' : 'auto'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab(tool.id as TabType);
                          setOpenDropdown(null);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: isBooks ? '12px 14px 10px 14px' : '11px 13px',
                          borderRadius: '12px',
                          border: isCurrent
                            ? '1px solid #10b981'
                            : theme === 'dark' ? '1px solid rgba(116, 198, 157, 0.16)' : '1px solid rgba(27, 67, 50, 0.10)',
                          background: isCurrent
                            ? theme === 'dark' ? 'rgba(34, 197, 94, 0.18)' : '#edf7f1'
                            : theme === 'dark' ? 'rgba(20, 36, 29, 0.55)' : 'rgba(255, 255, 255, 0.85)',
                          color: isCurrent 
                            ? theme === 'dark' ? '#86efac' : '#166534'
                            : theme === 'dark' ? '#f2f7f4' : '#0a1411',
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                          transition: 'all 0.14s ease',
                          boxShadow: isCurrent
                            ? '0 0 0 1px rgba(16, 185, 129, 0.4), 0 4px 12px rgba(16, 185, 129, 0.15)'
                            : theme === 'dark' ? '0 2px 6px rgba(0, 0, 0, 0.35)' : '0 2px 6px rgba(15, 44, 36, 0.04)'
                        }}
                        onMouseEnter={(e) => {
                          if (!isCurrent) {
                            e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(34, 60, 48, 0.85)' : 'rgba(240, 253, 244, 0.95)';
                            e.currentTarget.style.borderColor = '#74c69d';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = theme === 'dark' ? '0 8px 20px -4px rgba(0, 0, 0, 0.65)' : '0 8px 18px -4px rgba(15, 44, 36, 0.12)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isCurrent) {
                            e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(20, 36, 29, 0.55)' : 'rgba(255, 255, 255, 0.85)';
                            e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(116, 198, 157, 0.16)' : 'rgba(27, 67, 50, 0.10)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = theme === 'dark' ? '0 2px 6px rgba(0, 0, 0, 0.35)' : '0 2px 6px rgba(15, 44, 36, 0.04)';
                          }
                        }}
                      >
                        {/* Tool Icon Squircle */}
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          background: isCurrent
                            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                            : theme === 'dark'
                              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.22) 0%, rgba(20, 50, 35, 0.5) 100%)'
                              : 'linear-gradient(135deg, #eef7f2 0%, #e1f0e8 100%)',
                          color: isCurrent
                            ? '#ffffff'
                            : theme === 'dark' ? '#86efac' : '#1b4332',
                          border: isCurrent
                            ? '1px solid #34d399'
                            : theme === 'dark' ? '1px solid rgba(116, 198, 157, 0.28)' : '1px solid rgba(27, 67, 50, 0.14)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: isCurrent ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
                        }}>
                          {getToolIcon(tool.categoryIcon, 17)}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          {/* Header: Name + Badge */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              fontSize: '13.5px',
                              fontWeight: isCurrent ? 800 : 700,
                              color: isCurrent 
                                ? (theme === 'dark' ? '#86efac' : '#166534')
                                : (theme === 'dark' ? '#f2f7f4' : '#0a1411'),
                              lineHeight: 1.3
                            }}>
                              {tool.name}
                            </span>
                            {tool.badge && (
                              <span style={{
                                fontSize: '9.5px',
                                padding: '2px 6px',
                                borderRadius: '9999px',
                                background: tool.badgeBg || (theme === 'dark' ? 'rgba(34, 197, 94, 0.2)' : '#e2e8f0'),
                                color: tool.badgeColor || (theme === 'dark' ? '#86efac' : '#334155'),
                                fontWeight: 800,
                                whiteSpace: 'nowrap',
                                flexShrink: 0
                              }}>
                                {tool.badge}
                              </span>
                            )}
                          </div>

                          {/* Description / Use Case */}
                          <div style={{
                            fontSize: '11px',
                            color: theme === 'dark' ? '#9cb1a5' : '#475569',
                            marginTop: '3px',
                            lineHeight: 1.4
                          }}>
                            {tool.useCase}
                          </div>

                          {/* Books Library Volume Selector */}
                          {isBooks && (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                flexWrap: 'wrap',
                                marginTop: '10px',
                                paddingTop: '8px',
                                borderTop: theme === 'dark' ? '1px solid rgba(116, 198, 157, 0.18)' : '1px solid #e2e8f0'
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span style={{
                                fontSize: '10px',
                                color: theme === 'dark' ? '#86efac' : '#1b4332',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                marginRight: '2px'
                              }}>
                                7 VOLUMES:
                              </span>
                              {[
                                { num: 1, slug: 'the-foundation', title: '01 Foundation' },
                                { num: 2, slug: 'earned-not-built', title: '02 Earned' },
                                { num: 3, slug: 'site-architecture', title: '03 Architecture' },
                                { num: 4, slug: 'on-page-seo-for-nextjs', title: '04 Next.js' },
                                { num: 5, slug: 'organic-social-media', title: '05 Social' },
                                { num: 6, slug: 'writing-for-a-health-brand', title: '06 Writing' },
                                { num: 7, slug: 'analytics-and-reporting', title: '07 Analytics' }
                              ].map(b => (
                                <button
                                  key={b.slug}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveTab('books', b.slug);
                                    setOpenDropdown(null);
                                  }}
                                  style={{
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    padding: '3px 7px',
                                    borderRadius: '5px',
                                    background: theme === 'dark' ? 'rgba(34, 197, 94, 0.16)' : '#f1f5f9',
                                    color: theme === 'dark' ? '#d8f3dc' : '#1b4332',
                                    border: theme === 'dark' ? '1px solid rgba(116, 198, 157, 0.28)' : '1px solid #cbd5e1',
                                    cursor: 'pointer',
                                    transition: 'all 0.12s ease',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '3px'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#2d6a4f' : '#dcfce7';
                                    e.currentTarget.style.borderColor = '#74c69d';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(34, 197, 94, 0.16)' : '#f1f5f9';
                                    e.currentTarget.style.borderColor = theme === 'dark' ? 'rgba(116, 198, 157, 0.28)' : '#cbd5e1';
                                  }}
                                  title={`Jump directly to Book 0${b.num}: ${b.title}`}
                                >
                                  {b.title}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Dropdown Footer: Quick Links & Full Scan Shortcut */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '10px',
                marginTop: '2px',
                borderTop: theme === 'dark' ? '1px solid rgba(116, 198, 157, 0.16)' : '1px solid rgba(27, 67, 50, 0.10)',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenDropdown(null);
                    setActiveTab('suite-sitemap');
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: theme === 'dark' ? '#86efac' : '#1b4332',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 6px',
                    borderRadius: '6px',
                    transition: 'all 0.12s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  <FolderTree size={13} />
                  <span>View All 29 Tools in Visual Master Sitemap</span>
                  <ChevronRight size={12} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="glowing-dot glowing-dot-emerald" style={{ width: '6px', height: '6px' }} />
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    color: theme === 'dark' ? '#9cb1a5' : '#64748b'
                  }}>
                    {typeof activeCategory.levelNum === 'number' ? `Level ${activeCategory.levelNum}` : activeCategory.levelNum} · Ready for Audit
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Right Action: Master Site Scan, Search Modal, Theme Mode Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* Master Site Scan Button */}
            <button
              onClick={() => setMasterScanModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 9px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#ffffff',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: '1px solid #34d399',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
              title="Crawl entire live website (sitemap.xml) and refresh tools database"
            >
              <span className="glowing-dot glowing-dot-emerald glowing-dot-pulse" style={{ width: '5px', height: '5px' }} />
              <RefreshCw size={11} />
              <span className="nav-text-desktop">Scan</span>
              <span style={{
                background: 'rgba(0, 0, 0, 0.26)',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
                padding: '1px 5px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 800
              }}>
                56
              </span>
            </button>

            {/* Sitemap & Command Palette Search Modal */}
            <button
              onClick={() => setSitemapModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 9px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#d8f3dc',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
              title="Open Quick Search & Command Palette (⌘K)"
            >
              <Search size={12} />
              <span className="nav-text-desktop">Search</span>
              <kbd style={{
                fontSize: '9px',
                fontFamily: 'inherit',
                background: 'rgba(255, 255, 255, 0.14)',
                padding: '1px 4px',
                borderRadius: '3px',
                color: '#d8f3dc'
              }} className="nav-text-desktop">
                ⌘K
              </kbd>
            </button>

            {/* Classy Dark / Light Theme Mode Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                padding: 0,
                color: theme === 'dark' ? '#86efac' : '#d8f3dc',
                background: theme === 'dark' ? 'rgba(34, 197, 94, 0.16)' : 'rgba(255, 255, 255, 0.08)',
                border: theme === 'dark' ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: theme === 'dark' ? '0 0 10px rgba(74, 222, 128, 0.2)' : 'none',
                flexShrink: 0
              }}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark and Light Mode"
            >
              {theme === 'dark' ? <Sun size={13} style={{ color: '#4ade80' }} /> : <Moon size={13} style={{ color: '#d8f3dc' }} />}
            </button>

            {stats && (
              <div style={{
                display: 'none',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.75)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
                paddingLeft: '10px'
              }} className="lg-flex">
                <span><strong>100</strong> Brands</span>
                <span>•</span>
                <span><strong>35k</strong> URLs</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Visual Tools Sitemap Modal */}
      <ToolsSitemapModal
        isOpen={sitemapModalOpen}
        onClose={() => setSitemapModalOpen(false)}
        onSelectTool={(tab: TabType) => {
          setActiveTab(tab);
          setSitemapModalOpen(false);
        }}
        activeTab={activeTab}
      />
      {/* Master Website Scanner Modal */}
      <MasterSiteScanModal
        isOpen={masterScanModalOpen}
        onClose={() => setMasterScanModalOpen(false)}
      />
    </>
  );
}

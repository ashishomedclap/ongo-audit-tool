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
  Radar
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
  | 'meta' 
  | 'architecture' 
  | 'reports'
  | 'suite-sitemap';

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
  const [openDropdown, setOpenDropdown] = useState<'level-1' | 'level-2' | 'level-3' | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const navRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      default: return <Activity size={size} />;
    }
  };

  const levelCategories = [
    {
      id: 'level-1' as const,
      levelNum: 1,
      name: 'Level 1: Foundation & Baseline',
      shortLabel: 'L1 Foundation',
      useCase: 'Audit Ongo 56 live URLs, clone clean offline pages, test image alt tags, study 7 books & benchmark 100 competitors',
      accentColor: '#347e5d',
      tools: TOOLS_DIRECTORY.filter(t => t.level === 1)
    },
    {
      id: 'level-2' as const,
      levelNum: 2,
      name: 'Level 2: Content & Keywords Engine',
      shortLabel: 'L2 Content & Keywords',
      useCase: 'Discover 33k topic vacuums with writer briefs, harvest Google PAA ($0), compare moats & analyze 54k keyword volumes',
      accentColor: '#d97706',
      tools: TOOLS_DIRECTORY.filter(t => t.level === 2)
    },
    {
      id: 'level-3' as const,
      levelNum: 3,
      name: 'Level 3: Silos, Equity Flow & Trust',
      shortLabel: 'L3 Silos & Governance',
      useCase: 'Scale 6 topic silos, visualize PageRank equity flowcharts, audit MD E-E-A-T credentials & executive reports',
      accentColor: '#e76f51',
      tools: TOOLS_DIRECTORY.filter(t => t.level === 3)
    }
  ];

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(27, 67, 50, 0.98)', /* Ongo Deep Forest Racing Green */
        borderBottom: '1px solid rgba(116, 198, 157, 0.22)',
        boxShadow: '0 4px 20px -2px rgba(15, 44, 36, 0.35)'
      }}>
        <div style={{
          maxWidth: '1560px',
          margin: '0 auto',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px'
        }}>
          {/* Brand: Genuine Ongo Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
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
              <OngoLogo variant="dark" height={34} />
            </button>

            {/* Active Level Cue */}
            {activeTool && (
              <div style={{
                display: 'none',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(15, 44, 36, 0.6)',
                border: '1px solid rgba(116, 198, 157, 0.2)',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '11px',
                color: '#d8f3dc'
              }} className="md-flex">
                <span style={{
                  color: '#74c69d',
                  fontWeight: 800,
                  fontSize: '10px',
                  background: 'rgba(116, 198, 157, 0.2)',
                  padding: '1px 5px',
                  borderRadius: '4px'
                }}>
                  L{activeTool.level}
                </span>
                <span style={{ fontWeight: 600 }}>{activeTool.shortName}</span>
              </div>
            )}
          </div>

          {/* Center: Reorganized Level 1, 2, 3 Use-Case Segmented Navigation */}
          <div ref={navRef} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '1 1 auto',
            minWidth: 0
          }}>
            <nav 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(15, 44, 36, 0.78)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '9999px',
                padding: '4px 6px',
                overflowX: 'visible',
                position: 'relative'
              }}
            >
              {/* Level 1, Level 2, Level 3 Categorized Menus */}
              {levelCategories.map((cat) => {
                const isLevelActive = cat.tools.some(t => t.id === activeTab);
                const isOpen = openDropdown === cat.id;

                return (
                  <div key={cat.id} style={{ position: 'relative' }}>
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : cat.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        fontSize: '0.8rem',
                        fontWeight: isLevelActive ? 700 : 500,
                        color: isLevelActive ? '#ffffff' : '#d8f3dc',
                        background: isLevelActive 
                          ? 'linear-gradient(135deg, #2d6a4f 0%, #1b4332 100%)' 
                          : isOpen ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
                        border: isLevelActive ? '1px solid #74c69d' : '1px solid transparent',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        whiteSpace: 'nowrap'
                      }}
                      title={cat.useCase}
                    >
                      <span style={{
                        background: isLevelActive ? '#74c69d' : 'rgba(255, 255, 255, 0.18)',
                        color: isLevelActive ? '#081c15' : '#ffffff',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        fontSize: '9px',
                        fontWeight: 800
                      }}>
                        L{cat.levelNum}
                      </span>
                      <span>{cat.shortLabel}</span>
                      <ChevronDown size={11} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                    </button>

                    {/* Level Dropdown Menu with Ordered Use Cases */}
                    {isOpen && (
                      <div style={{
                        position: 'absolute',
                        top: 'calc(100% + 10px)',
                        left: cat.levelNum === 1 ? '0' : cat.levelNum === 2 ? '50%' : 'auto',
                        right: cat.levelNum === 3 ? '0' : 'auto',
                        transform: cat.levelNum === 2 ? 'translateX(-50%)' : 'none',
                        width: '390px',
                        maxHeight: '480px',
                        overflowY: 'auto',
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                        border: '1px solid #e2e8f0',
                        padding: '12px',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}>
                        {/* Dropdown Header with Explicit Use Case Banner */}
                        <div style={{
                          padding: '10px 12px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '10px',
                          border: '1px solid #e2e8f0',
                          marginBottom: '4px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#1b4332', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {cat.name}
                            </span>
                            <span style={{ fontSize: '10px', background: '#e2e8f0', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, color: '#475569' }}>
                              {cat.tools.length} Tools
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>
                            <strong>Use Case:</strong> {cat.useCase}
                          </p>
                        </div>

                        {/* List of Ordered Tools in this Level */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          {cat.tools.map(tool => {
                            const isCurrent = activeTab === tool.id;
                            return (
                              <button
                                key={tool.id}
                                onClick={() => {
                                  setActiveTab(tool.id as TabType);
                                  setOpenDropdown(null);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '10px',
                                  padding: '8px 10px',
                                  borderRadius: '8px',
                                  border: isCurrent ? '1px solid #a7f3d0' : '1px solid transparent',
                                  background: isCurrent ? '#f0fdf4' : 'transparent',
                                  color: isCurrent ? '#166534' : '#1e293b',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  width: '100%',
                                  transition: 'all 0.12s ease'
                                }}
                                onMouseEnter={(e) => {
                                  if (!isCurrent) e.currentTarget.style.backgroundColor = '#f8fafc';
                                }}
                                onMouseLeave={(e) => {
                                  if (!isCurrent) e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <div style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '6px',
                                  backgroundColor: isCurrent ? '#1b4332' : '#f1f5f9',
                                  color: isCurrent ? '#ffffff' : '#334155',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  marginTop: '1px'
                                }}>
                                  {getToolIcon(tool.categoryIcon, 14)}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', fontWeight: isCurrent ? 700 : 600 }}>
                                      {tool.name}
                                    </span>
                                    {tool.badge && (
                                      <span style={{
                                        fontSize: '10px',
                                        padding: '1px 6px',
                                        borderRadius: '9999px',
                                        background: tool.badgeBg || '#e2e8f0',
                                        color: tool.badgeColor || '#334155',
                                        fontWeight: 700
                                      }}>
                                        {tool.badge}
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>
                                    {tool.useCase}
                                  </div>

                                  {tool.id === 'books' && (
                                    <div style={{
                                      display: 'flex',
                                      gap: '4px',
                                      flexWrap: 'wrap',
                                      marginTop: '8px',
                                      paddingTop: '6px',
                                      borderTop: '1px solid #f1f5f9'
                                    }} onClick={(e) => e.stopPropagation()}>
                                      <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, alignSelf: 'center', marginRight: '2px' }}>
                                        Vol:
                                      </span>
                                      {[
                                        { num: 1, slug: 'the-foundation', title: 'Foundation' },
                                        { num: 2, slug: 'earned-not-built', title: 'Earned' },
                                        { num: 3, slug: 'site-architecture', title: 'Architecture' },
                                        { num: 4, slug: 'on-page-seo-for-nextjs', title: 'Next.js SEO' },
                                        { num: 5, slug: 'organic-social-media', title: 'Social' },
                                        { num: 6, slug: 'writing-for-a-health-brand', title: 'Writing' },
                                        { num: 7, slug: 'analytics-and-reporting', title: 'Analytics' }
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
                                            padding: '2px 5px',
                                            borderRadius: '4px',
                                            background: '#f1f5f9',
                                            color: '#1b4332',
                                            border: '1px solid #cbd5e1',
                                            cursor: 'pointer'
                                          }}
                                          title={`Jump to Book ${b.num}: ${b.title}`}
                                        >
                                          0{b.num}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
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
                  gap: '6px',
                  padding: '6px 13px',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === 'industry-radar' ? 700 : 600,
                  color: activeTab === 'industry-radar' ? '#ffffff' : '#bae6fd',
                  background: activeTab === 'industry-radar' 
                    ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' 
                    : 'rgba(2, 132, 199, 0.22)',
                  border: '1px solid rgba(56, 189, 248, 0.45)',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'industry-radar' ? '0 2px 10px rgba(2, 132, 199, 0.4)' : 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
                title="Open Industry Radar (FDA Shortages, 503A Compounding GFI, Live Competitor Prices)"
              >
                <Radar size={13} />
                <span>Radar</span>
                <span style={{
                  width: '6px',
                  height: '6px',
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
                  gap: '6px',
                  padding: '6px 14px',
                  fontSize: '0.8rem',
                  fontWeight: activeTab === 'suite-sitemap' ? 700 : 600,
                  color: activeTab === 'suite-sitemap' ? '#ffffff' : '#d8f3dc',
                  background: activeTab === 'suite-sitemap' 
                    ? 'linear-gradient(135deg, #e76f51 0%, #ee8a4f 100%)' 
                    : 'rgba(231, 111, 81, 0.22)',
                  border: '1px solid rgba(231, 111, 81, 0.45)',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'suite-sitemap' ? '0 2px 10px rgba(231, 111, 81, 0.4)' : 'none',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
                title="Open Visual Master Sitemap (All 3 Levels & Use Cases)"
              >
                <FolderTree size={13} />
                <span>Sitemap ({TOOLS_DIRECTORY.length} Tools)</span>
              </button>
            </nav>
          </div>

          {/* Right Action: Master Site Scan & Quick Modal Sitemap Button & Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => setMasterScanModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#ffffff',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: '1px solid #34d399',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.15s ease'
              }}
              title="Crawl entire live website (sitemap.xml) and refresh tools database"
            >
              <RefreshCw size={12} />
              <span>Master Site Scan</span>
              <span style={{
                background: 'rgba(0, 0, 0, 0.22)',
                padding: '1px 5px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 800
              }}>
                56 URLs
              </span>
            </button>

            <button
              onClick={() => setSitemapModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#d8f3dc',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title="Open Quick Search Sitemap Modal"
            >
              <Search size={13} />
              <span>Sitemap Modal</span>
            </button>

            {/* Classy Dark / Light Theme Mode Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                color: theme === 'dark' ? '#86efac' : '#d8f3dc',
                background: theme === 'dark' ? 'rgba(34, 197, 94, 0.16)' : 'rgba(255, 255, 255, 0.08)',
                border: theme === 'dark' ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: theme === 'dark' ? '0 0 10px rgba(74, 222, 128, 0.2)' : 'none'
              }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Dark and Light Mode"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={13} style={{ color: '#4ade80' }} />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon size={13} style={{ color: '#d8f3dc' }} />
                  <span>Dark</span>
                </>
              )}
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

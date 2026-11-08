'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart2, 
  Users, 
  Globe, 
  Stethoscope, 
  ShieldCheck, 
  GitCompare, 
  BookOpen, 
  Search, 
  Sun, 
  Moon, 
  ChevronDown, 
  X,
  Layers,
  Database,
  MapPin,
  FileText,
  Activity,
  Zap,
  Sparkles,
  Command,
  ExternalLink,
  ShieldAlert,
  Bot,
  FlaskConical,
  TrendingUp,
  FileCode,
  Image,
  Award,
  Scale,
  Compass,
  MessageSquare,
  FileCheck2,
  FolderTree,
  ArrowUpRight
} from 'lucide-react';
import OngoLogo from './OngoLogo';
import { TOOLS_DIRECTORY, ToolDefinition } from '@/lib/tools-sitemap';

export type TabType = 
  | 'overview' 
  | 'competitors' 
  | 'sitemaps' 
  | 'doctor-eeat' 
  | 'compliance' 
  | 'state-licensing' 
  | 'competitor-gap' 
  | 'keywords' 
  | 'architecture' 
  | 'ongo-pages' 
  | 'meta'
  | 'books' 
  | 'clean-scraper' 
  | 'image-audit' 
  | 'keywords-harvester' 
  | 'link-flowchart' 
  | 'internal-links' 
  | 'patterns' 
  | 'content-matcher' 
  | 'suite-sitemap' 
  | 'reports' 
  | 'seo-vault' 
  | 'industry-radar'
  | 'fda-shortages'
  | 'pagespeed-benchmark'
  | 'reddit-sentiment'
  | 'clinical-citations'
  | 'geo-readiness'
  | 'clinical-trials'
  | 'readability-audit'
  | 'content-extractor';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  stats: {
    totalCompetitors: number;
    activeSitemaps: number;
    totalUrls: number;
  };
}

type MegaMenuId = 'competitors' | 'clinical' | 'seo' | 'architecture' | null;

interface MegaMenuSection {
  id: MegaMenuId;
  label: string;
  badge?: string;
  featured: {
    title: string;
    badge: string;
    description: string;
    stat: string;
    statLabel: string;
    tab: TabType;
    actionLabel: string;
  };
  tools: {
    id: TabType;
    name: string;
    desc: string;
    badge?: string;
    icon: React.ReactNode;
    color: string;
  }[];
}

export default function Navbar({ activeTab, setActiveTab, stats }: NavbarProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeMenu, setActiveMenu] = useState<MegaMenuId>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize theme
  useEffect(() => {
    const saved = localStorage.getItem('ongo-theme') as 'light' | 'dark' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = isDark ? 'dark' : 'light';
      setTheme(initial);
      document.documentElement.setAttribute('data-theme', initial);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('ongo-theme', next);
    } catch {}
  };

  // Keyboard shortcut ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
        setActiveMenu(null);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setActiveMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close mega menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Mega Menu Configurations
  const megaMenus: MegaMenuSection[] = [
    {
      id: 'competitors',
      label: 'Competitors & Sitemaps',
      badge: '618',
      featured: {
        title: 'Competitor Census 618',
        badge: 'Flagship Feed',
        description: 'Complete reverse-engineered database of 618 US telehealth clinics with real-time pricing and sitemaps.',
        stat: '618 Brands',
        statLabel: '383 Active XML Feeds',
        tab: 'competitors',
        actionLabel: 'Open Competitor Directory →'
      },
      tools: [
        {
          id: 'competitors',
          name: 'Competitor Directory',
          desc: 'Filter 618 telehealth clinics by pricing, MD oversight & XML status',
          badge: '618 Brands',
          icon: <Users size={15} />,
          color: '#10b981'
        },
        {
          id: 'sitemaps',
          name: 'Sitemap & HTTP Explorer',
          desc: 'Audit 383 live XML feeds, HTTP status codes, latency in ms & drug URLs',
          badge: '383 Feeds',
          icon: <Globe size={15} />,
          color: '#2563eb'
        },
        {
          id: 'competitor-gap',
          name: 'Competitor Content Gap',
          desc: 'Mine 512,334 competitor URLs against Ongo to surface missing topic clusters',
          badge: '512k URLs',
          icon: <GitCompare size={15} />,
          color: '#e76f51'
        },
        {
          id: 'industry-radar',
          name: 'Industry Telehealth Radar',
          desc: 'Macro market share, organic traffic trajectories & rival ranking saturation',
          icon: <TrendingUp size={15} />,
          color: '#7c3aed'
        },
        {
          id: 'clean-scraper',
          name: 'Clean Page Cloner',
          desc: 'Strip bulky Next.js hydration, inline pure CSS & inspect pages offline',
          icon: <FileCode size={15} />,
          color: '#0891b2'
        },
        {
          id: 'patterns',
          name: 'Common vs Unique Patterns',
          desc: 'Classify common drug URLs vs proprietary commercial funnels',
          icon: <Layers size={15} />,
          color: '#d97706'
        }
      ]
    },
    {
      id: 'clinical',
      label: 'Clinical & Legal (E-E-A-T)',
      badge: 'Grade A+',
      featured: {
        title: '100% Physician-Led Care',
        badge: 'Grade A+ E-E-A-T',
        description: 'Ongo is governed by 5 board-certified US Medical Doctors (MD/MBA) with verified CMS NPI credentials.',
        stat: '5 Board MDs',
        statLabel: '50-State Telehealth',
        tab: 'doctor-eeat',
        actionLabel: 'Verify Doctor Credentials →'
      },
      tools: [
        {
          id: 'doctor-eeat',
          name: 'Doctor Credentials & E-E-A-T',
          desc: 'Verify Medical Director credentials, board certifications & CMS NPIs',
          badge: 'NPI Registry',
          icon: <Stethoscope size={15} />,
          color: '#10b981'
        },
        {
          id: 'compliance',
          name: '503A Compounding Pharmacy',
          desc: 'Audit sterile cleanroom compliance (USP <797>), cold shipping & COAs',
          badge: 'USP <797>',
          icon: <ShieldCheck size={15} />,
          color: '#2563eb'
        },
        {
          id: 'state-licensing',
          name: '50-State Licensing Matrix',
          desc: 'Map telehealth prescribing laws, video mandates & excluded states',
          badge: '50 States',
          icon: <MapPin size={15} />,
          color: '#e76f51'
        },
        {
          id: 'fda-shortages',
          name: 'FDA Drug Shortage Watchdog',
          desc: 'Track FDA Semaglutide/Tirzepatide shortage status & compounding rules',
          badge: 'FDA Watch',
          icon: <ShieldAlert size={15} />,
          color: '#d97706'
        },
        {
          id: 'clinical-trials',
          name: 'Clinical Trials Database',
          desc: 'Explore STEP and SURMOUNT clinical evidence, dosage arms & weight loss %',
          icon: <Activity size={15} />,
          color: '#7c3aed'
        },
        {
          id: 'clinical-citations',
          name: 'Clinical Citation Auditor',
          desc: 'Inspect medical literature references, PubMed IDs & peer-reviewed sources',
          icon: <FlaskConical size={15} />,
          color: '#0891b2'
        }
      ]
    },
    {
      id: 'seo',
      label: 'SEO & Growth Engines',
      badge: '54k KW',
      featured: {
        title: 'SEMrush SEO Vault',
        badge: '7,888 Backlinks',
        description: 'Curated keyword intelligence database indexing 531 high-intent keywords and authority backlink profiles.',
        stat: '531 Keywords',
        statLabel: '7,888 Live Backlinks',
        tab: 'seo-vault',
        actionLabel: 'Launch SEMrush Vault →'
      },
      tools: [
        {
          id: 'seo-vault',
          name: 'SEMrush SEO Vault',
          desc: '531 prioritized organic keywords, search volumes, KD & 7,888 backlinks',
          badge: 'SEMrush Live',
          icon: <Database size={15} />,
          color: '#2563eb'
        },
        {
          id: 'keywords',
          name: 'Keywords & Slug Matrix',
          desc: '54,841 prioritized patient keywords extracted from 11 top rivals',
          badge: '54,841 KW',
          icon: <Search size={15} />,
          color: '#10b981'
        },
        {
          id: 'keywords-harvester',
          name: 'Google Suggest Harvester',
          desc: 'Mine real-time patient questions and People Also Ask (PAA) queries',
          badge: 'PAA Mine',
          icon: <Zap size={15} />,
          color: '#d97706'
        },
        {
          id: 'meta',
          name: 'Meta Tag & CTR Auditor',
          desc: 'Inspect titles, descriptions, character counts & simulate Google SERP snippets',
          icon: <FileText size={15} />,
          color: '#0891b2'
        },
        {
          id: 'internal-links',
          name: 'Internal Link Equity Engine',
          desc: 'Audit PageRank circulation, internal anchor distribution & silo mesh',
          icon: <Sparkles size={15} />,
          color: '#7c3aed'
        },
        {
          id: 'pagespeed-benchmark',
          name: 'Core Web Vitals & Speed',
          desc: 'Benchmark LCP, CLS, TTFB, and mobile performance scores vs rivals',
          icon: <Activity size={15} />,
          color: '#e76f51'
        },
        {
          id: 'geo-readiness',
          name: 'GEO AI Engine Visibility',
          desc: 'Audit citation readiness for Perplexity, ChatGPT Search, and Gemini',
          badge: 'AI Search',
          icon: <Bot size={15} />,
          color: '#10b981'
        },
        {
          id: 'reddit-sentiment',
          name: 'Reddit Patient Sentiment',
          desc: 'Analyze patient sentiment, side effect concerns & r/Semaglutide feedback',
          icon: <MessageSquare size={15} />,
          color: '#f97316'
        },
        {
          id: 'readability-audit',
          name: 'Clinical Readability Audit',
          desc: 'Flesch-Kincaid grade evaluation for patient-friendly healthcare copy',
          icon: <Award size={15} />,
          color: '#059669'
        }
      ]
    },
    {
      id: 'architecture',
      label: 'Architecture & Books',
      badge: '7 Books',
      featured: {
        title: '7 Onboarding Books Library',
        badge: '2,924 Pages',
        description: 'Complete digital onboarding playbooks covering clinical compounding, technical SEO, and telehealth compliance.',
        stat: '7 Volumes',
        statLabel: '518,620 Words',
        tab: 'books',
        actionLabel: 'Open Books Digital Library →'
      },
      tools: [
        {
          id: 'books',
          name: '7 Books Digital Library',
          desc: 'Read, search (Ctrl+F) and download all 7 updated onboarding PDF playbooks',
          badge: '7 Books',
          icon: <BookOpen size={15} />,
          color: '#10b981'
        },
        {
          id: 'architecture',
          name: '217-Page Silo Blueprint',
          desc: 'Interactive roadmap spanning 6 silos with priority P0, P1, and P2 tiers',
          badge: '217 URLs',
          icon: <Layers size={15} />,
          color: '#2563eb'
        },
        {
          id: 'ongo-pages',
          name: 'Ongo 56 Production Pages',
          desc: 'Live inventory of all 56 routes with HTTP status, title tags & silos',
          badge: '56 Live',
          icon: <Compass size={15} />,
          color: '#e76f51'
        },
        {
          id: 'reports',
          name: 'Executive Strategy Reports',
          desc: 'Board briefs, regulatory filings & comprehensive telehealth census',
          icon: <FileText size={15} />,
          color: '#7c3aed'
        },
        {
          id: 'link-flowchart',
          name: 'Link Mesh Flowchart',
          desc: 'Interactive visual node graph of internal links and silo hierarchy',
          icon: <Activity size={15} />,
          color: '#0891b2'
        },
        {
          id: 'suite-sitemap',
          name: 'Master 31-Tool Sitemap',
          desc: 'Complete index and directory of all 31 specialized audit tools',
          badge: 'All Tools',
          icon: <FolderTree size={15} />,
          color: '#d97706'
        }
      ]
    }
  ];

  // Helper to get active label
  const getActiveTabTitle = (): string => {
    if (activeTab === 'overview') return 'Overview Dashboard';
    for (const menu of megaMenus) {
      const found = menu.tools.find(t => t.id === activeTab);
      if (found) return found.name;
    }
    return 'Specialized Tool';
  };

  // Filter tools for Command Palette search
  const filteredTools = TOOLS_DIRECTORY.filter(t => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.shortName.toLowerCase().includes(q) || t.useCase.toLowerCase().includes(q);
  });

  return (
    <>
      {/* Fixed World-Class Mega Menu Topbar */}
      <header 
        ref={navContainerRef}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: '56px',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.03)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          transition: 'all 0.15s ease'
        }}
      >
        <div style={{
          maxWidth: '1600px',
          height: '100%',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Left: Brand + Current Workspace Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <button
              onClick={() => {
                setActiveTab('overview');
                setActiveMenu(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
              title="Return to Overview"
            >
              <OngoLogo variant={theme === 'dark' ? 'light' : 'dark'} height={24} />
            </button>

            <span style={{ color: 'var(--border-medium)', fontSize: '0.85rem' }}>/</span>

            {/* Current Tool Badge */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em'
            }}>
              {getActiveTabTitle()}
            </span>
          </div>

          {/* Center: Mega Menu Triggers */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--bg-surface-alt)',
            padding: '3px 6px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)'
          }}>
            {/* Overview Direct Button */}
            <button
              onClick={() => {
                setActiveTab('overview');
                setActiveMenu(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '7px',
                fontSize: '0.78rem',
                fontWeight: activeTab === 'overview' ? 700 : 500,
                color: activeTab === 'overview' 
                  ? (theme === 'dark' ? '#042f2e' : '#ffffff') 
                  : 'var(--text-secondary)',
                backgroundColor: activeTab === 'overview' 
                  ? (theme === 'dark' ? '#10b981' : '#0f172a') 
                  : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
            >
              <BarChart2 size={14} />
              <span>Overview</span>
            </button>

            {/* Mega Menu Dropdown Triggers */}
            {megaMenus.map((menu) => {
              const isMenuOpen = activeMenu === menu.id;
              const hasActiveChild = menu.tools.some(t => t.id === activeTab);

              return (
                <button
                  key={menu.id}
                  onClick={() => setActiveMenu(isMenuOpen ? null : menu.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '7px',
                    fontSize: '0.78rem',
                    fontWeight: hasActiveChild || isMenuOpen ? 700 : 500,
                    color: isMenuOpen 
                      ? 'var(--text-primary)' 
                      : hasActiveChild 
                      ? 'var(--color-primary-dark)' 
                      : 'var(--text-secondary)',
                    backgroundColor: isMenuOpen 
                      ? 'var(--bg-surface)' 
                      : hasActiveChild 
                      ? 'rgba(16, 185, 129, 0.12)' 
                      : 'transparent',
                    border: isMenuOpen ? '1px solid var(--border-medium)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  <span>{menu.label}</span>
                  {menu.badge && (
                    <span style={{
                      fontSize: '0.64rem',
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--border-subtle)',
                      color: 'var(--text-tertiary)'
                    }}>
                      {menu.badge}
                    </span>
                  )}
                  <ChevronDown 
                    size={12} 
                    style={{ 
                      transform: isMenuOpen ? 'rotate(180deg)' : 'none', 
                      transition: 'transform 0.15s ease' 
                    }} 
                  />
                </button>
              );
            })}
          </nav>

          {/* Right: Quick Search Button, Live Indicator & Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Command Palette Trigger */}
            <button
              onClick={() => {
                setSearchOpen(true);
                setActiveMenu(null);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-alt)',
                color: 'var(--text-secondary)',
                fontSize: '0.76rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
              title="Search all 31 tools and data (⌘K)"
            >
              <Search size={13} />
              <span>Search</span>
              <kbd style={{
                fontSize: '0.62rem',
                padding: '1px 5px',
                borderRadius: '4px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                fontFamily: 'monospace',
                color: 'var(--text-tertiary)'
              }}>
                ⌘K
              </kbd>
            </button>

            {/* Live Telemetry Status Dot */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#10b981'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
              <span>618 Brands</span>
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-alt)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} color="#f59e0b" />}
            </button>

            {/* Live Website Link */}
            <a
              href="https://ongoweightloss.com/"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 9px',
                borderRadius: '7px',
                fontSize: '0.74rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textDecoration: 'none'
              }}
              title="Open public ongoweightloss.com"
            >
              <span>Live</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* =========================================================================
            ACTIVE MEGA MENU FLYOUT PANEL
            ========================================================================= */}
        {activeMenu && (() => {
          const menuData = megaMenus.find(m => m.id === activeMenu);
          if (!menuData) return null;

          return (
            <div style={{
              position: 'absolute',
              top: '56px',
              left: '0',
              right: '0',
              backgroundColor: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-medium)',
              boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.18)',
              zIndex: 49,
              animation: 'toolFadeIn 0.15s ease forwards'
            }}>
              <div style={{
                maxWidth: '1440px',
                margin: '0 auto',
                padding: '24px 28px',
                display: 'grid',
                gridTemplateColumns: '300px 1fr',
                gap: '28px'
              }}>
                {/* Left Column: Highlight Card */}
                <div style={{
                  padding: '22px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--bg-surface-alt) 0%, var(--bg-surface) 100%)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: '#10b981'
                      }}>
                        {menuData.featured.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
                      {menuData.featured.title}
                    </h3>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      {menuData.featured.description}
                    </p>
                  </div>

                  <div>
                    <div style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '14px'
                    }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                        {menuData.featured.stat}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                        {menuData.featured.statLabel}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab(menuData.featured.tab);
                        setActiveMenu(null);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        background: 'var(--color-primary-dark)',
                        color: '#ffffff',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'opacity 0.15s ease'
                      }}
                    >
                      {menuData.featured.actionLabel}
                    </button>
                  </div>
                </div>

                {/* Right Columns: Grid of Specialized Tools */}
                <div>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--text-muted)',
                    marginBottom: '14px'
                  }}>
                    Available Intelligence &amp; Audit Workspaces
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '10px'
                  }}>
                    {menuData.tools.map((tool) => {
                      const isCur = activeTab === tool.id;

                      return (
                        <button
                          key={tool.id}
                          onClick={() => {
                            setActiveTab(tool.id);
                            setActiveMenu(null);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            border: isCur 
                              ? '1px solid var(--color-primary)' 
                              : '1px solid transparent',
                            background: isCur 
                              ? 'var(--bg-surface-alt)' 
                              : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.12s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (!isCur) e.currentTarget.style.backgroundColor = 'var(--bg-surface-alt)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isCur) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: tool.color,
                            flexShrink: 0,
                            marginTop: '2px',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                          }}>
                            {tool.icon}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '2px' }}>
                              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {tool.name}
                              </span>
                              {tool.badge && (
                                <span style={{
                                  fontSize: '0.64rem',
                                  fontWeight: 700,
                                  padding: '1px 6px',
                                  borderRadius: '9999px',
                                  background: 'var(--bg-surface)',
                                  border: '1px solid var(--border-subtle)',
                                  color: 'var(--text-secondary)'
                                }}>
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', margin: 0, lineHeight: 1.4 }}>
                              {tool.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mega Menu Bottom Bar */}
              <div style={{
                background: 'var(--bg-surface-alt)',
                borderTop: '1px solid var(--border-subtle)',
                padding: '10px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.74rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)' }}>
                  <span>Pro Tip: Press <kbd style={{ padding: '1px 5px', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', fontFamily: 'monospace' }}>⌘K</kbd> to search all tools</span>
                  <span>&bull;</span>
                  <span>Press <kbd style={{ padding: '1px 5px', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', fontFamily: 'monospace' }}>Esc</kbd> to close menu</span>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('suite-sitemap');
                    setActiveMenu(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0
                  }}
                >
                  View All 31 Tools Sitemap <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          );
        })()}
      </header>

      {/* Global Command Palette Modal (⌘K) */}
      {searchOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '80px',
          paddingLeft: '16px',
          paddingRight: '16px',
          animation: 'toolFadeIn 0.15s ease forwards'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '620px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '16px',
            border: '1px solid var(--border-medium)',
            boxShadow: '0 20px 48px -8px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Search Input Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              gap: '12px'
            }}>
              <Search size={18} color="var(--text-tertiary)" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Jump to any tool, sitemap, competitor, or research..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'none',
                  outline: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)'
                }}
              />
              <button
                onClick={() => setSearchOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Results List */}
            <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '6px 10px' }}>
                Tools &amp; Workspaces ({filteredTools.length})
              </div>
              {filteredTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    setActiveTab(tool.id as TabType);
                    setSearchOpen(false);
                    setQuery('');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.1s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-alt)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {tool.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                      {tool.useCase}
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    background: 'var(--bg-surface-alt)',
                    color: 'var(--text-secondary)'
                  }}>
                    {tool.badge || 'Tool'}
                  </span>
                </button>
              ))}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '10px 16px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-alt)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.72rem',
              color: 'var(--text-tertiary)'
            }}>
              <span>Press <kbd style={{ padding: '1px 5px', borderRadius: '4px', background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', fontFamily: 'monospace' }}>Esc</kbd> to close</span>
              <span>Ongo Medical Intelligence Suite</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

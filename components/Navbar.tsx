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
  FolderTree,
  ChevronDown,
  LayoutGrid
} from 'lucide-react';
import OngoLogo from './OngoLogo';
import ToolsSitemapModal from './ToolsSitemapModal';

export type TabType = 
  | 'overview' 
  | 'ongo-pages' 
  | 'keywords-harvester' 
  | 'internal-links' 
  | 'competitor-gap' 
  | 'sitemaps' 
  | 'competitors' 
  | 'keywords' 
  | 'patterns' 
  | 'compliance' 
  | 'meta' 
  | 'architecture' 
  | 'reports'
  | 'suite-sitemap';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  stats?: {
    totalCompetitors: number;
    activeSitemaps: number;
    totalUrls: number;
  };
}

export default function Navbar({ activeTab, setActiveTab, stats }: NavbarProps) {
  const [sitemapModalOpen, setSitemapModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary featured tools shown directly in the top pill bar
  const primaryTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'ongo-pages', label: 'Ongo Pages (34)', icon: Compass },
    { id: 'keywords-harvester', label: 'PAA Harvester', icon: Sparkles, badge: 'New' },
    { id: 'internal-links', label: 'Internal Links', icon: Link2, badge: 'New' },
    { id: 'competitor-gap', label: 'Content Roadmap', icon: GitCompare, badge: '33k' },
  ];

  // Secondary tools accessible in the categorized "More Tools" dropdown
  const secondaryTabs = [
    { id: 'sitemaps', label: 'Competitor Sitemaps', icon: Globe, category: 'Core & Health', desc: '74 XML sitemaps parsed' },
    { id: 'competitors', label: '100 Competitors Census', icon: Users, category: 'Core & Health', desc: 'National telehealth clinic census' },
    { id: 'keywords', label: 'Keyword Explorer', icon: Search, category: 'SEO & Research', desc: 'GLP-1 search volume & difficulty' },
    { id: 'patterns', label: 'Common vs Unique Moats', icon: SplitSquareVertical, category: 'SEO & Research', desc: 'Differentiating clinical moats' },
    { id: 'compliance', label: 'Doctors & Policies (E-E-A-T)', icon: Stethoscope, category: 'Intel & Roadmap', desc: 'NPIs, MD licenses & state rules' },
    { id: 'meta', label: 'Meta Tags Auditor', icon: Tag, category: 'Intel & Roadmap', desc: 'Human query SERP rewrites' },
    { id: 'architecture', label: '217-Page Silo Architecture', icon: Layers, category: 'Silos & Linking', desc: '6 core telehealth silos' },
    { id: 'reports', label: 'Strategy Reports Library', icon: FileText, category: 'Intel & Roadmap', desc: 'Executive markdown blueprints' },
  ];

  const isSecondaryActive = secondaryTabs.some(t => t.id === activeTab);
  const activeSecondaryItem = secondaryTabs.find(t => t.id === activeTab);

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(27, 67, 50, 0.97)', /* Ongo Deep Forest Racing Green */
        borderBottom: '1px solid rgba(116, 198, 157, 0.22)',
        boxShadow: '0 4px 20px -2px rgba(15, 44, 36, 0.35)'
      }}>
        <div style={{
          maxWidth: '1520px',
          margin: '0 auto',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {/* Brand: Genuine Ongo Logo */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
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
          </div>

          {/* Center: Optimized Primary Menu Segmented Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '1 1 auto',
            minWidth: 0
          }}>
            <nav 
              className="no-scrollbar"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                background: 'rgba(15, 44, 36, 0.72)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '9999px',
                padding: '3px 5px',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
              }}
            >
              {/* Primary 5 Featured Core Tools */}
              {primaryTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      fontSize: '0.78rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#ffffff' : '#d8f3dc',
                      background: isActive 
                        ? 'linear-gradient(135deg, #e76f51 0%, #ee8a4f 100%)' 
                        : 'transparent',
                      border: 'none',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      boxShadow: isActive ? '0 2px 10px rgba(231, 111, 81, 0.4)' : 'none',
                      transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                      flexShrink: 0,
                      whiteSpace: 'nowrap'
                    }}
                    title={tab.label}
                  >
                    <Icon size={13} strokeWidth={isActive ? 2.4 : 1.8} />
                    <span>{tab.label}</span>
                    {tab.badge && !isActive && (
                      <span style={{
                        fontSize: '0.65rem',
                        padding: '1px 5px',
                        borderRadius: '9999px',
                        background: 'rgba(231, 111, 81, 0.35)',
                        color: '#ffcbbd',
                        fontWeight: 700
                      }}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Categorized "More Tools ▾" Dropdown Menu */}
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: isSecondaryActive ? 700 : 500,
                    color: isSecondaryActive ? '#ffffff' : '#d8f3dc',
                    background: isSecondaryActive 
                      ? 'linear-gradient(135deg, #347e5d 0%, #24553f 100%)' 
                      : dropdownOpen ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    border: isSecondaryActive ? '1px solid rgba(116, 198, 157, 0.4)' : 'none',
                    borderRadius: '9999px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    flexShrink: 0
                  }}
                  title="More SEO Audits & Intelligence Tools"
                >
                  <Layers size={13} />
                  <span>
                    {isSecondaryActive && activeSecondaryItem ? activeSecondaryItem.label : 'More Tools'}
                  </span>
                  <ChevronDown size={12} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                </button>

                {/* Dropdown Menu Panel */}
                {dropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '320px',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.35)',
                    border: '1px solid var(--border-medium)',
                    padding: '10px',
                    zIndex: 60,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{
                      padding: '6px 10px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: 'var(--text-tertiary)',
                      textTransform: 'uppercase',
                      borderBottom: '1px solid var(--border-subtle)',
                      marginBottom: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>Specialized SEO Audits</span>
                      <span style={{ color: 'var(--color-primary)' }}>8 Tools</span>
                    </div>

                    {secondaryTabs.map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id as TabType);
                            setDropdownOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 10px',
                            borderRadius: '10px',
                            border: 'none',
                            background: isActive ? 'var(--color-primary-soft)' : 'transparent',
                            color: isActive ? 'var(--color-primary-dark)' : 'var(--text-primary)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            transition: 'background-color 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-surface-alt)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            backgroundColor: isActive ? 'var(--color-primary)' : 'rgba(52, 126, 93, 0.1)',
                            color: isActive ? '#ffffff' : 'var(--color-primary-dark)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <Icon size={14} />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: isActive ? 700 : 600 }}>
                              {tab.label}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {tab.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    <div style={{
                      borderTop: '1px solid var(--border-subtle)',
                      marginTop: '4px',
                      paddingTop: '6px'
                    }}>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setSitemapModalOpen(true);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          width: '100%',
                          padding: '8px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'var(--bg-surface-alt)',
                          color: 'var(--color-primary-dark)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        <FolderTree size={13} color="var(--color-primary)" />
                        <span>View Master Tools Sitemap (13)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tools Sitemap Tab Button */}
              <button
                onClick={() => setActiveTab('suite-sitemap')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: activeTab === 'suite-sitemap' ? 700 : 500,
                  color: activeTab === 'suite-sitemap' ? '#ffffff' : '#d8f3dc',
                  background: activeTab === 'suite-sitemap' 
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                    : 'transparent',
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'suite-sitemap' ? '0 2px 10px rgba(16, 185, 129, 0.4)' : 'none',
                  transition: 'all 0.15s ease',
                  flexShrink: 0
                }}
                title="Visual Tools Sitemap Index"
              >
                <FolderTree size={13} />
                <span>Tools Sitemap</span>
              </button>
            </nav>
          </div>

          {/* Right Actions: Quick Access Sitemap Launcher & Live Site CTA */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0
          }}>
            {/* Quick-Launch Command Palette / Tools Sitemap Button */}
            <button
              onClick={() => setSitemapModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#1b4332',
                background: '#d8f3dc',
                border: '1px solid #74c69d',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
              title="Search and access all 13 tools (⌘K / Ctrl+K)"
            >
              <LayoutGrid size={13} color="#1b4332" />
              <span>All 13 Tools</span>
              <kbd style={{
                fontSize: '0.65rem',
                padding: '1px 5px',
                background: '#ffffff',
                borderRadius: '4px',
                border: '1px solid #b7e4c7',
                fontFamily: 'var(--font-mono)'
              }}>
                ⌘K
              </kbd>
            </button>

            {/* Live Website Link */}
            <a
              href="https://ongoweightloss.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 11px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: '#ffffff',
                background: 'rgba(255, 255, 255, 0.12)',
                textDecoration: 'none',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <span>ongoweightloss.com</span>
              <ExternalLink size={11} color="#ffffff" />
            </a>

            {/* Census Count Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.7rem',
              color: '#b7e4c7',
              fontFamily: 'var(--font-mono)',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '4px 9px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              whiteSpace: 'nowrap'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#52b788',
                display: 'inline-block',
                boxShadow: '0 0 6px #52b788'
              }} />
              <span>{stats?.totalCompetitors || 100} Brands</span>
            </div>
          </div>
        </div>
      </header>

      {/* Global Interactive Tools Sitemap Modal */}
      <ToolsSitemapModal
        isOpen={sitemapModalOpen}
        onClose={() => setSitemapModalOpen(false)}
        onSelectTool={setActiveTab}
        activeTab={activeTab}
      />
    </>
  );
}

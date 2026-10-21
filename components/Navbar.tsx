'use client';

import React from 'react';
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
  Stethoscope
} from 'lucide-react';
import OngoLogo from './OngoLogo';

export type TabType = 'overview' | 'sitemaps' | 'competitors' | 'keywords' | 'patterns' | 'compliance' | 'meta' | 'architecture' | 'reports';

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
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'sitemaps', label: 'Sitemaps', icon: Globe },
    { id: 'competitors', label: 'Competitors', icon: Users },
    { id: 'keywords', label: 'Keyword Explorer', icon: Search },
    { id: 'patterns', label: 'Common vs Unique', icon: SplitSquareVertical },
    { id: 'compliance', label: 'Doctors & Policies', icon: Stethoscope },
    { id: 'meta', label: 'Meta Auditor', icon: Tag },
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
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
        {/* Brand: Genuine Ongo Logo (Click switches to Overview without full page reload) */}
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

        {/* Center: Segmented Control Navigation with Smooth Horizontal Scrolling */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1 1 auto',
          minWidth: 0,
          overflow: 'hidden'
        }}>
          <nav 
            className="no-scrollbar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              background: 'rgba(15, 44, 36, 0.72)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '9999px',
              padding: '3px 5px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              maxWidth: '100%'
            }}
          >
            {tabs.map(tab => {
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
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Actions: Live Site CTA & Stats */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0
        }}>
          {/* Quick Pill linking to ongoweightloss.com */}
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
              color: '#1b4332',
              background: '#ffffff',
              textDecoration: 'none',
              border: '1px solid #b7e4c7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <span>ongoweightloss.com</span>
            <ExternalLink size={11} color="#1b4332" />
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
  );
}

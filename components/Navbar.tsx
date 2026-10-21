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

export type TabType = 'overview' | 'sitemaps' | 'competitors' | 'keywords' | 'patterns' | 'meta' | 'architecture' | 'reports';

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
      backgroundColor: 'rgba(27, 67, 50, 0.96)', /* Ongo Deep Forest Racing Green */
      borderBottom: '1px solid rgba(116, 198, 157, 0.22)',
      boxShadow: '0 4px 20px -2px rgba(15, 44, 36, 0.35)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Brand: Genuine Ongo Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <a 
            href="/" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none' 
            }}
            title="Ongo Weight Loss Home"
          >
            <OngoLogo variant="dark" height={36} />
          </a>
        </div>

        {/* Segmented Control Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          background: 'rgba(15, 44, 36, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '9999px',
          padding: '4px 6px'
        }}>
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
                  gap: '6px',
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#ffffff' : '#d8f3dc',
                  background: isActive 
                    ? 'linear-gradient(135deg, #e76f51 0%, #ee8a4f 100%)' 
                    : 'transparent',
                  border: 'none',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 2px 10px rgba(231, 111, 81, 0.4)' : 'none',
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <Icon size={14} strokeWidth={isActive ? 2.4 : 1.8} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Live Site CTA & Stats */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Quick Pill linking to ongoweightloss.com */}
          <a
            href="https://ongoweightloss.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: 600,
              color: '#1b4332',
              background: '#ffffff',
              textDecoration: 'none',
              border: '1px solid #b7e4c7',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.15s ease'
            }}
          >
            <span>ongoweightloss.com</span>
            <ExternalLink size={12} color="#1b4332" />
          </a>

          {/* Census Count Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            color: '#b7e4c7',
            fontFamily: 'var(--font-mono)',
            background: 'rgba(255, 255, 255, 0.07)',
            padding: '4px 10px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
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

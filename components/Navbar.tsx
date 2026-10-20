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
  Shield,
  SplitSquareVertical
} from 'lucide-react';
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
    { id: 'keywords', label: 'Keywords', icon: Search },
    { id: 'patterns', label: 'Common vs Unique', icon: SplitSquareVertical },
    { id: 'meta', label: 'Meta Tags', icon: Tag },
    { id: 'architecture', label: 'Architecture', icon: Layers },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(12px)',
      backgroundColor: 'rgba(9, 9, 11, 0.85)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '7px',
            background: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#09090b'
          }}>
            <Shield size={16} strokeWidth={2.5} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '-0.01em', color: '#fafafa' }}>
              Ongo Audit
            </span>
            <span style={{
              fontSize: '0.68rem',
              color: 'var(--text-tertiary)',
              borderLeft: '1px solid var(--border-subtle)',
              paddingLeft: '8px',
              fontFamily: 'var(--font-mono)'
            }}>
              GLP-1 Suite
            </span>
          </div>
        </div>

        {/* Segmented Control Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '10px',
          padding: '3px'
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
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#fafafa' : 'var(--text-tertiary)',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: 'none',
                  borderRadius: '7px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Minimal Stats Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.75rem',
          color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-mono)'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-emerald)',
            display: 'inline-block'
          }} />
          <span>{stats?.totalCompetitors || 100} Brands</span>
          <span>&bull;</span>
          <span>{stats?.totalUrls?.toLocaleString() || '35,420'} URLs</span>
        </div>
      </div>
    </header>
  );
}

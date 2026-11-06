'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar, { TabType } from './Navbar';
import OverviewTab from './OverviewTab';
import SitemapsTab from './SitemapsTab';
import CompetitorsTab from './CompetitorsTab';
import KeywordsTab from './KeywordsTab';
import MetaAuditorTab from './MetaAuditorTab';
import ArchitectureTab from './ArchitectureTab';
import ReportsTab from './ReportsTab';
import CommonVsUniqueTab from './CommonVsUniqueTab';
import ComplianceTab from './ComplianceTab';
import OngoPagesTab from './OngoPagesTab';
import KeywordsHarvesterTab from './KeywordsHarvesterTab';
import InternalLinksTab from './InternalLinksTab';
import CompetitorGapTab from './CompetitorGapTab';
import ToolsSitemapTab from './ToolsSitemapTab';
import BooksLibraryTab from './BooksLibraryTab';
import CleanScraperTab from './CleanScraperTab';
import ImageAuditTab from './ImageAuditTab';
import LinkFlowchartTab from './LinkFlowchartTab';
import DoctorEeatTab from './DoctorEeatTab';
import StateLicensingTab from './StateLicensingTab';
import ContentMatcherTab from './ContentMatcherTab';
import IndustryRadarTab from './IndustryRadarTab';
import CompetitorModal from './CompetitorModal';
import { CompetitorSummary, MasterUrlItem, OngoMetaItem, CompetitorComplianceItem, OngoLivePagesData } from '@/lib/data';
import { BooksIndexData } from '@/lib/books-data';
import { animatePageEntrance } from '@/lib/animations';

export const TAB_TO_URL: Record<TabType, string> = {
  'overview': '/',
  'books': '/books',
  'ongo-pages': '/ongo-pages',
  'clean-scraper': '/clean-scraper',
  'image-audit': '/image-audit',
  'competitors': '/competitors',
  'sitemaps': '/sitemaps',
  'competitor-gap': '/competitor-gap',
  'keywords-harvester': '/keywords-harvester',
  'keywords': '/keywords',
  'patterns': '/patterns',
  'link-flowchart': '/link-flowchart',
  'internal-links': '/internal-links',
  'architecture': '/architecture',
  'compliance': '/compliance',
  'doctor-eeat': '/doctor-eeat',
  'state-licensing': '/state-licensing',
  'content-matcher': '/content-matcher',
  'industry-radar': '/industry-radar',
  'meta': '/meta',
  'reports': '/reports',
  'suite-sitemap': '/sitemap'
};

export const URL_TO_TAB: Record<string, TabType> = {
  '/': 'overview',
  '/books': 'books',
  '/ongo-pages': 'ongo-pages',
  '/clean-scraper': 'clean-scraper',
  '/image-audit': 'image-audit',
  '/competitors': 'competitors',
  '/sitemaps': 'sitemaps',
  '/competitor-gap': 'competitor-gap',
  '/keywords-harvester': 'keywords-harvester',
  '/keywords': 'keywords',
  '/patterns': 'patterns',
  '/link-flowchart': 'link-flowchart',
  '/internal-links': 'internal-links',
  '/architecture': 'architecture',
  '/compliance': 'compliance',
  '/doctor-eeat': 'doctor-eeat',
  '/state-licensing': 'state-licensing',
  '/content-matcher': 'content-matcher',
  '/industry-radar': 'industry-radar',
  '/meta': 'meta',
  '/reports': 'reports',
  '/sitemap': 'suite-sitemap'
};

interface AuditDashboardProps {
  initialCompetitors: CompetitorSummary[];
  architectureOverview: Record<string, number>;
  ongoMeta: Record<string, OngoMetaItem>;
  masterUrls: MasterUrlItem[];
  reportsList: { id: string; title: string; filename: string; sizeKb: number }[];
  complianceData?: CompetitorComplianceItem[];
  ongoLivePages?: OngoLivePagesData;
  booksIndex?: BooksIndexData;
  initialBookSlug?: string;
  defaultTab?: TabType;
}

export default function AuditDashboard({
  initialCompetitors,
  architectureOverview,
  ongoMeta,
  masterUrls,
  reportsList,
  complianceData,
  ongoLivePages,
  booksIndex,
  initialBookSlug,
  defaultTab = 'overview'
}: AuditDashboardProps) {
  const [activeTab, setActiveTabState] = useState<TabType>(defaultTab);
  const [currentBookSlug, setCurrentBookSlug] = useState<string | undefined>(initialBookSlug);
  const [inspectFolder, setInspectFolder] = useState<string | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  const totalUrls = initialCompetitors.reduce((acc, c) => acc + (c.totalUrls || 0), 0);
  const activeSitemaps = initialCompetitors.filter(c => c.status === 'SUCCESS').length;

  // Robust scroll to top function that guarantees landing at top on page/tool switch
  const scrollToTopInstant = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    const mainEl = document.getElementById('tool-content-mount');
    if (mainEl) {
      mainEl.scrollTop = 0;
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 60);
  }, []);

  // URL sync handler when switching tabs or books
  const handleSelectTab = useCallback((tab: TabType, bookSlug?: string) => {
    setActiveTabState(tab);
    if (typeof window === 'undefined') return;

    scrollToTopInstant();

    let targetUrl = TAB_TO_URL[tab] || '/';
    if (tab === 'books') {
      const slug = bookSlug || currentBookSlug;
      if (slug) {
        targetUrl = `/books/${slug}`;
        setCurrentBookSlug(slug);
      }
    }

    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ tab, bookSlug: bookSlug || currentBookSlug }, '', targetUrl);
    }
  }, [currentBookSlug, scrollToTopInstant]);

  // Scroll to top when activeTab or book changes and trigger smooth GSAP entrance
  useEffect(() => {
    scrollToTopInstant();
    if (mainRef.current) {
      animatePageEntrance(mainRef.current);
    }
  }, [activeTab, scrollToTopInstant]);

  // Handle browser back and forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      scrollToTopInstant();

      const pathname = window.location.pathname;
      if (pathname.startsWith('/books/')) {
        const slug = pathname.replace('/books/', '').trim();
        setActiveTabState('books');
        if (slug) setCurrentBookSlug(slug);
      } else {
        const matched = URL_TO_TAB[pathname];
        if (matched) {
          setActiveTabState(matched);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [scrollToTopInstant]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Top Navbar with Optimized Primary Navigation & Tools Sitemap */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        stats={{
          totalCompetitors: initialCompetitors.length,
          activeSitemaps,
          totalUrls
        }}
      />

      {/* Main Content Area */}
      <main ref={mainRef} id="tool-content-mount" style={{
        flex: 1,
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        {activeTab === 'books' && (
          <BooksLibraryTab 
            initialIndex={booksIndex} 
            initialSlug={currentBookSlug || initialBookSlug} 
            onBookChange={(slug) => handleSelectTab('books', slug)}
          />
        )}

        {activeTab === 'overview' && (
          <OverviewTab
            competitors={initialCompetitors}
            onSelectTab={handleSelectTab}
            onInspectCompetitor={(folder) => setInspectFolder(folder)}
          />
        )}

        {activeTab === 'ongo-pages' && (
          <OngoPagesTab initialData={ongoLivePages} />
        )}

        {activeTab === 'clean-scraper' && (
          <CleanScraperTab />
        )}

        {activeTab === 'image-audit' && (
          <ImageAuditTab />
        )}

        {activeTab === 'keywords-harvester' && (
          <KeywordsHarvesterTab />
        )}

        {activeTab === 'link-flowchart' && (
          <LinkFlowchartTab />
        )}

        {activeTab === 'internal-links' && (
          <InternalLinksTab />
        )}

        {activeTab === 'competitor-gap' && (
          <CompetitorGapTab />
        )}

        {activeTab === 'suite-sitemap' && (
          <ToolsSitemapTab onSelectTab={handleSelectTab} />
        )}

        {activeTab === 'sitemaps' && (
          <SitemapsTab
            competitors={initialCompetitors}
            onInspectCompetitor={(folder) => setInspectFolder(folder)}
          />
        )}

        {activeTab === 'competitors' && (
          <CompetitorsTab
            competitors={initialCompetitors}
            onInspectCompetitor={(folder) => setInspectFolder(folder)}
          />
        )}

        {activeTab === 'keywords' && (
          <KeywordsTab
            competitors={initialCompetitors}
            onInspectCompetitor={(folder) => setInspectFolder(folder)}
          />
        )}

        {activeTab === 'patterns' && (
          <CommonVsUniqueTab />
        )}

        {activeTab === 'compliance' && (
          <ComplianceTab
            complianceData={complianceData || []}
            onInspectCompetitor={(folder) => setInspectFolder(folder)}
          />
        )}

        {activeTab === 'doctor-eeat' && (
          <DoctorEeatTab
            complianceData={complianceData || []}
            onInspectCompetitor={(folder) => setInspectFolder(folder)}
          />
        )}

        {activeTab === 'state-licensing' && (
          <StateLicensingTab
            complianceData={complianceData || []}
            onInspectCompetitor={(folder) => setInspectFolder(folder)}
          />
        )}

        {activeTab === 'content-matcher' && (
          <ContentMatcherTab
            livePages={ongoLivePages?.pages || []}
          />
        )}

        {activeTab === 'industry-radar' && (
          <IndustryRadarTab />
        )}

        {activeTab === 'meta' && (
          <MetaAuditorTab
            ongoMeta={ongoMeta}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureTab
            architectureOverview={architectureOverview}
            masterUrls={masterUrls}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab
            reportsList={reportsList}
          />
        )}
      </main>

      {/* Competitor Detail Inspector Modal */}
      <CompetitorModal
        folder={inspectFolder}
        onClose={() => setInspectFolder(null)}
      />

      {/* Ongo Weight Loss Executive Glassneumorphic Footer */}
      <footer className="glass-card" style={{
        margin: '48px 24px 24px 24px',
        padding: '32px 36px',
        borderRadius: '24px',
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Top Row: Brand & Telemetry Badges */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '20px'
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-primary-dark)', marginBottom: '4px', letterSpacing: '-0.01em' }}>
                Ongo Intelligence & Medical Architecture Suite &bull; Doctor-Led Telehealth Care
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', maxWidth: '720px', lineHeight: 1.5 }}>
                Doctor-supervised virtual GLP-1 compounding weight loss program. HIPAA-compliant telehealth care across all 50 U.S. states with cold-chain medication delivery from PCAB/503A accredited compounding pharmacies.
              </div>
            </div>

            {/* Live System Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span className="glass-pill" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#166534',
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius: '9999px'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} />
                21 Intelligence Tools
              </span>
              <span className="glass-pill" style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '9999px'
              }}>
                56 Live Ongo Pages
              </span>
              <span className="glass-pill" style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '9999px'
              }}>
                100 Competitors Indexed
              </span>
            </div>
          </div>

          {/* Bottom Row: Fast Links & Scroll Top */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '0.8rem'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={() => handleSelectTab('suite-sitemap')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary-dark)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.8rem'
                }}
              >
                Tools Sitemap Directory (21) ↗
              </button>
              <button
                onClick={() => handleSelectTab('industry-radar')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary-dark)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '0.8rem'
                }}
              >
                Industry Radar ↗
              </button>
              <a 
                href="https://ongoweightloss.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--color-primary-dark)', fontWeight: 600, textDecoration: 'none' }}
              >
                Live Homepage ↗
              </a>
              <a 
                href="https://ongoweightloss.com/how-it-works/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                How It Works
              </a>
              <a 
                href="https://ongoweightloss.com/pricing/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                Pricing
              </a>
              <a 
                href="https://ongoweightloss.com/medical-team/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
              >
                Medical Team
              </a>
              <a 
                href="https://ongoweightloss.com/weightloss-onboard/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--color-accent)', fontWeight: 700, textDecoration: 'none' }}
              >
                See If I'm Eligible ↗
              </a>
            </div>

            <button
              onClick={scrollToTopInstant}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Return to top of page"
            >
              <span>↑</span>
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

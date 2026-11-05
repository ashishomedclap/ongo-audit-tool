'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import CompetitorModal from './CompetitorModal';
import { CompetitorSummary, MasterUrlItem, OngoMetaItem, CompetitorComplianceItem, OngoLivePagesData } from '@/lib/data';
import { BooksIndexData } from '@/lib/books-data';

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

  const totalUrls = initialCompetitors.reduce((acc, c) => acc + (c.totalUrls || 0), 0);
  const activeSitemaps = initialCompetitors.filter(c => c.status === 'SUCCESS').length;

  // URL sync handler when switching tabs or books
  const handleSelectTab = useCallback((tab: TabType, bookSlug?: string) => {
    setActiveTabState(tab);
    if (typeof window === 'undefined') return;

    // Immediately open from start / hero section at top of page
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

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
  }, [currentBookSlug]);

  // Scroll to top when activeTab or book changes (including initial load, popstate, and programmatic switch)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [activeTab]);

  // Handle browser back and forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

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
  }, []);

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
      <main style={{
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

      {/* Ongo Weight Loss Executive Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: '#ffffff',
        padding: '32px 24px',
        marginTop: '48px',
        color: 'var(--text-secondary)'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary-dark)', marginBottom: '4px' }}>
              Ongo Weight Loss &bull; Doctor-Led Medical Weight Loss Care
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', maxWidth: '680px' }}>
              Doctor-supervised virtual GLP-1 weight loss program. HIPAA-compliant telehealth care across all 50 U.S. states with temperature-sensitive medication shipping from licensed compounding pharmacies.
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.78rem' }}>
            <button
              onClick={() => handleSelectTab('suite-sitemap')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary-dark)',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
                fontSize: '0.78rem'
              }}
            >
              Tools Sitemap Directory ↗
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
              style={{ color: 'var(--color-accent)', fontWeight: 600, textDecoration: 'none' }}
            >
              See If I'm Eligible ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

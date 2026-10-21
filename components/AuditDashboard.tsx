'use client';

import React, { useState } from 'react';
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
import CompetitorModal from './CompetitorModal';
import { CompetitorSummary, MasterUrlItem, OngoMetaItem, CompetitorComplianceItem } from '@/lib/data';

interface AuditDashboardProps {
  initialCompetitors: CompetitorSummary[];
  architectureOverview: Record<string, number>;
  ongoMeta: Record<string, OngoMetaItem>;
  masterUrls: MasterUrlItem[];
  reportsList: { id: string; title: string; filename: string; sizeKb: number }[];
  complianceData?: CompetitorComplianceItem[];
}

export default function AuditDashboard({
  initialCompetitors,
  architectureOverview,
  ongoMeta,
  masterUrls,
  reportsList,
  complianceData
}: AuditDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [inspectFolder, setInspectFolder] = useState<string | null>(null);

  const totalUrls = initialCompetitors.reduce((acc, c) => acc + (c.totalUrls || 0), 0);
  const activeSitemaps = initialCompetitors.filter(c => c.status === 'SUCCESS').length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
        {activeTab === 'overview' && (
          <OverviewTab
            competitors={initialCompetitors}
            onSelectTab={(tab) => setActiveTab(tab)}
            onInspectCompetitor={(folder) => setInspectFolder(folder)}
          />
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


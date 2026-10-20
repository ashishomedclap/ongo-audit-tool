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
import CompetitorModal from './CompetitorModal';
import { CompetitorSummary, MasterUrlItem, OngoMetaItem } from '@/lib/data';

interface AuditDashboardProps {
  initialCompetitors: CompetitorSummary[];
  architectureOverview: Record<string, number>;
  ongoMeta: Record<string, OngoMetaItem>;
  masterUrls: MasterUrlItem[];
  reportsList: { id: string; title: string; filename: string; sizeKb: number }[];
}

export default function AuditDashboard({
  initialCompetitors,
  architectureOverview,
  ongoMeta,
  masterUrls,
  reportsList
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

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
        marginTop: '40px'
      }}>
        Ongo Weight Loss &bull; Compounded GLP-1 Telehealth Competitor Audit & Intelligence Suite &bull; 2026
      </footer>
    </div>
  );
}

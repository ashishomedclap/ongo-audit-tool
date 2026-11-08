import { Metadata } from 'next';
import AuditDashboard from '@/components/AuditDashboard';
import {
  getCompetitorsSummary,
  getArchitectureAnalysis,
  getOngoMeta,
  getMasterUrlInventory,
  getAvailableReports,
  getCompetitorComplianceData,
  getOngoLivePages
} from '@/lib/data';
import { getBooksIndex } from '@/lib/books-data';

export const metadata: Metadata = {
  title: 'SEO Data Vault — Keyword Positions, Backlinks & Competitors | Ongo Intelligence',
  description: 'Live SEMrush SEO database: 531 organic keyword rankings, 7,888 backlinks, and 526 competitor domains for ongoweightloss.com. Upload fresh exports to update.',
};

export default function SeoVaultPage() {
  const initialCompetitors = getCompetitorsSummary();
  const architecture = getArchitectureAnalysis();
  const ongoMeta = getOngoMeta();
  const masterUrls = getMasterUrlInventory();
  const reportsList = getAvailableReports();
  const complianceData = getCompetitorComplianceData();
  const ongoLivePages = getOngoLivePages();
  const booksIndex = getBooksIndex();

  return (
    <AuditDashboard
      initialCompetitors={initialCompetitors}
      architectureOverview={architecture?.master_category_counts || {}}
      ongoMeta={ongoMeta}
      masterUrls={masterUrls}
      reportsList={reportsList}
      complianceData={complianceData}
      ongoLivePages={ongoLivePages}
      booksIndex={booksIndex}
      defaultTab="seo-vault"
    />
  );
}


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
  title: 'Generative Engine Optimization (GEO) & US AI Citation Auditor | Ongo Intelligence',
  description: 'Audit pages and drafts against Princeton/Georgia Tech GEO benchmarks to maximize citation probability in ChatGPT Search and Perplexity.',
};

export default function GeoReadinessPage() {
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
      defaultTab="geo-readiness"
    />
  );
}


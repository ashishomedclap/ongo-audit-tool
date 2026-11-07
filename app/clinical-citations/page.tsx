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
  title: 'US PubMed & NLM Clinical Citation Generator | Ongo Intelligence',
  description: 'Generate 1-click AMA/NLM clinical citations with direct PubMed IDs (PMID) and DOIs from 36M+ US clinical publications.',
};

export default function ClinicalCitationsPage() {
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
      defaultTab="clinical-citations"
    />
  );
}


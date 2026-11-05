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
  title: '50-State Telehealth Licensing & Video Regulations | Ongo Intelligence Suite',
  description: 'Benchmark nationwide telehealth medical coverage, asynchronous intake vs video visit mandates, and excluded state jurisdictions across 100 clinics.',
};

export default function StateLicensingPage() {
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
      defaultTab="state-licensing"
    />
  );
}

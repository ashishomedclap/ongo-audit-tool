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
  title: 'NIH ClinicalTrials.gov Next-Gen Obesity Pipeline Radar | Ongo Intelligence',
  description: 'Track ongoing US FDA Phase 2/3 clinical trials for Retatrutide, CagriSema, Orforglipron, and MariTide directly from ClinicalTrials.gov.',
};

export default function ClinicalTrialsPage() {
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
      defaultTab="clinical-trials"
    />
  );
}


import { Metadata } from 'next';
import { 
  getCompetitorsSummary, 
  getArchitectureAnalysis, 
  getOngoMeta, 
  getMasterUrlInventory, 
  getAvailableReports,
  getCompetitorComplianceData,
  getOngoLivePages 
} from '@/lib/data';
import AuditDashboard from '@/components/AuditDashboard';

export const metadata: Metadata = {
  title: 'Content Matcher & Competitor Head-to-Head Auditor | Ongo Intelligence Suite',
  description: 'Audit page content against search intent, run automated on-page SEO checklists, and compare Ongo content head-to-head with top ranking competitors.',
};

export default function ContentMatcherPage() {
  const competitors = getCompetitorsSummary();
  const architecture = getArchitectureAnalysis();
  const ongoMeta = getOngoMeta();
  const masterUrls = getMasterUrlInventory();
  const reportsList = getAvailableReports();
  const complianceData = getCompetitorComplianceData();
  const ongoLivePages = getOngoLivePages();

  return (
    <AuditDashboard
      defaultTab="content-matcher"
      initialCompetitors={competitors}
      architectureOverview={architecture?.master_category_counts || {}}
      ongoMeta={ongoMeta}
      masterUrls={masterUrls}
      reportsList={reportsList}
      complianceData={complianceData}
      ongoLivePages={ongoLivePages}
    />
  );
}


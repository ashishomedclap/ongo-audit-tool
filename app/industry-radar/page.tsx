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
  title: 'Industry Radar & Competitive Pulse | Ongo Intelligence Suite',
  description: 'Daily and weekly surveillance radar across FDA shortage registries, compounding GFI policies, telehealth state regulations, clinical trials, and live competitor pricing.',
};

export default function IndustryRadarPage() {
  const competitors = getCompetitorsSummary();
  const architecture = getArchitectureAnalysis();
  const ongoMeta = getOngoMeta();
  const masterUrls = getMasterUrlInventory();
  const reportsList = getAvailableReports();
  const complianceData = getCompetitorComplianceData();
  const ongoLivePages = getOngoLivePages();

  return (
    <AuditDashboard
      defaultTab="industry-radar"
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


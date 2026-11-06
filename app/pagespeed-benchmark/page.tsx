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
  title: 'Live Core Web Vitals & Speed Benchmark | Ongo Intelligence Suite',
  description: 'Audit mobile and desktop Core Web Vitals (LCP, INP, CLS, TTFB) head-to-head against Ro, Hims, Mochi, and Henry Meds with live Google PageSpeed Insights.',
};

export default function PageSpeedBenchmarkPage() {
  const competitors = getCompetitorsSummary();
  const architecture = getArchitectureAnalysis();
  const ongoMeta = getOngoMeta();
  const masterUrls = getMasterUrlInventory();
  const reportsList = getAvailableReports();
  const complianceData = getCompetitorComplianceData();
  const ongoLivePages = getOngoLivePages();

  return (
    <AuditDashboard
      defaultTab="pagespeed-benchmark"
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


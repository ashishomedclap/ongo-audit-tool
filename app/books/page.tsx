import { Metadata } from 'next';
import { 
  getCompetitorsSummary, 
  getArchitectureAnalysis, 
  getOngoMeta, 
  getMasterUrlInventory, 
  getAvailableReports,
  getCompetitorComplianceData,
  getOngoLivePages,
  getBooksIndex
} from '@/lib/data';
import AuditDashboard from '@/components/AuditDashboard';

export const metadata: Metadata = {
  title: '7 Onboarding Books (Verbatim Library) | Ongo Weight Loss',
  description: 'Complete word-for-word knowledge base for Ongo Weight Loss: 7 onboarding books, 2,924 pages, 518,620 words covering GLP-1 compounding, off-page SEO, Next.js on-page SEO, social media, YMYL writing, and analytics.'
};

export default function BooksPage() {
  const competitors = getCompetitorsSummary();
  const architecture = getArchitectureAnalysis();
  const ongoMeta = getOngoMeta();
  const masterUrls = getMasterUrlInventory();
  const reportsList = getAvailableReports();
  const complianceData = getCompetitorComplianceData();
  const ongoLivePages = getOngoLivePages();
  const booksIndex = getBooksIndex();

  return (
    <AuditDashboard
      defaultTab="books"
      initialCompetitors={competitors}
      architectureOverview={architecture?.master_category_counts || {}}
      ongoMeta={ongoMeta}
      masterUrls={masterUrls}
      reportsList={reportsList}
      complianceData={complianceData}
      ongoLivePages={ongoLivePages}
      booksIndex={booksIndex}
    />
  );
}


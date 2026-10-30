import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { 
  getCompetitorsSummary, 
  getArchitectureAnalysis, 
  getOngoMeta, 
  getMasterUrlInventory, 
  getAvailableReports,
  getCompetitorComplianceData,
  getOngoLivePages,
  getBooksIndex,
  getBookBySlug
} from '@/lib/data';
import AuditDashboard from '@/components/AuditDashboard';

export function generateStaticParams() {
  const index = getBooksIndex();
  return index.books.map((b) => ({
    slug: b.slug,
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    return {
      title: 'Book Not Found | Ongo Weight Loss',
      description: 'The requested onboarding book could not be found.'
    };
  }

  return {
    title: `Book ${book.bookNumber}: ${book.title} | Ongo Onboarding Series`,
    description: `${book.fullTitle}. Original updated PDF: ${book.totalPages} pages, ${book.fileSize}.`
  };
}

export default async function BookDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

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
      initialBookSlug={slug}
    />
  );
}

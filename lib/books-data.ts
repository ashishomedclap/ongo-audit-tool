export interface PdfBookItem {
  bookNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  fullTitle: string;
  category: string;
  fileName: string;
  pdfUrl: string;
  fileSize: string;
  totalPages: number;
  author: string;
}

export interface BooksIndexData {
  lastUpdated: string;
  totalBooks: number;
  books: PdfBookItem[];
}

export const ONGO_PDF_BOOKS: PdfBookItem[] = [
  {
    bookNumber: 1,
    slug: 'the-foundation',
    title: 'The Foundation',
    subtitle: 'Understanding the Project Before You Start the Work',
    fullTitle: 'The Foundation: Ongo Weight Loss Onboarding, Book One',
    category: 'Clinical, Legal & Platform Foundations',
    fileName: 'ongo book one the foundation.pdf',
    pdfUrl: '/books/book-1-the-foundation.pdf',
    fileSize: '3.1 MB',
    totalPages: 224,
    author: 'Ashish Osten, Team Lead, Ongo Weight Loss'
  },
  {
    bookNumber: 2,
    slug: 'earned-not-built',
    title: 'Earned, Not Built',
    subtitle: 'The Zero-to-Hero Off-Page SEO Handbook for Ongo',
    fullTitle: 'Earned, Not Built: The Zero-to-Hero Off-Page SEO Handbook for Ongo',
    category: 'Off-Page SEO & Digital PR',
    fileName: 'ongo book two earned not built.pdf',
    pdfUrl: '/books/book-2-earned-not-built.pdf',
    fileSize: '8.2 MB',
    totalPages: 399,
    author: 'Ashish Osten, Team Lead, Ongo Weight Loss'
  },
  {
    bookNumber: 3,
    slug: 'site-architecture',
    title: 'Site Architecture & Master Content Map',
    subtitle: 'Entities, Intent, Silos, Internal Linking & 217-Page Roadmap',
    fullTitle: 'Site Architecture & the Master Content Map: Ongo Weight Loss Onboarding, Book Three',
    category: 'Site Architecture & Content Taxonomy',
    fileName: 'ongo book three site architecture.pdf',
    pdfUrl: '/books/book-3-site-architecture.pdf',
    fileSize: '5.0 MB',
    totalPages: 543,
    author: 'Ashish Osten, Team Lead, Ongo Weight Loss'
  },
  {
    bookNumber: 4,
    slug: 'on-page-seo-for-nextjs',
    title: 'On-Page SEO for Next.js',
    subtitle: '22-Point Standard, Metadata, Schema, Sitemaps & CWV',
    fullTitle: 'On-Page SEO for Next.js: Ongo Weight Loss Onboarding, Book Four',
    category: 'Technical Next.js SEO & Performance',
    fileName: 'ongo weight loss book four on page seo for nextjs.pdf',
    pdfUrl: '/books/book-4-on-page-seo-for-nextjs.pdf',
    fileSize: '5.5 MB',
    totalPages: 431,
    author: 'Ashish Osten, Team Lead, Ongo Weight Loss'
  },
  {
    bookNumber: 5,
    slug: 'organic-social-media',
    title: 'Organic Social Media',
    subtitle: 'From Newbie to Independent Expert Across 5 Platforms',
    fullTitle: 'Organic Social Media for Ongo Weight Loss: Onboarding, Book Five',
    category: 'Multi-Channel Organic Social',
    fileName: 'ongo weight loss book five organic social media.pdf',
    pdfUrl: '/books/book-5-organic-social-media.pdf',
    fileSize: '4.2 MB',
    totalPages: 356,
    author: 'Ashish Osten, Team Lead, Ongo Weight Loss'
  },
  {
    bookNumber: 6,
    slug: 'writing-for-a-health-brand',
    title: 'Writing for a Health Brand',
    subtitle: 'YMYL Health Writing, E-E-A-T, Compliance & Formatting',
    fullTitle: 'Writing for a Health Brand: Ongo Weight Loss Onboarding, Book Six',
    category: 'YMYL Medical Copywriting & Compliance',
    fileName: 'ongo weight loss book six writing for a health brand.pdf',
    pdfUrl: '/books/book-6-writing-for-a-health-brand.pdf',
    fileSize: '4.5 MB',
    totalPages: 383,
    author: 'Ashish Osten, Team Lead, Ongo Weight Loss'
  },
  {
    bookNumber: 7,
    slug: 'analytics-and-reporting',
    title: 'Analytics and Reporting',
    subtitle: 'GTM, GA4, GSC, Clarity, BigQuery & Looker Studio',
    fullTitle: 'Analytics and Reporting: Ongo Weight Loss Onboarding, Book Seven',
    category: 'Analytics, Reporting & Funnel Attribution',
    fileName: 'ongo weight loss book seven analytics and reporting.pdf',
    pdfUrl: '/books/book-7-analytics-and-reporting.pdf',
    fileSize: '6.7 MB',
    totalPages: 588,
    author: 'Ashish Osten, Team Lead, Ongo Weight Loss'
  }
];

export function getBooksIndex(): BooksIndexData {
  return {
    lastUpdated: 'October 2026',
    totalBooks: ONGO_PDF_BOOKS.length,
    books: ONGO_PDF_BOOKS
  };
}

export function getBookBySlug(slug: string): PdfBookItem | null {
  return ONGO_PDF_BOOKS.find(b => b.slug === slug || String(b.bookNumber) === slug) || null;
}


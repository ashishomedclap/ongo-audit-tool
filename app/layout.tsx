import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ongo Weight Loss | Competitor Sitemap & SEO Intelligence Suite',
  description: 'Comprehensive audit tool to visit sitemaps, inspect competitor URLs, analyze GLP-1 keywords, audit meta tags, and track page architecture.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}

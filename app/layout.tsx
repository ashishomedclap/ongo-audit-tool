import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ongo Weight Loss | Doctor-Led GLP-1 Competitor Audit & SEO Intelligence Suite',
  description: 'Official Ongo Weight Loss competitor audit platform benchmarking 100 compounded semaglutide & tirzepatide telehealth clinics, XML sitemaps, on-page meta tags, and 217-page growth roadmap.',
  icons: {
    icon: 'https://ongoweightloss.com/icon.svg',
  }
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
        <link rel="icon" href="https://ongoweightloss.com/icon.svg" type="image/svg+xml" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="https://ongoweightloss.com/icon.svg" type="image/svg+xml" sizes="any" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('ongo-theme');
                  var pref = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', pref);
                } catch(e) {}
              })();
            `
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

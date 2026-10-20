# Ongo Weight Loss — Competitor Audit & Intelligence Suite

A full-stack Next.js intelligence application designed to audit 100 compounded GLP-1 telehealth competitors, inspect live XML sitemaps, analyze high-intent keywords across 35,000+ URLs, benchmark on-page metadata, and track Ongo's 217-page SEO expansion roadmap.

## Key Features

- **Executive Bento Dashboard**: Macro KPIs across 100 brands, 35,420 URLs, live sitemap ping sandbox, and competitor radar.
- **Sitemap Inspector**: Live HTTP connectivity, latency ping, direct sitemap XML links, and parsed URL silo inspector.
- **100 Competitors Directory**: Complete catalog of US compounded semaglutide & tirzepatide providers with drug silo distribution.
- **GLP-1 Keyword Scanner**: Real-time keyword query engine across 35,000+ competitor URLs with intent presets (vials, dosing, pricing, doctor, side effects).
- **Meta Tag Auditor**: Pre-loaded Ongo page optimization scorecard + live Google Desktop & Mobile SERP preview simulator.
- **Architecture & 217-Page Roadmap**: Content silo breakdown with an interactive, locally persisting checklist.
- **Intelligence Reports Reader**: Integrated reader for strategic markdown research artifacts.

## Architecture & Directory Structure

```text
audit-tool/
├── app/
│   ├── api/
│   │   ├── audit-meta/          # Live HTML crawler and SERP evaluator
│   │   ├── check-url/           # Real-time HTTP health, ping & latency tester
│   │   ├── competitors/         # 100 Compounded GLP-1 brands provider
│   │   ├── keyword-search/      # Live scanner across 35k competitor URLs
│   │   ├── reports/             # Markdown intelligence reports server
│   │   └── sitemap-detail/      # Parsed sitemap XML URLs & category breakdown
│   ├── globals.css              # Minimal neutral bento design system (Zinc palette)
│   ├── layout.tsx
│   └── page.tsx
├── components/                  # Modular Bento UI components
├── data/
│   ├── inventory/               # Datasets: architecture, CSV summaries, metadata
│   ├── reports/                 # Strategic research reports (.md)
│   └── sitemaps/                # 100 Competitor sitemaps & crawled URLs
├── lib/
│   └── data.ts                  # Typed data service & parser
└── scripts/                     # Python scraper & analysis scripts
```

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).

## Production Build

```bash
npm run build
npm run start
```

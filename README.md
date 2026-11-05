# Ongo Weight Loss — Competitor Audit & Intelligence Suite

All research files, scrapers, sitemaps, data inventories, and reports have been consolidated and organized into the **`audit-tool/`** directory.

## Directory Structure

```text
d:\research work\ongo weight loss\
└── audit-tool/                              # Next.js Full-Stack Application
    ├── app/                                 # Next.js App Router & API Endpoints
    │   ├── api/
    │   │   ├── audit-meta/                  # Live on-page meta tag crawler & evaluator
    │   │   ├── check-url/                   # Real-time HTTP health, ping & latency tester
    │   │   ├── competitors/                 # 100 Compounded GLP-1 brands provider
    │   │   ├── keyword-search/              # Live scanner across 35k competitor URLs
    │   │   ├── reports/                     # Markdown intelligence reports server
    │   │   └── sitemap-detail/              # Parsed sitemap XML URLs & category breakdown
    │   ├── globals.css                      # Vanilla CSS design system & dark obsidian theme
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/                          # Interactive UI Components
    │   ├── Navbar.tsx                       # Navigation & live metrics pill
    │   ├── OverviewTab.tsx                  # Executive KPIs, quick ping & ecosystem treemap
    │   ├── SitemapsTab.tsx                  # Sitemap Inspector with "Visit" & "Check Live"
    │   ├── CompetitorsTab.tsx               # 100 Compounded GLP-1 brands catalog
    │   ├── KeywordsTab.tsx                  # Live keyword scanner across 35,000+ URLs
    │   ├── MetaAuditorTab.tsx               # Ongo benchmark scorecard & Google SERP preview
    │   ├── ArchitectureTab.tsx              # Content silo treemap & 217-page checklist
    │   ├── ReportsTab.tsx                   # Built-in reader for 8 intelligence reports
    │   └── CompetitorModal.tsx              # Deep-dive URL browser for each competitor
    ├── data/
    │   ├── inventory/                       # Cleaned data files (CSV & JSON)
    │   │   ├── architecture_analysis.json
    │   │   ├── competitor_sitemaps_summary.csv
    │   │   ├── master_url_inventory.csv
    │   │   └── ongo_current_meta.json
    │   ├── reports/                         # Markdown research reports & checklists
    │   │   ├── SITEMAP_INTELLIGENCE_REPORT.md
    │   │   ├── recommended_pages_master_checklist.md
    │   │   ├── ongo_meta_optimization_and_competitor_comparison.md
    │   │   ├── competitor_page_architecture_treemap.md
    │   │   └── 100_compounded_glp1_competitors.md
    │   └── sitemaps/                        # 100 Competitor Sitemap XMLs & crawled URLs
    │       ├── 001_mochi_health/
    │       ├── 002_henry_meds/
    │       └── ... (100 folders)
    └── scripts/                             # Python crawler and analysis scripts
        ├── fetch_sitemaps.py
        ├── generate_url_inventory.py
        ├── analyze_architecture.py
        ├── fetch_ongo_meta.py
        └── build_full_inventory_md.py
```

## Running the Application

To launch the Next.js audit dashboard:

```bash
cd audit-tool
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).

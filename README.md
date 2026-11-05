# Ongo Weight Loss - SEO Intelligence & Proprietary Tool Suite

A full-stack, enterprise-grade Next.js intelligence application designed to audit 100 compounded GLP-1 telehealth competitors, parse 33,108 competitor sitemap URLs, mine real-time Google Autocomplete & PAA queries, recommend automated internal linking equity loops, and execute Ongo's multi-silo organic growth roadmap.

---

## 🛠️ The 13 In-House Proprietary SEO Tools

Every tool in this suite operates with zero recurring monthly subscription cost ($0 SaaS):

| # | Tool Name | Direct Route | Primary Function & Strategic Purpose |
| :-: | :--- | :--- | :--- |
| **1** | **Executive Overview** | [`/`](file:///d:/research%20work/ongo-audit-tool/app/page.tsx) | Macro KPI bento grid across 100 competitors, 33,108 URLs, live latency ping, and quick-launch shortcuts. |
| **2** | **Competitor Sitemaps Explorer** | [`/sitemaps`](file:///d:/research%20work/ongo-audit-tool/app/sitemaps/page.tsx) | Live XML sitemap parser, HTTP status verification, ping latency tester, and URL silo breakdown. |
| **3** | **100 Competitors Directory** | [`/competitors`](file:///d:/research%20work/ongo-audit-tool/app/competitors/page.tsx) | Complete index of 100 US telehealth brands with Semaglutide vs. Tirzepatide focus and clinical offerings. |
| **4** | **35,000+ Keyword Scanner** | [`/keywords`](file:///d:/research%20work/ongo-audit-tool/app/keywords/page.tsx) | Live search across 33k+ competitor URLs with intent filters (pricing, dosing, vials, doctors, side effects). |
| **5** | **Common vs. Unique Patterns** | [`/patterns`](file:///d:/research%20work/ongo-audit-tool/app/patterns/page.tsx) | Architectural pattern engine surfacing table-stakes pages vs. proprietary competitor growth loops. |
| **6** | **Doctors & Clinical Compliance** | [`/compliance`](file:///d:/research%20work/ongo-audit-tool/app/compliance/page.tsx) | Medical E-E-A-T benchmark auditing physician bios, board certifications, and pharmacy disclosures. |
| **7** | **Meta Tag Auditor & SERP Simulator** | [`/meta`](file:///d:/research%20work/ongo-audit-tool/app/meta/page.tsx) | Pixel-accurate Desktop (600px) and Mobile (375px) Google SERP preview with human-query optimization scoring. |
| **8** | **Architecture & Content Roadmap** | [`/architecture`](file:///d:/research%20work/ongo-audit-tool/app/architecture/page.tsx) | 8-silo architecture tracker with interactive, locally persisting 217-page SEO checklist. |
| **9** | **Intelligence Reports Reader** | [`/reports`](file:///d:/research%20work/ongo-audit-tool/app/reports/page.tsx) | Integrated markdown research reader for competitor teardowns and clinical sitemap reports. |
| **10** | **Ongo Live 34 Pages Auditor** | [`/ongo-pages`](file:///d:/research%20work/ongo-audit-tool/app/ongo-pages/page.tsx) | Live crawler auditing all 34 live `ongoweightloss.com` URLs with CTR hooks and human-query recommendations. |
| **11** | **Google Autocomplete / PAA Harvester** | [`/keywords-harvester`](file:///d:/research%20work/ongo-audit-tool/app/keywords-harvester/page.tsx) | Mines live Google Suggest API for seed keywords, sorting questions into 8 topical silos with copyable H2 snippets. |
| **12** | **Internal Link Recommender** | [`/internal-links`](file:///d:/research%20work/ongo-audit-tool/app/internal-links/page.tsx) | Rule engine scanning live pages to generate exact copy-paste anchor text snippets across 4 Silo Linking Rules. |
| **13** | **Competitor Gap Comparator** | [`/competitor-gap`](file:///d:/research%20work/ongo-audit-tool/app/competitor-gap/page.tsx) | Cross-references 33,108 competitor URLs against Ongo's 34 live pages, prioritizing high-impact missing pages. |
| **14** | **Clean Scraper & Offline Engine** | [`/clean-scraper`](file:///d:/research%20work/ongo-audit-tool/app/clean-scraper/page.tsx) | Headless page-by-page scraper turning heavy Next.js sites into simplified, offline HTML with unified inlined CSS & Vanilla JS. |

---

## ⚡ Quick Navigation & Command Palette

* **Command Palette:** Press `⌘K` (Mac) or `Ctrl+K` (Windows) from any screen to instantly search and navigate to any tool.
* **Tools Sitemap Index:** Dedicated visual tree view available at [`/sitemap`](file:///d:/research%20work/ongo-audit-tool/app/sitemap/page.tsx).
* **Machine-Readable Sitemap:** Dynamically generated XML sitemap available at [`/sitemap.xml`](file:///d:/research%20work/ongo-audit-tool/app/sitemap.ts).

---

## 📂 Architecture & Directory Structure

```text
ongo-audit-tool/
├── app/
│   ├── api/
│   │   ├── audit-meta/          # Live HTML crawler and SERP evaluator
│   │   ├── check-url/           # Real-time HTTP health, ping & latency tester
│   │   ├── competitor-gap/      # Cross-references 33k URLs vs Ongo inventory
│   │   ├── competitors/         # 100 Compounded GLP-1 brands provider
│   │   ├── internal-links/      # Automated silo link and anchor recommender
│   │   ├── keyword-search/      # Live scanner across 35k competitor URLs
│   │   ├── keywords-harvester/  # Google Suggest / PAA query scraper
│   │   ├── ongo-pages/          # Scrapes and audits Ongo's 34 live pages
│   │   ├── reports/             # Markdown intelligence reports provider
│   │   └── sitemap-detail/      # Parsed sitemap XML URLs & category breakdown
│   ├── architecture/            # Route: 217-page roadmap & silo checklist
│   ├── competitor-gap/          # Route: Market gap comparator & roadmap
│   ├── competitors/             # Route: 100-competitor catalog
│   ├── compliance/              # Route: Doctor E-E-A-T & regulatory compliance
│   ├── internal-links/          # Route: Internal link recommendations
│   ├── keywords/                # Route: 35k competitor keyword scanner
│   ├── keywords-harvester/      # Route: Google Suggest & PAA cluster harvester
│   ├── meta/                    # Route: Meta tag auditor & SERP simulator
│   ├── ongo-pages/              # Route: Live 34 Ongo pages auditor
│   ├── patterns/                # Route: Common vs unique architecture patterns
│   ├── reports/                 # Route: Markdown intelligence reports reader
│   ├── sitemap/                 # Route: Visual tools sitemap index
│   ├── sitemaps/                # Route: Competitor sitemaps inspector
│   ├── globals.css              # Minimal neutral bento design system (Zinc palette)
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main dashboard with tab switcher
│   └── sitemap.ts               # Generates /sitemap.xml
├── components/                  # Modular Bento UI components
│   ├── AuditDashboard.tsx       # Core orchestrator with tab state
│   ├── Navbar.tsx               # Segmented nav with featured tabs & dropdown
│   ├── ToolsSitemapModal.tsx    # ⌘K Command Palette overlay
│   ├── ToolsSitemapTab.tsx      # Visual directory of all 13 tools
│   ├── KeywordsHarvesterTab.tsx # Google Suggest harvester UI
│   ├── InternalLinksTab.tsx     # Link recommendation cards & anchor copy
│   ├── CompetitorGapTab.tsx     # Gap comparator & brief generator
│   ├── OngoPagesTab.tsx         # Live page inventory table & SERP inspector
│   ├── ContextCue.tsx           # Contextual strategy explainer drawer
│   └── ...                      # Additional tab components
├── data/
│   ├── inventory/               # Datasets: ongo_live_pages.json, CSV summaries
│   ├── reports/                 # Strategic research reports (.md)
│   ├── sitemaps/                # 100 Competitor sitemaps & parsed URLs
│   ├── competitor_clinical_compliance.json
│   └── keywords_explorer.json
├── docs/                        # Project architectural blueprints & audits
│   ├── architecture/            # Silo blueprints, SEO tools & linking guides
│   ├── audits/                  # Property performance & GSC audit reports
│   └── README.md                # Documentation index
├── lib/
│   ├── competitor-gap-engine.ts # Gap analysis and market vacuum calculator
│   ├── data.ts                  # Typed data service & file loader
│   ├── internal-links-engine.ts # 4 Silo linking rules & anchor text engine
│   ├── patterns-data.ts         # Architectural patterns database
│   └── tools-sitemap.ts         # Central schema for all 13 tools
└── scripts/                     # Python scrapers, crawlers & analysis tools
    ├── analyze_architecture.py  # Categorizes URLs across 8 silos
    ├── build_compliance_dataset.js
    ├── build_full_inventory_md.py
    ├── build_keywords_dataset.js
    ├── crawl_all_ongo_pages.py   # Live crawler for 34 Ongo pages
    ├── fetch_ongo_meta.py
    ├── fetch_sitemaps.py        # Concurrent competitor sitemap discoverer
    ├── generate_url_inventory.py
    └── update_human_query_titles.py # Enforces CTR human search titles
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).

### 3. Production Build
```bash
npm run build
npm run start
```

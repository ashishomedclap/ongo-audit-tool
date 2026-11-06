# Ongo Weight Loss — SEO Intelligence & Telehealth Growth Engineering Suite

> **The Single-File Master Reference Manual for the Entire Ongo Intelligence Platform**  
> *Everything you need to understand, run, audit, or extend the project is documented in this single file.*

---

## 📑 Table of Contents
1. [Executive Summary & Core Value Proposition](#-executive-summary--core-value-proposition)
2. [Macro Architecture: The 3 Operational Levels](#-macro-architecture-the-3-operational-levels)
3. [Master Directory: All 20 Tools Ranked (#1 to #20)](#-master-directory-all-20-tools-ranked-1-to-20)
4. [Deep-Dive Guide for Every Tool](#-deep-dive-guide-for-every-tool)
   - [Rank #1: Clean Page Scraper & Offline Cloner](#rank-1-clean-page-scraper--offline-cloner)
   - [Rank #2: Image Alt Tags & WCAG a11y Auditor](#rank-2-image-alt-tags--wcag-a11y-auditor)
   - [Rank #3: Competitor Gap & Content Roadmap](#rank-3-competitor-gap--content-roadmap)
   - [Rank #4: Google Autocomplete & PAA Harvester](#rank-4-google-autocomplete--paa-harvester)
   - [Rank #5: Content Matcher & Competitor Head-to-Head Auditor](#rank-5-content-matcher--competitor-head-to-head-auditor)
   - [Rank #6: PageRank & Link Equity Flowchart Visualizer](#rank-6-pagerank--link-equity-flowchart-visualizer)
   - [Rank #7: Internal Link & Anchor Text Recommender](#rank-7-internal-link--anchor-text-recommender)
   - [Rank #8: Ongo Live Pages & Meta Auditor](#rank-8-ongo-live-pages--meta-auditor)
   - [Rank #9: 7 Onboarding Books Digital Library](#rank-9-7-onboarding-books-digital-library)
   - [Rank #10: 100-Competitor Census & Directory](#rank-10-100-competitor-census--directory)
   - [Rank #11: Silo Architecture & 217-Page Roadmap](#rank-11-silo-architecture--217-page-roadmap)
   - [Rank #12: Doctor Credentials & Medical E-E-A-T Auditor](#rank-12-doctor-credentials--medical-e-e-a-t-auditor)
   - [Rank #13: 50-State Telehealth Licensing & Video Regulations](#rank-13-50-state-telehealth-licensing--video-regulations)
   - [Rank #14: 503A Compounding Pharmacy & Cold-Chain Sterility](#rank-14-503a-compounding-pharmacy--cold-chain-sterility)
   - [Rank #15: Meta Tags & CTR Auditor](#rank-15-meta-tags--ctr-auditor)
   - [Rank #16: Executive Intelligence Overview](#rank-16-executive-intelligence-overview)
   - [Rank #17: Common vs. Unique Moat Pattern Engine](#rank-17-common-vs-unique-moat-pattern-engine)
   - [Rank #18: Competitor Keyword Matrix](#rank-18-competitor-keyword-matrix)
   - [Rank #19: Executive Strategy & Compliance Reports](#rank-19-executive-strategy--compliance-reports)
   - [Rank #20: Competitor Sitemaps Explorer](#rank-20-competitor-sitemaps-explorer)
5. [The Ongo 56 Live Footprint & Live Scanning System](#-the-ongo-56-live-footprint--live-scanning-system)
6. [Complete Codebase & File Tree](#-complete-codebase--file-tree)
7. [API Endpoints Reference](#-api-endpoints-reference)
8. [Design System: $1,000 GSC + Clarity Minimal Neutral UI](#-design-system-1000-gsc--clarity-minimal-neutral-ui)
9. [Developer Quickstart & Deployment](#-developer-quickstart--deployment)

---

## 🎯 Executive Summary & Core Value Proposition

The **Ongo SEO Intelligence & Telehealth Growth Suite** is a full-stack, enterprise-grade Next.js 14 web application designed specifically for **Ongo Weight Loss** (`ongoweightloss.com`). It delivers competitive telemetry, automated on-page audits, PageRank simulation, and medical YMYL/E-E-A-T compliance across the compounded GLP-1 telehealth sector (Semaglutide, Tirzepatide, Oral GLP-1s).

### Key Architectural Benchmarks
* **$0 Recurring SaaS Costs**: Replaces $500+/month in commercial SEO tooling (Ahrefs, SEMrush, Screaming Frog, SurferSEO) using free Google Suggest APIs, live sitemap parsers, and custom client-side heuristics.
* **100 Competitors Indexed**: Full competitive census of 100 US telehealth brands (Mochi, Ro, Henry Meds, OrderlyMeds, Hims, Ivím Health, etc.).
* **33,108 Competitor URLs Mapped**: Categorized into 8 clinical/commercial topical silos for instant topic vacuum identification.
* **56 Live Ongo Pages Audited**: Real-time XML sitemap crawler monitoring indexation, title/meta lengths, images, missing alt tags, and internal link equity conduits.
* **Clinical YMYL & E-E-A-T Governance**: Verification of Board-Certified Physicians (MD/DO), 503A compounding pharmacy partners, USP <797> sterility standards, and 50-state synchronous video regulations.
* **$1,000 UI/UX Standard**: Designed with a high-density, minimal neutral aesthetic modeled after Google Search Console and Microsoft Clarity (clean `#ffffff` surfaces, subtle `#e2e8f0` borders, `#0f1715` typography, and deep Ongo Racing Green `#1b4332` accents).

---

## 🏗️ Macro Architecture: The 3 Operational Levels

The application is structured into **3 functional levels** accessible via the top navigation bar or the global `⌘K` / `Ctrl+K` command palette:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             ONGO SUITE (20 TOOLS)                        │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
  LEVEL 1: FOUNDATION         LEVEL 2: RESEARCH           LEVEL 3: SILOS &
     & BASELINE               & CONTENT ENGINE               GOVERNANCE
  ───────────────────         ─────────────────           ─────────────────
  • Clean Scraper (#1)        • Competitor Gap (#3)       • PageRank Flow (#6)
  • Image a11y (#2)           • Google PAA (#4)           • Internal Links (#7)
  • Ongo 56 Pages (#8)        • Content Matcher (#5)      • 217-Page Silos (#11)
  • 7 Books Library (#9)      • Moat Patterns (#17)       • Doctor E-E-A-T (#12)
  • 100 Competitors (#10)     • Keywords Matrix (#18)     • State Licensing (#13)
  • Overview KPIs (#16)                                   • 503A Sterility (#14)
  • Sitemaps (74) (#20)                                   • Meta CTR Auditor (#15)
                                                          • Strategy Reports (#19)
```

1. **Level 1 · Foundation & Baseline**: Core site health monitoring, offline cloner, image accessibility compliance, institutional digital books library, and macro competitive census.
2. **Level 2 · SEO Research & Content Engine**: 33,108-URL topic gap roadmap, $0 live Google Autocomplete harvester, and the pre-publish Content Matcher with Search Intent Donut Chart.
3. **Level 3 · Architecture, Silos & Governance**: Visual PageRank conduits, 4 strict silo internal linking rules, 217-page site roadmap, and medical/legal compliance radars (MD credentials, 50-state licensing, 503A cleanrooms).

---

## 📊 Master Directory: All 21 Tools Ranked (#1 to #21)

Every tool has been ranked by business ROI and strategic value, classified by tier, and given a clear product recommendation:

| Rank | Tool Name | Route | Tier | Category | Status / Recommendation | Key Metric |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **#1** | **Clean Page Scraper & Offline Cloner** | `/clean-scraper` | Tier 1 (Core) | L1 Foundation | **KEEP (Core Asset)** | 43 Saved Pages • 1-Click Offline |
| **#2** | **Image Alt & WCAG a11y Auditor** | `/image-audit` | Tier 1 (Core) | L1 Foundation | **KEEP (Core Asset)** | WCAG 2.1 AA/AAA • 1-Click Fix |
| **#3** | **Competitor Gap & Content Roadmap** | `/competitor-gap` | Tier 1 (Core) | L2 Content | **KEEP (Core Asset)** | 33,108 URLs Wired • Writer Briefs |
| **#4** | **Google Autocomplete & PAA Harvester** | `/keywords-harvester` | Tier 1 (Core) | L2 Content | **KEEP (Core Asset)** | $0 Real-Time API • 8 Silos |
| **#5** | **Content Matcher & Head-to-Head Auditor** | `/content-matcher` | Tier 1 (Core) | L2 Content | **KEEP (Core Asset)** | 8-Point Checklist • Intent Pie Chart |
| **#6** | **Industry Radar & Telehealth Pulse** | `/industry-radar` | Tier 1 (Core) | L2 Intelligence | **KEEP (Core Asset)** | 24 Feeds • FDA Shortages & Live Pings |
| **#7** | **PageRank Flowchart Visualizer** | `/link-flowchart` | Tier 1 (Core) | L3 Silos | **KEEP (Core Asset)** | Directed PR Conduit • Silo Loop |
| **#8** | **Internal Link & Anchor Recommender** | `/internal-links` | Tier 1 (Core) | L3 Silos | **KEEP (Core Asset)** | 4 Silo Rules • Copyable Anchors |
| **#9** | **Ongo Live Pages & Meta Auditor** | `/ongo-pages` | Tier 1 (Core) | L1 Foundation | **KEEP (Core Asset)** | 56 Live URLs • Live SERP Preview |
| **#10**| **7 Books Digital Library** | `/books` | Tier 2 (Strategy) | L1 Foundation | **KEEP (High Value)** | 7 Volumes • 2,924 Pages (PDF) |
| **#11**| **100-Competitor Census & Directory** | `/competitors` | Tier 2 (Strategy) | L1 Foundation | **KEEP (High Value)** | 100 Telehealth Brands • Stack Intel |
| **#12**| **Silo Architecture & 217-Page Roadmap** | `/architecture` | Tier 2 (Strategy) | L3 Silos | **KEEP (High Value)** | 6 Silos • 217 Planned URLs |
| **#13**| **Doctor Credentials & Medical E-E-A-T** | `/doctor-eeat` | Tier 1 (Core) | L3 Silos | **KEEP (Core Asset)** | 5 Board MDs • NPI Verification |
| **#14**| **50-State Telehealth Licensing Radar** | `/state-licensing` | Tier 2 (Strategy) | L3 Silos | **KEEP (High Value)** | 50 States • Video Visit Mandates |
| **#15**| **503A Compounding Pharmacy & Sterility**| `/compliance` | Tier 2 (Strategy) | L3 Silos | **KEEP (High Value)** | USP <797> • Cold-Chain Packaging |
| **#16**| **Meta Tags & CTR Auditor** | `/meta` | Tier 2 (Strategy) | L3 Silos | **KEEP (High Value)** | CTR Hooks • Human Query Rewrites |
| **#17**| **Executive Intelligence Overview** | `/` | Tier 2 (Strategy) | L1 Foundation | **KEEP (High Value)** | 35k URLs Counter • Health Pings |
| **#18**| **Common vs. Unique Moats Engine** | `/patterns` | Tier 3 (Review) | L2 Content | *CONSIDER MERGING into #3* | Interactive Moats • Peptide Blends |
| **#19**| **Competitor Keyword Matrix** | `/keywords` | Tier 3 (Review) | L2 Content | *CONSIDER MERGING into #4* | 54k Static Matrix • KD & Intent |
| **#20**| **Executive Strategy Reports Library** | `/reports` | Tier 3 (Review) | L3 Silos | *CONSIDER MERGING into #10*| Strategy Markdown Blueprints |
| **#21**| **Competitor Sitemaps Explorer (74)** | `/sitemaps` | Tier 3 (Review) | L1 Foundation | *CONSIDER REMOVING* | Raw XML Sitemaps (Data in #3) |

---

## 🔍 Deep-Dive Guide for Every Tool

### Rank #1: Clean Page Scraper & Offline Cloner
* **Direct Route**: [`/clean-scraper`](/clean-scraper)
* **Component**: `components/CleanScraperTab.tsx` | **Engine**: `lib/scraper-engine.ts`
* **What It Does**: Headless page-by-page cloner turning heavy Next.js sites into standalone, lightweight offline HTML. Strips 35+ bloated React hydration script tags, inlines unified computed CSS, rewrites relative image paths, and injects clean Vanilla JS for working FAQ accordions.
* **How To Use**:
  * *Mode 1 (Live URL)*: Enter any URL &rarr; Click "Scrape & Clean" &rarr; View instant live iframe sandbox preview & download standalone HTML.
  * *Mode 2 (Raw HTML)*: Paste page source code to strip trackers and clean inlined styling.
  * *Mode 3 (Ongo 43-Page Archive)*: Browse 43 pre-scraped Ongo pages saved on disk with 1-click preview and zero console errors.
* **Why To Use**: Eliminates hydration bugs and tracker lag, allowing engineers and copywriters to inspect, audit, and benchmark pages offline with perfectly preserved layouts and functioning FAQ accordions.
* **Recommendation**: **KEEP (Core Asset)** — Fundamental tool for offline auditing and clean HTML exports.

---

### Rank #2: Image Alt Tags & WCAG a11y Auditor
* **Direct Route**: [`/image-audit`](/image-audit)
* **Component**: `components/ImageAuditTab.tsx`
* **What It Does**: Scans all `<img>` tags on any Ongo or competitor page. Flags missing `alt` attributes, generic filenames (e.g., `IMG_001.jpg`), and evaluates descriptive quality against WCAG 2.1 AA/AAA accessibility guidelines.
* **How To Use**: Select an Ongo page preset (Homepage, Pricing, Semaglutide, Tirzepatide, etc.) or input a custom URL into the scan bar. View the overall a11y grade, filter by "Missing Alt" or "Suspicious Filename", and copy recommended alt text fixes with 1 click.
* **Why To Use**: Protects Ongo from ADA legal accessibility lawsuits and ensures Google Image Search indexes medication vials, doctor badges, and pricing graphics.
* **Recommendation**: **KEEP (Core Asset)** — Essential single-purpose accessibility and technical image SEO tool.

---

### Rank #3: Competitor Gap & Content Roadmap
* **Direct Route**: [`/competitor-gap`](/competitor-gap)
* **Component**: `components/CompetitorGapTab.tsx` | **Engine**: `lib/competitor-gap-engine.ts`
* **What It Does**: Cross-references **33,108 competitor URLs** across 74 clinics against Ongo's 56 live pages to instantly surface **topic vacuums** where competitors rank but Ongo has zero coverage.
* **How To Use**: Filter the database by Priority (`P0 Critical`, `P1 High`) or Silo Category (Dosage, Side Effects, Pricing, Compound Legality, State Rules). Click any topic vacuum to auto-generate a complete **Writer Brief** containing recommended H1, target keyword variants, and copyable meta tags.
* **Why To Use**: Delivers the highest organic traffic ROI in the suite by turning raw competitor indexation data directly into an actionable editorial roadmap.
* **Recommendation**: **KEEP (Core Asset)** — Ongo's primary organic search traffic growth engine.

---

### Rank #4: Google Autocomplete & PAA Harvester
* **Direct Route**: [`/keywords-harvester`](/keywords-harvester)
* **Component**: `components/KeywordsHarvesterTab.tsx` | **API**: `/api/keywords-harvester`
* **What It Does**: Connects directly to Google's public Suggest API at **$0 SaaS cost** to mine real patient search questions using dynamic question stems (`how`, `why`, `cost`, `vs`, `units`, `injection`, `side effects`).
* **How To Use**: Type a seed phrase (e.g., `semaglutide dose` or `tirzepatide nausea`) or click a question stem chip. Questions are clustered into Ongo's 8 topical silos with copyable H2/FAQ snippets and instant CSV export.
* **Why To Use**: Captures actual, high-intent patient questions directly from Google's autocomplete engine, giving writers the exact phrasing needed to win Featured Snippets and Google AI Overviews.
* **Recommendation**: **KEEP (Core Asset)** — Replaces expensive $99+/month keyword tools with real-time patient query mining.

---

### Rank #5: Content Matcher & Competitor Head-to-Head Auditor
* **Direct Route**: [`/content-matcher`](/content-matcher)
* **Component**: `components/ContentMatcherTab.tsx` | **Engine**: `lib/content-matcher-engine.ts`
* **What It Does**: High-precision content auditor that evaluates article drafts or live URLs against an **8-Point SEO & Clinical Checklist**, calculates an interactive **Search Intent Donut / Pie Chart**, and benchmarks side-by-side against competitor pages.
* **How To Use**:
  1. *Select Content*: Choose from Ongo's 56 live pages or paste draft copy into the editor.
  2. *Audit Checklist*: View Pass/Warning/Fail status across 8 metrics: Keyword in Title/H1, body keyword density, 1,200+ word depth, bullet points, H2/H3 structure, link citations, MD reviewer attribution, and 503A sterility disclosures.
  3. *Intent Donut Chart*: Inspect the SVG intent distribution (Informational %, Commercial %, Transactional %, Trust & E-E-A-T %) and read strategic recommendations.
  4. *Benchmark Competitor*: Select a competitor benchmark (Mochi, Ro, Henry Meds, OrderlyMeds, Hims, Ivím) from the dropdown. Click **"Open Competitor Live ↗"** to inspect their live page, review side-by-side metric deltas, and see missing competitor topics.
* **Why To Use**: Eliminates content quality blind spots before publishing and ensures article copy matches the hybrid search intent required to rank for competitive telehealth queries.
* **Recommendation**: **KEEP (Core Asset)** — Crucial pre-publish quality assurance and competitive benchmarking tool.

---

### Rank #6: Industry Surveillance Radar & Telehealth Pulse
* **Direct Route**: [`/industry-radar`](/industry-radar)
* **Component**: `components/IndustryRadarTab.tsx` | **Data**: `lib/industry-radar-data.ts`
* **What It Does**: Curated executive intelligence radar tracking **24 authoritative feeds** across FDA Drug Shortage databases, 503A/503B compounding policies, medical journals (NEJM, ClinicalTrials.gov), state medical licensing boards (California MBC, Texas TMB, FSMB video rules), and live competitor pricing/protocol moves (Mochi, Ro, Henry Meds, OrderlyMeds, Hims, Ivím).
* **How To Use**:
  1. *Filter by Cadence*: Toggle **Daily Priority** (FDA shortages, competitor pricing, APC advocacy), **Weekly Strategy** (state medical boards, clinical trial results, FTC enforcement), or **Monthly Deep Dive** (USP sterility standards, LegitScript certifications).
  2. *Live HTTP Ping*: Click **"Ping HTTP"** on any resource to test live endpoint status, verify connectivity, and measure latency.
  3. *Shift Checklist*: Check off resources as you inspect them; progress is saved automatically to `localStorage` so shifts and weekly audits never lose state.
  4. *Export CSV*: Download the complete intelligence directory formatted for leadership compliance briefings with 1 click.
* **Why To Use**: Telehealth compounding regulations, shortage removals, and competitor price cuts happen weekly. Maintaining continuous surveillance is essential for Ongo's clinical compliance, patient safety, and competitive positioning.
* **Recommendation**: **KEEP (Core Asset)** — Indispensable daily/weekly operational pulse for leadership.

---

### Rank #7: PageRank & Link Equity Flowchart Visualizer
* **Direct Route**: [`/link-flowchart`](/link-flowchart)
* **Component**: `components/LinkFlowchartTab.tsx`
* **What It Does**: Interactive directed flowchart simulator modeling the flow of PageRank equity ($PR$) between source and target pages using the Stanford PageRank algorithm:
  $$PR(A) = (1 - d) + d \sum \frac{PR(T_i)}{C(T_i)}$$
* **How To Use**: Choose any source and target page from Ongo's 56 URLs, adjust the outbound links slider ($N = 1$ to $12$), and view dynamic visual conduits showing exact equity units transferred, anchor text tags, and reciprocal silo loopbacks with 1-click HTML link copying.
* **Why To Use**: Prevents link equity dilution and verifies that informational blog articles funnel maximum authority into high-converting medication money pages.
* **Recommendation**: **KEEP (Core Asset)** — Visualizes internal link equity architecture with mathematical precision.

---

### Rank #8: Internal Link & Anchor Text Recommender
* **Direct Route**: [`/internal-links`](/internal-links)
* **Component**: `components/InternalLinksTab.tsx` | **Engine**: `lib/internal-links-engine.ts`
* **What It Does**: Scans Ongo's live footprint to identify missing internal equity links and generates copyable, exact-match anchor text snippets based on **4 Strict Silo Linking Rules**:
  1. *Rule 1 (Vertical Funnel)*: Informational guides link UP to medication money pages.
  2. *Rule 2 (Tool Bridge)*: Dosage calculators bridge across to consult forms.
  3. *Rule 3 (Doctor Loop)*: Clinical articles link to physician bios; doctor bios link back to medications.
  4. *Rule 4 (Conversion CTA)*: Bottom-of-funnel pricing guides link to medical intake.
* **How To Use**: Select any Ongo URL to view missing internal link cards prioritized by `P0 Critical` and `P1 High`. Copy the pre-built HTML link tag with verified anchor text.
* **Why To Use**: Internal linking is one of Google's top 3 ranking factors; prevents orphan pages and circulates ranking equity across topic silos.
* **Recommendation**: **KEEP (Core Asset)** — Core architectural engine powering on-site PageRank distribution.

---

### Rank #9: Ongo Live Pages & Meta Auditor
* **Direct Route**: [`/ongo-pages`](/ongo-pages)
* **Component**: `components/OngoPagesTab.tsx` | **Data**: `data/inventory/ongo_live_pages.json`
* **What It Does**: Complete operational inventory of Ongo's **56 live production pages** parsed directly from `sitemap.xml` and internal crawlers. Displays HTTP status codes, title tags, meta descriptions, image counts, missing alt tags, and simulated Google SERP previews.
* **How To Use**: Search or filter the 56 live pages by category or meta tag status. Click any page to preview its Google SERP appearance, inspect title character lengths (50-60 chars) and meta description lengths (130-160 chars), or re-audit via the Custom URL scan bar.
* **Why To Use**: Ensures existing production pages maintain healthy indexation, valid canonical tags, and high click-through rates.
* **Recommendation**: **KEEP (Core Asset)** — Essential site health and inventory monitor.

---

### Rank #10: 7 Onboarding Books Digital Library
* **Direct Route**: [`/books`](/books)
* **Component**: `components/BooksLibraryTab.tsx` | **Data**: `lib/books-data.ts`
* **What It Does**: In-browser digital PDF library containing all **7 foundational onboarding books** (2,924 pages, 518,000+ words) covering clinical GLP-1 pharmacology, FDA compounding legality, SEO silo architecture, and telehealth conversion engineering.
* **How To Use**: Select any volume from the library sidebar (The Foundation, Earned Not Built, Architecture, Conversion Engine, Clinical Pharmacology, State Telehealth Law, The Playbook) to read chapters in the embedded viewer, search key topics, or download the PDF.
* **Why To Use**: Serves as the central repository of company clinical standards, legal guidelines, and technical operating procedures.
* **Recommendation**: **KEEP (High Value)** — Permanent institutional knowledge base for team onboarding.

---

### Rank #11: 100-Competitor Census & Directory
* **Direct Route**: [`/competitors`](/competitors)
* **Component**: `components/CompetitorsTab.tsx` | **Data**: `data/inventory/100_competitors.json`
* **What It Does**: Exhaustive market directory of **100 telehealth competitors** offering compounded GLP-1 medications. Tracks monthly visit volume estimates, domain ratings, tech stacks (Webflow, Next.js, Shopify, WordPress), clinical medication focus (Semaglutide vs Tirzepatide), and primary sitemaps.
* **How To Use**: Filter competitors by medication offering, platform technology, or traffic tier. Click any brand to open the deep-dive modal detailing their sitemap hierarchies, pharmacy partners, and top ranking pages.
* **Why To Use**: Gives executive leadership macro competitive visibility into market leaders, pricing structures, and technological footprints.
* **Recommendation**: **KEEP (High Value)** — Core competitive intelligence database.

---

### Rank #12: Silo Architecture & 217-Page Roadmap
* **Direct Route**: [`/architecture`](/architecture)
* **Component**: `components/ArchitectureTab.tsx`
* **What It Does**: Interactive structural blueprint dividing Ongo's long-term expansion into **6 core telehealth silos** and tracking a master checklist of **217 planned pages** with localized browser persistence.
* **How To Use**: Navigate through the 6 silos (Medication Guides, Telehealth Programs, State Compliance, Transparent Pricing, Clinical Safety, Tools & Calculators). Toggle planned pages as Drafted, In-Review, or Published, and view competitor reference URLs for each URL tier.
* **Why To Use**: Prevents topic cannibalization and provides a step-by-step roadmap to scale Ongo from 56 pages to a 217-page market authority.
* **Recommendation**: **KEEP (High Value)** — Master architectural roadmap for long-term site expansion.

---

### Rank #13: Doctor Credentials & Medical E-E-A-T Auditor
* **Direct Route**: [`/doctor-eeat`](/doctor-eeat)
* **Component**: `components/DoctorEeatTab.tsx` | **Data**: `data/competitor_clinical_compliance.json`
* **What It Does**: Dedicated clinical authority auditor tracking medical director credentials, MD/DO board certifications, state medical licenses, NPI registrations, and doctor-reviewed author bylines across 100 telehealth brands.
* **How To Use**: Review physician credentials for Ongo's 5 Board-Certified Physicians (Dr. David Okonkwo, Dr. Kramer, Dr. Patel, Dr. Miller, Dr. Krasne), check NPI registry links, and benchmark against competitor physician oversight models (MD vs NP supervision).
* **Why To Use**: Telehealth is classified as "Your Money or Your Life" (YMYL). Verified physician credentials protect against severe Google Medical Core update penalties.
* **Recommendation**: **KEEP (Core Asset)** — Essential clinical governance tool safeguarding search visibility and patient trust.

---

### Rank #14: 50-State Telehealth Licensing & Video Regulations
* **Direct Route**: [`/state-licensing`](/state-licensing)
* **Component**: `components/StateLicensingTab.tsx`
* **What It Does**: Geographic regulatory radar mapping nationwide medical license coverage, synchronous video visit mandates vs asynchronous intake forms, and state medication shipping restrictions across all 50 US states.
* **How To Use**: Filter by "50 States Nationwide" vs "Restricted Coverage" to identify which competitors exclude states like California, Mississippi, or Louisiana. Export the 50-state regulatory matrix to CSV.
* **Why To Use**: Allows Ongo marketing to capitalize on competitors who exclude high-population states (e.g., CA, NY) by targeting patients with nationwide legal coverage.
* **Recommendation**: **KEEP (High Value)** — Strategic legal radar identifying geographic arbitrage opportunities.

---

### Rank #15: 503A Compounding Pharmacy & Cold-Chain Sterility
* **Direct Route**: [`/compliance`](/compliance)
* **Component**: `components/ComplianceTab.tsx`
* **What It Does**: Audits compounding pharmacy partnerships, 503A state-board compliance, 503B outsourcing facilities, USP <797> sterile cleanroom protocols, and temperature-controlled cold-pack shipping standards across 100 competitors.
* **How To Use**: Filter clinics by verified 503A/503B pharmacy partners, cold-pack insulated shipping guarantees, and flat-rate pricing transparency ($0 hidden consultation fees).
* **Why To Use**: Patient trust and conversion rates in compounded GLP-1s depend entirely on perceived sterile safety, cold-chain integrity, and legitimate pharmacy sourcing.
* **Recommendation**: **KEEP (High Value)** — Enforces compounding legitimacy and patient safety guarantees.

---

### Rank #16: Meta Tags & CTR Auditor
* **Direct Route**: [`/meta`](/meta)
* **Component**: `components/MetaAuditorTab.tsx`
* **What It Does**: Evaluates live title tags and meta descriptions, providing recommended **Human Search Query Rewrites** that replace robotic, symbol-heavy title tags with natural search phrasing to maximize organic Click-Through Rate (CTR).
* **How To Use**: Review pixel-accurate Google SERP previews (Desktop 600px, Mobile 375px). Inspect character counter badges (green for 50-60 chars, yellow/red for truncated) and copy suggested high-CTR rewrites.
* **Why To Use**: Higher SERP click-through rates directly increase organic patient volume without requiring higher keyword rankings.
* **Recommendation**: **KEEP (High Value)** — Dedicated CTR optimization tool.

---

### Rank #17: Executive Intelligence Overview
* **Direct Route**: [`/`](/)
* **Component**: `components/OverviewTab.tsx`
* **What It Does**: Central executive benchmarking dashboard tracking macro KPIs across 100 competitors, 33,108 indexed URLs, real-time HTTP server ping latency, and Ongo's live 56-page footprint.
* **How To Use**: Check high-level macro counters, review competitor sitemap health, launch one-click latency tests, and navigate directly into specialized sub-tools.
* **Why To Use**: Serves as the primary landing page and executive summary for the entire application.
* **Recommendation**: **KEEP (High Value)** — Executive homepage and central navigation portal.

---

### Rank #18: Common vs. Unique Moat Pattern Engine
* **Direct Route**: [`/patterns`](/patterns)
* **Component**: `components/CommonVsUniqueTab.tsx` | **Data**: `lib/patterns-data.ts`
* **What It Does**: Structural pattern analyzer that separates "table-stakes" competitor pages (e.g., standard blog posts, basic pricing) from **proprietary competitive moats** (dosage calculators, interactive quizzes, micro-dosing protocols, peptide combinations).
* **How To Use**: Filter patterns by Moat Type (Calculators, Quizzes, Clinical Protocols). View competitor examples and development complexity scores.
* **Why To Use**: Inspires product and engineering teams to build interactive web tools that drive customer retention and natural backlinks.
* **Recommendation**: **CONSIDER MERGING** — High-value insights, but could be integrated into Tool #3 (Content Roadmap) as an "Interactive Moats" sub-filter to streamline the main navigation.

---

### Rank #19: Competitor Keyword Matrix
* **Direct Route**: [`/keywords`](/keywords)
* **Component**: `components/KeywordsTab.tsx` | **Data**: `data/inventory/keywords_explorer.json`
* **What It Does**: Searchable database of 54,000+ commercial and clinical keywords targeted by top-ranking GLP-1 competitors, displaying estimated search volume, keyword difficulty (KD), and search intent.
* **How To Use**: Search keywords by topic, filter by KD score (< 30 for low-hanging fruit), or filter by search intent (Commercial, Transactional, Informational).
* **Why To Use**: General keyword reference library for editorial planning.
* **Recommendation**: **CONSIDER MERGING** — Largely superseded by Tool #4 (Google Autocomplete Harvester), which provides live, real-time patient questions at zero cost.

---

### Rank #20: Executive Strategy & Compliance Reports
* **Direct Route**: [`/reports`](/reports)
* **Component**: `components/ReportsTab.tsx` | **Data**: `data/reports/`
* **What It Does**: Integrated markdown document reader rendering full-length strategic research reports, sitemap intelligence teardowns, and clinical gap analysis generated for Ongo leadership.
* **How To Use**: Select any report from the sidebar to read full text with formatted tables, mermaid diagrams, and 1-click markdown downloads.
* **Why To Use**: Centralizes executive strategy documents within the application UI.
* **Recommendation**: **CONSIDER MERGING** — Could be merged into Tool #10 (7 Books Library) under a dedicated "Executive Reports" section to consolidate all long-form reading materials into one tab.

---

### Rank #21: Competitor Sitemaps Explorer (74)
* **Direct Route**: [`/sitemaps`](/sitemaps)
* **Component**: `components/SitemapsTab.tsx` | **Data**: `data/inventory/competitor_sitemaps_summary.csv`
* **What It Does**: Technical sitemap explorer inspecting raw XML sitemap hierarchies, URL distribution, and HTTP status codes across 74 accessible competitor domains.
* **How To Use**: Browse competitor domains, click "Check Live" to ping sitemap endpoints, and expand URLs by category.
* **Why To Use**: Useful for technical developers verifying raw XML ingestion, but offers limited utility for day-to-day marketing workflows.
* **Recommendation**: **CONSIDER REMOVING** — Prime candidate for removal from the main navigation, as all 33,108 extracted URLs are already powering Tool #3 (Content Roadmap).

---

## 🌐 The Ongo 56 Live Footprint & Live Scanning System

The application maintains a continuous live synchronization with Ongo's production website (`ongoweightloss.com`):

### 1. Live URL Footprint (56 URLs)
Earlier audits tracked 34 to 43 URLs. The automated recursive crawler (`scripts/full_live_site_audit.js` and `scripts/rescan_sitemap.js`) identified **56 live URLs** across the following categories:
* **Core Conversion & Marketing (8)**: `/`, `/pricing/`, `/how-it-works/`, `/glp-1-weight-loss-program/`, `/semaglutide/`, `/tirzepatide/`, `/oral-semaglutide/`, `/oral-tirzepatide/`
* **Clinical Guides & Research (14)**: `/resources/glp-1/clinical-studies/`, `/resources/glp-1/injection-guide/`, `/resources/nutrition-guide/`, `/glp-1-side-effects/`, `/compounded-semaglutide/`, `/compounded-tirzepatide/`, etc.
* **Interactive Tools (1)**: `/tools/bmi-calculator/`
* **Medical Leadership & E-E-A-T (11)**: `/editorial-team/`, `/editorial-team/awais-arshad/`, `/editorial-team/dr-david-okonkwo/`, `/editorial-team/dr-kramer/`, `/editorial-team/dr-patel/`, etc.
* **Geographic Coverage (14)**: `/locations/california/`, `/locations/texas/`, `/locations/florida/`, `/locations/virginia/`, etc.
* **Legal & Governance (8)**: `/privacy-policy/`, `/terms-of-service/`, `/doctor/terms/`, `/medical-disclaimer/`, etc.

### 2. Live Scanning Controls
* **Master Site Scan**: A glowing green button in the navbar (`56 URLs`) opens `MasterSiteScanModal.tsx` to initiate a full re-crawl of `https://ongoweightloss.com/sitemap.xml` via `/api/scan-site` (`action: 'scan-all'`), updating local disk cache automatically.
* **Single URL Live Inspector**: Embedded via `CustomUrlScanBar.tsx` across `OngoPagesTab`, `ImageAuditTab`, `MetaAuditorTab`, `InternalLinksTab`, and `CleanScraperTab`. Allows auditing any live URL on-demand via `/api/scan-site` (`action: 'scan-single'`).

---

## 📁 Complete Codebase & File Tree

```text
audit-tool/
├── app/
│   ├── api/
│   │   ├── audit-meta/          # Live HTML metadata scraper & SERP evaluator
│   │   ├── books/               # PDF streaming & metadata provider
│   │   ├── check-url/           # Real-time HTTP ping & latency tester
│   │   ├── competitor-gap/      # 33k URLs gap cross-referencing endpoint
│   │   ├── competitors/         # 100 Compounded GLP-1 brands provider
│   │   ├── internal-links/      # 4 Silo linking rules & anchor recommender
│   │   ├── keyword-search/      # Live scanner across 35k competitor URLs
│   │   ├── keywords-harvester/  # Google Suggest public API scraper ($0 SaaS)
│   │   ├── ongo-pages/          # Serves Ongo's 56 live pages inventory
│   │   ├── reports/             # Serves markdown research reports
│   │   ├── scan-site/           # Master site & single URL live crawler API
│   │   ├── scrape-page/         # Strips React hydration & inlines clean CSS
│   │   └── sitemap-detail/      # Competitor sitemap URL hierarchy provider
│   ├── architecture/            # Page Route: Tool #12 (217-Page Roadmap)
│   ├── books/                   # Page Route: Tool #10 (7 Books Library)
│   ├── clean-scraper/           # Page Route: Tool #1 (Clean Scraper)
│   ├── competitor-gap/          # Page Route: Tool #3 (Content Roadmap)
│   ├── competitors/             # Page Route: Tool #11 (100 Competitors)
│   ├── compliance/              # Page Route: Tool #15 (503A Sterility)
│   ├── content-matcher/         # Page Route: Tool #5 (Content Matcher)
│   ├── doctor-eeat/             # Page Route: Tool #13 (Doctor E-E-A-T)
│   ├── image-audit/             # Page Route: Tool #2 (Image a11y Auditor)
│   ├── industry-radar/          # Page Route: Tool #6 (Industry Radar & Surveillance)
│   ├── internal-links/          # Page Route: Tool #8 (Internal Links)
│   ├── keywords/                # Page Route: Tool #19 (Keywords Matrix)
│   ├── keywords-harvester/      # Page Route: Tool #4 (Google PAA Harvester)
│   ├── link-flowchart/          # Page Route: Tool #7 (PageRank Flowchart)
│   ├── meta/                    # Page Route: Tool #16 (Meta Tags Auditor)
│   ├── ongo-pages/              # Page Route: Tool #9 (Ongo Live Pages)
│   ├── patterns/                # Page Route: Tool #18 (Moat Patterns)
│   ├── reports/                 # Page Route: Tool #20 (Reports Library)
│   ├── sitemap/                 # Page Route: Visual 21-Tool Sitemap Tab
│   ├── sitemaps/                # Page Route: Tool #21 (Sitemaps Explorer)
│   ├── state-licensing/         # Page Route: Tool #14 (50-State Licensing)
│   ├── globals.css              # Glassneumorphism, Bento Grid & Dark Mode Contrast Engine
│   ├── layout.tsx               # Root application layout
│   ├── page.tsx                 # Dashboard orchestrator & tab manager
│   └── sitemap.ts               # Generates dynamic /sitemap.xml
├── components/
│   ├── ArchitectureTab.tsx      # Silo breakdown & 217-page checklist
│   ├── AuditDashboard.tsx       # Core orchestrator mounting all 21 tools with GSAP transitions
│   ├── BooksLibraryTab.tsx      # Digital PDF viewer for 7 onboarding books
│   ├── CleanScraperTab.tsx      # Clean cloner UI with offline preview sandbox
│   ├── CommonVsUniqueTab.tsx    # Table-stakes vs competitive moats UI
│   ├── CompetitorGapTab.tsx     # 33k competitor gap & writer brief generator
│   ├── CompetitorModal.tsx      # Deep-dive competitor brand inspector
│   ├── CompetitorsTab.tsx       # 100 Telehealth brands directory
│   ├── ComplianceTab.tsx        # 503A compounding & cold-pack shipping
│   ├── ContentMatcherTab.tsx    # Pre-publish auditor & Intent Donut Chart
│   ├── ContextCue.tsx           # Contextual strategy explainer drawer
│   ├── CustomUrlScanBar.tsx     # GSC-style URL inspection bar across tools
│   ├── DoctorEeatTab.tsx        # Medical director & NPI registry auditor
│   ├── ImageAuditTab.tsx        # Image alt & WCAG compliance scorecard
│   ├── IndustryRadarTab.tsx     # 24-feed industry surveillance radar & live ping tester
│   ├── InternalLinksTab.tsx     # 4 Silo internal linking recommendations
│   ├── KeywordsHarvesterTab.tsx # Google Autocomplete PAA miner UI
│   ├── KeywordsTab.tsx          # 54k Static keyword opportunity explorer
│   ├── LinkFlowchartTab.tsx     # Interactive PageRank equity flowchart
│   ├── MasterSiteScanModal.tsx  # 1-Click whole-site re-crawl modal
│   ├── MetaAuditorTab.tsx       # SERP preview & human query rewrites
│   ├── Navbar.tsx               # Header with 3 levels, Radar shortcut, 56 URLs badge & ⌘K
│   ├── OngoLogo.tsx             # Official SVG Ongo brand mark
│   ├── OngoPagesTab.tsx         # 56 live production pages inventory table
│   ├── OverviewTab.tsx          # Executive macro KPIs & latency pings
│   ├── ReportsTab.tsx           # Integrated markdown report reader
│   ├── SitemapsTab.tsx          # 74 Competitor XML sitemaps explorer
│   ├── StateLicensingTab.tsx    # 50-State video visit regulatory matrix
│   ├── ToolsSitemapModal.tsx    # ⌘K Command Palette search overlay
│   ├── ToolsSitemapTab.tsx      # 21-tool ranked visual directory
│   └── VisualMetricsWidgets.tsx # Reusable analytics metric cards
├── data/
│   ├── inventory/
│   │   ├── architecture_analysis.json      # 8 Silo category mapping
│   │   ├── competitor_sitemaps_summary.csv # 74 Competitor sitemaps summary
│   │   ├── master_url_inventory.csv        # 33,108 Competitor URLs
│   │   ├── ongo_brand_images.json          # Scraped Ongo images & alt tags
│   │   ├── ongo_current_meta.json          # Ongo meta tags & SERP preview
│   │   └── ongo_live_pages.json            # 56 Ongo live pages master census
│   ├── reports/                            # Markdown intelligence reports
│   ├── scraped_audit/                      # Pre-scraped offline clean pages
│   └── sitemaps/                           # 100 Individual competitor XML folders
├── docs/
│   └── architecture/
│       └── HOW_TO_USE_SCRAPER.md           # Architecture scraper documentation
├── lib/
│   ├── animations.ts            # GSAP entrance staggers, floating cards & beacon pulses
│   ├── books-data.ts            # Metadata & chapter indices for 7 books
│   ├── competitor-gap-engine.ts # 33k URLs gap calculator & writer briefs
│   ├── content-matcher-engine.ts# 8-Point checklist & Intent Donut engine
│   ├── data.ts                  # Central server-side data loaders
│   ├── industry-radar-data.ts   # 24 Curated feeds (FDA, compounding, boards, trials, pricing)
│   ├── internal-links-engine.ts # 4 Strict topic silo linking algorithms
│   ├── patterns-data.ts         # Common vs proprietary moat patterns
│   └── tools-sitemap.ts         # Single source of truth for all 21 tools
├── scripts/
│   ├── full_live_site_audit.js  # Scrapes 56 Ongo production pages
│   └── rescan_sitemap.js        # Re-crawls sitemap.xml on demand
├── public/                      # Static assets & 7 onboarding PDF volumes
└── package.json                 # Next.js 14, React 19, Lucide, GSAP
```
│   ├── data.ts                  # Typed data service & file loaders
│   ├── internal-links-engine.ts # 4 Silo linking rules & anchor text engine
│   ├── patterns-data.ts         # Table-stakes vs moat patterns database
│   ├── scraper-engine.ts        # Cheerio-based hydration stripper & CSS inliner
│   └── tools-sitemap.ts         # Master schema & ranking for all 20 tools
└── scripts/
    ├── analyze_architecture.py  # Categorizes URLs across 8 silos
    ├── build_compliance_dataset.js
    ├── build_full_inventory_md.py
    ├── build_keywords_dataset.js
    ├── crawl_all_ongo_pages.py  # Python crawler for live Ongo pages
    ├── fetch_ongo_meta.py       # Scrapes live metadata & titles
    ├── fetch_sitemaps.py        # Concurrent competitor XML discoverer
    ├── full_live_site_audit.js  # Node.js script auditing 56 live pages
    ├── generate_url_inventory.py# Compiles master_url_inventory.csv
    ├── rescan_sitemap.js        # Crawls https://ongoweightloss.com/sitemap.xml
    ├── scrape_clean_offline.js  # Batch scrapes pages to standalone HTML
    └── update_human_query_titles.py # Enforces CTR human search titles
```

---

## ⚡ API Endpoints Reference

All endpoints run on the Next.js App Router (`app/api/`):

### 1. `POST /api/scan-site`
* **Purpose**: Master site sitemap crawler and single-URL live DOM auditor.
* **Payload**:
  * `{ action: 'scan-all' }`: Crawls `https://ongoweightloss.com/sitemap.xml`, audits status, updates disk cache.
  * `{ action: 'scan-single', url: 'https://...' }`: Fetches page live, parses Title, Description, H1, Canonical, Images count, Missing Alt count, Internal Links.

### 2. `POST /api/keywords-harvester`
* **Purpose**: Scrapes real-time patient questions from Google Autocomplete ($0 SaaS).
* **Payload**: `{ query: 'semaglutide dose' }`
* **Response**: `{ query, totalResults, silos: { dosage: [...], cost: [...] }, results: [...] }`

### 3. `POST /api/check-url`
* **Purpose**: Real-time HTTP health, latency ping, and SSL handshake check.
* **Payload**: `{ url: 'https://mochihealth.com/sitemap.xml' }`
* **Response**: `{ status: 200, latencyMs: 142, ok: true }`

### 4. `POST /api/audit-meta`
* **Purpose**: Live on-page metadata scraper and CTR scorecard evaluator.
* **Payload**: `{ url: 'https://ongoweightloss.com/pricing/' }`
* **Response**: `{ title, description, h1, canonical, lengthScore, ctrRecommendations }`

### 5. `POST /api/scrape-page`
* **Purpose**: Strips React hydration bundles, inlines computed CSS, and injects Vanilla JS accordion handlers.
* **Payload**: `{ url: 'https://ongoweightloss.com/' }`
* **Response**: `{ cleanHtml, wordCount, imagesCount, accordionsFixed }`

### 6. `GET /api/competitor-gap`
* **Purpose**: Returns topic vacuum priorities and writer briefs cross-referencing 33k URLs.

### 7. `GET /api/internal-links`
* **Purpose**: Computes missing equity links across 4 silo rules for all 56 live pages.

---

## 🎨 Design System: $1,000 GSC + Clarity Minimal Neutral UI & Dark/Light Mode

The user interface follows a high-density, low-noise aesthetic modeled after **Google Search Console** and **Microsoft Clarity**, combined with an elite **Glassneumorphic Bento Grid** architecture and **GSAP micro-animations**:

* **Glassneumorphism & Bento Grids**: Cards feature frosted-glass backdrop filters (`backdrop-filter: blur(16px)`), dual-layer highlights, subtle borders, and asymmetric grid arrangements (`.glass-card`, `.bento-glass`, `.glass-pill`).
* **GSAP Micro-Animations**: Smooth GPU-accelerated entrance stagger animations across cards, tabs, and interactive pills via GreenSock (`gsap`), providing a snappy, premium feel without layout jank.
* **Instant Scroll-To-Top**: Tab and page changes execute a multi-pass synchronous and asynchronous scroll reset (`scrollToTopInstant`), instantly mounting the user at the exact top of the selected tool.
* **Classy Theme Toggle**: Integrated into the top navigation bar with dynamic Sun/Moon iconography.
* **Persistent Preference**: Remembers the user's manual selection across reloads via `localStorage` (`ongo-theme`) and automatically respects OS system settings (`prefers-color-scheme: dark`) on initial visit.
* **Dark Mode Readability System**: All text colors, badges, and alerts automatically invert from deep tones into radiant mint, sky, amber, and obsidian-pure contrast values (`#f8fafc`, `#86efac`, `#38bdf8`, `#fbbf24`), guaranteeing 100% legibility in dark mode.
* **Zero FOUC (Flash of Unstyled Content)**: Pre-hydration inline script in `<head>` applies `data-theme` immediately before paint.
* **Smooth Transitions**: 0.2s CSS ease transitions across backgrounds, card borders, and typography.

### Design Tokens by Theme Mode

| Design Token | Light Mode (Warm Canvas) | Dark Mode (Obsidian Emerald) | Purpose |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#faf8f5` (warm linen) | `#090e0c` (deep obsidian) | Page foundation with subtle radial glow |
| **Card Surface** | `#ffffff` (crisp white) | `#121815` (sleek dark jade) | Bento cards, panels, and modals |
| **Elevated Surface** | `#ffffff` | `#16201b` (floating dark card) | Toolbars, inputs, dropdown menus |
| **Subtle Border** | `#ede8e0` / `#e2e8f0` | `#1e2d26` (dark emerald border) | 1px clean separation lines |
| **Medium Border** | `#dfd9cf` / `#cbd5e1` | `#2a3e35` (visible border) | Card hover states, active inputs |
| **Primary Text** | `#0f1715` (obsidian charcoal) | `#f1f5f3` (pure white-mint) | Headers, metric values, high contrast |
| **Secondary Text** | `#475569` (slate neutral) | `#94a3b8` (silver slate) | Descriptions, data table values |
| **Primary Brand** | `#1b4332` (Racing Green) | `#1b4332` + glowing emerald | Sticky navbar, brand identity |
| **Brand Accent** | `#347e5d` (Forest Jade) | `#4ade80` (Vibrant Mint Emerald) | Active indicators, focus rings |
| **Coral Accent** | `#e76f51` (Warm Terracotta) | `#f97316` (Vivid Coral) | Category icons, secondary buttons |

---

## 🚀 Developer Quickstart & Deployment

### 1. Prerequisites
* **Node.js**: `v18.17.0` or higher
* **npm**: `v9.0.0` or higher

### 2. Local Setup
```bash
# Clone the repository
git clone https://github.com/ashishomedclap/ongo-audit-tool.git

# Navigate to project directory
cd ongo-audit-tool

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Keyboard Shortcuts
* `⌘K` / `Ctrl+K`: Open the 20-tool Command Palette search overlay from anywhere.
* `Esc`: Close any open modal or drawer.

### 4. Production Build & Verification
```bash
# Typecheck TypeScript (0 errors required)
npx tsc --noEmit

# Compile production Next.js bundle
npm run build

# Start production server
npm run start
```

### 5. Deployment
* **GitHub Repository**: Hosted at [`https://github.com/ashishomedclap/ongo-audit-tool.git`](https://github.com/ashishomedclap/ongo-audit-tool.git) on branch `main`.
* **Zero-Config Hosting**: Ready for immediate 1-click deployment to **Netlify** or **Vercel**:
  * Build command: `npm run build`
  * Publish directory: `.next`

---

*Authored by the Ongo Telehealth SEO & Growth Engineering Team.*  
*Maintained under clinical YMYL standards for `ongoweightloss.com`.*

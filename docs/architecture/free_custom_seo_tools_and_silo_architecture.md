# Free In-House SEO Research Tools & Silo Architecture Blueprint

## Executive Overview
Instead of paying $200–$500/month for third-party SaaS subscriptions (Ahrefs, Semrush, Screaming Frog), **you can build your own proprietary, 100% free SEO intelligence and architecture suite directly inside your `ongo-audit-tool` project**.

We have already built:
1. **Live Sitemap Crawler & Page Inspector** (`/api/ongo-pages`)
2. **Desktop & Mobile Google SERP Snippet Simulator**
3. **100-Competitor Sitemap & Architecture Analyzer** (33,108 competitor URLs parsed)
4. **Doctors & E-E-A-T Compliance Auditor**
5. **Common vs. Unique URL Pattern Engine**

Below is the master blueprint of **additional custom tools you can build for free**, categorized into actionable SEO silos with an automated internal linking matrix.

---

## 1. Master Table: Free Custom SEO Tools to Build in Your Dashboard

| Tool Category | Free Tool to Build | How We Build It (100% Free Stack) | What Data & SEO Research It Gives You | How It Governs Ongo Silos & Linking |
| :--- | :--- | :--- | :--- | :--- |
| **1. Silo & Internal Linking** | **Interactive Internal Link Tree & PageRank Visualizer** | React Flow / Canvas + Python graph crawler (0 API cost) | Scans all internal `<a href>` tags on `ongoweightloss.com`; displays an interactive node graph of PageRank flow, link depth, and orphan pages. | Visually reveals which spoke pages fail to link back to money pages (`/services/glp-1/...`) and detects orphan pages. |
| **1. Silo & Internal Linking** | **Automated Contextual Link & Anchor Text Recommender** | Python Regex / Keyword Matching script | Analyzes text of each page for mentions of target keywords (e.g., "tirzepatide titration", "BMI eligibility") where no link exists yet. | Outputs exact copy-paste anchor text snippets: *"In paragraph 3 of [Blog A], add link with anchor 'compounded semaglutide online' pointing to [Money Page 1]"*. |
| **2. Competitor Gap Mining** | **Competitor Content & Silo Gap Comparator** | Compares our local `master_url_inventory.csv` against `ongo_live_pages.json` | Cross-references 33,108 competitor URLs across 100 competitors against Ongo's 34 live pages; filters by category. | Instantly lists missing pages: *"OrderlyMeds and Mochi have 12 dosing/side-effect pages; Ongo only has 3. Here are the 9 missing topics to write next."* |
| **2. Competitor Gap Mining** | **Competitor Title & Meta Evolution Tracker** | Automated crawler comparing cached competitor sitemaps weekly | Diff engine showing when competitors change their title tags, descriptions, or launch new product silos. | Alerts you when a competitor tests a new CTR hook (e.g., *"Eden just changed title from 'Semaglutide' to 'Semaglutide Starting $199'"*). |
| **3. Intent & Keyword Harvester** | **Google Autocomplete & People Also Ask (PAA) Harvester** | Free Google Suggest API (`suggestqueries.google.com/complete/search`) | Extracts hundreds of real human search queries, question modifiers (how, why, cost, vs, units), and long-tail intents for free with zero API keys. | Automatically sorts harvested queries into their proper topical silo (Dosing Silo, Pricing Silo, Comparison Silo). |
| **3. Intent & Keyword Harvester** | **Topical Cannibalization Detector** | Fuzzy string matching & cosine similarity script | Compares H1s, titles, and target keywords across all Ongo live pages to detect keyword overlap. | Prevents duplicate pages from competing against each other in Google (e.g., stops two blog posts from cannibalizing "semaglutide dosing chart"). |
| **4. E-E-A-T & Schema** | **Interactive Healthcare Schema (JSON-LD) Generator** | Pure TypeScript / React form tool | Generates valid Schema.org structured data for `MedicalWebPage`, `Physician`, `Drug`, and `FAQPage`. | Creates copy-paste JSON-LD script tags linking Dr. Okonkwo and Dr. Kramer's board certifications directly to Ongo's medical treatments. |
| **5. CTR & SERP Testing** | **Live CTR & Snippet A/B Test Simulator** | Custom React component with character and pixel-width calculators | Calculates exact pixel width (600px desktop / 375px mobile) and scores titles for human search queries, power words, and zero-symbol compliance. | Lets you draft and validate 5 headline variations for each page and pick the highest-scoring title before updating your CMS. |
| **6. Local SEO Architecture** | **Programmatic 50-State Local Telehealth Silo Planner** | Next.js template generator + CSV city database | Generates the complete 50-state and top-100 metropolitan URL structure (`/locations/state/city/`) with localized metadata and breadcrumbs. | Plans out geotargeted silos (Houston, Dallas, Miami, Atlanta) with strict upward linking back to the Texas and Florida state hubs. |

---

## 2. Categorizing Ongo's Pages into 8 Structural Silos

```
                            [ ongoweightloss.com ]
                                      │
  ┌────────────────┬──────────────────┼──────────────────┬────────────────┐
  │                │                  │                  │                │
[Silo 1: Core]   [Silo 2: Tools]    [Silo 3: Compare]  [Silo 4: Dosing]  [Silo 5: Doctors]
Commercial       Interactive        Brand vs           Titration         Board Certified
Treatments       Calculators        Compounded         Guides            Authority
  │                │                  │                  │                │
  └────────────────┴──────────────────┼──────────────────┴────────────────┘
                   │                  │                  │
             [Silo 6: Local]    [Silo 7: Health]   [Silo 8: Trust]
             50-State Geo       Side Effects &     Pricing, Policies
             Telehealth         Nutrition          & Intake Funnel
```

### Silo 1: Commercial Treatment Hub (Money Pages)
* **Role:** High-intent conversion pages designed to rank for transactional search terms.
* **Core Pages:**
  - `/services/glp-1/compounded-semaglutide/`
  - `/services/glp-1/compounded-tirzepatide/`
  - `/services/glp-1/oral-tirzepatide-chewables/`

### Silo 2: Interactive Self-Service Tools Silo
* **Role:** High dwell-time, zero-bounce utility tools that qualify searchers and pass pre-filled data to intake.
* **Core Pages:**
  - `/tools/glp1-cost-calculator/`
  - `/tools/bmi-eligibility-screener/`
  - `/tools/glp1-dosage-converter/`
  - `/tools/semaglutide-vs-tirzepatide-quiz/`

### Silo 3: Medication Comparisons & Alternatives Silo
* **Role:** Captures middle-of-the-funnel patients comparing brand-name drugs vs. affordable compounded options.
* **Core Pages:**
  - `/compare/semaglutide-vs-tirzepatide/`
  - `/compare/compounded-semaglutide-vs-wegovy/`
  - `/compare/compounded-tirzepatide-vs-zepbound/`
  - `/compare/oral-vs-injectable-glp1/`

### Silo 4: Clinical Dosing, Titration & Administration Silo
* **Role:** High-volume informational queries capturing patients searching for dosage charts and instructions.
* **Core Pages:**
  - `/blog/semaglutide/semaglutide-dosing-guide/`
  - `/blog/tirzepatide/tirzepatide-dosing-guide/`
  - `/blog/tirzepatide/tirzepatide-liposomal-chewable-tablet-dosing-guide/`
  - `/guides/dosing/how-to-inject-subcutaneous-glp1/`

### Silo 5: Medical Board & Clinician E-E-A-T Silo
* **Role:** Satisfies Google's strict YMYL (Your Money or Your Life) medical authority algorithms.
* **Core Pages:**
  - `/medical-team/`
  - `/medical-team/dr-david-okonkwo/`
  - `/medical-team/dr-zachary-kramer/`
  - `/medical-team/dr-gaurav-patel/`
  - `/medical-team/dr-jonathan-miller/`
  - `/medical-team/dr-benjamin-krasne/`

### Silo 6: Programmatic 50-State Telehealth Silo
* **Role:** Captures localized search queries without creating duplicate content penalties.
* **Core Pages:**
  - State Hub: `/locations/texas/` -> City Spokes: `/locations/texas/houston/`, `/locations/texas/dallas/`, `/locations/texas/austin/`
  - State Hub: `/locations/florida/` -> City Spokes: `/locations/florida/miami/`, `/locations/florida/tampa/`, `/locations/florida/orlando/`

### Silo 7: Nutrition, Side Effects & Lifestyle Support Silo
* **Role:** Patient retention, long-tail search dominance, and trust building.
* **Core Pages:**
  - `/blog/glp-1/how-glp-1-works-for-weight-loss/`
  - `/guides/lifestyle/what-to-eat-on-semaglutide/`
  - `/guides/lifestyle/how-to-manage-glp1-nausea/`

### Silo 8: Trust, Compliance & Funnel Silo
* **Role:** Objection removal, legal transparency, and final payment/consultation intake.
* **Core Pages:**
  - `/weightloss-onboard/` (The primary money conversion endpoint)
  - `/pricing/`
  - `/how-it-works/`
  - `/policies/refund-policy/` (100% money-back if not approved)
  - `/policies/cold-chain-shipping-standards/`

---

## 3. The Strict Internal Linking Matrix (How Equity Flows)

To maximize Google rankings, internal links must follow a mathematical equity loop rather than random placement:

```
[ Informational Spoke (Dosing / Side Effects) ]
                  │
                  ▼ (Link in first 150 words)
[ Commercial Hub (/services/glp-1/compounded-semaglutide/) ]
                  │
                  ▼ (High-contrast primary CTA)
[ Conversion Funnel (/weightloss-onboard/) ]
```

### The 4 Linking Rules:
1. **Vertical Funneling (Spokes -> Hubs):**
   - Every guide in Silo 4 (Dosing) and Silo 7 (Side Effects) must link to its parent commercial page in Silo 1 within the first two paragraphs using exact intent anchor text (e.g., *"licensed doctors can prescribe [compounded semaglutide online](/services/glp-1/compounded-semaglutide/)"*).
2. **Contextual Tool Bridges:**
   - Every dosing guide must link to the **Syringe Converter Tool** (`/tools/glp1-dosage-converter/`).
   - Every pricing guide must link to the **Cost Calculator Tool** (`/tools/glp1-cost-calculator/`).
   - Every tool completion screen links directly to `/weightloss-onboard/`.
3. **Medical E-E-A-T Signature Loops:**
   - Every clinical guide features a *"Medically Reviewed by Dr. [Name]"* badge linking to their Silo 5 bio page.
   - The bio page links back to the treatments that doctor prescribes, creating an author-authority loop.
4. **Strict Silo Boundaries:**
   - Avoid cross-linking between unrelated spokes (e.g., do not link a local Houston page to a terms of service page). Keep link equity circulating within the topical silo before passing it upward to money pages.

---

## 4. Implementation Steps: What We Can Code Next in Your App

1. **Step 1: Build the Free Google Autocomplete / PAA Harvester**
   - Add a new tab `/keywords-harvester` to the dashboard that queries Google's free Suggest API for any seed term and outputs categorized question clusters.
2. **Step 2: Build the Internal Link Recommender Tool**
   - Add an engine that scans Ongo's live pages and outputs a table of missing internal links with exact anchor text recommendations.
3. **Step 3: Build the Competitor Gap Comparator**
   - Wire our existing 33,108 competitor URLs against Ongo's 34 pages to output an instant "Content Roadmap" of high-priority pages to create next.


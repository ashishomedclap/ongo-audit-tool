# SEO Research Tools, Topical Siloing & Internal Linking Architecture Guide

## Purpose & Scope
This guide provides an end-to-end framework of **SEO research tools, competitive intelligence platforms, and architectural methodologies** for an SEO specialist building **Ongo Weight Loss** (`ongoweightloss.com`) into an authoritative compounded GLP-1 telehealth market leader.

This document focuses on **tools you use as an SEO researcher** to:
1. Reverse-engineer competitor rankings, backlinks, and traffic sources.
2. Uncover high-intent transactional search queries and question clusters.
3. Model topical silos (Hub & Spoke architecture) and prevent topical cannibalization.
4. Audit and architect internal PageRank flow and internal linking equity.
5. Benchmark CTR performance and monitor search engine results page (SERP) features.

---

## 1. Master Table: SEO Research & Architecture Tools

| SEO Function Category | Tool Name | Primary Purpose in GLP-1 Research | What Data It Gives You | How to Apply to Ongo Weight Loss |
| :--- | :--- | :--- | :--- | :--- |
| **1. Competitor & Keyword Intelligence** | **Ahrefs / Semrush** | Competitor reverse-engineering & gap analysis | Organic keywords, traffic share, top pages, competitor backlink profiles, SERP volatility | Identify which URLs drive 80% of traffic for OrderlyMeds, Mochi, and Ro; extract their highest-converting transactional keywords. |
| **1. Competitor & Keyword Intelligence** | **OpenSEO / DataForSEO** | Real-time SERP scraping & domain intelligence | Live Google SERP rankings, search volumes, domain overviews, featured snippet owners | Continuously scrape live SERP competitor titles, descriptions, and ranking shifts across target GLP-1 queries. |
| **2. Technical Crawling & Architecture** | **Screaming Frog SEO Spider** | Site architecture, crawl depth & status auditing | Full crawl trees, canonicals, status codes, H1/H2 tags, title length, indexability, orphan pages | Crawl both `ongoweightloss.com` and top competitors to uncover hidden URLs, sitemap discrepancies, and crawl-depth bottlenecks. |
| **2. Technical Crawling & Architecture** | **Sitebulb** | Visual website architecture & audit diagnostics | Interactive crawl maps, crawl depth distribution, duplicate content clusters, redirect chains | Visually audit how search engine bots crawl Ongo and verify that key money pages are reachable in 2 clicks or fewer. |
| **3. Search Intent & Keyword Clustering** | **AlsoAsked** | People Also Ask (PAA) intent mapping | Hierarchical question trees directly mined from Google's live "People Also Ask" algorithm | Discover exact questions prospective patients ask before purchasing (e.g., "what happens if I stop semaglutide", "how many units is 0.25mg"). |
| **3. Search Intent & Keyword Clustering** | **Keyword Insights / Cluster AI** | Algorithmic keyword grouping & search intent classification | Clusters thousands of keywords into distinct URLs based on SERP similarity (avoids cannibalization) | Group 5,000+ GLP-1 keywords into single actionable content silos so you don't create duplicate competing pages. |
| **4. Internal Linking & Silo Modeling** | **Gephi** | Graph visualization of internal link PageRank flow | Visual node-and-edge graphs showing internal link weight, PageRank distribution, and hub centrality | Verify that link equity flows directly into money pages (`/services/glp-1/...`) rather than getting trapped in utility or legal pages. |
| **4. Internal Linking & Silo Modeling** | **InLinks / LinkStorm** | Semantic internal linking & entity association | Knowledge graph entity mapping, automated internal link suggestions based on schema concepts | Identifies missing internal links between clinical dosing guides and commercial treatment hubs to build topical clusters. |
| **5. Semantic NLP & Content Optimization** | **Surfer SEO / Clearscope** | Semantic entity scoring & NLP content optimization | Google NLP entity coverage, keyword density benchmarks, heading structure, readability | Score articles before publishing to ensure they cover all medically required entities (e.g., "titration", "gastric emptying", "subcutaneous injection"). |
| **5. Semantic NLP & Content Optimization** | **Google Cloud Natural Language API** | Entity salience & category verification | Google's own understanding of text entities, categories (/Health/Pharmacy), and sentiment | Run drafted content through Google's native API to confirm it is classified under the correct medical and pharmaceutical entities. |
| **6. SERP Snippet & CTR Optimization** | **Google Search Console (GSC)** | Live CTR analysis, search queries & impressions | Actual search queries, impression volume, average position, real click-through rates (CTR) | Pinpoint high-impression, low-CTR URLs (e.g., Position 3 with only 2% CTR) and test new human-query title tags to double clicks. |
| **6. SERP Snippet & CTR Optimization** | **Detailed SEO Extension / Mangools SERP Simulator** | Browser-level snippet and meta tag debugging | Live SERP snippet mockup, OpenGraph tags, schema markup preview, heading hierarchy | Rapidly preview and test how titles and descriptions wrap on desktop vs mobile screens before publishing changes to production. |
| **7. Local SERP & Geotargeting Research** | **Local Falcon / BrightLocal** | Multi-point local ranking grid research | Geotargeted rank tracking on a 5-mile to 25-mile grid for local search queries | Track local rankings for Houston, Dallas, Miami, and other target metros for terms like "semaglutide clinic near me". |

---

## 2. Categorizing the SEO Workflow: The 5 Research Silos

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SEO RESEARCH WORKFLOW                           │
└────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    │                               │                               │
[Silo A: Intelligence]    [Silo B: Architecture]         [Silo C: Linking]
Competitor Reverse-       Topical Siloing &              PageRank Flow &
Engineering & Keywords    Intent Clustering              Internal Link Graphs
    │                               │                               │
    └───────────────────────────────┼───────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    │                                                               │
[Silo D: Semantic NLP]                                  [Silo E: Performance]
Entity Coverage &                                       GSC CTR Optimization &
Medical E-E-A-T Scoring                                 Rank Tracking
```

---

## 3. How to Build Ongo's Content Silos & Internal Linking Using These Tools

### Phase 1: Competitor Reverse-Engineering & Keyword Extraction (Silo A)
* **Tools to use:** Ahrefs, Semrush, OpenSEO MCP.
* **Action Steps:**
  1. Input the top 10 competitors (`orderlymeds.com`, `joinmochi.com`, `tryeden.com`, `henrymeds.com`, `lavenderskyhealth.com`).
  2. Filter for **Top Pages by Organic Traffic**: Identify the exact URLs generating the highest organic search volume.
  3. Export competitor keyword lists with search volume, keyword difficulty (KD), and search intent (Commercial, Transactional, Informational).
  4. Identify **Content Gaps**: Keywords where competitors rank on Page 1 but Ongo does not yet have a dedicated page (e.g., *"tirzepatide chewable tablets"*, *"semaglutide dosage chart"*).

---

### Phase 2: Keyword Clustering & Topical Siloing (Silo B)
* **Tools to use:** Keyword Insights, AlsoAsked, Screaming Frog.
* **Action Steps:**
  1. Feed raw keyword exports into **Keyword Insights** to group keywords algorithmically based on SERP overlap.
     - If Google displays the same 5 websites for *"compounded semaglutide cost"* and *"how much is semaglutide per month"*, they belong to the **same URL** (`/pricing/`).
     - If Google displays different websites, create **separate dedicated spoke pages**.
  2. Map the keywords into the **8 Core Silos**:
     - **Commercial Silo:** Target terms like *"buy compounded semaglutide online"*, *"telehealth tirzepatide rx"*.
     - **Dosing Silo:** Target terms like *"semaglutide weekly titration schedule"*, *"how to inject semaglutide"*.
     - **Comparison Silo:** Target terms like *"semaglutide vs tirzepatide weight loss percentage"*, *"compounded semaglutide vs wegovy"*.
     - **Local Silo:** Target terms like *"compounded semaglutide Houston TX"*.

---

### Phase 3: Internal Linking Matrix & PageRank Modeling (Silo C)
* **Tools to use:** Screaming Frog (Force-Directed Crawl Diagram), Gephi, InLinks.
* **Action Steps:**
  1. Run a full crawl of `ongoweightloss.com` in **Screaming Frog**.
  2. Open **Visualizations -> Force-Directed Crawl Diagram**: Inspect the site graph.
     - **Healthy Graph:** The homepage connects to the 8 Silo Hubs, which fan out evenly to their spokes.
     - **Broken Graph:** Isolated spoke pages with only 1 incoming link (orphan pages) or utility pages (e.g., `/privacy-policy/`) receiving more link equity than money pages.
  3. Implement the **Hub-and-Spoke Silo Linking Rules**:
     - **Rule 1 (Spoke-to-Hub):** Every spoke page must link back to its parent hub (e.g., `/blog/semaglutide/semaglutide-dosing-guide/` links back to `/services/glp-1/compounded-semaglutide/`).
     - **Rule 2 (Spoke-to-Spoke):** Pages in the same silo cross-link naturally (e.g., Semaglutide Dosing Guide links to Semaglutide Side Effects Guide).
     - **Rule 3 (Cross-Silo Restriction):** Do not link randomly between unrelated spokes (e.g., a local Houston page should not link to a medical intake disclaimer). Keep silos tight to preserve topical context.
     - **Rule 4 (Funnel Pass-Through):** Every single page links to `/weightloss-onboard/` with a high-contrast anchor CTA.

---

### Phase 4: Semantic NLP & Medical Entity Optimization (Silo D)
* **Tools to use:** Surfer SEO, Google Natural Language API.
* **Action Steps:**
  1. For YMYL (Your Money or Your Life) healthcare topics, Google looks for specific medical entities and clinical co-occurrences.
  2. Run your page copy through the **Google Natural Language API**:
     - Check the **Entities** output: Google must recognize entities like *Glucagon-like peptide-1*, *Semaglutide*, *Subcutaneous injection*, *Titration*, and *Body mass index*.
     - Check the **Category** score: Ensure the content is classified under `/Health/Pharmacy/Drugs & Medications` with a confidence score above `0.85`.
  3. Ensure medical credentials: Include structured `MedicalWebPage` schema and `Person` schema for the reviewing physician (Dr. Okonkwo / Dr. Kramer).

---

### Phase 5: Live CTR Diagnostics & Optimization (Silo E)
* **Tools to use:** Google Search Console (GSC), Mangools SERP Simulator.
* **Action Steps:**
  1. In **Google Search Console -> Performance**, look for **High-Impression, Low-CTR pages**:
     - Filter for queries ranking in Positions 1–5 that have a CTR under 4%.
     - This indicates that Google likes your content relevance, but searchers find your snippet boring or passive.
  2. Replace rigid, symbolic title tags with **human-written search query titles**:
     - *Bad Title:* `Compounded Semaglutide Vials \| Telehealth Rx \| Ongo` (CTR: 2.1%)
     - *Optimized Title:* `How to get compounded semaglutide online prescribed by doctors` (CTR: 5.8%+)
  3. Preview the snippet on both Desktop and Mobile viewports using the **Ongo Audit Tool SERP Preview** before pushing live.

---

## 4. Implementation Checklist for the SEO

- [ ] **Step 1:** Export top 200 URLs and keywords from top 5 competitors using Ahrefs/Semrush.
- [ ] **Step 2:** Cluster keywords into 8 distinct topical silos using keyword grouping tools.
- [ ] **Step 3:** Crawl `ongoweightloss.com` using Screaming Frog to identify crawl depth bottlenecks.
- [ ] **Step 4:** Construct internal linking breadcrumbs and hub-and-spoke links across all 34 live pages.
- [ ] **Step 5:** Optimize meta titles and descriptions using conversational human search queries without brand fluff.
- [ ] **Step 6:** Validate Schema.org markup (`MedicalWebPage`, `Physician`, `FAQPage`) using Google Rich Results Test.
- [ ] **Step 7:** Set up weekly GSC rank and CTR monitoring to measure organic traffic growth.


# Custom In-House SEO Tools to Audit Competitors & Ongo Website Properties

## Executive Overview
This blueprint details the **custom SEO tools you can build for free** inside your `ongo-audit-tool` dashboard to inspect, analyze, and benchmark the technical, on-page, and architectural **SEO properties** of:
1. **Your Own Website:** `ongoweightloss.com` (diagnose issues, missing tags, thin content, broken links).
2. **Your Competitors:** (OrderlyMeds, Mochi, Eden, Ro, Henry Meds, etc.) to uncover their exact on-page SEO formulas, schemas, heading hierarchies, and internal link structures.

---

## 1. Master Table: Custom SEO Property Checkers to Build

| Tool Name | What SEO Properties It Checks (Own Site & Competitors) | Data Extracted & Inspected | How It Validates Silos & Internal Linking | Implementation (Free Code Stack) |
| :--- | :--- | :--- | :--- | :--- |
| **1. Head-to-Head Side-by-Side URL Comparator** | Direct side-by-side audit of any Ongo page vs. any competitor page | Title tag, meta description, H1, H2/H3 subheadings, word count, image count, schema types, canonical URL | Directly compares how a competitor structures their silo money page (e.g. OrderlyMeds `/semaglutide`) vs Ongo (`/compounded-semaglutide/`). | Next.js Split View Component + Server fetch with Cheerio HTML parser |
| **2. Heading Hierarchy & Outline Inspector** | H1, H2, H3, H4 logical structure and heading nesting | Full heading tree outline, multiple H1 warnings, empty headings, keyword placement in headings | Confirms that spoken guides use subheadings matching sub-intents (e.g., dosage ramp-up, side effects) within the silo. | Python / Cheerio DOM traversal extracting all `<h[1-6]>` in sequence |
| **3. Internal Link & Anchor Text Analyzer** | Every outgoing and incoming internal link on a page | Target URLs, link status (200, 301, 404), anchor text, link location (Header, Body, Footer), rel attributes | Audits whether a page properly links to its parent silo hub and checks if anchor text uses target keywords or generic "click here". | Python BeautifulSoup parser extracting `a[href]` and categorizing internal vs external |
| **4. Indexability, Canonical & Robots Auditor** | Canonical tags, robots meta directives, HTTP headers | Canonical URL match (self-referencing vs mismatch), `<meta name="robots">`, `X-Robots-Tag`, `noindex`, `nofollow` | Ensures silo spoke pages are fully indexable and not accidentally blocked or canonicalized to the wrong parent URL. | HTTP response headers check + `<link rel="canonical">` regex |
| **5. Structured Data & Schema.org Inspector** | Schema markup, JSON-LD, Microdata | Schema types (`MedicalWebPage`, `Physician`, `Drug`, `FAQPage`), author entity markup, validation warnings | Checks if competitors use `Drug` or `Physician` schema to win Google rich snippets and verifies Ongo's schema implementation. | Parses `<script type="application/ld+json">`, validates against Schema.org types |
| **6. Content Depth & Topical Entity Density Checker** | Text-to-code ratio, word count, keyword/entity frequency | Word count, reading ease, frequency of terms ("semaglutide", "titration", "GIP", "telehealth", "doctor") | Reveals whether competitor ranking pages have 1,500 words vs. Ongo's 600 words, highlighting thin content in your silo. | Python natural language tokenizer / regex word counter |
| **7. Image SEO & Asset Performance Inspector** | All `<img>` tags, file formats, and loading attributes | Image URLs, missing `alt` text, file format (WebP vs PNG/JPEG), `loading="lazy"` tags, natural dimensions | Audits image optimization on treatment and guide pages, checking for descriptive alt text matching silo keywords. | Extracts all `<img>` nodes; inspects `alt`, `src`, `loading`, and file extensions |
| **8. OpenGraph & Social Metadata Previewer** | Social sharing tags for Facebook, LinkedIn, Twitter/X | `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`, image aspect ratio | Ensures when guides or comparison pages are shared on forums (Reddit, Facebook groups), they generate high-CTR cards. | Parses all `<meta property="og:*">` and renders a live social card mockup |
| **9. Silo Breadcrumb & URL Depth Validator** | Breadcrumbs structure, URL slug hierarchy, click depth | Breadcrumb schema, UI breadcrumb trail, slash depth (e.g. `/services/glp-1/semaglutide/` = depth 3) | Validates that every page strictly signals its position in the silo hierarchy to Google bots and human visitors. | Parses breadcrumb HTML and `BreadcrumbList` JSON-LD schema |

---

## 2. Categorizing the Tools into 4 SEO Diagnostic Silos

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CUSTOM IN-HOUSE SEO AUDIT ENGINE                     │
└────────────────────────────────────────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    │                               │                               │
[Silo 1: On-Page & Content]  [Silo 2: Links & Silos]     [Silo 3: Technical]
- Heading Hierarchy          - Internal Link Extractor   - Canonical & Robots
- Head-to-Head Compare       - Anchor Text Distribution  - Indexability
- Content Word Count         - Silo Breadcrumb Validator - Schema JSON-LD
    │                               │                               │
    └───────────────────────────────┼───────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
            [Silo 4: Assets & Social]       [Silo 5: Live Snippets]
            - Image Alt & WebP Audit        - Desktop/Mobile SERP Preview
            - OpenGraph Social Cards        - Human Query Validator
```

---

## 3. How These Tools Specifically Audit Silos & Internal Linking

### A. How Tool #3 Audits Internal Silo Links
When you run the **Internal Link & Anchor Text Analyzer** on an Ongo URL (or a competitor URL):
1. **Silo Isolation Check:** Does the page link to pages outside its silo?
   - *Example:* A Semaglutide Dosing Guide should link to the **Semaglutide Core Treatment Hub** and the **Semaglutide Side Effects Guide**. If it links to a random local Texas page, it flags a *Silo Leak*.
2. **Anchor Text Optimization Check:**
   - Detects generic anchors like *"click here"*, *"read more"*, or *"learn more"*.
   - Recommends replacing them with descriptive keyword anchors like *"[compounded semaglutide online](/services/glp-1/compounded-semaglutide/)"*.
3. **Upward Funneling Check:**
   - Verifies whether the page contains at least one prominent contextual link pointing to the primary conversion funnel (`/weightloss-onboard/`).

### B. How Tool #1 (Head-to-Head Comparator) Reverse-Engineers Competitor Silos
When you input:
* **Ongo URL:** `https://ongoweightloss.com/services/glp-1/compounded-semaglutide/`
* **Competitor URL:** `https://orderlymeds.com/semaglutide` (or Mochi / Eden)

The tool immediately renders a split-screen comparative audit:
1. **Title & Description:** Length, CTR hooks, keywords included.
2. **Headings Outline:** OrderlyMeds' H2/H3 subheadings vs Ongo's subheadings (reveals what topics they cover that Ongo misses).
3. **Content Depth:** Word count comparison (e.g., Competitor: 1,420 words vs. Ongo: 580 words).
4. **Internal Link Outlets:** How many internal links does the competitor page have, and where do they point?
5. **Schema Markup:** What Schema types does the competitor have (`MedicalWebPage`, `Drug`, `FAQPage`) that Ongo is missing?

---

## 4. Implementation Plan for Your Dashboard (`ongo-audit-tool`)

### Phase 1: Build the Head-to-Head Side-by-Side URL Comparator (Priority 1)
* Add a new tab in the dashboard: **`URL Comparator`**.
* Input two URLs (your page + competitor page).
* Click **"Compare SEO Properties"** to instantly generate the full side-by-side comparison table.

### Phase 2: Build the Internal Link & Anchor Text Inspector (Priority 2)
* Add an inspector that scans any page's HTML.
* Extracts every link, displays internal vs external counts, flags broken links, and audits anchor text quality.

### Phase 3: Build the Structured Data & Schema Validator (Priority 3)
* Automatically extracts JSON-LD from any live URL and highlights missing required medical fields.

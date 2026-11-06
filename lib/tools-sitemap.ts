export interface ToolDefinition {
  id: string;
  name: string;
  shortName: string;
  rank: number;
  rankTier: 'Tier 1: Essential Core' | 'Tier 2: High Value Strategy' | 'Tier 3: Specialized / Review';
  level: 1 | 2 | 3;
  levelLabel: string;
  category: 'level-1' | 'level-2' | 'level-3';
  categoryLabel: string;
  categoryIcon: string;
  path: string;
  useCase: string;
  description: string;
  valueProp: string;
  howToUse: string;
  whyToUse: string;
  recommendation: 'KEEP (Core Asset)' | 'KEEP (High Value)' | 'CONSIDER MERGING' | 'CONSIDER REMOVING';
  recommendationReason: string;
  badge?: string;
  badgeColor?: string;
  badgeBg?: string;
  keyMetrics: string;
  keywords: string[];
}

export interface ToolCategory {
  id: 'level-1' | 'level-2' | 'level-3';
  level: 1 | 2 | 3;
  name: string;
  useCase: string;
  shortDescription: string;
  icon: string;
  accentColor: string;
  tools: ToolDefinition[];
}

export const TOOLS_DIRECTORY: ToolDefinition[] = [
  // ==========================================
  // RANK #1: CLEAN SCRAPER & OFFLINE CLONER
  // ==========================================
  {
    id: 'clean-scraper',
    name: 'Clean Page Scraper & Offline Cloner',
    shortName: 'Clean Scraper',
    rank: 1,
    rankTier: 'Tier 1: Essential Core',
    level: 1,
    levelLabel: 'Level 1 · Foundation',
    category: 'level-1',
    categoryLabel: 'Level 1: Foundation & Baseline',
    categoryIcon: 'FileCode',
    path: '/clean-scraper',
    useCase: 'Scrape websites page-by-page, strip bloated JS/trackers, inline CSS, inject simplified Vanilla JS for accordions, and preview offline HTML.',
    description: 'Headless page-by-page cloner turning heavy Next.js sites into standalone, lightweight offline HTML with working FAQ accordions, zero console errors, and instant live preview.',
    valueProp: 'Removes 35+ React hydration bundles, inlines unified computed CSS, rewrites assets, and provides an interactive offline sandbox preview.',
    howToUse: 'Enter any live website URL or paste raw HTML into Mode 1 or 2 to generate clean offline standalone code with working accordions, or browse the 43-page pre-scraped Ongo archive in Mode 3 with instant previews and downloads.',
    whyToUse: 'Allows Ongo to clone, inspect, audit, and benchmark competitors and its own pages offline with zero React hydration bugs, fully preserved CSS styling, and functional FAQ accordions.',
    recommendation: 'KEEP (Core Asset)',
    recommendationReason: 'Core asset providing standalone offline page simplification with working accordions and instant live preview.',
    badge: 'Offline Cloner',
    badgeColor: '#059669',
    badgeBg: '#dcfce7',
    keyMetrics: '43 Saved Pages • 1-Click Offline',
    keywords: ['scraper', 'clean', 'offline', 'html', 'css', 'js', 'vanilla', 'accordion', 'clone', 'crawler']
  },

  // ==========================================
  // RANK #2: IMAGE ALT & ACCESSIBILITY AUDITOR
  // ==========================================
  {
    id: 'image-audit',
    name: 'Image Alt Tags & WCAG a11y Auditor',
    shortName: 'Image Alt Auditor',
    rank: 2,
    rankTier: 'Tier 1: Essential Core',
    level: 1,
    levelLabel: 'Level 1 · Foundation',
    category: 'level-1',
    categoryLabel: 'Level 1: Foundation & Baseline',
    categoryIcon: 'Image',
    path: '/image-audit',
    useCase: 'Inspect all images across Ongo pages for missing alt tags, empty alt attributes, or suspicious filenames like IMG_001.jpg.',
    description: 'Dedicated image accessibility and WCAG auditor scanning img elements to flag missing alt tags, evaluate description quality, and provide 1-click copyable descriptive alt text fixes.',
    valueProp: 'Automated WCAG 2.1 AA/AAA compliance checks, filename heuristic detection, and 1-click copy fixes.',
    howToUse: 'Select any Ongo page preset (Homepage, Pricing, Semaglutide, Tirzepatide, etc.) to view all images, filter by Missing or Suspicious alt text, and copy suggested descriptive alt text directly to your clipboard.',
    whyToUse: 'Missing or generic image alt tags harm search engine image indexation and violate ADA / WCAG accessibility compliance.',
    recommendation: 'KEEP (Core Asset)',
    recommendationReason: 'Dedicated single-purpose accessibility tool protecting against ADA legal risks and boosting Google Image Search visibility.',
    badge: 'WCAG 2.1 Audit',
    badgeColor: '#059669',
    badgeBg: '#dcfce7',
    keyMetrics: 'Alt Tag Scorecard • 1-Click Fix',
    keywords: ['image', 'alt tags', 'a11y', 'accessibility', 'wcag', 'audit', 'images', 'screen reader']
  },

  // ==========================================
  // RANK #2.5: LIVE CORE WEB VITALS & SPEED BENCHMARK
  // ==========================================
  {
    id: 'pagespeed-benchmark',
    name: 'Live Core Web Vitals & Speed Benchmark',
    shortName: 'Speed Benchmark',
    rank: 3,
    rankTier: 'Tier 1: Essential Core',
    level: 1,
    levelLabel: 'Level 1 · Foundation',
    category: 'level-1',
    categoryLabel: 'Level 1: Foundation & Baseline',
    categoryIcon: 'Zap',
    path: '/pagespeed-benchmark',
    useCase: 'Audit live mobile and desktop Core Web Vitals (LCP, INP, CLS, TTFB) head-to-head against Ro, Hims, Mochi, and Henry Meds.',
    description: 'Real-time performance benchmark querying Google PageSpeed Insights and live edge network probes to verify Ongo\'s sub-2s mobile loading advantage.',
    valueProp: 'Instant CWV radar, edge TTFB waterfall breakdown, and competitive speed moat scorecard.',
    howToUse: 'Select any 1-click competitor preset or input any telehealth URL to run a live speed audit with radial performance gauges and timing diagnostics.',
    whyToUse: 'Telehealth conversion rates drop by 7% per 100ms delay. Proves Ongo\'s clean Next.js server-rendered architecture loads 46% faster than bloated competitor portals.',
    recommendation: 'KEEP (Core Asset)',
    recommendationReason: 'Crucial technical SEO and conversion rate optimization proof point.',
    badge: 'Live CWV Radar',
    badgeColor: '#059669',
    badgeBg: '#dcfce7',
    keyMetrics: 'LCP • INP • CLS • TTFB',
    keywords: ['pagespeed', 'speed', 'cwv', 'lcp', 'inp', 'cls', 'performance', 'lighthouse', 'ttfb', 'mobile']
  },

  // ==========================================
  // RANK #3: COMPETITOR GAP & CONTENT ROADMAP
  // ==========================================
  {
    id: 'competitor-gap',
    name: 'Competitor Gap & Content Roadmap',
    shortName: 'Content Roadmap',
    rank: 3,
    rankTier: 'Tier 1: Essential Core',
    level: 2,
    levelLabel: 'Level 2 · Research',
    category: 'level-2',
    categoryLabel: 'Level 2: Research & Content Engine',
    categoryIcon: 'GitCompare',
    path: '/competitor-gap',
    useCase: 'Discover topic vacuums where 70+ competitors rank but Ongo is missing; generate 1-click writer briefs.',
    description: 'Cross-references 33,108 competitor URLs against Ongo\'s 56 live pages to output an instant Content Roadmap.',
    valueProp: 'Reveals topic vacuums where 70+ competitors rank; generates 1-click writer briefs with H1s and meta tags.',
    howToUse: 'Filter the 33,108 competitor URL database by Priority (P0 Critical, P1 High) or Silo Category. Click any topic vacuum to auto-generate a complete writer brief with target H1s, keyword variations, and meta descriptions.',
    whyToUse: 'Directly drives organic traffic growth by identifying high-volume search topics (like GLP-1 dosage charts, insurance coverage, protein intake, side effects, and compounding legality) where competitors dominate but Ongo has zero content.',
    recommendation: 'KEEP (Core Asset)',
    recommendationReason: 'Highest organic traffic ROI in the entire suite. Turns raw competitor data directly into actionable content publishing briefs.',
    badge: '33,108 URLs Wired',
    badgeColor: '#c2410c',
    badgeBg: '#fee2e2',
    keyMetrics: 'P0 Gaps • Writer Briefs',
    keywords: ['competitor gap', 'gap', 'content roadmap', 'roadmap', '33108', 'writer briefs', 'vacuums']
  },

  // ==========================================
  // RANK #4: GOOGLE AUTOCOMPLETE & PAA HARVESTER
  // ==========================================
  {
    id: 'keywords-harvester',
    name: 'Google Autocomplete & PAA Harvester',
    shortName: 'PAA Harvester',
    rank: 4,
    rankTier: 'Tier 1: Essential Core',
    level: 2,
    levelLabel: 'Level 2 · Research',
    category: 'level-2',
    categoryLabel: 'Level 2: Research & Content Engine',
    categoryIcon: 'Sparkles',
    path: '/keywords-harvester',
    useCase: 'Harvest hundreds of real user questions from Google Suggest ($0 SaaS cost) grouped into silos.',
    description: 'Queries Google\'s free Suggest API across hundreds of question stems (how, why, cost, vs, units).',
    valueProp: 'Zero SaaS fees ($0). Clusters queries into Ongo\'s 8 topical silos with copyable titles and H2s.',
    howToUse: 'Type any seed query (e.g., "semaglutide dose" or "tirzepatide nausea") or click a question stem button. Google Autocomplete and People Also Ask questions are harvested in real-time with 1-click CSV and markdown export.',
    whyToUse: 'Captures live, unfiltered patient search queries directly from Google Suggest at $0 SaaS cost, giving writers the exact questions required to win Featured Snippets and Google AI Overviews.',
    recommendation: 'KEEP (Core Asset)',
    recommendationReason: 'Replaces expensive paid SEO keyword subscriptions ($99+/mo) with live, unlimited patient question harvesting.',
    badge: 'Free API ($0)',
    badgeColor: '#b45309',
    badgeBg: '#fef3c7',
    keyMetrics: 'Real-Time • 8 Silos',
    keywords: ['keywords', 'harvester', 'google', 'autocomplete', 'paa', 'people also ask', 'questions', 'suggest']
  },

  // ==========================================
  // RANK #5: CONTENT MATCHER & HEAD-TO-HEAD AUDITOR
  // ==========================================
  {
    id: 'content-matcher',
    name: 'Content Matcher & Competitor Head-to-Head Auditor',
    shortName: 'Content Matcher',
    rank: 5,
    rankTier: 'Tier 1: Essential Core',
    level: 2,
    levelLabel: 'Level 2 · Research',
    category: 'level-2',
    categoryLabel: 'Level 2: Research & Content Engine',
    categoryIcon: 'FileCheck2',
    path: '/content-matcher',
    useCase: 'Audit page copy against an 8-point on-page SEO checklist, visualize search intent distribution in an SVG pie/donut chart, and benchmark side-by-side against competitor pages.',
    description: 'Content quality auditor and head-to-head competitor matcher that evaluates keyword presence, meta tags, word count, clinical E-E-A-T, and generates an intent distribution pie chart.',
    valueProp: 'Instant 8-point SEO & clinical checklist, interactive search intent donut chart, and direct competitor page comparison.',
    howToUse: 'Select any Ongo live page or paste draft copy into the editor. Pick a benchmark competitor page (Mochi, Ro, Henry Meds, Hims, Ivím) to run instant head-to-head gap analysis and inspect intent breakdowns.',
    whyToUse: 'Guarantees every published article satisfies search engine ranking criteria (keywords, word depth, bullet formatting, clinical E-E-A-T) and matches target search intent before publishing.',
    recommendation: 'KEEP (Core Asset)',
    recommendationReason: 'Core content optimization and pre-publish governance tool requested to eliminate content quality blind spots.',
    badge: 'Intent Donut & Checklist',
    badgeColor: '#059669',
    badgeBg: '#dcfce7',
    keyMetrics: '8-Point Checklist • Intent Pie Chart',
    keywords: ['content matcher', 'checklist', 'intent', 'pie chart', 'competitor compare', 'head-to-head', 'word count', 'seo audit']
  },

  // ==========================================
  // RANK #6: INDUSTRY RADAR & COMPETITIVE PULSE
  // ==========================================
  {
    id: 'industry-radar',
    name: 'Industry Surveillance Radar & Telehealth Pulse',
    shortName: 'Industry Radar',
    rank: 6,
    rankTier: 'Tier 1: Essential Core',
    level: 2,
    levelLabel: 'Level 2 · Intelligence',
    category: 'level-2',
    categoryLabel: 'Level 2: Research & Market Surveillance',
    categoryIcon: 'Radar',
    path: '/industry-radar',
    useCase: 'Daily and weekly surveillance feeds for GLP-1 FDA shortages, 503A compounding regulations, clinical trial updates, and telehealth competitor price shifts.',
    description: 'Curated executive intelligence radar tracking 24 authoritative sources across regulatory bodies, medical journals, state licensing boards, and live competitor pricing.',
    valueProp: 'Instant daily/weekly inspection rounds with live status checks, categorized bookmarks, and automated workflow checklists.',
    howToUse: 'Filter by Cadence (Daily, Weekly, Monthly) or Category. Run live HTTP status pings to verify endpoints, mark items as inspected in your shift checklist, and export audit logs.',
    whyToUse: 'Compounding regulations and telehealth GLP-1 pricing change weekly. Staying ahead of FDA shortage status and state telemedicine laws is vital to Ongo\'s clinical compliance and SEO authority.',
    recommendation: 'KEEP (Core Asset)',
    recommendationReason: 'Indispensable intelligence dashboard keeping the executive team ahead of regulatory, clinical, and competitive shifts in the GLP-1 space.',
    badge: 'Daily Surveillance',
    badgeColor: '#0284c7',
    badgeBg: '#e0f2fe',
    keyMetrics: '24 Monitored Feeds • Live Ping Tester',
    keywords: ['radar', 'surveillance', 'fda', 'regulations', 'compounding', 'competitors', 'clinical', 'telehealth', 'glp-1', 'daily', 'weekly']
  },

  // ==========================================
  // RANK #6.5: REDDIT PATIENT SENTIMENT & COMPLAINT RADAR
  // ==========================================
  {
    id: 'reddit-sentiment',
    name: 'Reddit GLP-1 Patient Sentiment & Complaint Radar',
    shortName: 'Reddit Sentiment',
    rank: 7,
    rankTier: 'Tier 1: Essential Core',
    level: 2,
    levelLabel: 'Level 2 · Intelligence',
    category: 'level-2',
    categoryLabel: 'Level 2: Research & Market Surveillance',
    categoryIcon: 'MessageSquare',
    path: '/reddit-sentiment',
    useCase: 'Harvest unfiltered patient complaints from r/Semaglutide, r/Tirzepatide & r/compoundedcompleted to extract competitor service flaws and content hooks.',
    description: 'Real-time patient intelligence engine monitoring verified competitor breakdowns (melted cold-packs, hidden fees, prescription delays, doctor ghosting).',
    valueProp: 'Automated complaint categorization, sentiment analysis, and 1-click strategic content moat recommendations for high-intent SEO pages.',
    howToUse: 'Filter by category (Competitor Complaints, Titration, Side Effects, 503A Pharmacies) or search by rival brand (Mochi, Ro, Fridays, Henry Meds) to extract copy hooks.',
    whyToUse: 'Allows Ongo to capture dissatisfied patients by building transparent landing pages directly addressing competitor failures (e.g. 3-5 day guaranteed cold-pack shipping).',
    recommendation: 'KEEP (Core Asset)',
    recommendationReason: 'Highest conversion copywriting ROI in the suite. Turns real-world patient frustrations into winning competitive moats.',
    badge: 'Patient Voice',
    badgeColor: '#dc2626',
    badgeBg: '#fee2e2',
    keyMetrics: 'Verified Complaints • Moat Directives',
    keywords: ['reddit', 'sentiment', 'complaints', 'patient', 'semaglutide', 'tirzepatide', 'reviews', 'voice', 'ice pack', 'cold chain']
  },

  // ==========================================
  // RANK #7: PAGERANK & LINK EQUITY FLOWCHART
  // ==========================================
  {
    id: 'link-flowchart',
    name: 'PageRank & Link Equity Flowchart Visualizer',
    shortName: 'Link Flowchart',
    rank: 7,
    rankTier: 'Tier 1: Essential Core',
    level: 3,
    levelLabel: 'Level 3 · Architecture',
    category: 'level-3',
    categoryLabel: 'Level 3: Architecture & Governance',
    categoryIcon: 'GitMerge',
    path: '/link-flowchart',
    useCase: 'Simulate and visualize the directed flow of PageRank equity from page to page with dynamic damping factor calculations.',
    description: 'Interactive visual flowchart simulator calculating PageRank equity conduits between source and target pages with outbound link count tuning and reciprocal silo conservation.',
    valueProp: 'Interactive directed flowchart with live PageRank formula simulation (d = 0.85), exact anchor text badges, and reciprocal silo loopback.',
    howToUse: 'Select any source and target from Ongo\'s 56 live pages (or load strategic presets), adjust the outbound links count slider (N = 1 to 12), and observe the exact PageRank units transferred with 1-click copy of the resulting HTML link.',
    whyToUse: 'Prevents link equity dilution and verifies that internal links funnel maximum authority into high-converting medication money pages.',
    recommendation: 'KEEP (Core Asset)',
    recommendationReason: 'Interactive visual tool for modeling and optimizing PageRank distribution across topical silos.',
    badge: 'Interactive PR Flow',
    badgeColor: '#1b4332',
    badgeBg: '#d8f3dc',
    keyMetrics: 'PageRank Conduit • 100% Silo Loop',
    keywords: ['flowchart', 'pagerank', 'equity', 'visualizer', 'diagram', 'internal links', 'damping factor', 'conduit']
  },

  // ==========================================
  // RANK #8: INTERNAL LINK & ANCHOR RECOMMENDER
  // ==========================================
  {
    id: 'internal-links',
    name: 'Internal Link & Anchor Text Recommender',
    shortName: 'Internal Links',
    rank: 8,
    rankTier: 'Tier 1: Essential Core',
    level: 3,
    levelLabel: 'Level 3 · Architecture',
    category: 'level-3',
    categoryLabel: 'Level 3: Architecture & Governance',
    categoryIcon: 'Link2',
    path: '/internal-links',
    useCase: 'Eliminate orphan pages and pass link equity to money pages using 4 strict silo linking rules.',
    description: 'Scans Ongo\'s 56 live pages to identify missing internal equity links and generate exact anchor text copy.',
    valueProp: 'Enforces 4 Silo Linking Rules: Vertical funneling, tool bridges, doctor loops, and conversion CTAs.',
    howToUse: 'Select any Ongo page to view missing internal link recommendations. The engine applies 4 strict topic silo rules and provides copyable exact anchor text phrases.',
    whyToUse: 'Distributes PageRank equity efficiently, eliminates orphan pages, and funnels organic traffic from informational blog posts directly into high-converting consult and checkout pages.',
    recommendation: 'KEEP (Core Asset)',
    recommendationReason: 'Internal link architecture is one of Google\'s top 3 ranking factors for establishing topical authority.',
    badge: '4 Silo Rules',
    badgeColor: '#1b4332',
    badgeBg: '#d8f3dc',
    keyMetrics: 'P0 / P1 Anchors',
    keywords: ['internal links', 'anchor text', 'linking', 'pagerank', 'equity', 'funnel', 'silos']
  },

  // ==========================================
  // RANK #9: ONGO LIVE PAGES & META AUDITOR
  // ==========================================
  {
    id: 'ongo-pages',
    name: 'Ongo Live Pages & Meta Auditor',
    shortName: 'Ongo Live Pages',
    rank: 9,
    rankTier: 'Tier 1: Essential Core',
    level: 1,
    levelLabel: 'Level 1 · Foundation',
    category: 'level-1',
    categoryLabel: 'Level 1: Foundation & Baseline',
    categoryIcon: 'Compass',
    path: '/ongo-pages',
    useCase: 'Audit Ongo\'s complete 56 live URLs for title tag lengths, meta descriptions, and CTR hooks.',
    description: 'Audits Ongo\'s 56 live pages with title lengths, meta descriptions, and CTR optimization hooks.',
    valueProp: 'Real-time live XML sitemap refresh and human query SERP simulation.',
    howToUse: 'Inspect Ongo\'s 56 live production pages parsed from sitemap.xml. Filter by missing meta tags, character length warnings, or status codes, and preview real Google SERP snippets.',
    whyToUse: 'Ensures Ongo\'s existing pages don\'t lose search rankings or click-through rates due to missing descriptions, truncated titles, or broken URLs.',
    recommendation: 'KEEP (Core Asset)',
    recommendationReason: 'Essential site health monitor for Ongo\'s live footprint.',
    badge: '56 Live Pages',
    badgeColor: '#059669',
    badgeBg: '#dcfce7',
    keyMetrics: '56 URLs • Live Refresh',
    keywords: ['ongo', 'live', 'pages', 'sitemap.xml', 'meta', 'titles', 'descriptions', 'h1']
  },

  // ==========================================
  // RANK #10: 7 ONBOARDING BOOKS DIGITAL LIBRARY
  // ==========================================
  {
    id: 'books',
    name: '7 Onboarding Books Digital Library',
    shortName: '7 Books Library',
    rank: 10,
    rankTier: 'Tier 2: High Value Strategy',
    level: 1,
    levelLabel: 'Level 1 · Foundation',
    category: 'level-1',
    categoryLabel: 'Level 1: Foundation & Baseline',
    categoryIcon: 'BookOpen',
    path: '/books',
    useCase: 'Internalize clinical GLP-1 guidelines, FDA compounding laws, Next.js SEO, and analytics.',
    description: 'Direct interactive PDF reader with 7 complete onboarding books (2,924 pages, 518k words).',
    valueProp: 'Direct native browser PDF viewer with instant volume switcher, search, and downloads.',
    howToUse: 'Select any of the 7 digital onboarding books (The Foundation, Earned Not Built, Architecture, etc.) from the sidebar to read clinical chapters, legal guidelines, and conversion strategies with search and chapter navigation.',
    whyToUse: 'Centralizes 2,924 pages and 518,000+ words of clinical GLP-1 compounding rules, FDA compliance, and SEO architecture directly inside the application for team reference.',
    recommendation: 'KEEP (High Value)',
    recommendationReason: 'Permanent institutional knowledge and reference library for clinical, legal, and engineering guidelines.',
    badge: '7 Books (PDF)',
    badgeColor: '#059669',
    badgeBg: '#d1fae5',
    keyMetrics: '7 Volumes • 2,924 Pgs',
    keywords: ['books', 'library', 'pdf', 'onboarding', 'the foundation', 'earned not built', 'architecture']
  },

  // ==========================================
  // RANK #11: 100-COMPETITOR CENSUS & DIRECTORY
  // ==========================================
  {
    id: 'competitors',
    name: '100-Competitor Census & Directory',
    shortName: '100 Competitors',
    rank: 11,
    rankTier: 'Tier 2: High Value Strategy',
    level: 1,
    levelLabel: 'Level 1 · Foundation',
    category: 'level-1',
    categoryLabel: 'Level 1: Foundation & Baseline',
    categoryIcon: 'Users',
    path: '/competitors',
    useCase: 'Analyze the complete market census of 100 telehealth clinics offering compounded GLP-1s.',
    description: 'Full competitive census of 100 telehealth brands in the compounded GLP-1 weight loss market.',
    valueProp: 'Rank, domain, URLs indexed, Semaglutide vs Tirzepatide focus, and primary sitemaps.',
    howToUse: 'Search, sort, or filter the census of 100 telehealth competitors by Semaglutide vs Tirzepatide offerings, estimated visit volume, domain authority, or technical stack.',
    whyToUse: 'Gives Ongo leadership macro visibility into who the market leaders are, how big they are, and what clinical treatments they provide.',
    recommendation: 'KEEP (High Value)',
    recommendationReason: 'Fundamental competitive benchmark for the telehealth GLP-1 industry.',
    badge: '100 Brands',
    badgeColor: '#7c3aed',
    badgeBg: '#ede9fe',
    keyMetrics: '100 Competitors',
    keywords: ['competitors', 'directory', 'census', 'brands', 'domains', 'ranking']
  },

  // ==========================================
  // RANK #12: SILO ARCHITECTURE & 217-PAGE ROADMAP
  // ==========================================
  {
    id: 'architecture',
    name: 'Silo Architecture & 217-Page Roadmap',
    shortName: '217-Page Silos',
    rank: 12,
    rankTier: 'Tier 2: High Value Strategy',
    level: 3,
    levelLabel: 'Level 3 · Architecture',
    category: 'level-3',
    categoryLabel: 'Level 3: Architecture & Governance',
    categoryIcon: 'Layers',
    path: '/architecture',
    useCase: 'Navigate the complete structural blueprint of 6 core telehealth silos and 217 planned pages.',
    description: 'Structural breakdown of 6 core telehealth silos and master checklist of 217 planned pages.',
    valueProp: 'Full category breakdown with example competitor URLs for each architectural tier.',
    howToUse: 'Navigate through 6 telehealth silos (Medication Guides, Telehealth Programs, State Compliance, Pricing, Clinical Safety, Tools) to see the planned URLs, search intent, and status of all 217 planned pages.',
    whyToUse: 'Provides a structured blueprint to scale Ongo from 56 pages to a 217-page market authority with zero topic cannibalization.',
    recommendation: 'KEEP (High Value)',
    recommendationReason: 'Master scoping roadmap for the long-term website expansion.',
    badge: '217-Page Plan',
    badgeColor: '#4338ca',
    badgeBg: '#e0e7ff',
    keyMetrics: '6 Silos • 217 URLs',
    keywords: ['architecture', 'silos', 'blueprint', 'master', 'hierarchy', '217', 'roadmap']
  },

  // ==========================================
  // RANK #13: DOCTOR CREDENTIALS & MEDICAL E-E-A-T AUDITOR
  // ==========================================
  {
    id: 'doctor-eeat',
    name: 'Doctor Credentials & Medical E-E-A-T Auditor',
    shortName: 'Doctor E-E-A-T',
    rank: 13,
    rankTier: 'Tier 1: Essential Core',
    level: 3,
    levelLabel: 'Level 3 · Architecture',
    category: 'level-3',
    categoryLabel: 'Level 3: Architecture & Governance',
    categoryIcon: 'Stethoscope',
    path: '/doctor-eeat',
    useCase: 'Audit physician credentials, NPI registrations, state medical licenses, and clinical author bylines.',
    description: 'Dedicated clinical authority auditor evaluating medical directors, MD/DO board certifications, and doctor-reviewed author bylines across 100 competitors.',
    valueProp: 'NPI registry verification, MD vs NP supervision comparison, and clinical reviewer attribution.',
    howToUse: 'Filter by Doctor-Led supervision, view Ongo\'s 5 Board-Certified Physicians (Okonkwo, Kramer, Patel, Miller, Krasne), and export medical director credentials to CSV.',
    whyToUse: 'Google evaluates healthcare websites under strict YMYL standards. Dedicated physician oversight and verified doctor bylines protect against medical core ranking penalties.',
    recommendation: 'KEEP (Core Asset)',
    recommendationReason: 'Core medical governance tool safeguarding search visibility and patient trust.',
    badge: '100% MD Supervised',
    badgeColor: '#059669',
    badgeBg: '#dcfce7',
    keyMetrics: '5 Board MDs • NPI Registry',
    keywords: ['doctor', 'physician', 'eeat', 'medical director', 'credentials', 'npi', 'author', 'review']
  },

  // ==========================================
  // RANK #14: 50-STATE TELEHEALTH LICENSING & VIDEO REGULATIONS
  // ==========================================
  {
    id: 'state-licensing',
    name: '50-State Telehealth Licensing & Video Regulations',
    shortName: 'State Licensing',
    rank: 14,
    rankTier: 'Tier 2: High Value Strategy',
    level: 3,
    levelLabel: 'Level 3 · Architecture',
    category: 'level-3',
    categoryLabel: 'Level 3: Architecture & Governance',
    categoryIcon: 'Compass',
    path: '/state-licensing',
    useCase: 'Benchmark nationwide 50-state legal coverage, video visit regulations, and restricted state jurisdictions.',
    description: 'Geographic telehealth regulatory radar mapping 50-state medical license coverage, synchronous video mandates vs asynchronous forms, and state shipping restrictions.',
    valueProp: 'State-by-state legal breakdown, video visit mandate flags, and excluded states radar.',
    howToUse: 'Filter by 50 States Nationwide vs Restricted Coverage to see which competitors exclude states like California, Mississippi, or Louisiana, and export the regulatory matrix to CSV.',
    whyToUse: 'Allows Ongo to capitalize on competitors who exclude large population states (e.g. CA, NY) by targeting patients with nationwide legal coverage.',
    recommendation: 'KEEP (High Value)',
    recommendationReason: 'Strategic jurisdictional radar identifying geographic market opportunities.',
    badge: '50 US States',
    badgeColor: '#2563eb',
    badgeBg: '#dbeafe',
    keyMetrics: '50 / 50 States Legal',
    keywords: ['telehealth', 'states', 'licensing', 'california', 'video visit', 'regulations', 'jurisdiction']
  },

  // ==========================================
  // RANK #15: 503A COMPOUNDING PHARMACY & COLD-CHAIN STERILITY
  // ==========================================
  {
    id: 'compliance',
    name: '503A Compounding Pharmacy & Sterility Hub',
    shortName: 'Pharmacy Sterility',
    rank: 15,
    rankTier: 'Tier 2: High Value Strategy',
    level: 3,
    levelLabel: 'Level 3 · Architecture',
    category: 'level-3',
    categoryLabel: 'Level 3: Architecture & Governance',
    categoryIcon: 'ShieldCheck',
    path: '/compliance',
    useCase: 'Audit 503A/503B pharmacy sourcing, USP <797> sterile standards, and cold-pack shipping policies.',
    description: 'Audits compounding pharmacy partners, sterile cleanroom compliance, temperature-controlled shipping, and flat-rate pricing transparency.',
    valueProp: '503A compounding verification, cold packaging shipping standards, and refund guarantee benchmarks.',
    howToUse: 'Inspect pharmacy sourcing, 503A sterile compounding disclosures, and temperature-controlled shipping policies across 100 competitors.',
    whyToUse: 'Sterility and legitimate 503A sourcing are essential to patient safety and conversion confidence in compounded GLP-1 medications.',
    recommendation: 'KEEP (High Value)',
    recommendationReason: 'Enforces compounding legitimacy and patient safety guarantees.',
    badge: '503A Sterile',
    badgeColor: '#059669',
    badgeBg: '#d1fae5',
    keyMetrics: '503A Compounding • Cold Shipping',
    keywords: ['compliance', 'pharmacy', '503a', '503b', 'compounding', 'sterility', 'shipping', 'cold-pack']
  },

  // ==========================================
  // RANK #16: META TAGS & CTR AUDITOR
  // ==========================================
  {
    id: 'meta',
    name: 'Meta Tags & CTR Auditor',
    shortName: 'Meta Auditor',
    rank: 16,
    rankTier: 'Tier 2: High Value Strategy',
    level: 3,
    levelLabel: 'Level 3 · Architecture',
    category: 'level-3',
    categoryLabel: 'Level 3: Architecture & Governance',
    categoryIcon: 'Tag',
    path: '/meta',
    useCase: 'Rewrite robotic, symbol-heavy SERP titles into natural human search queries that maximize CTR.',
    description: 'Audits live title tags and meta descriptions with recommendations aligned to natural human queries.',
    valueProp: 'Length audits, CTR hooks, and symbol-free human title rewrites.',
    howToUse: 'Review title tag lengths (50-60 chars) and meta descriptions (130-160 chars) across Ongo pages. Copy suggested human search query rewrites that replace robotic title formatting.',
    whyToUse: 'Higher click-through rates (CTR) from search result pages directly increase organic traffic without needing higher keyword rankings.',
    recommendation: 'KEEP (High Value)',
    recommendationReason: 'Valuable CTR optimization tool; can remain standalone or be merged into Ongo Live Pages if simplification is desired.',
    badge: 'CTR Optimization',
    badgeColor: '#6d28d9',
    badgeBg: '#f3e8ff',
    keyMetrics: 'Title & Meta Rewrites',
    keywords: ['meta', 'auditor', 'titles', 'descriptions', 'ctr', 'serp', 'tags']
  },

  // ==========================================
  // RANK #17: EXECUTIVE INTELLIGENCE OVERVIEW
  // ==========================================
  {
    id: 'overview',
    name: 'Executive Intelligence Overview',
    shortName: 'Overview',
    rank: 17,
    rankTier: 'Tier 2: High Value Strategy',
    level: 1,
    levelLabel: 'Level 1 · Foundation',
    category: 'level-1',
    categoryLabel: 'Level 1: Foundation & Baseline',
    categoryIcon: 'BarChart2',
    path: '/',
    useCase: 'Assess high-level Ongo telemetry and macro competitive landscape across 100 brands.',
    description: 'Executive benchmarking dashboard tracking Ongo against 100 telehealth competitors.',
    valueProp: 'Monitors 35,420 URLs, active HTTP pings, and macro content distribution.',
    howToUse: 'Check high-level macro counters: 35,420 total competitor URLs, active sitemap pings, and Ongo live page footprint.',
    whyToUse: 'Serves as the central homepage and executive summary for the entire suite.',
    recommendation: 'KEEP (High Value)',
    recommendationReason: 'Homepage and executive navigation portal.',
    badge: 'Executive',
    badgeColor: '#1b4332',
    badgeBg: '#d8f3dc',
    keyMetrics: '100 Brands • 35k URLs',
    keywords: ['overview', 'dashboard', 'executive', 'summary', 'ping', 'stats', 'macro']
  },

  // ==========================================
  // RANK #18: COMMON VS UNIQUE MOAT PATTERNS
  // ==========================================
  {
    id: 'patterns',
    name: 'Common vs. Unique Moat Pattern Engine',
    shortName: 'Common vs Unique',
    rank: 18,
    rankTier: 'Tier 3: Specialized / Review',
    level: 2,
    levelLabel: 'Level 2 · Research',
    category: 'level-2',
    categoryLabel: 'Level 2: Research & Content Engine',
    categoryIcon: 'SplitSquareVertical',
    path: '/patterns',
    useCase: 'Isolate proprietary competitive moats (quizzes, micro-dosing, peptide blends) from table-stakes pages.',
    description: 'Separates table-stakes URLs from proprietary competitive moats across competitor websites.',
    valueProp: 'Identifies innovative pages (quizzes, micro-dosing, peptide blends) that set market leaders apart.',
    howToUse: 'Review the clustering of "table-stakes" competitor pages versus "unique moats" (quizzes, micro-dosing guides, dosage calculators, peptide combinations).',
    whyToUse: 'Sparks product ideas for interactive tools that competitors use to build customer engagement beyond basic blog posts.',
    recommendation: 'CONSIDER MERGING',
    recommendationReason: 'Valuable insights, but could be integrated into the Content Roadmap (Tool #3) as an "Interactive Moats" sub-filter to keep navigation cleaner.',
    badge: 'Moats',
    badgeColor: '#c2410c',
    badgeBg: '#ffedd5',
    keyMetrics: 'Competitive Moats',
    keywords: ['patterns', 'common', 'unique', 'moats', 'differentiation', 'innovative']
  },

  // ==========================================
  // RANK #19: COMPETITOR KEYWORD MATRIX
  // ==========================================
  {
    id: 'keywords',
    name: 'Competitor Keyword & Opportunity Matrix',
    shortName: 'Keyword Explorer',
    rank: 19,
    rankTier: 'Tier 3: Specialized / Review',
    level: 2,
    levelLabel: 'Level 2 · Research',
    category: 'level-2',
    categoryLabel: 'Level 2: Research & Content Engine',
    categoryIcon: 'Search',
    path: '/keywords',
    useCase: 'Filter high-volume commercial and clinical GLP-1 keywords by search volume, KD, and intent.',
    description: 'Explores high-converting clinical and commercial keywords targeted by top ranking competitors.',
    valueProp: 'Volume, keyword difficulty (KD), search intent, and opportunity scores.',
    howToUse: 'Browse the static matrix of commercial and clinical keywords targeted by top telehealth competitors, sorted by estimated difficulty and search intent.',
    whyToUse: 'Provides a general reference list of high-converting GLP-1 keywords.',
    recommendation: 'CONSIDER MERGING',
    recommendationReason: 'Largely superseded by Tool #4 (Google Autocomplete Harvester) which provides live real-time search queries at zero cost.',
    badge: 'Keywords',
    badgeColor: '#0f766e',
    badgeBg: '#ccfbf1',
    keyMetrics: 'Search Intent & KD',
    keywords: ['keywords', 'explorer', 'matrix', 'volume', 'kd', 'opportunity', 'search intent']
  },

  // ==========================================
  // RANK #20: EXECUTIVE STRATEGY & COMPLIANCE REPORTS
  // ==========================================
  {
    id: 'reports',
    name: 'Executive Strategy & Compliance Reports',
    shortName: 'Reports Library',
    rank: 20,
    rankTier: 'Tier 3: Specialized / Review',
    level: 3,
    levelLabel: 'Level 3 · Architecture',
    category: 'level-3',
    categoryLabel: 'Level 3: Architecture & Governance',
    categoryIcon: 'FileText',
    path: '/reports',
    useCase: 'Read and download comprehensive architectural, compliance, and competitive strategy blueprints.',
    description: 'Read and export in-depth architectural and strategic markdown reports generated for Ongo leadership.',
    valueProp: 'Instant access to full text of audits, recommendations, and clinical gap analysis.',
    howToUse: 'Select and read in-depth strategy and compliance markdown reports generated during research.',
    whyToUse: 'Provides detailed executive reading material on market analysis and clinical policies.',
    recommendation: 'CONSIDER MERGING',
    recommendationReason: 'Could be merged into the 7 Books Digital Library (Tool #9) under a "Special Reports" section to keep all reading materials in one unified tab.',
    badge: 'Reports Library',
    badgeColor: '#475569',
    badgeBg: '#f1f5f9',
    keyMetrics: 'Strategic Reports',
    keywords: ['reports', 'executive', 'library', 'markdown', 'strategy', 'documentation']
  },

  // ==========================================
  // RANK #21: COMPETITOR SITEMAPS EXPLORER
  // ==========================================
  {
    id: 'sitemaps',
    name: 'Competitor Sitemaps Explorer',
    shortName: 'Sitemaps (74)',
    rank: 21,
    rankTier: 'Tier 3: Specialized / Review',
    level: 1,
    levelLabel: 'Level 1 · Foundation',
    category: 'level-1',
    categoryLabel: 'Level 1: Foundation & Baseline',
    categoryIcon: 'Globe',
    path: '/sitemaps',
    useCase: 'Inspect XML sitemap hierarchies, indexation health, and URL distribution across 74 clinics.',
    description: 'Inspect XML sitemap structures across 74 accessible competitor telehealth domains.',
    valueProp: 'Drill down into individual XML files, total URLs, and GLP-1 page counts.',
    howToUse: 'Inspect raw XML sitemap files, hierarchies, and indexation status across 74 competitor domains.',
    whyToUse: 'Useful for developers verifying raw XML ingestion, but offers limited value to marketing/business users.',
    recommendation: 'CONSIDER REMOVING',
    recommendationReason: 'Prime candidate for removal or hiding from main navigation: all 33k URLs extracted from these sitemaps are already powering Tool #3 (Content Roadmap).',
    badge: '74 Sitemaps',
    badgeColor: '#0284c7',
    badgeBg: '#e0f2fe',
    keyMetrics: '74 Active Sitemaps',
    keywords: ['sitemaps', 'xml', 'competitors', 'urls', 'hierarchy', 'status']
  }
];

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'level-1',
    level: 1,
    name: 'Level 1: Foundation & Baseline',
    useCase: 'Assess current Ongo health, study onboarding guidelines, clone/audit pages, and benchmark the 100-competitor landscape.',
    shortDescription: 'Clean scraper, image a11y auditor, 7 onboarding books, live page audits, and 100-competitor census',
    icon: 'Activity',
    accentColor: '#347e5d',
    tools: TOOLS_DIRECTORY.filter(t => t.category === 'level-1')
  },
  {
    id: 'level-2',
    level: 2,
    name: 'Level 2: SEO Research & Content Engine',
    useCase: 'Discover high-converting search intent, keyword opportunity gaps, and competitive moats.',
    shortDescription: '33k competitor gap roadmap, Google Suggest PAA harvester, keywords matrix, and moats',
    icon: 'Sparkles',
    accentColor: '#d97706',
    tools: TOOLS_DIRECTORY.filter(t => t.category === 'level-2')
  },
  {
    id: 'level-3',
    level: 3,
    name: 'Level 3: Architecture, Linking & Governance',
    useCase: 'Build scalable topic silos, circulate PageRank internal equity, and enforce E-E-A-T clinical compliance.',
    shortDescription: 'PageRank flowchart visualizer, 4 Silo internal linking rules, 217-page blueprint, and E-E-A-T compliance',
    icon: 'Layers',
    accentColor: '#e76f51',
    tools: TOOLS_DIRECTORY.filter(t => t.category === 'level-3')
  }
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS_DIRECTORY.find(t => t.id === id);
}

export function getToolsByLevel(level: 1 | 2 | 3): ToolDefinition[] {
  return TOOLS_DIRECTORY.filter(t => t.level === level);
}

export function getToolsByRank(): ToolDefinition[] {
  return [...TOOLS_DIRECTORY].sort((a, b) => a.rank - b.rank);
}

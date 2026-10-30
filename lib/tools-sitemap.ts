export interface ToolDefinition {
  id: string;
  name: string;
  shortName: string;
  level: 1 | 2 | 3;
  levelLabel: string;
  category: 'level-1' | 'level-2' | 'level-3';
  categoryLabel: string;
  categoryIcon: string;
  path: string;
  useCase: string;
  description: string;
  valueProp: string;
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
  // LEVEL 1: FOUNDATION, ONBOARDING & BENCHMARKS
  // ==========================================
  {
    id: 'overview',
    name: 'Executive Intelligence Overview',
    shortName: 'Overview',
    level: 1,
    levelLabel: 'Level 1 · Foundation',
    category: 'level-1',
    categoryLabel: 'Level 1: Foundation & Baseline',
    categoryIcon: 'BarChart2',
    path: '/',
    useCase: 'Assess high-level Ongo telemetry and macro competitive landscape across 100 brands.',
    description: 'Executive benchmarking dashboard tracking Ongo against 100 telehealth competitors.',
    valueProp: 'Monitors 35,420 URLs, active HTTP pings, and macro content distribution.',
    badge: 'Executive',
    badgeColor: '#1b4332',
    badgeBg: '#d8f3dc',
    keyMetrics: '100 Brands • 35k URLs',
    keywords: ['overview', 'dashboard', 'executive', 'summary', 'ping', 'stats', 'macro']
  },
  {
    id: 'books',
    name: '7 Onboarding Books Digital Library',
    shortName: '7 Books Library',
    level: 1,
    levelLabel: 'Level 1 · Foundation',
    category: 'level-1',
    categoryLabel: 'Level 1: Foundation & Baseline',
    categoryIcon: 'BookOpen',
    path: '/books',
    useCase: 'Internalize clinical GLP-1 guidelines, FDA compounding laws, Next.js SEO, and analytics.',
    description: 'Direct interactive PDF reader with 7 complete onboarding books (2,924 pages, 518k words).',
    valueProp: 'Direct native browser PDF viewer with instant volume switcher, search, and downloads.',
    badge: '7 Books (PDF)',
    badgeColor: '#059669',
    badgeBg: '#d1fae5',
    keyMetrics: '7 Volumes • 2,924 Pgs',
    keywords: ['books', 'library', 'pdf', 'onboarding', 'the foundation', 'earned not built', 'architecture']
  },
  {
    id: 'ongo-pages',
    name: 'Ongo Live Pages & Meta Auditor',
    shortName: 'Ongo Live Pages',
    level: 1,
    levelLabel: 'Level 1 · Foundation',
    category: 'level-1',
    categoryLabel: 'Level 1: Foundation & Baseline',
    categoryIcon: 'Compass',
    path: '/ongo-pages',
    useCase: 'Audit Ongo\'s current 34 live URLs for title tag lengths, meta descriptions, and CTR hooks.',
    description: 'Audits Ongo\'s 34 live pages with title lengths, meta descriptions, and CTR optimization hooks.',
    valueProp: 'Real-time live XML sitemap refresh and human query SERP simulation.',
    badge: '34 Live Pages',
    badgeColor: '#059669',
    badgeBg: '#dcfce7',
    keyMetrics: '34 URLs • Live Refresh',
    keywords: ['ongo', 'live', 'pages', 'sitemap.xml', 'meta', 'titles', 'descriptions', 'h1']
  },
  {
    id: 'competitors',
    name: '100-Competitor Census & Directory',
    shortName: '100 Competitors',
    level: 1,
    levelLabel: 'Level 1 · Foundation',
    category: 'level-1',
    categoryLabel: 'Level 1: Foundation & Baseline',
    categoryIcon: 'Users',
    path: '/competitors',
    useCase: 'Analyze the complete market census of 100 telehealth clinics offering compounded GLP-1s.',
    description: 'Full competitive census of 100 telehealth brands in the compounded GLP-1 weight loss market.',
    valueProp: 'Rank, domain, URLs indexed, Semaglutide vs Tirzepatide focus, and primary sitemaps.',
    badge: '100 Brands',
    badgeColor: '#7c3aed',
    badgeBg: '#ede9fe',
    keyMetrics: '100 Competitors',
    keywords: ['competitors', 'directory', 'census', 'brands', 'domains', 'ranking']
  },
  {
    id: 'sitemaps',
    name: 'Competitor Sitemaps Explorer',
    shortName: 'Sitemaps (74)',
    level: 1,
    levelLabel: 'Level 1 · Foundation',
    category: 'level-1',
    categoryLabel: 'Level 1: Foundation & Baseline',
    categoryIcon: 'Globe',
    path: '/sitemaps',
    useCase: 'Inspect XML sitemap hierarchies, indexation health, and URL distribution across 74 clinics.',
    description: 'Inspect XML sitemap structures across 74 accessible competitor telehealth domains.',
    valueProp: 'Drill down into individual XML files, total URLs, and GLP-1 page counts.',
    badge: '74 Sitemaps',
    badgeColor: '#0284c7',
    badgeBg: '#e0f2fe',
    keyMetrics: '74 Active Sitemaps',
    keywords: ['sitemaps', 'xml', 'competitors', 'urls', 'hierarchy', 'status']
  },

  // ==========================================
  // LEVEL 2: SEO RESEARCH, CONTENT ENGINE & MOATS
  // ==========================================
  {
    id: 'competitor-gap',
    name: 'Competitor Gap & Content Roadmap',
    shortName: 'Content Roadmap',
    level: 2,
    levelLabel: 'Level 2 · Research',
    category: 'level-2',
    categoryLabel: 'Level 2: Research & Content Engine',
    categoryIcon: 'GitCompare',
    path: '/competitor-gap',
    useCase: 'Discover topic vacuums where 70+ competitors rank but Ongo is missing; generate writer briefs.',
    description: 'Cross-references 33,108 competitor URLs against Ongo\'s 34 pages to output an instant Content Roadmap.',
    valueProp: 'Reveals topic vacuums where 70+ competitors rank; generates 1-click writer briefs with H1s and meta tags.',
    badge: '33,108 URLs Wired',
    badgeColor: '#c2410c',
    badgeBg: '#fee2e2',
    keyMetrics: 'P0 Gaps • Writer Briefs',
    keywords: ['competitor gap', 'gap', 'content roadmap', 'roadmap', '33108', 'writer briefs', 'vacuums']
  },
  {
    id: 'keywords-harvester',
    name: 'Google Autocomplete & PAA Harvester',
    shortName: 'PAA Harvester',
    level: 2,
    levelLabel: 'Level 2 · Research',
    category: 'level-2',
    categoryLabel: 'Level 2: Research & Content Engine',
    categoryIcon: 'Sparkles',
    path: '/keywords-harvester',
    useCase: 'Harvest hundreds of real user questions from Google Suggest ($0 SaaS cost) grouped into silos.',
    description: 'Queries Google\'s free Suggest API across hundreds of question stems (how, why, cost, vs, units).',
    valueProp: 'Zero SaaS fees ($0). Clusters queries into Ongo\'s 8 topical silos with copyable titles and H2s.',
    badge: 'Free API ($0)',
    badgeColor: '#b45309',
    badgeBg: '#fef3c7',
    keyMetrics: 'Real-Time • 8 Silos',
    keywords: ['keywords', 'harvester', 'google', 'autocomplete', 'paa', 'people also ask', 'questions', 'suggest']
  },
  {
    id: 'keywords',
    name: 'Competitor Keyword & Opportunity Matrix',
    shortName: 'Keyword Explorer',
    level: 2,
    levelLabel: 'Level 2 · Research',
    category: 'level-2',
    categoryLabel: 'Level 2: Research & Content Engine',
    categoryIcon: 'Search',
    path: '/keywords',
    useCase: 'Filter high-volume commercial and clinical GLP-1 keywords by search volume, KD, and intent.',
    description: 'Explores high-converting clinical and commercial keywords targeted by top ranking competitors.',
    valueProp: 'Volume, keyword difficulty (KD), search intent, and opportunity scores.',
    badge: 'Keywords',
    badgeColor: '#0f766e',
    badgeBg: '#ccfbf1',
    keyMetrics: 'Search Intent & KD',
    keywords: ['keywords', 'explorer', 'matrix', 'volume', 'kd', 'opportunity', 'search intent']
  },
  {
    id: 'patterns',
    name: 'Common vs. Unique Moat Pattern Engine',
    shortName: 'Common vs Unique',
    level: 2,
    levelLabel: 'Level 2 · Research',
    category: 'level-2',
    categoryLabel: 'Level 2: Research & Content Engine',
    categoryIcon: 'SplitSquareVertical',
    path: '/patterns',
    useCase: 'Isolate proprietary competitive moats (quizzes, micro-dosing, peptide blends) from table-stakes pages.',
    description: 'Separates table-stakes URLs from proprietary competitive moats across competitor websites.',
    valueProp: 'Identifies innovative pages (quizzes, micro-dosing, peptide blends) that set market leaders apart.',
    badge: 'Moats',
    badgeColor: '#c2410c',
    badgeBg: '#ffedd5',
    keyMetrics: 'Competitive Moats',
    keywords: ['patterns', 'common', 'unique', 'moats', 'differentiation', 'innovative']
  },

  // ==========================================
  // LEVEL 3: ARCHITECTURE, LINKING & GOVERNANCE
  // ==========================================
  {
    id: 'internal-links',
    name: 'Internal Link & Anchor Text Recommender',
    shortName: 'Internal Links',
    level: 3,
    levelLabel: 'Level 3 · Architecture',
    category: 'level-3',
    categoryLabel: 'Level 3: Architecture & Governance',
    categoryIcon: 'Link2',
    path: '/internal-links',
    useCase: 'Eliminate orphan pages and pass link equity to money pages using 4 strict silo linking rules.',
    description: 'Scans Ongo\'s 34 live pages to identify missing internal equity links and generate exact anchor text copy.',
    valueProp: 'Enforces 4 Silo Linking Rules: Vertical funneling, tool bridges, doctor loops, and conversion CTAs.',
    badge: '4 Silo Rules',
    badgeColor: '#1b4332',
    badgeBg: '#d8f3dc',
    keyMetrics: 'P0 / P1 Anchors',
    keywords: ['internal links', 'anchor text', 'linking', 'pagerank', 'equity', 'funnel', 'silos']
  },
  {
    id: 'architecture',
    name: 'Silo Architecture & 217-Page Roadmap',
    shortName: '217-Page Silos',
    level: 3,
    levelLabel: 'Level 3 · Architecture',
    category: 'level-3',
    categoryLabel: 'Level 3: Architecture & Governance',
    categoryIcon: 'Layers',
    path: '/architecture',
    useCase: 'Navigate the complete structural blueprint of 6 core telehealth silos and 217 planned pages.',
    description: 'Structural breakdown of 6 core telehealth silos and master checklist of 217 planned pages.',
    valueProp: 'Full category breakdown with example competitor URLs for each architectural tier.',
    badge: '217-Page Plan',
    badgeColor: '#4338ca',
    badgeBg: '#e0e7ff',
    keyMetrics: '6 Silos • 217 URLs',
    keywords: ['architecture', 'silos', 'blueprint', 'master', 'hierarchy', '217', 'roadmap']
  },
  {
    id: 'compliance',
    name: 'Doctors & E-E-A-T Compliance Auditor',
    shortName: 'Doctors & Policies',
    level: 3,
    levelLabel: 'Level 3 · Architecture',
    category: 'level-3',
    categoryLabel: 'Level 3: Architecture & Governance',
    categoryIcon: 'Stethoscope',
    path: '/compliance',
    useCase: 'Audit doctor credentials, NPI registrations, state licenses, and compounding disclaimers for E-E-A-T.',
    description: 'Audits clinical credentials, medical directors, state licensing, and pharmacy compounding compliance.',
    valueProp: 'NPI registry verification, editorial doctor reviews, and refund / shipping policy benchmarks.',
    badge: 'E-E-A-T Authority',
    badgeColor: '#059669',
    badgeBg: '#d1fae5',
    keyMetrics: 'Doctor Profiles & NPI',
    keywords: ['compliance', 'doctors', 'physicians', 'e-e-a-t', 'npi', 'medical director', 'policies']
  },
  {
    id: 'meta',
    name: 'Meta Tags & CTR Auditor',
    shortName: 'Meta Auditor',
    level: 3,
    levelLabel: 'Level 3 · Architecture',
    category: 'level-3',
    categoryLabel: 'Level 3: Architecture & Governance',
    categoryIcon: 'Tag',
    path: '/meta',
    useCase: 'Rewrite robotic, symbol-heavy SERP titles into natural human search queries that maximize CTR.',
    description: 'Audits live title tags and meta descriptions with recommendations aligned to natural human queries.',
    valueProp: 'Length audits, CTR hooks, and symbol-free human title rewrites.',
    badge: 'CTR Optimization',
    badgeColor: '#6d28d9',
    badgeBg: '#f3e8ff',
    keyMetrics: 'Title & Meta Rewrites',
    keywords: ['meta', 'auditor', 'titles', 'descriptions', 'ctr', 'serp', 'tags']
  },
  {
    id: 'reports',
    name: 'Executive Strategy & Compliance Reports',
    shortName: 'Reports Library',
    level: 3,
    levelLabel: 'Level 3 · Architecture',
    category: 'level-3',
    categoryLabel: 'Level 3: Architecture & Governance',
    categoryIcon: 'FileText',
    path: '/reports',
    useCase: 'Read and download comprehensive architectural, compliance, and competitive strategy blueprints.',
    description: 'Read and export in-depth architectural and strategic markdown reports generated for Ongo leadership.',
    valueProp: 'Instant access to full text of audits, recommendations, and clinical gap analysis.',
    badge: 'Reports Library',
    badgeColor: '#475569',
    badgeBg: '#f1f5f9',
    keyMetrics: 'Strategic Reports',
    keywords: ['reports', 'executive', 'library', 'markdown', 'strategy', 'documentation']
  }
];

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    id: 'level-1',
    level: 1,
    name: 'Level 1: Foundation & Baseline',
    useCase: 'Assess current Ongo health, study onboarding guidelines, and benchmark the 100-competitor landscape.',
    shortDescription: 'Executive overview, 7 onboarding books, live page audits, and 100-competitor census',
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
    shortDescription: '4 Silo internal linking rules, 217-page blueprint, E-E-A-T doctor compliance, and meta rewrites',
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

export interface ToolDefinition {
  id: string;
  name: string;
  shortName: string;
  category: 'core' | 'seo-research' | 'silos-linking' | 'intel-roadmap';
  categoryLabel: string;
  categoryIcon: string;
  path: string;
  description: string;
  valueProp: string;
  badge?: string;
  badgeColor?: string;
  badgeBg?: string;
  keyMetrics: string;
  keywords: string[];
}

export interface ToolCategory {
  id: 'core' | 'seo-research' | 'silos-linking' | 'intel-roadmap';
  name: string;
  shortDescription: string;
  icon: string;
  accentColor: string;
  tools: ToolDefinition[];
}

export const TOOLS_DIRECTORY: ToolDefinition[] = [
  // 1. Core & Site Health
  {
    id: 'overview',
    name: 'Executive Intelligence Overview',
    shortName: 'Overview',
    category: 'core',
    categoryLabel: 'Core & Health',
    categoryIcon: 'BarChart2',
    path: '/',
    description: 'High-level executive benchmarking dashboard tracking Ongo against 100 competitors.',
    valueProp: 'Monitors 35,420 URLs, active HTTP pings, and macro content distribution.',
    badge: 'Executive',
    badgeColor: '#1b4332',
    badgeBg: '#d8f3dc',
    keyMetrics: '100 Brands • 35k URLs',
    keywords: ['overview', 'dashboard', 'executive', 'summary', 'ping', 'stats', 'macro']
  },
  {
    id: 'ongo-pages',
    name: 'Ongo Live Pages & Meta Auditor',
    shortName: 'Ongo Live Pages',
    category: 'core',
    categoryLabel: 'Core & Health',
    categoryIcon: 'Compass',
    path: '/ongo-pages',
    description: 'Audits Ongo\'s 34 live pages with title lengths, meta descriptions, and CTR optimization hooks.',
    valueProp: 'Real-time live XML sitemap refresh and human query SERP simulation.',
    badge: '34 Live Pages',
    badgeColor: '#059669',
    badgeBg: '#dcfce7',
    keyMetrics: '34 URLs • Live Refresh',
    keywords: ['ongo', 'live', 'pages', 'sitemap.xml', 'meta', 'titles', 'descriptions', 'h1']
  },
  {
    id: 'sitemaps',
    name: 'Competitor Sitemaps Explorer',
    shortName: 'Sitemaps',
    category: 'core',
    categoryLabel: 'Core & Health',
    categoryIcon: 'Globe',
    path: '/sitemaps',
    description: 'Inspect XML sitemap structures across 74 accessible competitor telehealth domains.',
    valueProp: 'Drill down into individual XML files, total URLs, and GLP-1 page counts.',
    badge: '74 Sitemaps',
    badgeColor: '#0284c7',
    badgeBg: '#e0f2fe',
    keyMetrics: '74 Active Sitemaps',
    keywords: ['sitemaps', 'xml', 'competitors', 'urls', 'hierarchy', 'status']
  },
  {
    id: 'competitors',
    name: '100-Competitor Census & Directory',
    shortName: 'Competitors',
    category: 'core',
    categoryLabel: 'Core & Health',
    categoryIcon: 'Users',
    path: '/competitors',
    description: 'Full competitive census of 100 telehealth brands in the compounded GLP-1 weight loss market.',
    valueProp: 'Rank, domain, URLs indexed, Semaglutide vs Tirzepatide focus, and primary sitemaps.',
    badge: '100 Brands',
    badgeColor: '#7c3aed',
    badgeBg: '#ede9fe',
    keyMetrics: '100 Competitors',
    keywords: ['competitors', 'directory', 'census', 'brands', 'domains', 'ranking']
  },

  // 2. SEO Research & Harvesters
  {
    id: 'keywords-harvester',
    name: 'Google Autocomplete & PAA Harvester',
    shortName: 'PAA Harvester',
    category: 'seo-research',
    categoryLabel: 'SEO & Research',
    categoryIcon: 'Sparkles',
    path: '/keywords-harvester',
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
    category: 'seo-research',
    categoryLabel: 'SEO & Research',
    categoryIcon: 'Search',
    path: '/keywords',
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
    category: 'seo-research',
    categoryLabel: 'SEO & Research',
    categoryIcon: 'SplitSquareVertical',
    path: '/patterns',
    description: 'Separates table-stakes URLs from proprietary competitive moats across competitor websites.',
    valueProp: 'Identifies innovative pages (quizzes, micro-dosing, peptide blends) that set market leaders apart.',
    badge: 'Moats',
    badgeColor: '#c2410c',
    badgeBg: '#ffedd5',
    keyMetrics: 'Competitive Moats',
    keywords: ['patterns', 'common', 'unique', 'moats', 'differentiation', 'innovative']
  },

  // 3. Silo Architecture & Internal Linking
  {
    id: 'internal-links',
    name: 'Internal Link & Anchor Text Recommender',
    shortName: 'Internal Links',
    category: 'silos-linking',
    categoryLabel: 'Silos & Linking',
    categoryIcon: 'Link2',
    path: '/internal-links',
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
    shortName: 'Architecture',
    category: 'silos-linking',
    categoryLabel: 'Silos & Linking',
    categoryIcon: 'Layers',
    path: '/architecture',
    description: 'Structural breakdown of 6 core telehealth silos and master checklist of 217 planned pages.',
    valueProp: 'Full category breakdown with example competitor URLs for each architectural tier.',
    badge: '217-Page Plan',
    badgeColor: '#4338ca',
    badgeBg: '#e0e7ff',
    keyMetrics: '6 Silos • 217 URLs',
    keywords: ['architecture', 'silos', 'blueprint', 'master', 'hierarchy', '217', 'roadmap']
  },

  // 4. Intelligence & Content Roadmap
  {
    id: 'competitor-gap',
    name: 'Competitor Gap & Dynamic Content Roadmap',
    shortName: 'Content Roadmap',
    category: 'intel-roadmap',
    categoryLabel: 'Intel & Roadmap',
    categoryIcon: 'GitCompare',
    path: '/competitor-gap',
    description: 'Cross-references 33,108 competitor URLs against Ongo\'s 34 pages to output an instant Content Roadmap.',
    valueProp: 'Reveals topic vacuums where 70+ competitors rank; generates 1-click writer briefs with H1s and meta tags.',
    badge: '33,108 URLs Wired',
    badgeColor: '#c2410c',
    badgeBg: '#fee2e2',
    keyMetrics: 'P0 Gaps • Writer Briefs',
    keywords: ['competitor gap', 'gap', 'content roadmap', 'roadmap', '33108', 'writer briefs', 'vacuums']
  },
  {
    id: 'compliance',
    name: 'Doctors & E-E-A-T Compliance Auditor',
    shortName: 'Doctors & Policies',
    category: 'intel-roadmap',
    categoryLabel: 'Intel & Roadmap',
    categoryIcon: 'Stethoscope',
    path: '/compliance',
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
    category: 'intel-roadmap',
    categoryLabel: 'Intel & Roadmap',
    categoryIcon: 'Tag',
    path: '/meta',
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
    shortName: 'Reports',
    category: 'intel-roadmap',
    categoryLabel: 'Intel & Roadmap',
    categoryIcon: 'FileText',
    path: '/reports',
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
    id: 'core',
    name: 'Core & Site Health',
    shortDescription: 'Overview, live page audits, and competitor sitemap census',
    icon: 'Activity',
    accentColor: '#347e5d',
    tools: TOOLS_DIRECTORY.filter(t => t.category === 'core')
  },
  {
    id: 'seo-research',
    name: 'SEO & Research Engines',
    shortDescription: 'Free Google Suggest PAA harvester and keyword opportunity matrix',
    icon: 'Sparkles',
    accentColor: '#d97706',
    tools: TOOLS_DIRECTORY.filter(t => t.category === 'seo-research')
  },
  {
    id: 'silos-linking',
    name: 'Silos & Internal Linking',
    shortDescription: '4 Silo linking rules, exact anchor text recommendations, and 217-page roadmap',
    icon: 'Link2',
    accentColor: '#1b4332',
    tools: TOOLS_DIRECTORY.filter(t => t.category === 'silos-linking')
  },
  {
    id: 'intel-roadmap',
    name: 'Intelligence & Content Roadmap',
    shortDescription: '33,108-URL competitor gap comparator, E-E-A-T doctor compliance, and meta audits',
    icon: 'GitCompare',
    accentColor: '#e76f51',
    tools: TOOLS_DIRECTORY.filter(t => t.category === 'intel-roadmap')
  }
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS_DIRECTORY.find(t => t.id === id);
}


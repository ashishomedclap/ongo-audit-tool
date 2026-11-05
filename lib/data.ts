import fs from 'fs';
import path from 'path';
import { getScrapedArchive, ScrapedArchiveItem } from './scraper-engine';
export type { ScrapedArchiveItem };
export { getScrapedArchive };

export interface CompetitorSummary {
  rank: number;
  name: string;
  domain: string;
  status: 'SUCCESS' | 'NO_SITEMAP' | 'ERROR';
  primarySitemap: string;
  totalSitemaps: number;
  totalUrls: number;
  semaglutideUrls: number;
  tirzepatideUrls: number;
  pricingUrls: number;
  localFolder: string;
}

export interface ArchitectureAnalysis {
  master_category_counts: Record<string, number>;
  master_examples: Record<string, [string, string][]>;
  [key: string]: unknown;
}

export interface OngoMetaItem {
  title: string;
  description: string;
  recommendedTitle?: string;
  recommendedDescription?: string;
  primaryKeyword?: string;
  notes?: string;
}

export interface MasterUrlItem {
  id: string;
  path: string;
  name: string;
  description: string;
  silo: string;
  priority: string;
  status?: string;
}

export interface CompetitorDetail {
  summary: CompetitorSummary;
  allUrls: string[];
  keyGlp1Pages?: {
    name?: string;
    domain?: string;
    total_urls?: number;
    semaglutide_pages?: string[];
    tirzepatide_pages?: string[];
    pricing_pages?: string[];
    [key: string]: unknown;
  };
  hasLocalSitemap: boolean;
}

const DATA_DIR = path.join(process.cwd(), 'data');

export function getCompetitorsSummary(): CompetitorSummary[] {
  try {
    const csvPath = path.join(DATA_DIR, 'inventory', 'competitor_sitemaps_summary.csv');
    if (!fs.existsSync(csvPath)) return [];
    
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.trim().split('\n');
    if (lines.length <= 1) return [];

    const results: CompetitorSummary[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Handle simple CSV parsing (rank, name, domain, status, primarySitemap, totalSitemaps, totalUrls, sema, tirz, pricing, folder)
      // Note: Competitor name might have parentheses or quotes
      const parts = parseCsvLine(line);
      if (parts.length >= 11) {
        results.push({
          rank: parseInt(parts[0], 10) || i,
          name: parts[1] || 'Unknown',
          domain: parts[2] || '',
          status: (parts[3] as 'SUCCESS' | 'NO_SITEMAP' | 'ERROR') || 'NO_SITEMAP',
          primarySitemap: parts[4] === 'None' ? '' : parts[4],
          totalSitemaps: parseInt(parts[5], 10) || 0,
          totalUrls: parseInt(parts[6], 10) || 0,
          semaglutideUrls: parseInt(parts[7], 10) || 0,
          tirzepatideUrls: parseInt(parts[8], 10) || 0,
          pricingUrls: parseInt(parts[9], 10) || 0,
          localFolder: parts[10] || ''
        });
      }
    }

    return results;
  } catch (err) {
    console.error('Error reading competitor sitemaps summary:', err);
    return [];
  }
}

function parseCsvLine(text: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

export function getArchitectureAnalysis(): ArchitectureAnalysis | null {
  try {
    const jsonPath = path.join(DATA_DIR, 'inventory', 'architecture_analysis.json');
    if (!fs.existsSync(jsonPath)) return null;
    const content = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading architecture analysis:', err);
    return null;
  }
}

export function getOngoMeta(): Record<string, OngoMetaItem> {
  try {
    const jsonPath = path.join(DATA_DIR, 'inventory', 'ongo_current_meta.json');
    if (!fs.existsSync(jsonPath)) return {};
    const content = fs.readFileSync(jsonPath, 'utf8');
    const raw = JSON.parse(content);

    // Enrich with recommendation data from optimization report
    const enriched: Record<string, OngoMetaItem> = {};
    for (const [url, item] of Object.entries(raw as Record<string, { title: string; description: string }>)) {
      enriched[url] = {
        title: item.title,
        description: item.description,
        ...getRecommendationForUrl(url, item.title, item.description)
      };
    }
    return enriched;
  } catch (err) {
    console.error('Error reading ongo current meta:', err);
    return {};
  }
}

function getRecommendationForUrl(url: string, currentTitle: string, currentDesc: string) {
  if (url === 'https://ongoweightloss.com/') {
    return {
      recommendedTitle: 'Doctor prescribed compounded semaglutide and tirzepatide online',
      recommendedDescription: 'Get doctor prescribed compounded semaglutide and tirzepatide delivered directly to your home with transparent monthly pricing and no insurance needed',
      primaryKeyword: 'compounded semaglutide and tirzepatide online',
      notes: 'Natural human search query matching patients searching how to get prescribed compounded GLP-1 medications online without brand fluff or symbols'
    };
  }
  if (url.includes('compounded-semaglutide')) {
    return {
      recommendedTitle: 'How to get compounded semaglutide online prescribed by doctors',
      recommendedDescription: 'Find out how to get compounded semaglutide prescribed online by licensed physicians and delivered refrigerated to your door with all injection supplies',
      primaryKeyword: 'how to get compounded semaglutide online',
      notes: 'Matches conversational transactional search intent for affordable doctor prescribed semaglutide without rigid corporate brand tags'
    };
  }
  if (url.includes('compounded-tirzepatide')) {
    return {
      recommendedTitle: 'How to get compounded tirzepatide prescribed online for weight loss',
      recommendedDescription: 'Learn how to get dual GIP and GLP-1 compounded tirzepatide prescribed online by licensed doctors with fast home delivery and ongoing medical support',
      primaryKeyword: 'compounded tirzepatide prescribed online for weight loss',
      notes: 'Direct human query for patients seeking compounded tirzepatide for superior weight reduction results'
    };
  }
  if (url.includes('pricing')) {
    return {
      recommendedTitle: 'How much does compounded semaglutide and tirzepatide cost per month',
      recommendedDescription: 'See transparent monthly costs for compounded semaglutide and tirzepatide including doctor consults medication supplies and free shipping with no hidden fees',
      primaryKeyword: 'how much does compounded semaglutide cost per month',
      notes: 'Exact query typed by patients researching out-of-pocket costs and comparing telehealth clinics'
    };
  }
  if (url.includes('how-it-works')) {
    return {
      recommendedTitle: 'How online weight loss consultations and medication delivery works',
      recommendedDescription: 'See how virtual medical weight loss works in three simple steps from an online health intake to doctor review and home delivery of your medication',
      primaryKeyword: 'how online medical weight loss works',
      notes: 'Answers the searcher question of what to expect during virtual weight loss telehealth'
    };
  }
  if (url.includes('eligibility')) {
    return {
      recommendedTitle: 'Find out if you qualify for glp 1 medical weight loss online',
      recommendedDescription: 'Check the BMI criteria and medical qualifications required to receive doctor prescribed compounded semaglutide or tirzepatide online',
      primaryKeyword: 'qualify for glp 1 medical weight loss online',
      notes: 'Matches diagnostic queries from prospective patients asking if their BMI qualifies'
    };
  }
  if (url.includes('medical-team')) {
    return {
      recommendedTitle: 'Meet our team of board certified doctors specializing in weight loss',
      recommendedDescription: 'Learn about our US licensed physicians and clinical specialists who provide medical evaluations ongoing dosage adjustments and virtual weight loss care',
      primaryKeyword: 'board certified doctors specializing in weight loss',
      notes: 'Builds authentic medical trust and E-E-A-T without stiff corporate titling'
    };
  }
  if (url.includes('locations')) {
    return {
      recommendedTitle: 'States where doctor prescribed compounded glp 1 can be shipped',
      recommendedDescription: 'Check the list of US states where licensed physicians provide virtual medical consultations and ship compounded semaglutide and tirzepatide to your home',
      primaryKeyword: 'states where compounded glp 1 can be shipped',
      notes: 'Answers the searcher question of whether telehealth delivery is legal in their state'
    };
  }
  if (url.includes('faq')) {
    return {
      recommendedTitle: 'Common questions about compounded semaglutide and tirzepatide',
      recommendedDescription: 'Find clear answers to frequently asked questions about compounded GLP-1 prescriptions injection instructions side effect relief and shipping timelines',
      primaryKeyword: 'questions about compounded semaglutide and tirzepatide',
      notes: 'Direct Q&A intent matching user queries about safety and logistics'
    };
  }
  return {
    recommendedTitle: currentTitle.replace(/[|—–:;•]/g, ' ').replace(/&/g, 'and').replace(/\bOngo\s+Weight\s+Loss\b/gi, '').replace(/\bOngo\b/gi, '').replace(/\s+/g, ' ').trim(),
    recommendedDescription: currentDesc,
    primaryKeyword: 'GLP-1 Weight Loss',
    notes: 'Well-aligned with search intent.'
  };
}

export function getMasterUrlInventory(): MasterUrlItem[] {
  try {
    const csvPath = path.join(DATA_DIR, 'inventory', 'master_url_inventory.csv');
    if (!fs.existsSync(csvPath)) return [];
    
    const content = fs.readFileSync(csvPath, 'utf8');
    const lines = content.trim().split('\n');
    if (lines.length <= 1) return [];

    const items: MasterUrlItem[] = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = parseCsvLine(line);
      if (parts.length >= 6) {
        items.push({
          id: parts[0] || String(i),
          path: parts[1] || '',
          name: parts[2] || '',
          description: parts[3] || '',
          silo: parts[4] || '',
          priority: parts[5] || 'P1'
        });
      }
    }
    return items;
  } catch (err) {
    console.error('Error reading master url inventory:', err);
    return [];
  }
}

export function getCompetitorDetail(folderName: string): CompetitorDetail | null {
  try {
    const competitors = getCompetitorsSummary();
    const summary = competitors.find(c => c.localFolder === folderName || c.domain.replace(/\./g, '_') === folderName);
    if (!summary) return null;

    const folderPath = path.join(DATA_DIR, 'sitemaps', summary.localFolder);
    let allUrls: string[] = [];
    let keyGlp1Pages = undefined;
    let hasLocalSitemap = false;

    if (fs.existsSync(folderPath)) {
      const urlsFile = path.join(folderPath, 'all_urls.txt');
      if (fs.existsSync(urlsFile)) {
        allUrls = fs.readFileSync(urlsFile, 'utf8').split('\n').map(u => u.trim()).filter(Boolean);
      }

      const keyPagesFile = path.join(folderPath, 'key_glp1_pages.json');
      if (fs.existsSync(keyPagesFile)) {
        try {
          keyGlp1Pages = JSON.parse(fs.readFileSync(keyPagesFile, 'utf8'));
        } catch {}
      }

      const sitemapXmlFile = path.join(folderPath, 'sitemap.xml');
      hasLocalSitemap = fs.existsSync(sitemapXmlFile);
    }

    return {
      summary,
      allUrls,
      keyGlp1Pages,
      hasLocalSitemap
    };
  } catch (err) {
    console.error('Error reading competitor detail:', err);
    return null;
  }
}

export function getAvailableReports(): { id: string; title: string; filename: string; sizeKb: number }[] {
  try {
    const reportsDir = path.join(DATA_DIR, 'reports');
    if (!fs.existsSync(reportsDir)) return [];

    const files = fs.readdirSync(reportsDir).filter(f => f.endsWith('.md'));
    return files.map(filename => {
      const stat = fs.statSync(path.join(reportsDir, filename));
      const title = formatReportTitle(filename);
      return {
        id: filename.replace('.md', ''),
        title,
        filename,
        sizeKb: Math.round(stat.size / 1024)
      };
    });
  } catch (err) {
    console.error('Error getting reports:', err);
    return [];
  }
}

function formatReportTitle(filename: string): string {
  const clean = filename.replace('.md', '');
  return clean
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function getReportContent(filename: string): string {
  try {
    const fullPath = path.join(DATA_DIR, 'reports', filename.endsWith('.md') ? filename : `${filename}.md`);
    if (!fs.existsSync(fullPath)) return '# Report Not Found';
    return fs.readFileSync(fullPath, 'utf8');
  } catch {
    return '# Error Reading Report';
  }
}

export interface KeywordExplorerItem {
  id: number;
  keyword: string;
  url: string;
  competitor: string;
  position: number;
  volume: number;
  kd: number;
  traffic: number;
  intent: string;
  opportunityScore: number;
}

export interface DoctorProfile {
  name: string;
  specialty?: string;
  role: string;
  npiId?: string;
  npiRegistryUrl?: string;
  statesCount?: number;
  states?: string[];
  sitemapUrl: string;
  bio: string;
}

export interface CompetitorComplianceItem {
  rank: number;
  name: string;
  domain: string;
  isBenchmark: boolean;
  doctors: {
    medicalDirector: string;
    physicianSupervised: string;
    doctorCredentials: string[];
    consultationType: string;
    namedDoctorsCount: number;
    doctorTeamSample: string[];
    doctorPagesCount?: number;
    doctorUrls: string[];
    doctorProfiles?: DoctorProfile[];
  };
  authors: {
    editorialReviewByDoctors: boolean;
    authorBylinesPresent: boolean;
    namedAuthorsCount: number;
    eeatGrade: string;
    reviewProtocol: string;
    authorUrls: string[];
  };
  categories: {
    medications: string[];
    forms: string[];
    ancillaryServices: string[];
    specializations: string[];
  };
  policies: {
    pricingModel: string;
    membershipFee: string;
    pharmacyType: string;
    namedPharmacies: string[];
    cancellationPolicy: string;
    refundPolicy: string;
    labRequirements: string;
    bmiEligibility: string;
    shippingPolicy: string;
    policyUrls: string[];
  };
  states: {
    totalStatesCovered: number;
    coverageSummary: string;
    isFullNationwide: boolean;
    excludedStates: string[];
    synchronousMandates: string;
    stateLandingPagesCount?: number;
    sampleStateUrls: string[];
  };
}

export function getCompetitorComplianceData(): CompetitorComplianceItem[] {
  try {
    const filePath = path.join(DATA_DIR, 'competitor_clinical_compliance.json');
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error('Error loading competitor compliance data:', err);
    return [];
  }
}

export interface OngoLivePageItem {
  id: number;
  url: string;
  path: string;
  status_code: number;
  title: string;
  title_length: number;
  title_status: 'optimal' | 'too_short' | 'too_long' | 'missing';
  description: string;
  description_length: number;
  description_status: 'optimal' | 'too_short' | 'too_long' | 'missing';
  h1: string;
  canonical: string;
  category: string;
  intent: string;
  priority: string;
  recommended_title: string;
  recommended_description: string;
  primary_keyword: string;
  intent_gap: string;
  ctr_hook: string;
}

export interface OngoLivePagesData {
  last_updated: string;
  total_pages: number;
  source: string;
  pages: OngoLivePageItem[];
}

export function getOngoLivePages(): OngoLivePagesData {
  try {
    const filePath = path.join(DATA_DIR, 'inventory', 'ongo_live_pages.json');
    if (!fs.existsSync(filePath)) {
      return {
        last_updated: new Date().toISOString(),
        total_pages: 0,
        source: 'https://ongoweightloss.com/sitemap.xml',
        pages: []
      };
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error('Error loading ongo live pages:', err);
    return {
      last_updated: new Date().toISOString(),
      total_pages: 0,
      source: 'https://ongoweightloss.com/sitemap.xml',
      pages: []
    };
  }
}





export * from './books-data';

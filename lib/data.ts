import fs from 'fs';
import path from 'path';

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
      recommendedTitle: 'Doctor-Led Medical Weight Loss & Compounded GLP-1 | Ongo',
      recommendedDescription: 'Doctor-led telehealth weight loss with compounded semaglutide & tirzepatide vials. Licensed clinician care, transparent pricing, delivered to your door.',
      primaryKeyword: 'Doctor-Led Medical Weight Loss, Compounded GLP-1',
      notes: 'Current title is 55 chars. Recommended enhances intent with Compounded GLP-1 and clinician care.'
    };
  }
  if (url.includes('compounded-semaglutide')) {
    return {
      recommendedTitle: 'Compounded Semaglutide Vials & Telehealth Rx | Ongo Weight Loss',
      recommendedDescription: 'Order compounded semaglutide vials online. Doctor-prescribed GLP-1 weight loss medication delivered discreetly with ongoing clinical titration and support.',
      primaryKeyword: 'Compounded Semaglutide Vials, GLP-1 Telehealth',
      notes: 'Focus on high-converting transactional queries: vials, doctor-prescribed, discreet delivery.'
    };
  }
  if (url.includes('compounded-tirzepatide')) {
    return {
      recommendedTitle: 'Compounded Tirzepatide Vials & Telehealth Rx | Ongo Weight Loss',
      recommendedDescription: 'Dual GIP/GLP-1 compounded tirzepatide vials for weight loss. Licensed doctor consultations, personalized titration schedules, and fast direct shipping.',
      primaryKeyword: 'Compounded Tirzepatide Vials, Dual GIP/GLP-1',
      notes: 'Highlight dual GIP/GLP-1 receptor benefit and physician consultation.'
    };
  }
  if (url.includes('pricing')) {
    return {
      recommendedTitle: 'GLP-1 Pricing & Plans: Semaglutide & Tirzepatide | Ongo',
      recommendedDescription: 'Transparent GLP-1 weight loss pricing with no hidden membership fees. Affordable compounded semaglutide and tirzepatide with doctor care included.',
      primaryKeyword: 'GLP-1 Pricing, Semaglutide Cost, Affordable Weight Loss',
      notes: 'Directly target cost and transparency searches.'
    };
  }
  if (url.includes('how-it-works')) {
    return {
      recommendedTitle: 'How Ongo Works: 3 Steps to Medical Weight Loss Online',
      recommendedDescription: 'Learn how Ongo connects you with licensed doctors for GLP-1 weight management: 5-minute intake, provider consultation, and home delivery.',
      primaryKeyword: 'How Ongo Works, Telehealth Weight Loss Steps',
      notes: 'Add clarity on 3 simple steps (intake, consultation, delivery).'
    };
  }
  if (url.includes('eligibility')) {
    return {
      recommendedTitle: 'GLP-1 Weight Loss Eligibility & BMI Requirements | Ongo',
      recommendedDescription: 'Check if you qualify for semaglutide or tirzepatide weight loss treatments. Review BMI guidelines, clinical medical criteria, and health history checks.',
      primaryKeyword: 'GLP-1 Eligibility, BMI Requirements',
      notes: 'Captures patients researching qualification before signing up.'
    };
  }
  if (url.includes('medical-team')) {
    return {
      recommendedTitle: 'Licensed Medical Team & Clinical Weight Loss Doctors | Ongo',
      recommendedDescription: 'Meet our US-licensed doctors and healthcare clinicians specializing in obesity medicine, medical weight management, and personalized GLP-1 therapies.',
      primaryKeyword: 'Ongo Medical Team, Obesity Medicine Doctors, E-E-A-T',
      notes: 'Crucial for Google Health E-E-A-T trust signals.'
    };
  }
  if (url.includes('locations')) {
    return {
      recommendedTitle: 'Online Weight Loss Clinics in All 50 States | Ongo',
      recommendedDescription: 'Access licensed telehealth weight loss care across all 50 states. Licensed clinicians, compounded GLP-1 prescriptions, and direct pharmacy shipping.',
      primaryKeyword: 'Telehealth Weight Loss All 50 States, State Availability',
      notes: 'Builds authority across state-specific patient queries.'
    };
  }
  if (url.includes('faq')) {
    return {
      recommendedTitle: 'Medical Weight Loss FAQs: GLP-1, Semaglutide, Shipping | Ongo',
      recommendedDescription: 'Get answers to frequently asked questions about compounded GLP-1 medications, doctor visits, delivery timelines, dosing, and eligibility with Ongo.',
      primaryKeyword: 'GLP-1 FAQ, Semaglutide Questions',
      notes: 'Optimized for Google FAQ rich snippet indexing.'
    };
  }
  return {
    recommendedTitle: currentTitle,
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


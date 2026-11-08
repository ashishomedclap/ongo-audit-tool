import fs from 'fs';
import path from 'path';

export interface VaultKeyword {
  id: string;
  keyword: string;
  position: number;
  prevPosition: number;
  searchVolume: number;
  keywordDifficulty: number;
  cpc: number;
  url: string;
  traffic: number;
  trafficPercent: number;
  trafficCost: number;
  competition: number;
  resultsCount: number;
  trends: string;
  timestamp: string;
  serpFeatures: string[];
  intents: string[];
  positionType: string;
}

export interface VaultBacklink {
  id: string;
  ascore: number;
  sourceTitle: string;
  sourceUrl: string;
  targetUrl: string;
  anchor: string;
  externalLinks: number;
  internalLinks: number;
  isNofollow: boolean;
  isSponsored: boolean;
  isUgc: boolean;
  isText: boolean;
  isFrame: boolean;
  isForm: boolean;
  isImage: boolean;
  isSitewide: boolean;
  firstSeen: string;
  lastSeen: string;
  isNew: boolean;
  isLost: boolean;
  sourceDomain: string;
}

export interface VaultCompetitor {
  id: string;
  domain: string;
  relevance: number;
  commonKeywords: number;
  organicKeywords: number;
  organicTraffic: number;
  organicCost: number;
  adwordsKeywords: number;
}

export interface VaultMeta {
  lastUpdated: string;
  version: string;
  counts: {
    keywords: number;
    backlinks: number;
    competitors: number;
    referringDomains: number;
  };
  kpis: {
    top3Keywords: number;
    top10Keywords: number;
    totalSearchVolume: number;
    totalTrafficCost: number;
    totalEstimatedTraffic: number;
    dofollowBacklinks: number;
    nofollowBacklinks: number;
    highAuthBacklinks: number;
    averageCompetitorRelevance: number;
  };
}

const VAULT_DIR = path.join(process.cwd(), 'data', 'seo_vault');

function ensureDir() {
  if (!fs.existsSync(VAULT_DIR)) {
    fs.mkdirSync(VAULT_DIR, { recursive: true });
  }
}

export function getVaultMeta(): VaultMeta {
  try {
    ensureDir();
    const metaPath = path.join(VAULT_DIR, 'meta.json');
    if (fs.existsSync(metaPath)) {
      return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading vault meta:', err);
  }
  return {
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    counts: { keywords: 0, backlinks: 0, competitors: 0, referringDomains: 0 },
    kpis: {
      top3Keywords: 0,
      top10Keywords: 0,
      totalSearchVolume: 0,
      totalTrafficCost: 0,
      totalEstimatedTraffic: 0,
      dofollowBacklinks: 0,
      nofollowBacklinks: 0,
      highAuthBacklinks: 0,
      averageCompetitorRelevance: 0
    }
  };
}

export function getVaultKeywords(): VaultKeyword[] {
  try {
    ensureDir();
    const filePath = path.join(VAULT_DIR, 'keywords.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading vault keywords:', err);
  }
  return [];
}

export function getVaultBacklinks(): VaultBacklink[] {
  try {
    ensureDir();
    const filePath = path.join(VAULT_DIR, 'backlinks.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading vault backlinks:', err);
  }
  return [];
}

export function getVaultCompetitors(): VaultCompetitor[] {
  try {
    ensureDir();
    const filePath = path.join(VAULT_DIR, 'competitors.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading vault competitors:', err);
  }
  return [];
}

// Extract domain helper
export function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

// CSV line parser handling quotes
export function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Auto-detect CSV type from header line
export function detectCsvDatasetType(headerLine: string): 'keywords' | 'backlinks' | 'competitors' | 'unknown' {
  const lower = headerLine.toLowerCase();
  if (lower.includes('keyword') && (lower.includes('position') || lower.includes('search volume') || lower.includes('difficulty'))) {
    return 'keywords';
  }
  if ((lower.includes('page ascore') || lower.includes('ascore') || lower.includes('anchor')) && (lower.includes('source url') || lower.includes('target url'))) {
    return 'backlinks';
  }
  if (lower.includes('domain') && (lower.includes('relevance') || lower.includes('organic traffic') || lower.includes('common keywords'))) {
    return 'competitors';
  }
  return 'unknown';
}

function escapeCsvField(val: unknown): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// Save & Recalculate Metadata
export function saveVaultKeywords(items: VaultKeyword[]) {
  ensureDir();
  fs.writeFileSync(path.join(VAULT_DIR, 'keywords.json'), JSON.stringify(items, null, 2), 'utf8');

  // Also write CSV
  const headers = [
    'Keyword', 'Position', 'Previous position', 'Search Volume', 'Keyword Difficulty', 'CPC', 'URL',
    'Traffic', 'Traffic (%)', 'Traffic Cost', 'Competition', 'Number of Results', 'Trends', 'Timestamp',
    'SERP Features by Keyword', 'Keyword Intents', 'Position Type'
  ];
  const rows = [headers.join(',')];
  items.forEach(k => {
    rows.push([
      escapeCsvField(k.keyword),
      k.position,
      k.prevPosition,
      k.searchVolume,
      k.keywordDifficulty,
      k.cpc,
      escapeCsvField(k.url),
      k.traffic,
      k.trafficPercent,
      k.trafficCost,
      k.competition,
      k.resultsCount,
      escapeCsvField(k.trends),
      k.timestamp,
      escapeCsvField(k.serpFeatures.join(', ')),
      escapeCsvField(k.intents.join(', ')),
      escapeCsvField(k.positionType)
    ].join(','));
  });
  fs.writeFileSync(path.join(VAULT_DIR, 'keywords.csv'), rows.join('\n') + '\n', 'utf8');

  recalculateAndSaveMeta();
}

export function saveVaultBacklinks(items: VaultBacklink[]) {
  ensureDir();
  fs.writeFileSync(path.join(VAULT_DIR, 'backlinks.json'), JSON.stringify(items, null, 2), 'utf8');

  // Also write CSV
  const headers = [
    'Page ascore', 'Source title', 'Source url', 'Target url', 'Anchor', 'External links', 'Internal links',
    'Nofollow', 'Sponsored', 'Ugc', 'Text', 'Frame', 'Form', 'Image', 'Sitewide', 'First seen', 'Last seen',
    'New link', 'Lost link'
  ];
  const rows = [headers.join(',')];
  items.forEach(b => {
    rows.push([
      b.ascore,
      escapeCsvField(b.sourceTitle),
      escapeCsvField(b.sourceUrl),
      escapeCsvField(b.targetUrl),
      escapeCsvField(b.anchor),
      b.externalLinks,
      b.internalLinks,
      b.isNofollow,
      b.isSponsored,
      b.isUgc,
      b.isText,
      b.isFrame,
      b.isForm,
      b.isImage,
      b.isSitewide,
      b.firstSeen,
      b.lastSeen,
      b.isNew,
      b.isLost
    ].join(','));
  });
  fs.writeFileSync(path.join(VAULT_DIR, 'backlinks.csv'), rows.join('\n') + '\n', 'utf8');

  recalculateAndSaveMeta();
}

export function saveVaultCompetitors(items: VaultCompetitor[]) {
  ensureDir();
  fs.writeFileSync(path.join(VAULT_DIR, 'competitors.json'), JSON.stringify(items, null, 2), 'utf8');

  // Also write CSV
  const headers = [
    'Domain', 'Competitor Relevance', 'Common Keywords', 'Organic Keywords', 'Organic Traffic', 'Organic Cost', 'Adwords Keywords'
  ];
  const rows = [headers.join(',')];
  items.forEach(c => {
    rows.push([
      escapeCsvField(c.domain),
      c.relevance,
      c.commonKeywords,
      c.organicKeywords,
      c.organicTraffic,
      c.organicCost,
      c.adwordsKeywords
    ].join(','));
  });
  fs.writeFileSync(path.join(VAULT_DIR, 'competitors.csv'), rows.join('\n') + '\n', 'utf8');

  recalculateAndSaveMeta();
}

export function recalculateAndSaveMeta(): VaultMeta {
  const kwData = getVaultKeywords();
  const blData = getVaultBacklinks();
  const cpData = getVaultCompetitors();

  const uniqueReferringDomains = new Set(blData.map(b => b.sourceDomain).filter(Boolean)).size;
  const top3Keywords = kwData.filter(k => k.position > 0 && k.position <= 3).length;
  const top10Keywords = kwData.filter(k => k.position > 0 && k.position <= 10).length;
  const totalSearchVolume = kwData.reduce((acc, k) => acc + (k.searchVolume || 0), 0);
  const totalTrafficCost = kwData.reduce((acc, k) => acc + (k.trafficCost || 0), 0);
  const totalEstimatedTraffic = kwData.reduce((acc, k) => acc + (k.traffic || 0), 0);
  const dofollowBacklinks = blData.filter(b => !b.isNofollow).length;
  const nofollowBacklinks = blData.filter(b => b.isNofollow).length;
  const highAuthBacklinks = blData.filter(b => b.ascore >= 20).length;

  const meta: VaultMeta = {
    lastUpdated: new Date().toISOString(),
    version: '1.1.0',
    counts: {
      keywords: kwData.length,
      backlinks: blData.length,
      competitors: cpData.length,
      referringDomains: uniqueReferringDomains
    },
    kpis: {
      top3Keywords,
      top10Keywords,
      totalSearchVolume,
      totalTrafficCost: Math.round(totalTrafficCost),
      totalEstimatedTraffic: Math.round(totalEstimatedTraffic),
      dofollowBacklinks,
      nofollowBacklinks,
      highAuthBacklinks,
      averageCompetitorRelevance: +(cpData.reduce((acc, c) => acc + c.relevance, 0) / (cpData.length || 1)).toFixed(3)
    }
  };

  ensureDir();
  fs.writeFileSync(path.join(VAULT_DIR, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');
  return meta;
}


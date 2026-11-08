import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import {
  VaultKeyword,
  VaultBacklink,
  VaultCompetitor,
  getVaultKeywords,
  getVaultBacklinks,
  getVaultCompetitors,
  saveVaultKeywords,
  saveVaultBacklinks,
  saveVaultCompetitors,
  detectCsvDatasetType,
  parseCsvLine,
  extractDomain,
  recalculateAndSaveMeta
} from '@/lib/seo-vault-data';

function colLetterToIndex(colStr: string): number {
  let index = 0;
  for (let i = 0; i < colStr.length; i++) {
    index = index * 26 + (colStr.charCodeAt(i) - 64);
  }
  return index - 1;
}

function formatExcelDate(serial: string): string {
  if (!serial) return '';
  const num = parseFloat(serial);
  if (isNaN(num) || num < 100) return serial;
  const date = new Date(Math.round((num - 25569) * 86400 * 1000));
  if (isNaN(date.getTime())) return serial;
  return date.toISOString().split('T')[0];
}

function parseOpenXmlSheetFromBuffer(buffer: ArrayBuffer): string[][] {
  const { ZipEntry } = (() => {
    // We'll use built-in Node zlib/Buffer instead
    return { ZipEntry: null };
  })();

  // Write to temp and use zip extraction
  const tmpDir = path.join(process.cwd(), '.next', 'tmp-vault-upload');
  fs.mkdirSync(tmpDir, { recursive: true });
  const tmpXlsxPath = path.join(tmpDir, 'upload_' + Date.now() + '.xlsx');
  const tmpExtractPath = path.join(tmpDir, 'extracted_' + Date.now());

  fs.writeFileSync(tmpXlsxPath, Buffer.from(buffer));

  // Use PowerShell to extract (Windows)
  const { execSync } = require('child_process');
  try {
    execSync(
      `powershell -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('${tmpXlsxPath.replace(/\\/g, '\\\\')}', '${tmpExtractPath.replace(/\\/g, '\\\\')}')"`,
      { timeout: 30000 }
    );
  } catch (err) {
    console.error('ZIP extraction failed:', err);
    throw new Error('Failed to extract xlsx file');
  }

  const sharedStringsPath = path.join(tmpExtractPath, 'xl', 'sharedStrings.xml');
  const sheetPath = path.join(tmpExtractPath, 'xl', 'worksheets', 'sheet1.xml');

  const sharedStrings: string[] = [];
  if (fs.existsSync(sharedStringsPath)) {
    const ssXml = fs.readFileSync(sharedStringsPath, 'utf8');
    const siMatches = ssXml.match(/<si>([\s\S]*?)<\/si>/g) || [];
    for (const si of siMatches) {
      const tMatches = si.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || [];
      const text = tMatches.map(t => {
        return t.replace(/^<t[^>]*>/, '').replace(/<\/t>$/, '')
          .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"').replace(/&apos;/g, "'");
      }).join('');
      sharedStrings.push(text);
    }
  }

  const sheetXml = fs.readFileSync(sheetPath, 'utf8');
  const rowMatches = sheetXml.match(/<row[^>]*>([\s\S]*?)<\/row>/g) || [];
  const rows: string[][] = [];

  for (const rowTag of rowMatches) {
    const row: string[] = [];
    const cellMatches = rowTag.match(/<c\s+[^>]*>[\s\S]*?<\/c>|<c\s+[^>]*\/>/g) || [];

    for (const cell of cellMatches) {
      const rAttr = cell.match(/r="([A-Z]+)(\d+)"/);
      if (!rAttr) continue;
      const colIdx = colLetterToIndex(rAttr[1]);
      const tAttr = cell.match(/t="([^"]+)"/);
      const cellType = tAttr ? tAttr[1] : 'n';

      let val = '';
      if (cellType === 's') {
        const vMatch = cell.match(/<v>(\d+)<\/v>/);
        if (vMatch) val = sharedStrings[parseInt(vMatch[1], 10)] || '';
      } else if (cellType === 'inlineStr') {
        const isMatch = cell.match(/<t[^>]*>([\s\S]*?)<\/t>/);
        if (isMatch) val = isMatch[1].replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
      } else if (cellType === 'b') {
        const vMatch = cell.match(/<v>([01])<\/v>/);
        val = vMatch && vMatch[1] === '1' ? 'true' : 'false';
      } else {
        const vMatch = cell.match(/<v>([\s\S]*?)<\/v>/);
        if (vMatch) val = vMatch[1];
      }
      row[colIdx] = val;
    }
    for (let c = 0; c < row.length; c++) { if (row[c] === undefined) row[c] = ''; }
    if (row.length > 0) rows.push(row);
  }

  // Cleanup
  try { fs.rmSync(tmpExtractPath, { recursive: true, force: true }); } catch {}
  try { fs.unlinkSync(tmpXlsxPath); } catch {}

  return rows;
}

function parseKeywordsFromXlsx(rows: string[][]): VaultKeyword[] {
  const data: VaultKeyword[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[0]) continue;
    data.push({
      id: 'kw-' + Date.now() + '-' + i,
      keyword: r[0] || '',
      position: parseInt(r[1], 10) || 0,
      prevPosition: parseInt(r[2], 10) || 0,
      searchVolume: parseInt(r[3], 10) || 0,
      keywordDifficulty: parseFloat(r[4]) || 0,
      cpc: parseFloat(r[5]) || 0,
      url: r[6] || '',
      traffic: parseFloat(r[7]) || 0,
      trafficPercent: parseFloat(r[8]) || 0,
      trafficCost: parseFloat(r[9]) || 0,
      competition: parseFloat(r[10]) || 0,
      resultsCount: parseInt(r[11], 10) || 0,
      trends: r[12] || '',
      timestamp: formatExcelDate(r[13]),
      serpFeatures: (r[14] || '').split(',').map((s: string) => s.trim()).filter(Boolean),
      intents: (r[15] || '').split(',').map((s: string) => s.trim().toLowerCase()).filter(Boolean),
      positionType: r[16] || 'Organic'
    });
  }
  return data;
}

function parseBacklinksFromXlsx(rows: string[][]): VaultBacklink[] {
  const data: VaultBacklink[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[2]) continue;
    data.push({
      id: 'bl-' + Date.now() + '-' + i,
      ascore: parseInt(r[0], 10) || 0,
      sourceTitle: r[1] || '',
      sourceUrl: r[2] || '',
      targetUrl: r[3] || '',
      anchor: r[4] || '',
      externalLinks: parseInt(r[5], 10) || 0,
      internalLinks: parseInt(r[6], 10) || 0,
      isNofollow: r[7] === 'true',
      isSponsored: r[8] === 'true',
      isUgc: r[9] === 'true',
      isText: r[10] === 'true',
      isFrame: r[11] === 'true',
      isForm: r[12] === 'true',
      isImage: r[13] === 'true',
      isSitewide: r[14] === 'true',
      firstSeen: formatExcelDate(r[15]),
      lastSeen: formatExcelDate(r[16]),
      isNew: r[17] === 'true',
      isLost: r[18] === 'true',
      sourceDomain: extractDomain(r[2])
    });
  }
  return data;
}

function parseCompetitorsFromXlsx(rows: string[][]): VaultCompetitor[] {
  const data: VaultCompetitor[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[0]) continue;
    data.push({
      id: 'cp-' + Date.now() + '-' + i,
      domain: r[0] || '',
      relevance: parseFloat(r[1]) || 0,
      commonKeywords: parseInt(r[2], 10) || 0,
      organicKeywords: parseInt(r[3], 10) || 0,
      organicTraffic: parseInt(r[4], 10) || 0,
      organicCost: parseFloat(r[5]) || 0,
      adwordsKeywords: parseInt(r[6], 10) || 0
    });
  }
  return data;
}

// GET — Retrieve vault data
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const dataset = searchParams.get('dataset') || 'meta';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '100', 10);
  const search = (searchParams.get('search') || '').toLowerCase().trim();
  const sortBy = searchParams.get('sortBy') || '';
  const sortDir = searchParams.get('sortDir') === 'asc' ? 'asc' : 'desc';

  if (dataset === 'meta') {
    const { getVaultMeta } = await import('@/lib/seo-vault-data');
    return NextResponse.json({ meta: getVaultMeta() });
  }

  if (dataset === 'keywords') {
    let items = getVaultKeywords();
    if (search) {
      items = items.filter(k => k.keyword.toLowerCase().includes(search) || k.url.toLowerCase().includes(search));
    }
    // Sort
    if (sortBy === 'position') items.sort((a, b) => sortDir === 'asc' ? a.position - b.position : b.position - a.position);
    else if (sortBy === 'searchVolume') items.sort((a, b) => sortDir === 'asc' ? a.searchVolume - b.searchVolume : b.searchVolume - a.searchVolume);
    else if (sortBy === 'traffic') items.sort((a, b) => sortDir === 'asc' ? a.traffic - b.traffic : b.traffic - a.traffic);
    else if (sortBy === 'kd') items.sort((a, b) => sortDir === 'asc' ? a.keywordDifficulty - b.keywordDifficulty : b.keywordDifficulty - a.keywordDifficulty);
    else if (sortBy === 'cpc') items.sort((a, b) => sortDir === 'asc' ? a.cpc - b.cpc : b.cpc - a.cpc);
    else items.sort((a, b) => a.position - b.position);

    const total = items.length;
    const paginated = items.slice((page - 1) * pageSize, page * pageSize);
    return NextResponse.json({ items: paginated, total, page, pageSize });
  }

  if (dataset === 'backlinks') {
    let items = getVaultBacklinks();
    if (search) {
      items = items.filter(b => b.sourceUrl.toLowerCase().includes(search) || b.sourceDomain.toLowerCase().includes(search) || b.anchor.toLowerCase().includes(search) || b.sourceTitle.toLowerCase().includes(search));
    }
    // Filter params
    const minAscore = parseInt(searchParams.get('minAscore') || '0', 10);
    if (minAscore > 0) items = items.filter(b => b.ascore >= minAscore);
    const nofollowFilter = searchParams.get('nofollow');
    if (nofollowFilter === 'dofollow') items = items.filter(b => !b.isNofollow);
    if (nofollowFilter === 'nofollow') items = items.filter(b => b.isNofollow);

    if (sortBy === 'ascore') items.sort((a, b) => sortDir === 'asc' ? a.ascore - b.ascore : b.ascore - a.ascore);
    else if (sortBy === 'firstSeen') items.sort((a, b) => sortDir === 'asc' ? a.firstSeen.localeCompare(b.firstSeen) : b.firstSeen.localeCompare(a.firstSeen));
    else items.sort((a, b) => b.ascore - a.ascore);

    const total = items.length;
    const paginated = items.slice((page - 1) * pageSize, page * pageSize);
    return NextResponse.json({ items: paginated, total, page, pageSize });
  }

  if (dataset === 'competitors') {
    let items = getVaultCompetitors();
    if (search) {
      items = items.filter(c => c.domain.toLowerCase().includes(search));
    }
    if (sortBy === 'relevance') items.sort((a, b) => sortDir === 'asc' ? a.relevance - b.relevance : b.relevance - a.relevance);
    else if (sortBy === 'traffic') items.sort((a, b) => sortDir === 'asc' ? a.organicTraffic - b.organicTraffic : b.organicTraffic - a.organicTraffic);
    else if (sortBy === 'commonKeywords') items.sort((a, b) => sortDir === 'asc' ? a.commonKeywords - b.commonKeywords : b.commonKeywords - a.commonKeywords);
    else items.sort((a, b) => b.relevance - a.relevance);

    const total = items.length;
    const paginated = items.slice((page - 1) * pageSize, page * pageSize);
    return NextResponse.json({ items: paginated, total, page, pageSize });
  }

  return NextResponse.json({ error: 'Unknown dataset' }, { status: 400 });
}

// POST — Upload new xlsx file to update database
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const mode = (formData.get('mode') as string) || 'replace'; // 'replace' or 'merge'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.csv')) {
      return NextResponse.json({ error: 'Only .xlsx and .csv files are supported' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();

    let detectedType: 'keywords' | 'backlinks' | 'competitors' | 'unknown' = 'unknown';
    let importedCount = 0;

    if (fileName.endsWith('.csv')) {
      // Parse CSV directly
      const text = Buffer.from(buffer).toString('utf8');
      const lines = text.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) {
        return NextResponse.json({ error: 'CSV file is empty or has no data rows' }, { status: 400 });
      }

      detectedType = detectCsvDatasetType(lines[0]);
      if (detectedType === 'unknown') {
        return NextResponse.json({ error: 'Could not detect CSV type. Expected headers for keywords, backlinks, or competitors.' }, { status: 400 });
      }

      const dataRows = lines.slice(1);

      if (detectedType === 'keywords') {
        const newItems: VaultKeyword[] = dataRows.map((line, i) => {
          const r = parseCsvLine(line);
          return {
            id: 'kw-upload-' + Date.now() + '-' + i,
            keyword: r[0] || '', position: parseInt(r[1], 10) || 0, prevPosition: parseInt(r[2], 10) || 0,
            searchVolume: parseInt(r[3], 10) || 0, keywordDifficulty: parseFloat(r[4]) || 0,
            cpc: parseFloat(r[5]) || 0, url: r[6] || '', traffic: parseFloat(r[7]) || 0,
            trafficPercent: parseFloat(r[8]) || 0, trafficCost: parseFloat(r[9]) || 0,
            competition: parseFloat(r[10]) || 0, resultsCount: parseInt(r[11], 10) || 0,
            trends: r[12] || '', timestamp: r[13] || '',
            serpFeatures: (r[14] || '').split(',').map(s => s.trim()).filter(Boolean),
            intents: (r[15] || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
            positionType: r[16] || 'Organic'
          };
        }).filter(k => k.keyword);

        const existing = mode === 'merge' ? getVaultKeywords() : [];
        const merged = mode === 'merge' ? [...existing, ...newItems] : newItems;
        saveVaultKeywords(merged);
        importedCount = newItems.length;

      } else if (detectedType === 'backlinks') {
        const newItems: VaultBacklink[] = dataRows.map((line, i) => {
          const r = parseCsvLine(line);
          return {
            id: 'bl-upload-' + Date.now() + '-' + i,
            ascore: parseInt(r[0], 10) || 0, sourceTitle: r[1] || '', sourceUrl: r[2] || '',
            targetUrl: r[3] || '', anchor: r[4] || '', externalLinks: parseInt(r[5], 10) || 0,
            internalLinks: parseInt(r[6], 10) || 0, isNofollow: r[7] === 'true',
            isSponsored: r[8] === 'true', isUgc: r[9] === 'true', isText: r[10] === 'true',
            isFrame: r[11] === 'true', isForm: r[12] === 'true', isImage: r[13] === 'true',
            isSitewide: r[14] === 'true', firstSeen: r[15] || '', lastSeen: r[16] || '',
            isNew: r[17] === 'true', isLost: r[18] === 'true',
            sourceDomain: extractDomain(r[2])
          };
        }).filter(b => b.sourceUrl);

        const existing = mode === 'merge' ? getVaultBacklinks() : [];
        const merged = mode === 'merge' ? [...existing, ...newItems] : newItems;
        saveVaultBacklinks(merged);
        importedCount = newItems.length;

      } else if (detectedType === 'competitors') {
        const newItems: VaultCompetitor[] = dataRows.map((line, i) => {
          const r = parseCsvLine(line);
          return {
            id: 'cp-upload-' + Date.now() + '-' + i,
            domain: r[0] || '', relevance: parseFloat(r[1]) || 0,
            commonKeywords: parseInt(r[2], 10) || 0, organicKeywords: parseInt(r[3], 10) || 0,
            organicTraffic: parseInt(r[4], 10) || 0, organicCost: parseFloat(r[5]) || 0,
            adwordsKeywords: parseInt(r[6], 10) || 0
          };
        }).filter(c => c.domain);

        const existing = mode === 'merge' ? getVaultCompetitors() : [];
        const merged = mode === 'merge' ? [...existing, ...newItems] : newItems;
        saveVaultCompetitors(merged);
        importedCount = newItems.length;
      }

    } else {
      // Parse xlsx using our PowerShell + OpenXML approach
      const rows = parseOpenXmlSheetFromBuffer(buffer);
      if (rows.length < 2) {
        return NextResponse.json({ error: 'XLSX file is empty or has no data rows' }, { status: 400 });
      }

      const headerLine = rows[0].join(',');
      detectedType = detectCsvDatasetType(headerLine);
      if (detectedType === 'unknown') {
        return NextResponse.json({ error: 'Could not detect XLSX type. Expected headers for keywords, backlinks, or competitors.' }, { status: 400 });
      }

      if (detectedType === 'keywords') {
        const newItems = parseKeywordsFromXlsx(rows);
        const existing = mode === 'merge' ? getVaultKeywords() : [];
        const merged = mode === 'merge' ? [...existing, ...newItems] : newItems;
        saveVaultKeywords(merged);
        importedCount = newItems.length;

      } else if (detectedType === 'backlinks') {
        const newItems = parseBacklinksFromXlsx(rows);
        const existing = mode === 'merge' ? getVaultBacklinks() : [];
        const merged = mode === 'merge' ? [...existing, ...newItems] : newItems;
        saveVaultBacklinks(merged);
        importedCount = newItems.length;

      } else if (detectedType === 'competitors') {
        const newItems = parseCompetitorsFromXlsx(rows);
        const existing = mode === 'merge' ? getVaultCompetitors() : [];
        const merged = mode === 'merge' ? [...existing, ...newItems] : newItems;
        saveVaultCompetitors(merged);
        importedCount = newItems.length;
      }
    }

    const { getVaultMeta } = await import('@/lib/seo-vault-data');
    const meta = getVaultMeta();

    return NextResponse.json({
      success: true,
      dataset: detectedType,
      importedCount,
      mode,
      meta
    });

  } catch (err) {
    console.error('[SEO Vault Upload Error]', err);
    return NextResponse.json({
      error: 'Upload failed: ' + (err instanceof Error ? err.message : String(err))
    }, { status: 500 });
  }
}


const fs = require('fs');
const path = require('path');

function colLetterToIndex(colStr) {
  let index = 0;
  for (let i = 0; i < colStr.length; i++) {
    index = index * 26 + (colStr.charCodeAt(i) - 64);
  }
  return index - 1;
}

function parseOpenXmlSheet(dir) {
  const sharedStringsPath = path.join(dir, 'xl', 'sharedStrings.xml');
  const sheetPath = path.join(dir, 'xl', 'worksheets', 'sheet1.xml');

  if (!fs.existsSync(sheetPath)) {
    throw new Error('Sheet not found: ' + sheetPath);
  }

  const sharedStrings = [];
  if (fs.existsSync(sharedStringsPath)) {
    const ssXml = fs.readFileSync(sharedStringsPath, 'utf8');
    const siMatches = ssXml.match(/<si>([\s\S]*?)<\/si>/g) || [];
    for (const si of siMatches) {
      const tMatches = si.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || [];
      const text = tMatches.map(t => {
        return t.replace(/^<t[^>]*>/, '').replace(/<\/t>$/, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'");
      }).join('');
      sharedStrings.push(text);
    }
  }

  const sheetXml = fs.readFileSync(sheetPath, 'utf8');
  const rowMatches = sheetXml.match(/<row[^>]*>([\s\S]*?)<\/row>/g) || [];
  const rows = [];

  for (const rowTag of rowMatches) {
    const row = [];
    const cellMatches = rowTag.match(/<c\s+[^>]*>[\s\S]*?<\/c>|<c\s+[^>]*\/>/g) || [];
    
    for (const cell of cellMatches) {
      const rAttr = cell.match(/r="([A-Z]+)(\d+)"/);
      if (!rAttr) continue;
      const colLetter = rAttr[1];
      const colIdx = colLetterToIndex(colLetter);

      const tAttr = cell.match(/t="([^"]+)"/);
      const cellType = tAttr ? tAttr[1] : 'n';

      let val = '';
      if (cellType === 's') {
        const vMatch = cell.match(/<v>(\d+)<\/v>/);
        if (vMatch) {
          const sIdx = parseInt(vMatch[1], 10);
          val = sharedStrings[sIdx] || '';
        }
      } else if (cellType === 'inlineStr') {
        const isMatch = cell.match(/<t[^>]*>([\s\S]*?)<\/t>/);
        if (isMatch) {
          val = isMatch[1]
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'");
        }
      } else if (cellType === 'b') {
        const vMatch = cell.match(/<v>([01])<\/v>/);
        val = vMatch && vMatch[1] === '1' ? 'true' : 'false';
      } else {
        const vMatch = cell.match(/<v>([\s\S]*?)<\/v>/);
        if (vMatch) {
          val = vMatch[1];
        }
      }

      row[colIdx] = val;
    }

    for (let c = 0; c < row.length; c++) {
      if (row[c] === undefined) row[c] = '';
    }

    if (row.length > 0) {
      rows.push(row);
    }
  }

  return rows;
}

function formatExcelDate(serial) {
  if (!serial) return '';
  const num = parseFloat(serial);
  if (isNaN(num)) return serial;
  if (num < 1000) return serial; // not a date
  // Excel base date: Dec 30 1899
  const date = new Date(Math.round((num - 25569) * 86400 * 1000));
  if (isNaN(date.getTime())) return serial;
  return date.toISOString().split('T')[0];
}

function escapeCsvField(val) {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function rowsToCsv(rows) {
  return rows.map(r => r.map(escapeCsvField).join(',')).join('\n') + '\n';
}

function extractDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch (e) {
    return '';
  }
}

// EXECUTE
const baseUnzipped = path.join(__dirname, '..', 'data', 'seo_vault', '_unzipped');
const outDir = path.join(__dirname, '..', 'data', 'seo_vault');
fs.mkdirSync(outDir, { recursive: true });

console.log('--- Converting Keywords ---');
const kwRaw = parseOpenXmlSheet(path.join(baseUnzipped, 'kw'));
const kwHeaders = kwRaw[0];
const kwData = [];
const kwCleanRows = [kwHeaders];

for (let i = 1; i < kwRaw.length; i++) {
  const r = kwRaw[i];
  if (!r[0]) continue; // empty keyword
  const dateStr = formatExcelDate(r[13]);
  const rowClean = [...r];
  rowClean[13] = dateStr;
  kwCleanRows.push(rowClean);

  kwData.push({
    id: 'kw-' + i,
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
    timestamp: dateStr,
    serpFeatures: (r[14] || '').split(',').map(s => s.trim()).filter(Boolean),
    intents: (r[15] || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
    positionType: r[16] || 'Organic'
  });
}

fs.writeFileSync(path.join(outDir, 'keywords.csv'), rowsToCsv(kwCleanRows), 'utf8');
fs.writeFileSync(path.join(outDir, 'keywords.json'), JSON.stringify(kwData, null, 2), 'utf8');
console.log(`Saved ${kwData.length} keywords.`);

console.log('--- Converting Backlinks ---');
const blRaw = parseOpenXmlSheet(path.join(baseUnzipped, 'bl'));
const blHeaders = blRaw[0];
const blData = [];
const blCleanRows = [blHeaders];

for (let i = 1; i < blRaw.length; i++) {
  const r = blRaw[i];
  if (!r[2]) continue; // empty source url
  const firstSeen = formatExcelDate(r[15]);
  const lastSeen = formatExcelDate(r[16]);
  const rowClean = [...r];
  rowClean[15] = firstSeen;
  rowClean[16] = lastSeen;
  blCleanRows.push(rowClean);

  blData.push({
    id: 'bl-' + i,
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
    firstSeen: firstSeen,
    lastSeen: lastSeen,
    isNew: r[17] === 'true',
    isLost: r[18] === 'true',
    sourceDomain: extractDomain(r[2])
  });
}

fs.writeFileSync(path.join(outDir, 'backlinks.csv'), rowsToCsv(blCleanRows), 'utf8');
fs.writeFileSync(path.join(outDir, 'backlinks.json'), JSON.stringify(blData, null, 2), 'utf8');
console.log(`Saved ${blData.length} backlinks.`);

console.log('--- Converting Competitors ---');
const cpRaw = parseOpenXmlSheet(path.join(baseUnzipped, 'cp'));
const cpHeaders = cpRaw[0];
const cpData = [];
const cpCleanRows = [cpHeaders];

for (let i = 1; i < cpRaw.length; i++) {
  const r = cpRaw[i];
  if (!r[0]) continue;
  cpCleanRows.push(r);

  cpData.push({
    id: 'cp-' + i,
    domain: r[0] || '',
    relevance: parseFloat(r[1]) || 0,
    commonKeywords: parseInt(r[2], 10) || 0,
    organicKeywords: parseInt(r[3], 10) || 0,
    organicTraffic: parseInt(r[4], 10) || 0,
    organicCost: parseFloat(r[5]) || 0,
    adwordsKeywords: parseInt(r[6], 10) || 0
  });
}

fs.writeFileSync(path.join(outDir, 'competitors.csv'), rowsToCsv(cpCleanRows), 'utf8');
fs.writeFileSync(path.join(outDir, 'competitors.json'), JSON.stringify(cpData, null, 2), 'utf8');
console.log(`Saved ${cpData.length} competitors.`);

// Calculate metadata summary
const uniqueReferringDomains = new Set(blData.map(b => b.sourceDomain).filter(Boolean)).size;
const top3Keywords = kwData.filter(k => k.position > 0 && k.position <= 3).length;
const top10Keywords = kwData.filter(k => k.position > 0 && k.position <= 10).length;
const totalSearchVolume = kwData.reduce((acc, k) => acc + (k.searchVolume || 0), 0);
const totalTrafficCost = kwData.reduce((acc, k) => acc + (k.trafficCost || 0), 0);
const totalEstimatedTraffic = kwData.reduce((acc, k) => acc + (k.traffic || 0), 0);
const dofollowBacklinks = blData.filter(b => !b.isNofollow).length;
const nofollowBacklinks = blData.filter(b => b.isNofollow).length;
const highAuthBacklinks = blData.filter(b => b.ascore >= 20).length;

const meta = {
  lastUpdated: new Date().toISOString(),
  version: '1.0.0',
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

fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');
console.log('Saved meta.json summary:', meta);

// Clean up unzipped folder
try {
  fs.rmSync(baseUnzipped, { recursive: true, force: true });
  console.log('Cleaned up _unzipped directory.');
} catch (e) {}

console.log('SEO Vault Database build complete!');


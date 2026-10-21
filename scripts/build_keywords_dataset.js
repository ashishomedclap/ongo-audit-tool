const fs = require('fs');
const path = require('path');

const csvDir = 'C:\\Users\\Ashish O\\.gemini\\antigravity-ide\\brain\\a5dbdec3-4b1d-49e2-9acd-e1f209d5ea7c\\scratch\\raw_csvs';
const targetFile = path.join(__dirname, '..', 'data', 'keywords_explorer.json');

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    
    if (c === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(field);
      field = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      row.push(field);
      field = '';
      if (row.length > 1 || row[0] !== '') {
        rows.push(row);
      }
      row = [];
    } else {
      field += c;
    }
  }
  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function cleanNumber(str) {
  if (!str) return 0;
  const cleaned = str.replace(/,/g, '').trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : Math.round(n * 100) / 100;
}

function cleanInt(str) {
  if (!str) return 0;
  const cleaned = str.replace(/,/g, '').trim();
  const n = parseInt(cleaned, 10);
  return isNaN(n) ? 0 : n;
}

function getBrandFromUrl(url) {
  try {
    const host = new URL(url).hostname.toLowerCase().replace('www.', '');
    if (host.includes('goodrx.com')) return 'GoodRx';
    if (host.includes('ro.co')) return 'Ro';
    if (host.includes('weightwatchers.com')) return 'WeightWatchers';
    if (host.includes('hims.com')) return 'Hims';
    if (host.includes('noom.com')) return 'Noom';
    if (host.includes('plushcare.com')) return 'PlushCare';
    if (host.includes('joinmochi.com')) return 'Join Mochi';
    if (host.includes('lifemd.com')) return 'LifeMD';
    if (host.includes('lemonaidhealth.com')) return 'Lemonaid Health';
    if (host.includes('joinfridays.com')) return 'Join Fridays';
    if (host.includes('brellohealth.com')) return 'Brello Health';
    return host;
  } catch(e) {
    return 'Other';
  }
}

function normalizeIntent(raw) {
  if (!raw) return 'informational';
  const l = raw.toLowerCase().trim();
  if (l.includes('transactional')) return 'transactional';
  if (l.includes('commercial')) return 'commercial';
  if (l.includes('navigational')) return 'navigational';
  return 'informational';
}

console.log('Reading Master file...');
const masterRows = parseCSV(fs.readFileSync(path.join(csvDir, 'Master___Primary_Keywords.csv'), 'utf-8'));

const recordMap = new Map();

for (let i = 10; i < masterRows.length; i++) {
  const r = masterRows[i];
  if (r.length < 10) continue;
  const kw = r[2].trim();
  const url = r[3].trim();
  if (!kw || !url) continue;

  const key = `${kw.toLowerCase()}|${url}`;
  const pos = cleanInt(r[4]);
  const vol = cleanInt(r[5]);
  const kd = cleanInt(r[6]);
  const traffic = cleanInt(r[7]);
  const rawIntent = r[8].trim();
  const opp = cleanNumber(r[9]);
  const brand = getBrandFromUrl(url);

  recordMap.set(key, {
    keyword: kw,
    url: url,
    competitor: brand,
    position: pos,
    volume: vol,
    kd: kd,
    traffic: traffic,
    intent: normalizeIntent(rawIntent),
    opportunityScore: opp
  });
}
console.log(`Master processed: ${recordMap.size} records.`);

const otherFiles = ['GoodRx.csv', 'Ro.csv', 'WeightWatchers.csv', 'LemonaidHealth.csv', 'JoinFridays.csv'];

for (const f of otherFiles) {
  const filePath = path.join(csvDir, f);
  if (!fs.existsSync(filePath)) continue;
  console.log(`Processing ${f}...`);
  const rows = parseCSV(fs.readFileSync(filePath, 'utf-8'));
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (r.length < 9) continue;
    const kw = r[1].trim();
    const url = r[2].trim();
    if (!kw || !url) continue;

    const key = `${kw.toLowerCase()}|${url}`;
    if (!recordMap.has(key)) {
      const pos = cleanInt(r[3]);
      const vol = cleanInt(r[4]);
      const kd = cleanInt(r[5]);
      const traffic = cleanInt(r[6]);
      const rawIntent = r[7].trim();
      const opp = cleanNumber(r[8]);
      const brand = getBrandFromUrl(url);

      recordMap.set(key, {
        keyword: kw,
        url: url,
        competitor: brand,
        position: pos,
        volume: vol,
        kd: kd,
        traffic: traffic,
        intent: normalizeIntent(rawIntent),
        opportunityScore: opp
      });
    }
  }
}

console.log(`Total unique records: ${recordMap.size}`);

// Sort initially by opportunityScore descending
const allRecords = Array.from(recordMap.values()).map((item, index) => ({
  id: index + 1,
  ...item
}));

allRecords.sort((a, b) => b.opportunityScore - a.opportunityScore);

// Re-assign 1-based sequential IDs based on default sort
allRecords.forEach((item, index) => {
  item.id = index + 1;
});

console.log(`Writing to ${targetFile}...`);
fs.writeFileSync(targetFile, JSON.stringify(allRecords), 'utf-8');
const mb = (fs.statSync(targetFile).size / 1024 / 1024).toFixed(2);
console.log(`Successfully written ${allRecords.length} records (${mb} MB).`);

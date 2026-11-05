const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data, headers: res.headers }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function run() {
  console.log('Fetching https://ongoweightloss.com/sitemap.xml ...');
  const res = await fetchUrl('https://ongoweightloss.com/sitemap.xml');
  const xml = res.body;

  const locMatches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());
  console.log(`Found ${locMatches.length} URLs in sitemap.xml:`);

  const existingPath = path.join(__dirname, '..', 'data', 'inventory', 'ongo_live_pages.json');
  let existing = { pages: [] };
  if (fs.existsSync(existingPath)) {
    existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
  }

  const existingUrls = new Set(existing.pages.map(p => p.url.trim()));
  const sitemapUrls = new Set(locMatches);

  const newUrls = locMatches.filter(u => !existingUrls.has(u));
  const removedUrls = [...existingUrls].filter(u => !sitemapUrls.has(u));

  console.log(`\nExisting in inventory: ${existing.pages.length} URLs`);
  console.log(`In live sitemap.xml: ${locMatches.length} URLs`);
  console.log(`New URLs in sitemap: ${newUrls.length}`, newUrls);
  console.log(`URLs in inventory not in sitemap: ${removedUrls.length}`, removedUrls);

  // Also check if any page links to other pages not in sitemap (e.g. crawl links on homepage, blog, services, locations)
  console.log('\nChecking for unindexed or linked pages on homepage and blog...');
  const homeRes = await fetchUrl('https://ongoweightloss.com/');
  const hrefMatches = [...homeRes.body.matchAll(/href=["'](\/[^"'#\s]*|https:\/\/ongoweightloss\.com\/[^"'#\s]*)["']/g)].map(m => m[1]);
  const discoveredInternal = new Set();
  for (const h of hrefMatches) {
    let clean = h;
    if (clean.startsWith('/')) clean = 'https://ongoweightloss.com' + clean;
    if (clean.startsWith('https://ongoweightloss.com')) {
      // remove trailing query
      clean = clean.split('?')[0];
      if (!clean.endsWith('/') && !clean.includes('.')) clean += '/';
      discoveredInternal.add(clean);
    }
  }

  const notInSitemap = [...discoveredInternal].filter(u => !sitemapUrls.has(u) && !u.includes('/_next/') && !u.includes('/api/'));
  console.log(`Discovered internal links on homepage: ${discoveredInternal.size}`);
  console.log(`Links on homepage NOT in sitemap.xml:`, notInSitemap);
}

run().catch(console.error);

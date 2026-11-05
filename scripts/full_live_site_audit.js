const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function fetchUrl(targetUrl) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(targetUrl);
      const client = urlObj.protocol === 'https:' ? https : http;
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: 12000
      };

      const req = client.request(options, (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let redirectUrl = res.headers.location;
          if (redirectUrl.startsWith('/')) {
            redirectUrl = `${urlObj.protocol}//${urlObj.host}${redirectUrl}`;
          }
          return fetchUrl(redirectUrl).then(resolve);
        }

        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 200,
            body,
            url: targetUrl
          });
        });
      });

      req.on('error', (err) => {
        resolve({ statusCode: 500, body: '', error: err.message, url: targetUrl });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ statusCode: 408, body: '', error: 'Timeout', url: targetUrl });
      });

      req.end();
    } catch (e) {
      resolve({ statusCode: 500, body: '', error: e.message, url: targetUrl });
    }
  });
}

function cleanText(text) {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

function extractPageMetadata(html, url) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? cleanText(titleMatch[1]) : '';

  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const description = metaDescMatch ? cleanText(metaDescMatch[1]) : '';

  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? cleanText(h1Match[1].replace(/<[^>]+>/g, '')) : '';

  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : url;

  // Extract images
  const imgMatches = [...html.matchAll(/<img[^>]+>/gi)];
  let totalImages = imgMatches.length;
  let missingAlt = 0;
  for (const img of imgMatches) {
    if (!/alt=["'][^"']*["']/i.test(img[0])) {
      missingAlt++;
    } else {
      const altValMatch = img[0].match(/alt=["']([^"']*)["']/i);
      if (!altValMatch || !altValMatch[1].trim()) {
        missingAlt++;
      }
    }
  }

  // Extract internal links
  const hrefMatches = [...html.matchAll(/href=["'](\/[^"'#\s]*|https:\/\/ongoweightloss\.com\/[^"'#\s]*)["']/gi)];
  const internalLinks = new Set();
  for (const m of hrefMatches) {
    let link = m[1];
    if (link.startsWith('/')) link = 'https://ongoweightloss.com' + link;
    link = link.split('?')[0];
    if (!link.endsWith('/') && !link.includes('.')) link += '/';
    if (!link.includes('/_next/') && !link.includes('/api/')) {
      internalLinks.add(link);
    }
  }

  // Category determination
  let category = 'Other';
  let intent = 'Informational';
  let priority = 'P2';

  const path = new URL(url).pathname;
  if (path === '/' || path === '') {
    category = 'Homepage / Core';
    intent = 'Commercial / Brand Authority';
    priority = 'P0';
  } else if (path.includes('/pricing')) {
    category = 'Pricing & Plans';
    intent = 'High Commercial Intent';
    priority = 'P0';
  } else if (path.includes('/services/glp-1') || path.includes('/semaglutide') || path.includes('/tirzepatide')) {
    category = 'Medication & Clinical';
    intent = 'Commercial / Treatment Research';
    priority = 'P0';
  } else if (path.includes('/medical-team') || path.includes('/editorial-team')) {
    category = 'Medical Team & E-E-A-T';
    intent = 'Trust & Credibility';
    priority = 'P1';
  } else if (path.includes('/locations')) {
    category = 'Local Telehealth Coverage';
    intent = 'Local Commercial';
    priority = 'P1';
  } else if (path.includes('/blog')) {
    category = 'Blog & Education';
    intent = 'Informational Search';
    priority = 'P1';
  } else if (path.includes('/resources') || path.includes('/tools')) {
    category = 'Clinical Resources & Tools';
    intent = 'Educational & Interactive';
    priority = 'P1';
  } else if (path.includes('/policies')) {
    category = 'Legal & Regulatory Policies';
    intent = 'Compliance & Transparency';
    priority = 'P2';
  } else if (path.includes('/about') || path.includes('/contact') || path.includes('/faq') || path.includes('/how-it-works')) {
    category = 'Company & Support';
    intent = 'Trust & Customer Assistance';
    priority = 'P1';
  }

  // Length evaluations
  const titleLength = title.length;
  let titleStatus = 'optimal';
  if (titleLength === 0) titleStatus = 'missing';
  else if (titleLength < 40) titleStatus = 'too_short';
  else if (titleLength > 65) titleStatus = 'too_long';

  const descLength = description.length;
  let descStatus = 'optimal';
  if (descLength === 0) descStatus = 'missing';
  else if (descLength < 110) descStatus = 'too_short';
  else if (descLength > 165) descStatus = 'too_long';

  // Smart natural query recommendation
  const pathParts = path.split('/').filter(Boolean);
  const leaf = pathParts[pathParts.length - 1] || 'weight-loss';
  const humanReadableSlug = leaf.replace(/-/g, ' ');

  const recommendedTitle = `${humanReadableSlug.charAt(0).toUpperCase() + humanReadableSlug.slice(1)} doctor supervised online guide`;
  const recommendedDescription = `Comprehensive clinical guide on ${humanReadableSlug} from Ongo Weight Loss board-certified physicians with flat rate pricing and nationwide delivery.`;

  return {
    url,
    path,
    statusCode: 200,
    title,
    title_length: titleLength,
    title_status: titleStatus,
    description,
    description_length: descLength,
    description_status: descStatus,
    h1,
    canonical,
    category,
    intent,
    priority,
    totalImages,
    missingAlt,
    internalLinksCount: internalLinks.size,
    internalLinks: Array.from(internalLinks),
    recommended_title: recommendedTitle,
    recommended_description: recommendedDescription,
    primary_keyword: humanReadableSlug,
    intent_gap: `Natural search query matching patients searching for ${humanReadableSlug} without brand symbols`,
    ctr_hook: 'Board-certified MD consultation with home medication shipping'
  };
}

async function auditSite() {
  console.log('=== Ongo Full Website Live Site Scanner ===');
  console.log('1. Fetching https://ongoweightloss.com/sitemap.xml ...');

  const sitemapRes = await fetchUrl('https://ongoweightloss.com/sitemap.xml');
  const xml = sitemapRes.body;
  const sitemapUrls = [...new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim()))];

  console.log(`Discovered ${sitemapUrls.length} URLs in sitemap.xml.`);

  // Load existing inventory
  const inventoryPath = path.join(__dirname, '..', 'data', 'inventory', 'ongo_live_pages.json');
  let oldInventory = { pages: [] };
  if (fs.existsSync(inventoryPath)) {
    try {
      oldInventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
    } catch(e) {}
  }

  const oldUrls = new Set(oldInventory.pages.map(p => p.url));
  console.log(`Previous database had ${oldInventory.pages.length} URLs.`);

  // Scrape each sitemap URL in concurrent batches
  const auditedPages = [];
  const allDiscoveredLinks = new Set();
  const concurrency = 4;

  console.log(`\n2. Auditing all ${sitemapUrls.length} pages live...`);

  for (let i = 0; i < sitemapUrls.length; i += concurrency) {
    const chunk = sitemapUrls.slice(i, i + concurrency);
    const results = await Promise.all(chunk.map(async (url) => {
      process.stdout.write(`Fetching [${url}] ... `);
      const res = await fetchUrl(url);
      console.log(`Status: ${res.statusCode}`);
      const meta = extractPageMetadata(res.body, url);
      meta.status_code = res.statusCode;
      if (meta.internalLinks) {
        meta.internalLinks.forEach(l => allDiscoveredLinks.add(l));
      }
      return meta;
    }));
    auditedPages.push(...results);
  }

  // Check if any discovered internal links are valid pages not in sitemap
  console.log('\n3. Analyzing recursively discovered internal links for any unindexed pages...');
  const excludedPatterns = ['/_next/', '/api/', '/images/', '/icon', '.svg', '.webp', '.jpg', '.png', '.css', '.js'];
  const candidates = [...allDiscoveredLinks].filter(link => {
    if (sitemapUrls.includes(link)) return false;
    for (const pat of excludedPatterns) {
      if (link.includes(pat)) return false;
    }
    return true;
  });

  console.log(`Found ${candidates.length} candidate internal links outside sitemap:`, candidates);

  for (const candUrl of candidates) {
    console.log(`Auditing candidate page: ${candUrl} ...`);
    const res = await fetchUrl(candUrl);
    if (res.statusCode === 200 && res.body.includes('<html')) {
      console.log(`  -> Valid live page! Adding to database.`);
      const meta = extractPageMetadata(res.body, candUrl);
      meta.status_code = res.statusCode;
      meta.priority = 'P2 (Unindexed / Discovery)';
      auditedPages.push(meta);
    } else {
      console.log(`  -> Skipped (status ${res.statusCode} or non-HTML)`);
    }
  }

  // Assign sequential IDs
  auditedPages.sort((a, b) => a.url.localeCompare(b.url));
  const finalPages = auditedPages.map((page, index) => ({
    id: index + 1,
    ...page
  }));

  const newPagesFound = finalPages.filter(p => !oldUrls.has(p.url));
  const removedPages = [...oldUrls].filter(u => !finalPages.some(p => p.url === u));

  console.log('\n=== Scan & Audit Results ===');
  console.log(`Total live pages in updated database: ${finalPages.length}`);
  console.log(`Newly identified pages: ${newPagesFound.length}`);
  newPagesFound.forEach(p => console.log(`  + [NEW] ${p.url} ("${p.title}")`));
  console.log(`Changed / Retired URLs: ${removedPages.length}`);
  removedPages.forEach(u => console.log(`  - [OLD] ${u}`));

  // Write updated inventory
  const updatedData = {
    last_updated: new Date().toISOString(),
    total_pages: finalPages.length,
    source: `https://ongoweightloss.com/sitemap.xml (Audited ${finalPages.length} Live Pages on ${new Date().toLocaleDateString()})`,
    pages: finalPages
  };

  fs.writeFileSync(inventoryPath, JSON.stringify(updatedData, null, 2), 'utf8');
  console.log(`\nSuccessfully updated: ${inventoryPath}`);
  return updatedData;
}

auditSite().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});


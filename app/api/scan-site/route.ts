import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function cleanText(text: string): string {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

async function fetchPage(targetUrl: string, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      next: { revalidate: 0 }
    });
    clearTimeout(timeout);
    const body = await res.text();
    return {
      statusCode: res.status,
      body,
      url: targetUrl
    };
  } catch (err: any) {
    clearTimeout(timeout);
    return {
      statusCode: 500,
      body: '',
      error: err.message || 'Fetch failed',
      url: targetUrl
    };
  }
}

function parsePageMetadata(html: string, url: string) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? cleanText(titleMatch[1]) : '';

  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const description = metaDescMatch ? cleanText(metaDescMatch[1]) : '';

  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? cleanText(h1Match[1].replace(/<[^>]+>/g, '')) : '';

  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : url;

  // Images audit
  const imgMatches = [...html.matchAll(/<img[^>]+>/gi)];
  const totalImages = imgMatches.length;
  let missingAlt = 0;
  let emptyAlt = 0;
  let suspiciousAlt = 0;
  const imageDetails: any[] = [];

  for (const img of imgMatches) {
    const srcMatch = img[0].match(/src=["']([^"']*)["']/i);
    const altMatch = img[0].match(/alt=["']([^"']*)["']/i);
    const src = srcMatch ? srcMatch[1] : '';
    const hasAltAttr = /alt=["'][^"']*["']/i.test(img[0]);
    const altText = altMatch ? cleanText(altMatch[1]) : '';

    let status = 'valid';
    let issue = '';

    if (!hasAltAttr) {
      missingAlt++;
      status = 'missing';
      issue = 'Missing alt attribute';
    } else if (altText === '') {
      emptyAlt++;
      status = 'empty';
      issue = 'Empty alt=""';
    } else if (/(^img_\d+|^dsc_\d+|screenshot|untitled|image\d*|photo\d*|\.jpg|\.png|\.webp)/i.test(altText)) {
      suspiciousAlt++;
      status = 'suspicious';
      issue = 'Generic placeholder or filename used as alt';
    }

    imageDetails.push({
      src,
      alt: altText,
      status,
      issue,
      snippet: img[0].slice(0, 140)
    });
  }

  // Links
  const hrefMatches = [...html.matchAll(/href=["'](\/[^"'#\s]*|https:\/\/ongoweightloss\.com\/[^"'#\s]*)["']/gi)];
  const internalLinks = new Set<string>();
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

  let pathStr = '/';
  try {
    pathStr = new URL(url).pathname;
  } catch (e) {
    pathStr = url;
  }

  if (pathStr === '/' || pathStr === '') {
    category = 'Homepage / Core';
    intent = 'Commercial / Brand Authority';
    priority = 'P0';
  } else if (pathStr.includes('/pricing')) {
    category = 'Pricing & Plans';
    intent = 'High Commercial Intent';
    priority = 'P0';
  } else if (pathStr.includes('/services/glp-1') || pathStr.includes('/semaglutide') || pathStr.includes('/tirzepatide')) {
    category = 'Medication & Clinical';
    intent = 'Commercial / Treatment Research';
    priority = 'P0';
  } else if (pathStr.includes('/medical-team') || pathStr.includes('/editorial-team')) {
    category = 'Medical Team & E-E-A-T';
    intent = 'Trust & Credibility';
    priority = 'P1';
  } else if (pathStr.includes('/locations')) {
    category = 'Local Telehealth Coverage';
    intent = 'Local Commercial';
    priority = 'P1';
  } else if (pathStr.includes('/blog')) {
    category = 'Blog & Education';
    intent = 'Informational Search';
    priority = 'P1';
  } else if (pathStr.includes('/resources') || pathStr.includes('/tools')) {
    category = 'Clinical Resources & Tools';
    intent = 'Educational & Interactive';
    priority = 'P1';
  } else if (pathStr.includes('/policies')) {
    category = 'Legal & Regulatory Policies';
    intent = 'Compliance & Transparency';
    priority = 'P2';
  } else if (pathStr.includes('/about') || pathStr.includes('/contact') || pathStr.includes('/faq') || pathStr.includes('/how-it-works')) {
    category = 'Company & Support';
    intent = 'Trust & Customer Assistance';
    priority = 'P1';
  }

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

  const pathParts = pathStr.split('/').filter(Boolean);
  const leaf = pathParts[pathParts.length - 1] || 'weight-loss';
  const humanReadableSlug = leaf.replace(/-/g, ' ');

  return {
    url,
    path: pathStr,
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
    emptyAlt,
    suspiciousAlt,
    imageDetails: imageDetails.slice(0, 50),
    internalLinksCount: internalLinks.size,
    internalLinks: Array.from(internalLinks),
    recommended_title: `${humanReadableSlug.charAt(0).toUpperCase() + humanReadableSlug.slice(1)} doctor supervised online guide`,
    recommended_description: `Comprehensive clinical guide on ${humanReadableSlug} from Ongo Weight Loss board-certified physicians with flat rate pricing and nationwide delivery.`,
    primary_keyword: humanReadableSlug,
    intent_gap: `Natural query matching patients searching for ${humanReadableSlug}`,
    ctr_hook: 'Board-certified MD consultation with home medication shipping'
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'scan-single', url, sitemapUrl = 'https://ongoweightloss.com/sitemap.xml' } = body;

    // Action 1: Scan single custom URL (User input custom URL on any tool)
    if (action === 'scan-single') {
      if (!url || typeof url !== 'string') {
        return NextResponse.json({ success: false, error: 'Target URL is required' }, { status: 400 });
      }

      let target = url.trim();
      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = 'https://' + target;
      }

      const res = await fetchPage(target);
      if (res.statusCode >= 400 || !res.body) {
        return NextResponse.json({
          success: false,
          error: `Failed to fetch page: HTTP status ${res.statusCode} (${(res as any).error || 'No content'})`,
          url: target,
          statusCode: res.statusCode
        }, { status: 200 });
      }

      const pageMeta = parsePageMetadata(res.body, target);
      return NextResponse.json({
        success: true,
        action: 'scan-single',
        page: {
          ...pageMeta,
          statusCode: res.statusCode
        }
      });
    }

    // Action 2: Master Site Scan across sitemap.xml and linked pages
    if (action === 'scan-all') {
      const sitemapRes = await fetchPage(sitemapUrl);
      if (!sitemapRes.body) {
        return NextResponse.json({ success: false, error: 'Failed to fetch sitemap.xml' }, { status: 500 });
      }

      const sitemapUrls = [...new Set([...sitemapRes.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim()))];
      const inventoryPath = path.join(process.cwd(), 'data', 'inventory', 'ongo_live_pages.json');

      let oldUrls = new Set<string>();
      if (fs.existsSync(inventoryPath)) {
        try {
          const old = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
          oldUrls = new Set(old.pages.map((p: any) => p.url));
        } catch (e) {}
      }

      // Batch fetch sitemap pages
      const auditedPages: any[] = [];
      const allDiscoveredLinks = new Set<string>();
      const batchSize = 5;

      for (let i = 0; i < sitemapUrls.length; i += batchSize) {
        const batch = sitemapUrls.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(async (u) => {
          const res = await fetchPage(u);
          const meta = parsePageMetadata(res.body, u);
          (meta as any).status_code = res.statusCode;
          meta.internalLinks.forEach(l => allDiscoveredLinks.add(l));
          return meta;
        }));
        auditedPages.push(...batchResults);
      }

      // Check candidate discovered internal links
      const excluded = ['/_next/', '/api/', '/images/', '/icon', '.svg', '.webp', '.jpg', '.png', '.css', '.js'];
      const candidates = [...allDiscoveredLinks].filter(link => {
        if (sitemapUrls.includes(link)) return false;
        for (const pat of excluded) {
          if (link.includes(pat)) return false;
        }
        return true;
      });

      for (const candUrl of candidates) {
        const res = await fetchPage(candUrl);
        if (res.statusCode === 200 && res.body.includes('<html')) {
          const meta = parsePageMetadata(res.body, candUrl);
          (meta as any).status_code = res.statusCode;
          meta.priority = 'P2 (Unindexed / Discovery)';
          auditedPages.push(meta);
        }
      }

      auditedPages.sort((a, b) => a.url.localeCompare(b.url));
      const finalPages = auditedPages.map((page, index) => ({
        id: index + 1,
        ...page
      }));

      const newPagesFound = finalPages.filter(p => !oldUrls.has(p.url));

      // Save to disk
      const updatedData = {
        last_updated: new Date().toISOString(),
        total_pages: finalPages.length,
        source: `${sitemapUrl} (Audited ${finalPages.length} Live Pages on ${new Date().toLocaleDateString()})`,
        pages: finalPages
      };

      try {
        fs.writeFileSync(inventoryPath, JSON.stringify(updatedData, null, 2), 'utf8');
      } catch (e) {}

      return NextResponse.json({
        success: true,
        action: 'scan-all',
        totalPages: finalPages.length,
        newPagesCount: newPagesFound.length,
        newPages: newPagesFound.map(p => ({ url: p.url, title: p.title })),
        data: updatedData
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Internal error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const inventoryPath = path.join(process.cwd(), 'data', 'inventory', 'ongo_live_pages.json');
    if (fs.existsSync(inventoryPath)) {
      const data = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
      return NextResponse.json({
        success: true,
        totalPages: data.total_pages || data.pages?.length || 0,
        lastUpdated: data.last_updated,
        source: data.source
      });
    }
    return NextResponse.json({ success: false, error: 'Inventory not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from 'next/server';

export interface MetaAuditResult {
  url: string;
  finalUrl: string;
  statusCode: number;
  responseTimeMs: number;
  title: string;
  titleLength: number;
  titleStatus: 'optimal' | 'warning' | 'critical';
  titleRecommendation: string;
  description: string;
  descriptionLength: number;
  descriptionStatus: 'optimal' | 'warning' | 'critical';
  descriptionRecommendation: string;
  canonical: string;
  hasCanonical: boolean;
  robots: string;
  isIndexable: boolean;
  h1Tags: string[];
  h1Count: number;
  h2Count: number;
  openGraph: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    siteName?: string;
    type?: string;
  };
  twitterCard: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  score: number;
  recommendations: string[];
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid URL is required' }, { status: 400 });
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    let res: Response;
    try {
      res = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (Ongo-Meta-Auditor/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        signal: controller.signal,
        redirect: 'follow'
      });
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const errMsg = err instanceof Error ? err.message : 'Failed to connect';
      return NextResponse.json({
        success: false,
        error: `Could not reach ${targetUrl}: ${errMsg}`
      }, { status: 502 });
    }
    clearTimeout(timeoutId);

    const responseTimeMs = Date.now() - startTime;
    const html = await res.text();

    const audit = parseHtmlMetadata(html, targetUrl, res.url, res.status, responseTimeMs);

    return NextResponse.json({
      success: true,
      audit
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

function parseHtmlMetadata(html: string, originalUrl: string, finalUrl: string, statusCode: number, responseTimeMs: number): MetaAuditResult {
  // Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const rawTitle = titleMatch ? cleanText(titleMatch[1]) : '';
  const titleLength = rawTitle.length;

  // Meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                    html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  const rawDesc = descMatch ? cleanText(descMatch[1]) : '';
  const descriptionLength = rawDesc.length;

  // Canonical
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
  const canonical = canonicalMatch ? canonicalMatch[1] : '';

  // Robots
  const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  const robots = robotsMatch ? robotsMatch[1].toLowerCase() : 'all, index, follow';
  const isIndexable = !robots.includes('noindex');

  // OpenGraph
  const ogTitle = getMetaTag(html, 'og:title');
  const ogDesc = getMetaTag(html, 'og:description');
  const ogImage = getMetaTag(html, 'og:image');
  const ogUrl = getMetaTag(html, 'og:url');
  const ogSiteName = getMetaTag(html, 'og:site_name');
  const ogType = getMetaTag(html, 'og:type');

  // Twitter
  const twitterCard = getMetaTag(html, 'twitter:card');
  const twitterTitle = getMetaTag(html, 'twitter:title');
  const twitterDesc = getMetaTag(html, 'twitter:description');
  const twitterImage = getMetaTag(html, 'twitter:image');

  // H1 Tags
  const h1Matches = Array.from(html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi));
  const h1Tags = h1Matches.map(m => cleanText(m[1])).filter(Boolean);

  // H2 Tags count
  const h2Matches = Array.from(html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi));
  const h2Count = h2Matches.length;

  // Title Status & Recommendation
  let titleStatus: 'optimal' | 'warning' | 'critical' = 'optimal';
  let titleRecommendation = 'Good length. Stays within standard Google search preview limits (50–60 chars).';
  if (!rawTitle) {
    titleStatus = 'critical';
    titleRecommendation = 'CRITICAL: Missing <title> tag. Add a primary keyword and brand name.';
  } else if (titleLength < 35) {
    titleStatus = 'warning';
    titleRecommendation = `Short title (${titleLength} chars). Expand to 50–60 chars with high-intent keywords like "Compounded GLP-1" or "Doctor-Led".`;
  } else if (titleLength > 65) {
    titleStatus = 'warning';
    titleRecommendation = `Long title (${titleLength} chars). Likely to be truncated with ellipsis on Google Mobile/Desktop search results.`;
  }

  // Description Status & Recommendation
  let descriptionStatus: 'optimal' | 'warning' | 'critical' = 'optimal';
  let descriptionRecommendation = 'Optimal length. Provides compelling snippet between 140–160 chars.';
  if (!rawDesc) {
    descriptionStatus = 'critical';
    descriptionRecommendation = 'CRITICAL: Missing meta description. Search engines will automatically generate uncontrolled excerpts.';
  } else if (descriptionLength < 100) {
    descriptionStatus = 'warning';
    descriptionRecommendation = `Short description (${descriptionLength} chars). Expand to 140–160 chars to cover clinical credentials, benefits, and call to action.`;
  } else if (descriptionLength > 165) {
    descriptionStatus = 'warning';
    descriptionRecommendation = `Long description (${descriptionLength} chars). May get cut off after 155–160 characters in Google SERPs.`;
  }

  // Calculate Overall Score (0-100)
  let score = 100;
  const recommendations: string[] = [];

  if (!rawTitle) {
    score -= 30;
    recommendations.push('Add an optimized <title> tag containing target medical weight loss keywords.');
  } else if (titleLength < 35 || titleLength > 65) {
    score -= 10;
    recommendations.push(`Tune title length (current: ${titleLength} chars, recommended: 50–60 chars).`);
  }

  if (!rawDesc) {
    score -= 25;
    recommendations.push('Add a compelling <meta name="description"> tag (140–160 chars).');
  } else if (descriptionLength < 100 || descriptionLength > 165) {
    score -= 8;
    recommendations.push(`Refine meta description length (current: ${descriptionLength} chars, ideal: 140–160 chars).`);
  }

  if (h1Tags.length === 0) {
    score -= 15;
    recommendations.push('No <h1> heading found on the page. Add a single primary <h1> heading.');
  } else if (h1Tags.length > 1) {
    score -= 5;
    recommendations.push(`Multiple (${h1Tags.length}) <h1> headings detected. Standard SEO practice recommends exactly one main <h1>.`);
  }

  if (!canonical) {
    score -= 8;
    recommendations.push('Missing rel="canonical" link tag. Essential to prevent duplicate content dilution.');
  }

  if (!ogTitle || !ogImage) {
    score -= 10;
    recommendations.push('Incomplete OpenGraph tags. Ensure og:title, og:description, and og:image are set for social/messaging previews.');
  }

  if (!twitterCard) {
    score -= 5;
    recommendations.push('Missing twitter:card meta tag. Add summary_large_image for optimal social sharing.');
  }

  if (score < 0) score = 0;

  return {
    url: originalUrl,
    finalUrl,
    statusCode,
    responseTimeMs,
    title: rawTitle,
    titleLength,
    titleStatus,
    titleRecommendation,
    description: rawDesc,
    descriptionLength,
    descriptionStatus,
    descriptionRecommendation,
    canonical,
    hasCanonical: !!canonical,
    robots,
    isIndexable,
    h1Tags,
    h1Count: h1Tags.length,
    h2Count,
    openGraph: {
      title: ogTitle,
      description: ogDesc,
      image: ogImage,
      url: ogUrl,
      siteName: ogSiteName,
      type: ogType
    },
    twitterCard: {
      card: twitterCard,
      title: twitterTitle,
      description: twitterDesc,
      image: twitterImage
    },
    score: Math.max(0, score),
    recommendations
  };
}

function getMetaTag(html: string, propertyName: string): string | undefined {
  const propMatch = html.match(new RegExp(`<meta[^>]*property=["']${propertyName}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i')) ||
                    html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${propertyName}["'][^>]*>`, 'i')) ||
                    html.match(new RegExp(`<meta[^>]*name=["']${propertyName}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i')) ||
                    html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*name=["']${propertyName}["'][^>]*>`, 'i'));
  return propMatch ? cleanText(propMatch[1]) : undefined;
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

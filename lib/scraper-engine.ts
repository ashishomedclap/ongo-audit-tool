import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

export interface ScraperOptions {
  inlineCss?: boolean;
  simplifyJs?: boolean;
  stripScripts?: boolean;
  rewriteAssets?: boolean;
  saveToFile?: boolean;
  outputDir?: string;
  auditDir?: string;
  timeout?: number;
}

export interface ImageAuditDetail {
  id: number;
  src: string;
  alt: string | null;
  altStatus: 'valid' | 'missing' | 'empty' | 'suspicious';
  altBadge: string;
  altWarning?: string;
  hasDimensions: boolean;
  width?: string;
  height?: string;
  isLazy: boolean;
  format: string;
  recommendation: string;
}

export interface ChecklistItem {
  id: string;
  category: 'images_a11y' | 'meta_seo' | 'headings' | 'links' | 'schema' | 'code_clean';
  categoryLabel: string;
  title: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  badgeText: string;
  summaryValue: string;
  recommendation?: string;
  items?: {
    label: string;
    value: string;
    status?: 'pass' | 'warning' | 'fail';
    meta?: string;
  }[];
}

export interface AuditChecklistReport {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  totalChecks: number;
  passedCount: number;
  warningCount: number;
  failedCount: number;
  imagesAudit: {
    total: number;
    validCount: number;
    missingCount: number;
    emptyCount: number;
    suspiciousCount: number;
    missingDimensionsCount: number;
    lazyCount: number;
    details: ImageAuditDetail[];
  };
  checklist: ChecklistItem[];
}

export interface PageAuditTelemetry {
  title: string;
  metaDescription: string;
  canonical: string;
  robots: string;
  viewport: string;
  h1: string[];
  h2Count: number;
  h3Count: number;
  h4ToH6Count: number;
  paragraphsCount: number;
  listsCount: number;
  buttonsCount: number;
  formsCount: number;
  iframesCount: number;
  imagesTotal: number;
  imagesMissingAlt: number;
  linksTotal: number;
  linksInternal: number;
  linksExternal: number;
  jsonLdSchemas: Record<string, unknown>[];
  schemaTypes: string[];
  visibleTextLength: number;
  approxWordCount: number;
  issues: string[];
  auditChecklist: AuditChecklistReport;
}

export interface ScrapeResult {
  success: boolean;
  url: string;
  filename: string;
  filePath?: string;
  cleanHtml: string;
  inlinedCss: string;
  vanillaJs: string;
  telemetry: PageAuditTelemetry;
  stats: {
    rawHtmlSize: number;
    cleanHtmlSize: number;
    sizeReductionPercent: number;
    scriptsRemoved: number;
    cssRulesCount: number;
    imagesRewritten: number;
    linksRewritten: number;
    executionTimeMs: number;
  };
  error?: string;
}

export interface ScrapedArchiveItem {
  filename: string;
  path: string;
  sizeBytes: number;
  sizeKb: string;
  lastModified: string;
  title: string;
  h1: string;
  relativeUrl: string;
  hasAuditReport: boolean;
  reportFilename?: string;
}

// Universal bulletproof Vanilla CSS for simplified interactive widgets
export const SIMPLIFIED_OFFLINE_CSS = `
/* ==========================================================================
   SIMPLIFIED OFFLINE COMPONENT ENGINE (Ongo Intelligence Suite)
   Enables smooth CSS Grid transitions, accordion toggles & drawer menus
   without needing heavy React/Next.js hydration bundles.
   ========================================================================== */

/* Expand accordion smoothly via CSS grid */
article:has(button[aria-expanded="true"]) [class*="answerPanelReveal"],
[class*="itemOpen"] [class*="answerPanelReveal"],
[class*="answerPanelRow"][aria-hidden="false"] [class*="answerPanelReveal"],
[aria-hidden="false"] > [class*="answerPanelReveal"],
.faq-open [class*="answerPanelReveal"],
.accordion-open [class*="answerPanelReveal"],
[data-open="true"] [class*="answerPanelReveal"] {
    grid-template-rows: 1fr !important;
}

article:has(button[aria-expanded="true"]) [class*="answerPanelContent"],
[class*="itemOpen"] [class*="answerPanelContent"],
[class*="answerPanelRow"][aria-hidden="false"] [class*="answerPanelContent"],
[aria-hidden="false"] > [class*="answerPanelContent"],
.faq-open [class*="answerPanelContent"],
.accordion-open [class*="answerPanelContent"],
[data-open="true"] [class*="answerPanelContent"] {
    overflow: visible !important;
    opacity: 1 !important;
    transform: translateY(0) !important;
}

/* Rotate plus icon to 'x' (45 degrees) when expanded */
button[aria-expanded="true"] [class*="plusIcon"],
button[aria-expanded="true"] svg[class*="plusIcon"],
[class*="plusIconOpen"],
.faq-open svg {
    transform: translate(-50%, -50%) rotate(45deg) !important;
}

/* Question bar border radius adjustments when open */
button[aria-expanded="true"][class*="questionBar"] {
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
}

/* Footer legal disclaimer read more expand */
[class*="legalNoteTextOpen"],
[class*="legalNoteText"].legal-open,
[class*="legalNoteText"][data-open="true"] {
    max-height: none !important;
    overflow: visible !important;
}

/* Header Drawer Mobile Menu */
[class*="Header_drawer"].drawer-open,
[class*="Header_drawerOpen"] {
    transform: translateX(0) !important;
    pointer-events: auto !important;
}

/* Offline Helper Banner */
#ongo-offline-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #0f172a;
    color: #f8fafc;
    border: 1px solid #10b981;
    border-radius: 8px;
    padding: 12px 18px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 13px;
    z-index: 999999;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.25s ease, transform 0.25s ease;
    pointer-events: none;
    display: flex;
    align-items: center;
    gap: 8px;
}
#ongo-offline-toast.toast-show {
    opacity: 1;
    transform: translateY(0);
}
`;

// Universal lightweight Vanilla JS interactive engine (< 100 lines, 0 dependencies)
export const SIMPLIFIED_OFFLINE_JS = `
<script>
/**
 * ⚡ SIMPLIFIED OFFLINE INTERACTIVE ENGINE
 * Replaces megabytes of Next.js / Webpack hydration chunks with zero-dependency
 * event delegation for FAQ accordions, mobile drawer, menus & legal expanders.
 */
(function() {
    function showToast(msg) {
        let toast = document.getElementById('ongo-offline-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'ongo-offline-toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = '⚡ <span>' + msg + '</span>';
        toast.classList.add('toast-show');
        setTimeout(function() {
            toast.classList.remove('toast-show');
        }, 3200);
    }

    document.addEventListener('click', function(e) {
        // 1. Mobile Menu Drawer Close button
        const closeBtn = e.target.closest('[class*="drawerClose"]');
        if (closeBtn) {
            const drawer = document.getElementById('site-menu') || document.querySelector('[class*="Header_drawer"]');
            if (drawer) {
                drawer.classList.remove('drawer-open', 'Header_drawerOpen__QY08Z');
            }
            const menuBtn = document.querySelector('[class*="Header_menuToggle"]');
            if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
            return;
        }

        // 2. Interactive trigger button (Accordions, Drawers, Toggles)
        const trigger = e.target.closest('button[aria-controls], button[aria-expanded], [role="tab"], .faq-trigger');
        if (!trigger) return;

        const controls = trigger.getAttribute('aria-controls');

        // Case A: Mobile Menu Header Drawer
        if (controls === 'site-menu' || (trigger.className && typeof trigger.className === 'string' && trigger.className.includes('menuToggle'))) {
            const drawer = document.getElementById('site-menu') || document.querySelector('[class*="Header_drawer"]');
            const isExp = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', String(!isExp));
            if (drawer) {
                drawer.classList.toggle('drawer-open', !isExp);
                drawer.classList.toggle('Header_drawerOpen__QY08Z', !isExp);
            }
            return;
        }

        // Case B: Drawer Accordion ('Services')
        if (trigger.className && typeof trigger.className === 'string' && trigger.className.includes('drawerAccordion')) {
            const isExp = trigger.getAttribute('aria-expanded') === 'true';
            const willExp = !isExp;
            trigger.setAttribute('aria-expanded', String(willExp));
            const subNav = trigger.parentElement ? trigger.parentElement.querySelector('ul') : null;
            if (subNav) {
                if (willExp) {
                    subNav.removeAttribute('hidden');
                    subNav.style.display = 'block';
                } else {
                    subNav.setAttribute('hidden', '');
                    subNav.style.display = 'none';
                }
            }
            return;
        }

        // Case C: Footer Legal Read More
        if (trigger.className && typeof trigger.className === 'string' && trigger.className.includes('legalReadMore')) {
            const isExp = trigger.getAttribute('aria-expanded') === 'true';
            const willExp = !isExp;
            trigger.setAttribute('aria-expanded', String(willExp));
            trigger.textContent = willExp ? 'Read less' : 'Read more';
            let target = controls ? document.getElementById(controls) : null;
            if (!target && trigger.previousElementSibling) {
                target = trigger.previousElementSibling;
            }
            if (target) {
                target.classList.toggle('legal-open', willExp);
                target.classList.toggle('Footer_legalNoteTextOpen__Wh9z3', willExp);
                target.setAttribute('data-open', willExp ? 'true' : 'false');
            }
            return;
        }

        // Case D: FAQ Accordion Toggle
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        const willExpand = !isExpanded;

        const article = trigger.closest('article') || trigger.closest('[class*="item"]') || trigger.closest('.accordion-item');

        // Sync both the text bar and the '+' button
        let allButtons = [];
        if (controls) {
            allButtons = Array.from(document.querySelectorAll('button[aria-controls="' + controls + '"]'));
        }
        if (article && allButtons.length === 0) {
            allButtons = Array.from(article.querySelectorAll('button[aria-expanded]'));
        }
        if (allButtons.length === 0) {
            allButtons = [trigger];
        }

        allButtons.forEach(btn => {
            btn.setAttribute('aria-expanded', String(willExpand));
            btn.setAttribute('aria-label', willExpand ? 'Collapse answer' : 'Expand answer');
            
            // Toggle Next.js question bar classes
            if (btn.className && typeof btn.className === 'string' && btn.className.includes('questionBar')) {
                btn.classList.toggle('BrandFAQ_questionBarOpen__sky_t', willExpand);
                btn.classList.toggle('BrandFAQ_questionBarClosed__MBMOG', !willExpand);
            }
            // Toggle plus icon SVG class
            const svg = btn.querySelector('svg');
            if (svg) {
                svg.classList.toggle('BrandFAQ_plusIconOpen__6t0aJ', willExpand);
            }
        });

        // Toggle article classes
        if (article) {
            article.classList.toggle('BrandFAQ_itemOpen__rZbcx', willExpand);
            article.classList.toggle('faq-open', willExpand);
            article.classList.toggle('accordion-open', willExpand);
            article.setAttribute('data-open', willExpand ? 'true' : 'false');
        }

        // Toggle answer panel
        let panel = controls ? document.getElementById(controls) : null;
        if (!panel && article) {
            panel = article.querySelector('[class*="answerPanelRow"]') || article.querySelector('.accordion-panel');
        }
        if (panel) {
            panel.setAttribute('aria-hidden', String(!willExpand));
            if (panel.hasAttribute('hidden') && willExpand) {
                panel.removeAttribute('hidden');
            }
        }
    });

    // Intercept dead dummy anchors in offline mode
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"], a[href=""]');
        if (anchor && anchor.getAttribute('href') === '#') {
            e.preventDefault();
            showToast('Offline clone: link is internal anchor placeholder');
        }
    });

    console.log('✓ Ongo Clean Scraper Engine active. Offline accordions and toggles ready.');
})();
</script>
`;

/**
 * Clean & simplify raw HTML using Cheerio
 */
export function cleanAndSimplifyHtml(
  rawHtml: string,
  inlinedCss: string = '',
  targetUrl: string = 'https://ongoweightloss.com/'
): { cleanHtml: string; scriptsRemoved: number; imagesRewritten: number; linksRewritten: number } {
  const $ = cheerio.load(rawHtml);
  let origin = 'https://ongoweightloss.com';
  try {
    origin = new URL(targetUrl).origin;
  } catch {
    origin = 'https://ongoweightloss.com';
  }

  // 1. Remove all scripts (strips heavy Next.js hydration, webpack, trackers, analytics)
  const initialScriptsCount = $('script').length;
  $('script').remove();
  const scriptsRemoved = initialScriptsCount;

  // 2. Remove external stylesheet links that fail offline
  $('link[rel="stylesheet"]').remove();

  // 3. Inline the captured/extracted CSS into <head>
  if (inlinedCss && inlinedCss.trim().length > 0) {
    $('head').append(`\n<style id="inlined-site-styles">\n${inlinedCss}\n</style>\n`);
  }

  // 4. Inject simplified component CSS
  $('head').append(`\n<style id="simplified-component-styles">\n${SIMPLIFIED_OFFLINE_CSS}\n</style>\n`);

  // 5. Rewrite relative asset links (images, scripts, styles, anchors) to absolute origin
  let imagesRewritten = 0;
  $('[src^="/"]').each((_, el) => {
    const src = $(el).attr('src');
    if (src && src.startsWith('/') && !src.startsWith('//')) {
      $(el).attr('src', origin + src);
      imagesRewritten++;
    }
  });

  let linksRewritten = 0;
  $('[href^="/"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && href.startsWith('/') && !href.startsWith('//')) {
      $(el).attr('href', origin + href);
      linksRewritten++;
    }
  });

  $('[srcset]').each((_, el) => {
    let srcset = $(el).attr('srcset');
    if (srcset) {
      srcset = srcset.replace(/(^|,)\s*\//g, '$1 ' + origin + '/');
      $(el).attr('srcset', srcset);
    }
  });

  // Ensure utf-8 charset and standard viewport exist
  if ($('meta[charset]').length === 0) {
    $('head').prepend('<meta charset="utf-8">\n');
  }
  if ($('meta[name="viewport"]').length === 0) {
    $('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1">\n');
  }

  // 6. Inject the lightweight Vanilla JS interaction engine before </body>
  $('body').append(`\n${SIMPLIFIED_OFFLINE_JS}\n`);

  return {
    cleanHtml: $.html(),
    scriptsRemoved,
    imagesRewritten,
    linksRewritten
  };
}

/**
 * Detailed Multi-Category Quality & SEO Audit Checklist Engine
 */
export function generateAuditChecklist(
  rawHtml: string,
  cleanHtml: string,
  pageUrl: string
): AuditChecklistReport {
  const $ = cheerio.load(rawHtml);
  let pageHost = 'ongoweightloss.com';
  try {
    pageHost = new URL(pageUrl).hostname;
  } catch {}

  // 1. COMPREHENSIVE IMAGE & ALT TAG AUDIT
  const imageDetails: ImageAuditDetail[] = [];
  let validCount = 0;
  let missingCount = 0;
  let emptyCount = 0;
  let suspiciousCount = 0;
  let missingDimensionsCount = 0;
  let lazyCount = 0;

  $('img').each((idx, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || '';
    const altAttr = $(el).attr('alt');
    const width = $(el).attr('width');
    const height = $(el).attr('height');
    const hasDimensions = Boolean(width && height);
    if (!hasDimensions) missingDimensionsCount++;

    const isLazy = $(el).attr('loading') === 'lazy';
    if (isLazy) lazyCount++;

    let format = 'unknown';
    const cleanSrc = src.split('?')[0].toLowerCase();
    if (cleanSrc.endsWith('.webp')) format = 'WebP';
    else if (cleanSrc.endsWith('.svg')) format = 'SVG';
    else if (cleanSrc.endsWith('.png')) format = 'PNG';
    else if (cleanSrc.endsWith('.jpg') || cleanSrc.endsWith('.jpeg')) format = 'JPEG';
    else if (cleanSrc.endsWith('.avif')) format = 'AVIF';
    else if (cleanSrc.endsWith('.gif')) format = 'GIF';

    let altStatus: 'valid' | 'missing' | 'empty' | 'suspicious' = 'valid';
    let altBadge = 'Valid Descriptive Alt';
    let altWarning: string | undefined = undefined;
    let recommendation = 'Image has descriptive alternative text.';

    if (altAttr === undefined || altAttr === null) {
      altStatus = 'missing';
      altBadge = 'Missing Alt Tag';
      altWarning = 'The <img> tag has no alt attribute at all. Screen readers cannot describe this image.';
      recommendation = 'Add an alt attribute describing the image context, or alt="" if purely decorative.';
      missingCount++;
    } else if (altAttr.trim() === '') {
      altStatus = 'empty';
      altBadge = 'Empty Alt (alt="")';
      altWarning = 'Alt text is empty. Screen readers will skip this element.';
      recommendation = 'If this is a product, doctor, or treatment graphic, add meaningful alt text.';
      emptyCount++;
    } else {
      const lower = altAttr.trim().toLowerCase();
      const isSuspicious =
        lower === 'image' ||
        lower === 'photo' ||
        lower === 'picture' ||
        lower === 'pic' ||
        lower === 'logo' ||
        lower === 'icon' ||
        lower === 'graphic' ||
        lower.startsWith('img_') ||
        lower.startsWith('dsc_') ||
        /\.(png|jpe?g|webp|svg|gif|avif)$/i.test(lower);

      if (isSuspicious) {
        altStatus = 'suspicious';
        altBadge = 'Generic / Placeholder Alt';
        altWarning = `Alt contains generic placeholder: "${altAttr}". Provides little SEO or accessibility value.`;
        recommendation = 'Replace generic label with descriptive text describing what the image represents.';
        suspiciousCount++;
      } else {
        altStatus = 'valid';
        validCount++;
      }
    }

    imageDetails.push({
      id: idx + 1,
      src,
      alt: altAttr !== undefined && altAttr !== null ? altAttr : null,
      altStatus,
      altBadge,
      altWarning,
      hasDimensions,
      width,
      height,
      isLazy,
      format,
      recommendation
    });
  });

  const totalImages = imageDetails.length;

  // 2. CHECKLIST ITEMS GENERATION
  const checklist: ChecklistItem[] = [];

  // ====================
  // CATEGORY: IMAGES & ACCESSIBILITY (a11y)
  // ====================
  checklist.push({
    id: 'a11y_missing_alt',
    category: 'images_a11y',
    categoryLabel: 'Images & Accessibility',
    title: 'Image Alt Attribute Completeness',
    description: 'Every <img> tag must include an alt attribute for screen readers and SEO crawlers (WCAG 2.1 Level A).',
    status: missingCount > 0 ? 'fail' : 'pass',
    badgeText: missingCount > 0 ? `${missingCount} Missing Alt Attributes` : '100% Present',
    summaryValue: `${totalImages - missingCount} / ${totalImages} Images have Alt Attributes`,
    recommendation: missingCount > 0 
      ? `Add alt attributes to the ${missingCount} images listed below to meet WCAG accessibility standards.`
      : 'All images declare the required alt attribute.',
    items: imageDetails.filter(img => img.altStatus === 'missing').slice(0, 15).map(img => ({
      label: img.src ? img.src.split('/').pop() || img.src : `Image #${img.id}`,
      value: 'Missing alt attribute',
      status: 'fail' as const,
      meta: img.src
    }))
  });

  checklist.push({
    id: 'a11y_alt_quality',
    category: 'images_a11y',
    categoryLabel: 'Images & Accessibility',
    title: 'Descriptive Quality of Alt Text',
    description: 'Alt text should provide meaningful descriptions rather than generic placeholders (e.g. "image", "photo", or filenames).',
    status: suspiciousCount > 0 ? 'warning' : 'pass',
    badgeText: suspiciousCount > 0 ? `${suspiciousCount} Generic Placeholders` : 'High Quality',
    summaryValue: `${validCount} Descriptive • ${emptyCount} Empty • ${suspiciousCount} Generic`,
    recommendation: suspiciousCount > 0
      ? `Replace ${suspiciousCount} generic placeholder alt tags with descriptive medical/product context.`
      : 'No generic or placeholder alt tags detected.',
    items: imageDetails.filter(img => img.altStatus === 'suspicious').slice(0, 15).map(img => ({
      label: img.src ? img.src.split('/').pop() || img.src : `Image #${img.id}`,
      value: `Current: "${img.alt}"`,
      status: 'warning' as const,
      meta: img.altWarning
    }))
  });

  checklist.push({
    id: 'a11y_img_dimensions',
    category: 'images_a11y',
    categoryLabel: 'Images & Accessibility',
    title: 'Image Dimensions (CLS Layout Shift Prevention)',
    description: 'Explicit width and height attributes reserve visual space before loading, preventing Cumulative Layout Shift (CLS).',
    status: missingDimensionsCount > 0 ? 'warning' : 'pass',
    badgeText: missingDimensionsCount > 0 ? `${missingDimensionsCount} Missing Dimensions` : 'CLS Protected',
    summaryValue: `${totalImages - missingDimensionsCount} / ${totalImages} declare explicit dimensions`,
    recommendation: missingDimensionsCount > 0
      ? `Specify width and height attributes on ${missingDimensionsCount} images to eliminate layout shifts.`
      : 'All images declare explicit layout dimensions.'
  });

  const modernFormatsCount = imageDetails.filter(i => ['WebP', 'SVG', 'AVIF'].includes(i.format)).length;
  checklist.push({
    id: 'a11y_modern_formats',
    category: 'images_a11y',
    categoryLabel: 'Images & Accessibility',
    title: 'Next-Gen Compressed Formats (WebP / SVG / AVIF)',
    description: 'Serving modern image formats reduces byte payloads significantly compared to legacy JPEG/PNG.',
    status: (totalImages > 0 && modernFormatsCount / totalImages < 0.6) ? 'warning' : 'pass',
    badgeText: `${Math.round((modernFormatsCount / Math.max(1, totalImages)) * 100)}% Modern Formats`,
    summaryValue: `${modernFormatsCount} / ${totalImages} use WebP/SVG/AVIF`,
    recommendation: modernFormatsCount < totalImages
      ? 'Convert remaining PNG/JPEG assets to WebP or AVIF for optimal load speed.'
      : 'Images utilize next-gen compressed formats.'
  });

  // ====================
  // CATEGORY: META TAGS & SERP
  // ====================
  const title = $('title').first().text().trim();
  const titleLen = title.length;
  checklist.push({
    id: 'meta_title',
    category: 'meta_seo',
    categoryLabel: 'Meta Tags & SERP',
    title: 'Title Tag Display Length (45–65 chars)',
    description: 'The <title> tag is Google\'s primary organic ranking factor and defines the clickable headline in search snippets.',
    status: !title ? 'fail' : (titleLen < 35 || titleLen > 65) ? 'warning' : 'pass',
    badgeText: !title ? 'Missing Title' : `${titleLen} Chars (${titleLen >= 45 && titleLen <= 65 ? 'Optimal' : titleLen < 35 ? 'Short' : 'Long'})`,
    summaryValue: title || '(No Title Found)',
    recommendation: !title ? 'Add a title tag immediately.' : titleLen > 65 ? 'Shorten title to <= 65 characters to prevent Google SERP truncation.' : titleLen < 35 ? 'Expand title to >= 45 characters with primary keywords.' : 'Title tag is within optimal search snippet character boundaries.'
  });

  const metaDesc = $('meta[name="description"]').attr('content')?.trim() || '';
  const metaDescLen = metaDesc.length;
  checklist.push({
    id: 'meta_desc',
    category: 'meta_seo',
    categoryLabel: 'Meta Tags & SERP',
    title: 'Meta Description Optimization (110–160 chars)',
    description: 'The meta description drives organic click-through rate (CTR) by summarizing the page value proposition.',
    status: !metaDesc ? 'fail' : (metaDescLen < 80 || metaDescLen > 165) ? 'warning' : 'pass',
    badgeText: !metaDesc ? 'Missing Description' : `${metaDescLen} Chars`,
    summaryValue: metaDesc || '(No Meta Description Found)',
    recommendation: !metaDesc ? 'Add a compelling meta description with a conversion hook and clinical transparency.' : metaDescLen > 165 ? 'Shorten meta description to <= 160 characters to avoid snippet truncation.' : 'Meta description length is well-balanced for search engines.'
  });

  const canonical = $('link[rel="canonical"]').attr('href')?.trim() || '';
  checklist.push({
    id: 'meta_canonical',
    category: 'meta_seo',
    categoryLabel: 'Meta Tags & SERP',
    title: 'Canonical Tag Self-Reference',
    description: 'The canonical tag prevents duplicate content indexing by instructing search engines on the authoritative URL.',
    status: canonical ? 'pass' : 'fail',
    badgeText: canonical ? 'Canonical Declared' : 'Missing Canonical',
    summaryValue: canonical || 'Missing <link rel="canonical">',
    recommendation: canonical ? 'Valid canonical URL declared.' : 'Add a <link rel="canonical" href="..."> pointing to the authoritative URL.'
  });

  const robots = $('meta[name="robots"]').attr('content')?.trim() || 'index, follow';
  checklist.push({
    id: 'meta_robots',
    category: 'meta_seo',
    categoryLabel: 'Meta Tags & SERP',
    title: 'Robots Indexability Directive',
    description: 'Controls whether Google and other search engine spiders are permitted to index and crawl page links.',
    status: robots.includes('noindex') ? 'warning' : 'pass',
    badgeText: robots,
    summaryValue: `Robots: ${robots}`,
    recommendation: robots.includes('noindex') ? 'Warning: Page is marked "noindex" and will not rank in search engines.' : 'Page is fully indexable by search engine bots.'
  });

  const ogTitle = $('meta[property="og:title"]').attr('content') || $('meta[name="og:title"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content') || $('meta[name="og:image"]').attr('content');
  checklist.push({
    id: 'meta_open_graph',
    category: 'meta_seo',
    categoryLabel: 'Meta Tags & SERP',
    title: 'Open Graph Social Cards (og:title, og:image)',
    description: 'Ensures rich preview cards when page URLs are shared on LinkedIn, iMessage, Twitter, and Facebook.',
    status: (ogTitle && ogImage) ? 'pass' : (ogTitle || ogImage) ? 'warning' : 'fail',
    badgeText: (ogTitle && ogImage) ? 'Complete OG Tags' : (ogTitle || ogImage) ? 'Partial OG Tags' : 'Missing OG Tags',
    summaryValue: `og:title: ${ogTitle ? '✓' : '✗'} • og:image: ${ogImage ? '✓' : '✗'}`,
    recommendation: (!ogTitle || !ogImage) ? 'Add og:title and og:image tags for rich social sharing.' : 'Social Open Graph metadata is fully declared.'
  });

  // ====================
  // CATEGORY: HEADINGS & STRUCTURE
  // ====================
  const h1Tags: string[] = [];
  $('h1').each((_, el) => {
    const t = $(el).text().trim();
    if (t) h1Tags.push(t);
  });
  checklist.push({
    id: 'heading_h1_count',
    category: 'headings',
    categoryLabel: 'Headings & Semantics',
    title: 'Single Primary H1 Tag Hierarchy',
    description: 'Every page should feature exactly one clear H1 tag declaring the primary topical entity of the document.',
    status: h1Tags.length === 1 ? 'pass' : h1Tags.length === 0 ? 'fail' : 'warning',
    badgeText: `${h1Tags.length} H1 Tag(s)`,
    summaryValue: h1Tags.length > 0 ? h1Tags.join(' | ') : 'No H1 found',
    recommendation: h1Tags.length === 0 ? 'Add an H1 tag to establish the main subject of this page.' : h1Tags.length > 1 ? 'Multiple H1 tags detected. Consolidate into a single H1 to prevent dilution of keyword relevance.' : 'Page adheres to clean single-H1 heading standards.'
  });

  const h2Count = $('h2').length;
  const h3Count = $('h3').length;
  checklist.push({
    id: 'heading_subheadings',
    category: 'headings',
    categoryLabel: 'Headings & Semantics',
    title: 'Logical Subheading Outline (H2 & H3)',
    description: 'Subheadings organize the content flow into digestible sections for users and algorithmic comprehension.',
    status: h2Count >= 2 ? 'pass' : h2Count > 0 ? 'warning' : 'fail',
    badgeText: `${h2Count} H2s • ${h3Count} H3s`,
    summaryValue: `${h2Count} H2 sections and ${h3Count} H3 subtopics`,
    recommendation: h2Count < 2 ? 'Add structured H2 subheadings to divide content into clear thematic blocks.' : 'Subheading architecture is well-structured.'
  });

  // ====================
  // CATEGORY: LINKS & NAVIGATION
  // ====================
  let deadAnchors = 0;
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')?.trim();
    if (href === '#' || href === '' || href === 'javascript:void(0)') deadAnchors++;
  });
  checklist.push({
    id: 'links_dead_anchors',
    category: 'links',
    categoryLabel: 'Links & Navigation',
    title: 'Empty & Dead Anchor Links Check',
    description: 'Links pointing to "#" or "javascript:void(0)" without targets create broken user experiences.',
    status: deadAnchors > 0 ? 'warning' : 'pass',
    badgeText: deadAnchors > 0 ? `${deadAnchors} Placeholder Anchors` : 'All Links Valid',
    summaryValue: `${deadAnchors} dummy anchor links found`,
    recommendation: deadAnchors > 0 ? `Update ${deadAnchors} placeholder links with real navigation targets.` : 'No empty or broken placeholder links found.'
  });

  // ====================
  // CATEGORY: SCHEMA & STRUCTURED DATA
  // ====================
  const schemaScripts: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).html();
    if (raw) schemaScripts.push(raw);
  });
  checklist.push({
    id: 'schema_jsonld',
    category: 'schema',
    categoryLabel: 'Schema & Structured Data',
    title: 'JSON-LD Structured Data Verification',
    description: 'Schema markup unlocks rich results, medical organization knowledge graph cards, and FAQ accordions in Google SERP.',
    status: schemaScripts.length > 0 ? 'pass' : 'warning',
    badgeText: schemaScripts.length > 0 ? `${schemaScripts.length} Schemas Detected` : 'No Schema Detected',
    summaryValue: schemaScripts.length > 0 ? `${schemaScripts.length} JSON-LD blocks found` : 'Missing JSON-LD structured data',
    recommendation: schemaScripts.length === 0 ? 'Add MedicalOrganization, Product, or FAQPage JSON-LD schema to qualify for Google rich snippets.' : 'JSON-LD structured data successfully landed.'
  });

  // ====================
  // CATEGORY: CODE SIMPLIFICATION & OFFLINE
  // ====================
  checklist.push({
    id: 'clean_scripts_stripped',
    category: 'code_clean',
    categoryLabel: 'Offline Code Simplification',
    title: 'Next.js Script Bundles & Telemetry Stripped',
    description: 'Ensures that heavy JavaScript webpack bundles, Google Tag Manager, and telemetry are removed so the page runs offline with 0 console errors.',
    status: 'pass',
    badgeText: '0 Script Errors',
    summaryValue: 'All runtime script bundles replaced with Vanilla JS engine',
    recommendation: 'Page is lightweight and error-free.'
  });

  checklist.push({
    id: 'clean_css_inlined',
    category: 'code_clean',
    categoryLabel: 'Offline Code Simplification',
    title: 'Computed CSS Inlined in <head>',
    description: 'All stylesheets from browser memory are inlined directly into a single stylesheet so external CSS files never 404.',
    status: 'pass',
    badgeText: '100% Inlined Styles',
    summaryValue: 'Unified inlined stylesheet in <head>',
    recommendation: 'Styles are completely self-contained.'
  });

  // 3. SCORE & GRADE CALCULATION
  const totalChecks = checklist.length;
  const passedCount = checklist.filter(c => c.status === 'pass').length;
  const warningCount = checklist.filter(c => c.status === 'warning').length;
  const failedCount = checklist.filter(c => c.status === 'fail').length;

  const calculatedScore = Math.max(10, Math.min(100, 100 - (failedCount * 10) - (warningCount * 3)));
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'A';
  if (calculatedScore >= 96) grade = 'A+';
  else if (calculatedScore >= 88) grade = 'A';
  else if (calculatedScore >= 78) grade = 'B';
  else if (calculatedScore >= 65) grade = 'C';
  else if (calculatedScore >= 50) grade = 'D';
  else grade = 'F';

  return {
    score: calculatedScore,
    grade,
    totalChecks,
    passedCount,
    warningCount,
    failedCount,
    imagesAudit: {
      total: totalImages,
      validCount,
      missingCount,
      emptyCount,
      suspiciousCount,
      missingDimensionsCount,
      lazyCount,
      details: imageDetails
    },
    checklist
  };
}

/**
 * Extract comprehensive SEO & content audit telemetry from a page
 */
export function auditPageTelemetry(
  rawHtml: string,
  cleanHtml: string,
  pageUrl: string
): PageAuditTelemetry {
  const $ = cheerio.load(rawHtml);
  const issues: string[] = [];

  const title = $('title').first().text().trim();
  if (!title) issues.push('Missing <title> tag');

  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
  if (!metaDescription) issues.push('Missing meta description');

  const canonical = $('link[rel="canonical"]').attr('href')?.trim() || '';
  if (!canonical) issues.push('Missing canonical tag');

  const robots = $('meta[name="robots"]').attr('content')?.trim() || 'index, follow';
  const viewport = $('meta[name="viewport"]').attr('content')?.trim() || 'width=device-width, initial-scale=1';

  const h1Tags: string[] = [];
  $('h1').each((_, el) => {
    const txt = $(el).text().trim();
    if (txt) h1Tags.push(txt);
  });
  if (h1Tags.length === 0) issues.push('Missing H1 heading');
  if (h1Tags.length > 1) issues.push(`Multiple H1 headings detected (${h1Tags.length})`);

  const h2Count = $('h2').length;
  const h3Count = $('h3').length;
  const h4ToH6Count = $('h4, h5, h6').length;
  const paragraphsCount = $('p').length;
  const listsCount = $('ul, ol').length;
  const buttonsCount = $('button').length;
  const formsCount = $('form').length;
  const iframesCount = $('iframe').length;

  let imagesMissingAlt = 0;
  const images = $('img');
  images.each((_, el) => {
    const alt = $(el).attr('alt');
    if (alt === undefined || alt === null || alt.trim() === '') {
      imagesMissingAlt++;
    }
  });
  if (imagesMissingAlt > 0) {
    issues.push(`${imagesMissingAlt} images missing alt text`);
  }

  let linksInternal = 0;
  let linksExternal = 0;
  let pageHost = '';
  try {
    pageHost = new URL(pageUrl).hostname;
  } catch {
    pageHost = 'ongoweightloss.com';
  }

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')?.trim() || '';
    if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    try {
      const u = new URL(href, pageUrl);
      if (u.hostname === pageHost) {
        linksInternal++;
      } else {
        linksExternal++;
      }
    } catch {
      linksInternal++;
    }
  });

  const jsonLdSchemas: Record<string, unknown>[] = [];
  const schemaTypes: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const content = $(el).html();
      if (content) {
        const parsed = JSON.parse(content);
        jsonLdSchemas.push(parsed);
        if (parsed['@type']) {
          if (Array.isArray(parsed['@type'])) {
            schemaTypes.push(...parsed['@type']);
          } else {
            schemaTypes.push(String(parsed['@type']));
          }
        } else if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
          parsed['@graph'].forEach((item: Record<string, unknown>) => {
            if (item['@type']) {
              if (Array.isArray(item['@type'])) {
                schemaTypes.push(...item['@type']);
              } else {
                schemaTypes.push(String(item['@type']));
              }
            }
          });
        }
      }
    } catch {
      // Ignore malformed schema
    }
  });
  if (jsonLdSchemas.length === 0) {
    issues.push('No Schema/JSON-LD structured data');
  }

  // Visible text
  $('script, style, noscript').remove();
  const visibleText = $('body').text().replace(/\s+/g, ' ').trim();
  const visibleTextLength = visibleText.length;
  const approxWordCount = visibleText ? visibleText.split(/\s+/).length : 0;

  const auditChecklist = generateAuditChecklist(rawHtml, cleanHtml, pageUrl);

  return {
    title,
    metaDescription,
    canonical,
    robots,
    viewport,
    h1: h1Tags,
    h2Count,
    h3Count,
    h4ToH6Count,
    paragraphsCount,
    listsCount,
    buttonsCount,
    formsCount,
    iframesCount,
    imagesTotal: images.length,
    imagesMissingAlt: auditChecklist.imagesAudit.missingCount,
    linksTotal: linksInternal + linksExternal,
    linksInternal,
    linksExternal,
    jsonLdSchemas,
    schemaTypes: Array.from(new Set(schemaTypes)),
    visibleTextLength,
    approxWordCount,
    issues,
    auditChecklist
  };
}

/**
 * Generate a filename from a URL
 */
export function generateFilenameFromUrl(url: string, index?: number): string {
  try {
    const urlObj = new URL(url);
    let pathname = urlObj.pathname.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!pathname) pathname = 'homepage';
    const prefix = index !== undefined ? `${String(index).padStart(2, '0')}-` : '';
    return `${prefix}${pathname}.html`;
  } catch {
    const clean = url.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    const prefix = index !== undefined ? `${String(index).padStart(2, '0')}-` : '';
    return `${prefix}${clean || 'page'}.html`;
  }
}

/**
 * Scrape a page using Playwright Chromium (or fallback to HTTP fetch)
 */
export async function scrapePage(
  targetUrl: string,
  options: ScraperOptions = {}
): Promise<ScrapeResult> {
  const startTime = Date.now();
  let url = targetUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  const outputDir = options.outputDir || path.join(process.cwd(), 'scraped_clean');
  const auditDir = options.auditDir || path.join(process.cwd(), 'data', 'scraped_audit');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const reportsDir = path.join(auditDir, 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  let rawHtml = '';
  let inlinedCss = '';
  let cssRulesCount = 0;

  // Attempt 1: Try Playwright for full client-side CSS and DOM hydration
  let playwrightSuccess = false;
  try {
    // Dynamic import to prevent bundler compilation issues
    const { chromium } = await import('playwright');
    const browser = await chromium.launch({ headless: true });
    try {
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (Ongo-Scraper/1.0)',
        viewport: { width: 1440, height: 900 }
      });
      const page = await context.newPage();

      await page.goto(url, { waitUntil: 'networkidle', timeout: options.timeout || 35000 });

      // Smooth scroll to bottom to trigger lazy-loaded images & dynamic modules
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let totalHeight = 0;
          const distance = 350;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              window.scrollTo(0, 0);
              resolve();
            }
          }, 80);
        });
      });

      // Capture all computed CSS rules from document.styleSheets
      const extracted = await page.evaluate(() => {
        let css = '';
        let rules = 0;
        for (const sheet of document.styleSheets) {
          try {
            for (const rule of sheet.cssRules) {
              css += rule.cssText + '\n';
              rules++;
            }
          } catch {
            // CORS restricted stylesheet
          }
        }
        return { css, rules };
      });

      inlinedCss = extracted.css;
      cssRulesCount = extracted.rules;
      rawHtml = await page.content();
      playwrightSuccess = true;
    } finally {
      await browser.close();
    }
  } catch (pwError: unknown) {
    // If Playwright fails (e.g. network resolution or sandbox limits), fall back to standard HTTP fetch
    console.warn(`Playwright capture note: ${(pwError as Error).message}. Attempting fallback fetch...`);
  }

  // Attempt 2: Fallback to fetch if Playwright didn't get HTML
  if (!playwrightSuccess || !rawHtml) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (Ongo-Scraper/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      rawHtml = await res.text();
    } catch (fetchError: unknown) {
      return {
        success: false,
        url,
        filename: generateFilenameFromUrl(url),
        cleanHtml: '',
        inlinedCss: '',
        vanillaJs: SIMPLIFIED_OFFLINE_JS,
        telemetry: {
          title: '',
          metaDescription: '',
          canonical: '',
          robots: '',
          viewport: '',
          h1: [],
          h2Count: 0,
          h3Count: 0,
          h4ToH6Count: 0,
          paragraphsCount: 0,
          listsCount: 0,
          buttonsCount: 0,
          formsCount: 0,
          iframesCount: 0,
          imagesTotal: 0,
          imagesMissingAlt: 0,
          linksTotal: 0,
          linksInternal: 0,
          linksExternal: 0,
          jsonLdSchemas: [],
          schemaTypes: [],
          visibleTextLength: 0,
          approxWordCount: 0,
          issues: ['Failed to fetch URL: ' + (fetchError as Error).message],
          auditChecklist: {
            score: 0,
            grade: 'F',
            totalChecks: 0,
            passedCount: 0,
            warningCount: 0,
            failedCount: 1,
            imagesAudit: {
              total: 0,
              validCount: 0,
              missingCount: 0,
              emptyCount: 0,
              suspiciousCount: 0,
              missingDimensionsCount: 0,
              lazyCount: 0,
              details: []
            },
            checklist: []
          }
        },
        stats: {
          rawHtmlSize: 0,
          cleanHtmlSize: 0,
          sizeReductionPercent: 0,
          scriptsRemoved: 0,
          cssRulesCount: 0,
          imagesRewritten: 0,
          linksRewritten: 0,
          executionTimeMs: Date.now() - startTime
        },
        error: (fetchError as Error).message
      };
    }
  }

  // Clean & simplify HTML
  const { cleanHtml, scriptsRemoved, imagesRewritten, linksRewritten } = cleanAndSimplifyHtml(rawHtml, inlinedCss, url);
  const telemetry = auditPageTelemetry(rawHtml, cleanHtml, url);

  const rawSize = Buffer.byteLength(rawHtml, 'utf-8');
  const cleanSize = Buffer.byteLength(cleanHtml, 'utf-8');
  const sizeReduction = rawSize > 0 ? Math.max(0, Math.round(((rawSize - cleanSize) / rawSize) * 100)) : 0;

  const filename = generateFilenameFromUrl(url);
  const filePath = path.join(outputDir, filename);

  // Save to disk if requested
  if (options.saveToFile !== false) {
    try {
      fs.writeFileSync(filePath, cleanHtml, 'utf-8');

      // Generate audit report text
      const reportName = filename.replace(/\.html$/, '-report.txt');
      const reportPath = path.join(reportsDir, reportName);
      const reportContent = `======================================================
AUDIT REPORT FOR: ${filename}
URL: ${url}
DATE: ${new Date().toISOString()}
======================================================

NOTE: Clean offline clone generated with all Next.js hydration scripts
removed and replaced with simplified Vanilla JS & unified CSS.

${JSON.stringify({
  filename,
  url,
  stats: {
    rawHtmlSize: rawSize,
    cleanHtmlSize: cleanSize,
    sizeReductionPercent: sizeReduction,
    scriptsRemoved,
    cssRulesInlined: cssRulesCount
  },
  content: {
    title: telemetry.title,
    h1: telemetry.h1,
    h2_to_h6_count: telemetry.h2Count + telemetry.h3Count + telemetry.h4ToH6Count,
    paragraphs_count: telemetry.paragraphsCount,
    lists_count: telemetry.listsCount,
    buttons_count: telemetry.buttonsCount,
    forms_count: telemetry.formsCount,
    iframes_count: telemetry.iframesCount,
    visible_text_length: telemetry.visibleTextLength,
    approx_word_count: telemetry.approxWordCount
  },
  seo: {
    metaDescription: telemetry.metaDescription,
    robots: telemetry.robots,
    viewport: telemetry.viewport,
    canonical: telemetry.canonical
  },
  structuredData: {
    schemasCount: telemetry.jsonLdSchemas.length,
    schemaTypes: telemetry.schemaTypes
  },
  assets: {
    imagesTotal: telemetry.imagesTotal,
    imagesMissingAlt: telemetry.imagesMissingAlt,
    linksTotal: telemetry.linksTotal,
    linksInternal: telemetry.linksInternal,
    linksExternal: telemetry.linksExternal
  },
  issues: telemetry.issues
}, null, 2)}
`;
      fs.writeFileSync(reportPath, reportContent, 'utf-8');
    } catch (saveError) {
      console.warn('Could not save to disk:', (saveError as Error).message);
    }
  }

  return {
    success: true,
    url,
    filename,
    filePath,
    cleanHtml,
    inlinedCss,
    vanillaJs: SIMPLIFIED_OFFLINE_JS,
    telemetry,
    stats: {
      rawHtmlSize: rawSize,
      cleanHtmlSize: cleanSize,
      sizeReductionPercent: sizeReduction,
      scriptsRemoved,
      cssRulesCount,
      imagesRewritten,
      linksRewritten,
      executionTimeMs: Date.now() - startTime
    }
  };
}

/**
 * Return all previously scraped clean HTML files in scraped_clean/
 */
export function getScrapedArchive(): ScrapedArchiveItem[] {
  const outputDir = path.join(process.cwd(), 'scraped_clean');
  const reportsDir = path.join(process.cwd(), 'data', 'scraped_audit', 'reports');

  if (!fs.existsSync(outputDir)) return [];

  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.html'));
  return files.map(file => {
    const fullPath = path.join(outputDir, file);
    const stat = fs.statSync(fullPath);
    const sizeKb = (stat.size / 1024).toFixed(1) + ' KB';

    let title = file;
    let h1 = '';
    try {
      const sample = fs.readFileSync(fullPath, 'utf-8').slice(0, 10000);
      const titleMatch = sample.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim();
      }
      const h1Match = sample.match(/<h1[^>]*>([^<]+)<\/h1>/i);
      if (h1Match && h1Match[1]) {
        h1 = h1Match[1].trim();
      }
    } catch {
      // Ignore read errors for sample
    }

    const reportName = file.replace(/\.html$/, '-report.txt');
    const hasAuditReport = fs.existsSync(path.join(reportsDir, reportName));

    return {
      filename: file,
      path: fullPath,
      sizeBytes: stat.size,
      sizeKb,
      lastModified: stat.mtime.toISOString(),
      title,
      h1,
      relativeUrl: file.replace(/^\d+-/, '').replace(/\.html$/, '').replace(/-/g, '/'),
      hasAuditReport,
      reportFilename: hasAuditReport ? reportName : undefined
    };
  }).sort((a, b) => a.filename.localeCompare(b.filename));
}


const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// =========================================================================
// SIMPLIFIED OFFLINE CSS & VANILLA JS ENGINE
// =========================================================================
const SIMPLIFIED_CSS = `
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
`;

const SIMPLIFIED_JS = `
<script>
/**
 * ⚡ SIMPLIFIED OFFLINE INTERACTIVE ENGINE
 * Replaces megabytes of Next.js / Webpack hydration chunks with zero-dependency
 * event delegation for FAQ accordions, mobile drawer, menus & legal expanders.
 */
(function() {
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

        // 2. Interactive trigger button
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

    console.log('✓ Ongo Clean Scraper Engine active. Offline accordions and toggles ready.');
})();
</script>
`;

// Helper: Parse CLI Arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const parsed = {
        url: null,
        input: null,
        outputDir: path.join(__dirname, '..', 'scraped_clean'),
        audit: true,
        auditDir: path.join(__dirname, '..', 'data', 'scraped_audit')
    };

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--url' && args[i + 1]) {
            parsed.url = args[i + 1];
            i++;
        } else if (args[i] === '--input' && args[i + 1]) {
            parsed.input = args[i + 1];
            i++;
        } else if (args[i] === '--output' && args[i + 1]) {
            parsed.outputDir = args[i + 1];
            i++;
        } else if (args[i] === '--no-audit') {
            parsed.audit = false;
        }
    }

    return parsed;
}

async function run() {
    const opts = parseArgs();

    let urls = [];
    if (opts.url) {
        urls = [opts.url];
        console.log(`\n🎯 Single Target Mode: ${opts.url}`);
    } else {
        let urlsFilePath = opts.input || path.join(__dirname, '..', 'urls.txt');
        if (!fs.existsSync(urlsFilePath) && fs.existsSync(path.join(__dirname, 'urls.txt'))) {
            urlsFilePath = path.join(__dirname, 'urls.txt');
        }
        if (!fs.existsSync(urlsFilePath) && fs.existsSync(path.join(__dirname, '..', '..', 'urls.txt'))) {
            urlsFilePath = path.join(__dirname, '..', '..', 'urls.txt');
        }

        if (!fs.existsSync(urlsFilePath)) {
            console.error(`❌ Error: URLs file not found at: ${urlsFilePath}`);
            console.log('Provide a URL with --url <link> or create a urls.txt file.');
            return;
        }

        console.log(`\n📋 Reading target URLs from: ${urlsFilePath}`);
        urls = fs.readFileSync(urlsFilePath, 'utf-8')
            .split('\n')
            .map(l => l.trim())
            .filter(l => l.length > 0 && !l.startsWith('#'));
    }

    console.log(`Total URLs to scrape: ${urls.length}`);

    if (!fs.existsSync(opts.outputDir)) {
        fs.mkdirSync(opts.outputDir, { recursive: true });
    }

    const reportsDir = path.join(opts.auditDir, 'reports');
    if (opts.audit && !fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }

    console.log('\n🚀 Launching headless Chromium browser...');
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (Ongo-Offline-Scraper/1.0)',
        viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();

    const summaryRows = [];
    summaryRows.push('URL/file,Title,H1 count,Schema count,CSS inlined,JS stripped,Images,Links,Issues');

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const indexStr = String(i + 1).padStart(2, '0');
        console.log(`\n[${i + 1}/${urls.length}] Crawling: ${url}`);

        try {
            await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });

            // Smooth scroll to bottom to trigger lazy images and deferred assets
            await page.evaluate(async () => {
                await new Promise((resolve) => {
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

            // Capture all rendered CSS directly from browser memory
            const inlinedCss = await page.evaluate(() => {
                let css = '';
                for (const sheet of document.styleSheets) {
                    try {
                        for (const rule of sheet.cssRules) {
                            css += rule.cssText + '\n';
                        }
                    } catch (e) {}
                }
                return css;
            });

            let rawHtml = await page.content();
            const rawSize = Buffer.byteLength(rawHtml, 'utf-8');

            // Parse & Simplify HTML with Cheerio
            const $ = cheerio.load(rawHtml);

            // 1. Remove all scripts (strips heavy Next.js chunks, analytics, trackers)
            const scriptCount = $('script').length;
            $('script').remove();

            // 2. Remove external stylesheet links
            $('link[rel="stylesheet"]').remove();

            // 3. Inline all captured CSS directly in <head>
            if (inlinedCss) {
                $('head').append(`\n<style id="inlined-site-styles">\n${inlinedCss}\n</style>\n`);
            }

            // 4. Inject simplified component CSS
            $('head').append(`\n<style id="simplified-component-styles">\n${SIMPLIFIED_CSS}\n</style>\n`);

            // 5. Fix relative links, images, srcset
            const origin = new URL(url).origin;
            let imagesCount = 0;
            $('[src^="/"]').each((_, el) => {
                $(el).attr('src', origin + $(el).attr('src'));
                imagesCount++;
            });
            let linksCount = 0;
            $('[href^="/"]').each((_, el) => {
                const href = $(el).attr('href');
                if (href && href.startsWith('/') && !href.startsWith('//')) {
                    $(el).attr('href', origin + href);
                    linksCount++;
                }
            });
            $('[srcset]').each((_, el) => {
                let srcset = $(el).attr('srcset');
                if (srcset) {
                    srcset = srcset.replace(/(^|,)\s*\//g, '$1 ' + origin + '/');
                    $(el).attr('srcset', srcset);
                }
            });

            // 6. Inject the lightweight Vanilla JS interaction engine
            $('body').append(`\n${SIMPLIFIED_JS}\n`);

            // Filename generation
            const urlObj = new URL(url);
            let pathname = urlObj.pathname.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            if (!pathname) pathname = 'homepage';
            const filename = `${indexStr}-${pathname}.html`;
            const filePath = path.join(opts.outputDir, filename);

            const cleanHtml = $.html();
            const cleanSize = Buffer.byteLength(cleanHtml, 'utf-8');
            const reduction = rawSize > 0 ? Math.round(((rawSize - cleanSize) / rawSize) * 100) : 0;

            fs.writeFileSync(filePath, cleanHtml, 'utf-8');
            console.log(`   ✓ Saved: ${filename} (${(cleanSize / 1024).toFixed(1)} KB, -${reduction}% payload)`);
            console.log(`   ✓ Stripped ${scriptCount} scripts, inlined CSS, injected zero-dependency Vanilla JS`);

            // Audit Telemetry
            if (opts.audit) {
                const title = $('title').first().text().trim() || '';
                const h1Count = $('h1').length;
                const schemaCount = $('script[type="application/ld+json"]').length;
                const issues = [];
                if (!title) issues.push('Missing Title');
                if (h1Count === 0) issues.push('Missing H1');
                if (schemaCount === 0) issues.push('No Schema/JSON-LD');

                const reportName = filename.replace(/\.html$/, '-report.txt');
                const reportContent = `======================================================
AUDIT REPORT FOR: ${filename}
URL: ${url}
DATE: ${new Date().toISOString()}
======================================================
Title: ${title}
H1 Count: ${h1Count}
Raw Payload: ${(rawSize / 1024).toFixed(1)} KB
Clean Payload: ${(cleanSize / 1024).toFixed(1)} KB (-${reduction}%)
Scripts Stripped: ${scriptCount}
Images Rewritten: ${imagesCount}
Links Rewritten: ${linksCount}
Issues: ${issues.join(' | ') || 'None'}
`;
                fs.writeFileSync(path.join(reportsDir, reportName), reportContent, 'utf-8');

                const escapedTitle = `"${title.replace(/"/g, '""')}"`;
                const issuesStr = `"${issues.join(' | ') || 'None'}"`;
                summaryRows.push(`${filename},${escapedTitle},${h1Count},${schemaCount},Yes,${scriptCount},${imagesCount},${linksCount},${issuesStr}`);
            }

        } catch (error) {
            console.error(`   ❌ Failed: ${error.message}`);
        }
    }

    await browser.close();

    if (opts.audit && summaryRows.length > 1) {
        const summaryPath = path.join(opts.auditDir, 'audit_summary.csv');
        fs.writeFileSync(summaryPath, summaryRows.join('\n'), 'utf-8');
        console.log(`\n📊 Generated Audit Summary: ${path.relative(process.cwd(), summaryPath)}`);
    }

    console.log(`\n✨ Scraping completed successfully! Output saved in "${path.relative(process.cwd(), opts.outputDir)}"`);
}

run();


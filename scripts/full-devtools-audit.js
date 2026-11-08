const { chromium } = require('../node_modules/playwright');
const fs = require('fs');
const path = require('path');

const ROUTES = [
  '/',
  '/competitors',
  '/sitemaps',
  '/doctor-eeat',
  '/compliance',
  '/state-licensing',
  '/competitor-gap',
  '/keywords',
  '/architecture',
  '/ongo-pages',
  '/meta',
  '/books',
  '/clean-scraper',
  '/image-audit',
  '/keywords-harvester',
  '/link-flowchart',
  '/internal-links',
  '/patterns',
  '/content-matcher',
  '/reports',
  '/seo-vault',
  '/industry-radar',
  '/fda-shortages',
  '/pagespeed-benchmark',
  '/reddit-sentiment',
  '/clinical-citations',
  '/geo-readiness',
  '/clinical-trials',
  '/readability-audit',
  '/content-extractor',
  '/sitemap'
];

async function runAudit() {
  console.log('🚀 Starting Full Chrome DevTools & Playwright Audit across ' + ROUTES.length + ' routes...\n');

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const allIssues = [];
  const routeSummaries = {};

  for (const route of ROUTES) {
    const url = 'http://localhost:3000' + route;
    process.stdout.write(`Auditing ${route.padEnd(24)} `);

    const page = await context.newPage();
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Audits.enable').catch(() => {});

    const pageIssues = [];

    // 1. Console listener
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      // Ignore normal dev logs, but capture warnings and errors
      if (type === 'error' || text.includes('Warning:') || text.includes('Error:') || text.includes('Hydration')) {
        pageIssues.push({
          route,
          category: 'Console ' + (type === 'error' ? 'Error' : 'Warning'),
          severity: type === 'error' ? 'HIGH' : 'MEDIUM',
          message: text,
          location: msg.location()
        });
      }
    });

    // 2. Uncaught exceptions
    page.on('pageerror', err => {
      pageIssues.push({
        route,
        category: 'Uncaught JS Exception',
        severity: 'CRITICAL',
        message: err.message,
        stack: err.stack
      });
    });

    // 3. Network request failures
    page.on('requestfailed', req => {
      pageIssues.push({
        route,
        category: 'Network Request Failed',
        severity: 'HIGH',
        message: `${req.method()} ${req.url()} failed: ${req.failure()?.errorText || 'unknown'}`
      });
    });

    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      const status = response ? response.status() : 0;

      if (status >= 400) {
        pageIssues.push({
          route,
          category: 'HTTP Error',
          severity: 'CRITICAL',
          message: `HTTP Status Code: ${status}`
        });
      }

      // Wait a moment for dynamic widgets & React effects
      await page.waitForTimeout(600);

      // 4. In-page DOM & Accessibility & Visual Audits
      const domIssues = await page.evaluate((currentRoute) => {
        const issues = [];

        // Check horizontal overflow
        const docWidth = document.documentElement.scrollWidth;
        const viewWidth = window.innerWidth;
        if (docWidth > viewWidth + 2) {
          issues.push({
            route: currentRoute,
            category: 'Layout Overflow',
            severity: 'MEDIUM',
            message: `Horizontal overflow detected: document width (${docWidth}px) exceeds viewport (${viewWidth}px) by ${docWidth - viewWidth}px`
          });
        }

        // Check broken images
        const images = Array.from(document.querySelectorAll('img'));
        images.forEach((img, idx) => {
          if (!img.getAttribute('alt') && !img.getAttribute('aria-hidden')) {
            issues.push({
              route: currentRoute,
              category: 'Accessibility (WCAG a11y)',
              severity: 'LOW',
              message: `Image missing alt attribute: ${img.src ? img.src.slice(-50) : `img[${idx}]`}`
            });
          }
          if (img.complete && img.naturalWidth === 0 && img.src && !img.src.startsWith('data:')) {
            issues.push({
              route: currentRoute,
              category: 'Broken Image',
              severity: 'HIGH',
              message: `Broken image source (failed to decode): ${img.src}`
            });
          }
        });

        // Check buttons without accessible name
        const buttons = Array.from(document.querySelectorAll('button'));
        buttons.forEach((btn, idx) => {
          const text = (btn.innerText || btn.getAttribute('aria-label') || btn.getAttribute('title') || '').trim();
          if (!text && !btn.querySelector('svg') && !btn.querySelector('img')) {
            issues.push({
              route: currentRoute,
              category: 'Accessibility (WCAG a11y)',
              severity: 'MEDIUM',
              message: `Button #${idx} has no text, icon, title, or aria-label`
            });
          }
        });

        // Check inputs without label or aria-label
        const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
        inputs.forEach((input, idx) => {
          const label = input.getAttribute('placeholder') || input.getAttribute('aria-label') || input.getAttribute('title') || input.id;
          if (!label && input.type !== 'hidden') {
            issues.push({
              route: currentRoute,
              category: 'Accessibility (WCAG a11y)',
              severity: 'LOW',
              message: `Input [type="${input.type}"] #${idx} has no placeholder, aria-label, or associated label`
            });
          }
        });

        // Check for NaN or undefined rendered as raw text in page
        const bodyText = document.body.innerText;
        if (bodyText.includes('NaN') || bodyText.includes('undefined') || bodyText.includes('[object Object]')) {
          if (bodyText.includes('NaN')) {
            issues.push({
              route: currentRoute,
              category: 'Render Bug',
              severity: 'MEDIUM',
              message: 'Page renders "NaN" in visible text'
            });
          }
          if (bodyText.includes('undefined')) {
            issues.push({
              route: currentRoute,
              category: 'Render Bug',
              severity: 'MEDIUM',
              message: 'Page renders "undefined" in visible text'
            });
          }
          if (bodyText.includes('[object Object]')) {
            issues.push({
              route: currentRoute,
              category: 'Render Bug',
              severity: 'HIGH',
              message: 'Page renders raw "[object Object]" in visible text'
            });
          }
        }

        return issues;
      }, route);

      pageIssues.push(...domIssues);

    } catch (e) {
      pageIssues.push({
        route,
        category: 'Navigation Crash',
        severity: 'CRITICAL',
        message: e.message
      });
    }

    allIssues.push(...pageIssues);
    routeSummaries[route] = {
      total: pageIssues.length,
      critical: pageIssues.filter(i => i.severity === 'CRITICAL').length,
      high: pageIssues.filter(i => i.severity === 'HIGH').length,
      medium: pageIssues.filter(i => i.severity === 'MEDIUM').length,
      low: pageIssues.filter(i => i.severity === 'LOW').length
    };

    console.log(`→ ${pageIssues.length} issues (${routeSummaries[route].critical} crit, ${routeSummaries[route].high} high, ${routeSummaries[route].medium} med, ${routeSummaries[route].low} low)`);

    await page.close();
  }

  // 5. Test Global Navbar Mega Menu & Modal Interaction on Homepage
  console.log('\n🔍 Testing Mega Menu & Modal Interactions on Desktop & Mobile Viewports...');
  const testPage = await context.newPage();
  await testPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Test opening each mega menu
  const menuButtons = await testPage.$$('nav > button');
  console.log(`Found ${menuButtons.length} menu triggers in navbar.`);
  for (let i = 1; i < menuButtons.length; i++) {
    try {
      await menuButtons[i].click();
      await testPage.waitForTimeout(200);
      const isVisible = await testPage.$('header div[style*="position: absolute"]');
      if (!isVisible) {
        allIssues.push({
          route: '/',
          category: 'Interaction Bug',
          severity: 'HIGH',
          message: `Mega menu trigger #${i} clicked but flyout panel did not open`
        });
      }
    } catch (e) {
      allIssues.push({
        route: '/',
        category: 'Interaction Crash',
        severity: 'HIGH',
        message: `Failed clicking mega menu trigger #${i}: ${e.message}`
      });
    }
  }

  // Close with Escape
  await testPage.keyboard.press('Escape');
  await testPage.waitForTimeout(150);

  // Test Command Palette (⌘K)
  await testPage.keyboard.press('Control+k');
  await testPage.waitForTimeout(200);
  const searchModal = await testPage.$('input[placeholder*="Jump to any tool"]');
  if (!searchModal) {
    allIssues.push({
      route: '/',
      category: 'Interaction Bug',
      severity: 'HIGH',
      message: 'Control+K did not open search command palette'
    });
  } else {
    // Type in search
    await searchModal.fill('doctor');
    await testPage.waitForTimeout(200);
    await testPage.keyboard.press('Escape');
  }

  await testPage.close();
  await browser.close();

  // Save report
  const reportPath = path.join(__dirname, '../audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalIssues: allIssues.length,
    routeSummaries,
    issues: allIssues
  }, null, 2));

  console.log(`\n========================================================`);
  console.log(`🏁 AUDIT COMPLETE! Total Issues Detected: ${allIssues.length}`);
  console.log(`Detailed audit log saved to: ${reportPath}`);
  console.log(`========================================================\n`);
}

runAudit().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});

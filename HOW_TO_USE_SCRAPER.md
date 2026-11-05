# 🌐 Clean Page-by-Page Web Scraper & Offline Engine

A specialized tool built into **Ongo Weight Loss Intelligence Suite** that scrapes websites **page by page** and simplifies the **HTML, CSS, and JavaScript**:

* **Simplified HTML**: Strips 35+ Next.js/React hydration script bundles, telemetry, Google Tag Manager, trackers, and ads. Rewrites relative links, images, and srcset to absolute URLs so assets never 404.
* **Simplified CSS**: Directly captures all rendered CSS rules from browser memory (`document.styleSheets`), merging and inlining them into a single, self-contained `<style id="inlined-site-styles">` tag in `<head>`.
* **Simplified Vanilla JS**: Injects a lightweight (< 60 lines), zero-dependency event delegation engine that keeps **FAQ accordions, '+' toggle buttons, mobile drawer menus, and legal disclaimers working 100% offline with 0 console errors**.

---

## 🚀 Workflow 1: Interactive Web Dashboard (Recommended)

1. **Start the Next.js Dashboard**:
   ```powershell
   cd "d:\research work\ongo weight loss\audit-tool"
   npm run dev
   ```

2. **Open the Tool**:
   Open [http://localhost:3000/clean-scraper](http://localhost:3000/clean-scraper) in your browser (or click the **"Clean Scraper"** tab in the navigation bar).

3. **Explore the 4 Built-In Modes**:
   * **Single Page Scraper**:
     * Enter any live web URL (e.g. `https://ongoweightloss.com/pricing`) or pick from quick presets.
     * Click **"Scrape & Simplify Page"**.
     * Inspect results with the 5 interactive tabs:
       * 👁️ **Interactive Preview**: Sandboxed offline iframe where you can test FAQ accordions, plus-icon rotations, and drawer menus live!
       * 📄 **Simplified HTML**: View and copy clean markup (0 Next.js script bundles).
       * 🎨 **Inlined CSS**: View unified computed styles.
       * ⚡ **Vanilla JS**: Inspect the zero-dependency interactive script.
       * 🔍 **Page Telemetry & SEO**: Audit Title, H1, Meta tags, JSON-LD Schemas, and Image alt tags.
     * One-click **Download .html** or **Copy HTML**.
   * **Paste Raw HTML & Simplify (Zero Network Needed)**:
     * Right-click any webpage in Chrome -> "View Page Source".
     * Paste the raw markup and enter the domain origin.
     * Instantly simplifies the page offline without needing any outbound internet access.
   * **Batch Page-by-Page Crawler**:
     * Paste multiple URLs (one per line) or click "Load Core Ongo Pages".
     * Click "Start Batch Scrape" to process them sequentially.
   * **Scraped Clean Archive (33 Pre-Scraped Pages Ready)**:
     * Instant access to all 33 pre-scraped Ongo pages already in `scraped_clean/`!
     * Click **"Inspect"** to preview in a live modal, or **"Live"** to open directly in a new tab.

---

## 💻 Workflow 2: Command Line (CLI) Scraper

You can also run the scraper directly from PowerShell / Terminal:

### 1. Scrape All URLs from `urls.txt`
```powershell
# From the project root:
node scrape_clean_offline.js

# Or from audit-tool/:
cd "audit-tool"
npm run scrape:clean
```

### 2. Scrape a Single Specific URL
```powershell
node scrape_clean_offline.js --url https://ongoweightloss.com/pricing
```

### 3. Scrape a Custom File
```powershell
node scrape_clean_offline.js --input my_custom_urls.txt
```

---

## 📁 Output File Structure

| Directory / File | Description |
| :--- | :--- |
| **`audit-tool/scraped_clean/`** | All simplified standalone `.html` pages (e.g. `01-homepage.html`, `07-pricing.html`). Double-click to open in any browser! |
| **`audit-tool/data/scraped_audit/reports/`** | Individual page audit text reports (e.g. `01-homepage-report.txt`) tracking Title, H1, Schema, and issues. |
| **`audit-tool/data/scraped_audit/audit_summary.csv`** | CSV table comparing payload reduction, scripts stripped, and SEO health. |
| **`audit-tool/data/scraped_audit/audit_full.json`** | Comprehensive JSON audit data. |
| **`audit-tool/urls.txt`** | Default target URLs list. |

---

## 🛠️ How the Simplification Architecture Works

### 1. Stripping Heavy Runtimes
```javascript
// Removes all script tags, eliminated Next.js webpack bundles, Google Analytics, trackers
$('script').remove();
$('link[rel="stylesheet"]').remove();
```

### 2. Inlining Live Computed CSS
```javascript
// Captures all computed CSS rules from document.styleSheets in browser memory
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
```

### 3. Rewriting Relative Assets to Absolute Origin
```javascript
const origin = new URL(url).origin;
$('[src^="/"]').each((_, el) => $(el).attr('src', origin + $(el).attr('src')));
$('[href^="/"]').each((_, el) => $(el).attr('href', origin + $(el).attr('href')));
```

### 4. Zero-Dependency Vanilla JS Interactive Engine
A 60-line event delegation listener attached to `document` handles:
1. **FAQ Accordion clicks**: Automatically toggles `aria-expanded="true/false"`, smoothly reveals the answer panel via CSS grid (`1fr`), rotates plus icons (`+` to `x`), and updates accessible labels.
2. **Mobile Drawer Menu**: Handles open toggle button and close button.
3. **Legal Disclaimers**: Expands truncated text and toggles "Read more" / "Read less".
4. **Offline notifications**: Intercepts dummy links and shows an elegant toast notification.


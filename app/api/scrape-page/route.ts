import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { 
  scrapePage, 
  cleanAndSimplifyHtml, 
  auditPageTelemetry, 
  generateAuditChecklist,
  getScrapedArchive,
  generateFilenameFromUrl,
  SIMPLIFIED_OFFLINE_JS
} from '@/lib/scraper-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = 'scrape', url, html, urls, saveToFile = true } = body;

    // Action 1: Scrape a single URL using the clean offline scraper engine
    if (action === 'scrape') {
      if (!url || typeof url !== 'string') {
        return NextResponse.json({ success: false, error: 'Target URL is required' }, { status: 400 });
      }

      const result = await scrapePage(url, { saveToFile });
      return NextResponse.json(result);
    }

    // Action 2: Simplify raw HTML directly (useful for offline mode, pasted inspect source, or local files)
    if (action === 'simplify-raw') {
      if (!html || typeof html !== 'string') {
        return NextResponse.json({ success: false, error: 'Raw HTML string is required' }, { status: 400 });
      }

      const targetUrl = url || 'https://ongoweightloss.com/';
      const startTime = Date.now();
      const rawSize = Buffer.byteLength(html, 'utf-8');

      const { cleanHtml, scriptsRemoved, imagesRewritten, linksRewritten } = cleanAndSimplifyHtml(html, '', targetUrl);
      const telemetry = auditPageTelemetry(html, cleanHtml, targetUrl);

      const cleanSize = Buffer.byteLength(cleanHtml, 'utf-8');
      const sizeReduction = rawSize > 0 ? Math.max(0, Math.round(((rawSize - cleanSize) / rawSize) * 100)) : 0;
      const filename = generateFilenameFromUrl(targetUrl);

      if (saveToFile) {
        try {
          const outDir = path.join(process.cwd(), 'scraped_clean');
          if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
          fs.writeFileSync(path.join(outDir, filename), cleanHtml, 'utf-8');
        } catch (e) {
          console.warn('Could not save raw simplified HTML to disk:', (e as Error).message);
        }
      }

      return NextResponse.json({
        success: true,
        url: targetUrl,
        filename,
        cleanHtml,
        inlinedCss: '',
        vanillaJs: SIMPLIFIED_OFFLINE_JS,
        telemetry,
        stats: {
          rawHtmlSize: rawSize,
          cleanHtmlSize: cleanSize,
          sizeReductionPercent: sizeReduction,
          scriptsRemoved,
          cssRulesCount: 0,
          imagesRewritten,
          linksRewritten,
          executionTimeMs: Date.now() - startTime
        }
      });
    }

    // Action 3: Batch scrape multiple URLs sequentially
    if (action === 'batch-scrape') {
      if (!Array.isArray(urls) || urls.length === 0) {
        return NextResponse.json({ success: false, error: 'Array of URLs is required' }, { status: 400 });
      }

      const results = [];
      for (const u of urls.slice(0, 15)) { // Limit to 15 per batch to prevent server timeouts
        try {
          const r = await scrapePage(u, { saveToFile });
          results.push({
            url: u,
            success: r.success,
            filename: r.filename,
            cleanHtmlSize: r.stats.cleanHtmlSize,
            scriptsRemoved: r.stats.scriptsRemoved,
            issues: r.telemetry.issues,
            error: r.error
          });
        } catch (itemErr) {
          results.push({
            url: u,
            success: false,
            error: (itemErr as Error).message
          });
        }
      }

      return NextResponse.json({
        success: true,
        total: results.length,
        results
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Scraping failed'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const action = searchParams.get('action') || 'list';
    const filename = searchParams.get('filename');

    // 1. List all archived scraped clean HTML files
    if (action === 'list') {
      const archive = getScrapedArchive();
      return NextResponse.json({ success: true, count: archive.length, archive });
    }

    // 2. Return specific HTML file content
    if (action === 'get-file' && filename) {
      const safeName = path.basename(filename);
      const filePath = path.join(process.cwd(), 'scraped_clean', safeName);
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
      }
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const asRaw = searchParams.get('raw') === 'true';
      if (asRaw) {
        return new NextResponse(content, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Disposition': `inline; filename="${safeName}"`
          }
        });
      }

      return NextResponse.json({ success: true, filename: safeName, content });
    }

    // 3. Return specific audit report content
    if (action === 'get-report' && filename) {
      const safeName = path.basename(filename);
      const filePath = path.join(process.cwd(), 'data', 'scraped_audit', 'reports', safeName);
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
      }
      const content = fs.readFileSync(filePath, 'utf-8');
      return NextResponse.json({ success: true, filename: safeName, content });
    }

    // 4. Return complete audit checklist for any scraped clean file
    if (action === 'audit-checklist' && filename) {
      const safeName = path.basename(filename);
      const filePath = path.join(process.cwd(), 'scraped_clean', safeName);
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 });
      }
      const content = fs.readFileSync(filePath, 'utf-8');
      const origin = 'https://ongoweightloss.com';
      const checklistReport = generateAuditChecklist(content, content, `${origin}/${safeName.replace(/\.html$/, '')}`);
      return NextResponse.json({ success: true, filename: safeName, auditChecklist: checklistReport });
    }

    return NextResponse.json({ success: false, error: 'Invalid query parameters' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Request failed'
    }, { status: 500 });
  }
}


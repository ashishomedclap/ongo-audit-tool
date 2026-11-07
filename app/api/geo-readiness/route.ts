import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

export interface GeoSignalBreakdown {
  statisticDensity: {
    score: number; // 0 - 25
    count: number;
    examples: string[];
    status: 'EXCELLENT' | 'ADEQUATE' | 'NEEDS_DATA';
    recommendation: string;
  };
  physicianQuotes: {
    score: number; // 0 - 25
    count: number;
    quotes: string[];
    attributions?: string[];
    status: 'EXCELLENT' | 'MODERATE' | 'MISSING_QUOTES';
    recommendation: string;
  };
  clinicalCitations: {
    score: number; // 0 - 20
    count: number;
    sources: string[];
    status: 'PEER_REVIEWED' | 'MINIMAL' | 'UNSUBSTANTIATED';
    recommendation: string;
  };
  tldrDirectAnswers: {
    score: number; // 0 - 15
    detected: boolean;
    snippet?: string;
    wordCount?: number;
    status: 'OPTIMIZED' | 'MARGINAL' | 'ABSENT';
    recommendation: string;
  };
  medicalSchema: {
    score: number; // 0 - 15
    hasMedicalWebPage: boolean;
    hasPhysician: boolean;
    hasDrug: boolean;
    detectedTypes: string[];
    status: 'COMPLETE' | 'PARTIAL' | 'MISSING';
    recommendation: string;
  };
}

export interface GeoAuditResult {
  target: string;
  url?: string;
  sourceType: 'LIVE_URL' | 'OFFLINE_ARCHIVE' | 'MANUAL_DRAFT';
  metaDescription?: string;
  wordCount: number;
  extractedSnippet?: string;
  detectedSchemas: string[];
  outboundCitations: string[];
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  aiSearchVisibilityIndex: 'VERY HIGH (Top 3 AI Citation)' | 'HIGH (Likely Mention)' | 'MODERATE' | 'LOW RISK OF EXCLUSION';
  signals: GeoSignalBreakdown;
  quickFixes: string[];
}

// Map of canonical Ongo URL paths to verified local scraped HTML archives
const ONGO_ARCHIVE_MAP: Record<string, string> = {
  '/': '01-homepage.html',
  '': '01-homepage.html',
  '/about': '02-about.html',
  '/contact': '03-contact.html',
  '/eligibility': '04-eligibility.html',
  '/faq': '05-faq.html',
  '/how-it-works': '06-how-it-works.html',
  '/pricing': '07-pricing.html',
  '/services': '08-services.html',
  '/blog': '09-blog.html',
  '/blog/what-are-glp-1-medications-and-how-they-support-weight-loss': '10-blog-what-are-glp-1-medications-and-how-they-support-weight-loss.html',
  '/services/glp-1': '32-services-glp-1.html',
  '/services/glp-1/compounded-semaglutide': '11-services-glp-1-compounded-semaglutide.html',
  '/services/glp-1-compounded-semaglutide': '11-services-glp-1-compounded-semaglutide.html',
  '/services/glp-1/compounded-tirzepatide': '33-services-glp-1-compounded-tirzepatide.html',
  '/services/glp-1-compounded-tirzepatide': '33-services-glp-1-compounded-tirzepatide.html',
  '/medical-team': '23-medical-team.html',
  '/medical-team/dr-benjamin-krasne': '24-medical-team-dr-benjamin-krasne.html',
  '/medical-team/dr-david-okonkwo': '25-medical-team-dr-david-okonkwo-md.html',
  '/medical-team/dr-david-okonkwo-md': '25-medical-team-dr-david-okonkwo-md.html',
  '/medical-team/dr-gaurav-patel': '26-medical-team-dr-gaurav-k-patel-md.html',
  '/medical-team/dr-gaurav-k-patel-md': '26-medical-team-dr-gaurav-k-patel-md.html',
  '/medical-team/dr-johnathan-miller': '27-medical-team-dr-jonathan-miller.html',
  '/medical-team/dr-zachary-kramer': '28-medical-team-dr-zachary-b-kramer-md.html',
  '/medical-team/dr-zachary-b-kramer-md': '28-medical-team-dr-zachary-b-kramer-md.html',
  '/locations': '21-locations.html',
  '/locations/texas/houston': '22-houston-weight-loss.html',
  '/houston-weight-loss': '22-houston-weight-loss.html',
  '/about/clinical-excellence': '29-about-clinical-excellence.html',
  '/about/innovation': '30-about-innovation.html',
  '/about/quality-and-safety': '31-about-quality-and-safety.html',
  '/policies/california-privacy-statement': '12-policies-california-privacy-statement.html',
  '/policies/disclaimer': '13-policies-disclaimer.html',
  '/policies/editorial-policy': '14-policies-editorial-policy.html',
  '/policies/notice-of-privacy-practices': '15-policies-notice-of-privacy-practices.html',
  '/policies/patient-bill-of-rights': '16-policies-patient-bill-of-rights.html',
  '/policies/privacy-policy': '17-policies-privacy-policy.html',
  '/policies/refund-policy': '18-policies-refund-policy.html',
  '/policies/shipping-policy': '19-policies-shipping-policy.html',
  '/policies/terms-of-service': '20-policies-terms-of-service.html',
  '/blog/semaglutide/semaglutide-dosing-guide': '11-services-glp-1-compounded-semaglutide.html',
  '/blog/tirzepatide/tirzepatide-dosing-guide': '33-services-glp-1-compounded-tirzepatide.html',
  '/blog/semaglutide/semaglutide-for-weight-loss': '10-blog-what-are-glp-1-medications-and-how-they-support-weight-loss.html'
};

function tryLoadLocalArchive(urlStr: string): { html: string; archiveFile: string } | null {
  try {
    let cleanPath = urlStr;
    try {
      const parsed = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
      cleanPath = parsed.pathname.replace(/\/$/, '') || '/';
    } catch {
      cleanPath = urlStr.replace(/\/$/, '') || '/';
    }

    let matchFile = ONGO_ARCHIVE_MAP[cleanPath];
    if (!matchFile) {
      // Fuzzy search against keys
      const keys = Object.keys(ONGO_ARCHIVE_MAP);
      const foundKey = keys.find(k => k !== '/' && cleanPath.toLowerCase().includes(k.toLowerCase()));
      if (foundKey) {
        matchFile = ONGO_ARCHIVE_MAP[foundKey];
      }
    }

    if (!matchFile && (cleanPath === '/' || cleanPath === '' || cleanPath.includes('ongo'))) {
      matchFile = '01-homepage.html';
    }

    if (matchFile) {
      let filePath = path.join(process.cwd(), 'scraped_clean', matchFile);
      if (!fs.existsSync(filePath)) {
        filePath = path.join(process.cwd(), 'audit-tool', 'scraped_clean', matchFile);
      }
      if (fs.existsSync(filePath)) {
        return {
          html: fs.readFileSync(filePath, 'utf-8'),
          archiveFile: matchFile
        };
      }
    }
  } catch (err) {
    console.error('Local archive resolution error:', err);
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawUrl: string | undefined = body.url?.trim();
    let text: string = body.text || '';
    let title: string = body.title || 'Page Audit';
    let metaDescription = '';
    let sourceType: 'LIVE_URL' | 'OFFLINE_ARCHIVE' | 'MANUAL_DRAFT' = 'MANUAL_DRAFT';
    const detectedSchemas: string[] = [];
    const outboundCitations: string[] = [];
    let targetDisplay = title;

    if (rawUrl) {
      let normalizedUrl = rawUrl;
      if (!/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = `https://${normalizedUrl}`;
      }
      targetDisplay = normalizedUrl;

      let html = '';
      let fetchSuccess = false;

      // 1. Attempt live HTTP fetch
      try {
        const res = await fetch(normalizedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (GEO-Auditor/1.0)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9'
          },
          signal: AbortSignal.timeout(8000),
          redirect: 'follow'
        });

        if (res.ok) {
          html = await res.text();
          fetchSuccess = true;
          sourceType = 'LIVE_URL';
        }
      } catch (err) {
        // Fetch failed or blocked (e.g. sandbox offline or network restriction)
        console.warn(`Live fetch failed for ${normalizedUrl}:`, (err as any)?.message);
      }

      // 2. Fallback to local verified archive if live fetch failed and domain matches Ongo
      if (!fetchSuccess) {
        const local = tryLoadLocalArchive(normalizedUrl);
        if (local) {
          html = local.html;
          sourceType = 'OFFLINE_ARCHIVE';
        } else {
          return NextResponse.json({
            success: false,
            error: `Unable to reach "${normalizedUrl}". If this is an external third-party website, verify your internet connection, or copy and paste the article text into the Draft Content mode.`
          }, { status: 400 });
        }
      }

      // 3. Parse HTML via Cheerio
      const $ = cheerio.load(html);

      // Extract Title
      const pageTitle = $('title').text().trim();
      const h1Title = $('h1').first().text().trim();
      title = h1Title || pageTitle || normalizedUrl;
      targetDisplay = title;

      // Extract Meta Description
      metaDescription = $('meta[name="description"]').attr('content') ||
        $('meta[property="og:description"]').attr('content') ||
        $('meta[name="twitter:description"]').attr('content') || '';

      // Extract JSON-LD Schemas
      $('script[type="application/ld+json"]').each((_, el) => {
        try {
          const content = $(el).html();
          if (content) {
            const parsed = JSON.parse(content);
            const collectTypes = (obj: any) => {
              if (!obj) return;
              if (Array.isArray(obj)) {
                obj.forEach(collectTypes);
              } else if (typeof obj === 'object') {
                if (obj['@type']) {
                  if (Array.isArray(obj['@type'])) {
                    detectedSchemas.push(...obj['@type']);
                  } else {
                    detectedSchemas.push(obj['@type']);
                  }
                }
                if (obj['@graph'] && Array.isArray(obj['@graph'])) {
                  obj['@graph'].forEach(collectTypes);
                }
              }
            };
            collectTypes(parsed);
          }
        } catch {}
      });

      // Extract Outbound Clinical/Authoritative Citations
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href') || '';
        if (/nih\.gov|fda\.gov|nejm\.org|jamanetwork|pubmed|clinicaltrials\.gov|cdc\.gov|doi\.org|nature\.com|thelancet\.com/i.test(href)) {
          if (!outboundCitations.includes(href)) {
            outboundCitations.push(href);
          }
        }
      });

      // Remove noise & boilerplate
      $('script, style, noscript, nav, footer, header, svg, iframe, form, button, [role="navigation"], [role="banner"]').remove();

      // Smart spacing to preserve boundaries between tables, spans, badges, and divs
      $('h1, h2, h3, h4, h5, h6, p, li, dt, dd, td, th, div, span, blockquote').each((_, el) => {
        $(el).after('\n');
      });

      const rawText = $('body').text();
      const cleanLines = rawText
        .split('\n')
        .map(line => line.replace(/\s+/g, ' ').trim())
        .filter(line => line.length > 0);

      text = cleanLines.join('\n');
    }

    // 1. Evaluate Statistic Density (Percentages, Milligrams, Sample Sizes, p-values, dollar figures, weights)
    const statMatches = text.match(/(\d+(?:\.\d+)?%|\$\d+(?:,\d+)?|\b\d+(?:\.\d+)?\s*mg\b|\b\d{1,3}(?:,\d{3})+\b|p\s*[<=]\s*0\.\d+|week\s*\d+|\b\d+\s*lbs\b|BMI\s*[>=<]\s*\d+)/gi) || [];
    const uniqueStats = Array.from(new Set(statMatches));
    const wordCount = Math.max(text.split(/\s+/).filter(Boolean).length, 1);
    const statDensityPer1k = (uniqueStats.length / wordCount) * 1000;
    
    let statScore = Math.min(25, Math.round(statDensityPer1k * 3.5));
    if (uniqueStats.length >= 8) statScore = 25;
    else if (uniqueStats.length >= 4) statScore = Math.max(statScore, 18);
    else if (uniqueStats.length >= 2) statScore = Math.max(statScore, 12);

    // 2. Evaluate Physician & Clinical Quotations
    const quoteMatches = text.match(/"([^"]{20,})"/g) || text.match(/“([^”]{20,})”/g) || [];
    const mdPrefixMatches = text.match(/\b(?:Dr\.|Doctor)\s+[A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+/g) || [];
    const mdPostfixMatches = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+,\s*(?:MD|DO|PhD|FACP|FACE)\b/g) || [];
    const mdRoleMentions = text.match(/\b(?:board-certified|medical director|licensed physician|clinical director|endocrinologist)\b/gi) || [];
    const mdAttributions = Array.from(new Set([...mdPrefixMatches, ...mdPostfixMatches, ...mdRoleMentions]));

    let quoteScore = 0;
    if (quoteMatches.length >= 2 && mdAttributions.length >= 1) quoteScore = 25;
    else if (quoteMatches.length >= 1 && mdAttributions.length >= 1) quoteScore = 20;
    else if (quoteMatches.length >= 1 || mdAttributions.length >= 2) quoteScore = 16;
    else if (mdAttributions.length >= 1) quoteScore = 12;
    else quoteScore = 4;

    // 3. Clinical Citations & Federal Registry Outbound Links (NEJM, JAMA, FDA, NIH, PubMed)
    const citationKeywords = ['nejm', 'jama', 'lancet', 'fda', 'pubmed', 'clinicaltrials', 'step 1', 'step-1', 'surmount', 'nih', 'cdc', 'doi', '503a', 'usp <797>'];
    const foundKeywords = citationKeywords.filter(k => text.toLowerCase().includes(k));
    const totalCitations = Array.from(new Set([...foundKeywords, ...outboundCitations]));
    let citationScore = Math.min(20, totalCitations.length * 5);
    if (outboundCitations.length >= 2) citationScore = Math.max(citationScore, 18);

    // 4. TL;DR Direct Answer Blocks (40 - 75 words answering the primary user question)
    const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    const tldrCandidate = paragraphs.find(p => {
      const words = p.split(/\s+/).length;
      return words >= 28 && words <= 85 && /(is a|works by|provides|cost of|treatment|compounded|subcutaneous|agonist)/i.test(p);
    });
    let tldrScore = tldrCandidate ? 15 : 5;

    // 5. Medical Schema & Structured Entities
    const hasMedicalWebPage = detectedSchemas.some(s => /medicalwebpage|webpage/i.test(s)) || /(medicalwebpage|json-ld|schema\.org)/i.test(text);
    const hasPhysician = detectedSchemas.some(s => /physician|person|medicalbusiness/i.test(s)) || mdAttributions.length > 0;
    const hasDrug = detectedSchemas.some(s => /drug|substance|medicaltherapy/i.test(s)) || /semaglutide|tirzepatide|glp-1/i.test(text);
    
    let schemaScore = 0;
    if (detectedSchemas.length >= 2) schemaScore = 15;
    else if (detectedSchemas.length === 1) schemaScore = 12;
    else if (hasMedicalWebPage && (hasPhysician || hasDrug)) schemaScore = 10;
    else if (hasPhysician || hasDrug) schemaScore = 7;
    else schemaScore = 3;

    const overallScore = Math.min(100, statScore + quoteScore + citationScore + tldrScore + schemaScore);
    const grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 
      overallScore >= 90 ? 'A+' :
      overallScore >= 80 ? 'A' :
      overallScore >= 68 ? 'B' :
      overallScore >= 50 ? 'C' : 'D';

    const visibilityIndex = 
      overallScore >= 85 ? 'VERY HIGH (Top 3 AI Citation)' :
      overallScore >= 70 ? 'HIGH (Likely Mention)' :
      overallScore >= 55 ? 'MODERATE' : 'LOW RISK OF EXCLUSION';

    const quickFixes: string[] = [];
    if (uniqueStats.length < 5) quickFixes.push('Inject at least 3 clinical data points (e.g. "14.9% mean weight loss in the STEP-1 trial", "$199/month starting rate").');
    if (quoteMatches.length === 0) quickFixes.push('Add a direct clinical quotation from Dr. Brett Kramer or Ongo Medical Director.');
    if (totalCitations.length < 2) quickFixes.push('Reference at least 1 peer-reviewed study (NEJM / JAMA) or PubMed PMID to increase AI citation probability by ~38%.');
    if (!tldrCandidate) quickFixes.push('Add a concise 45-word definition block directly beneath the H1 title answering: What is it, how does it work, and what is the expected outcome?');
    if (detectedSchemas.length === 0) quickFixes.push('Embed JSON-LD structured data in the HTML <head> with MedicalWebPage, Physician, and Drug schemas.');

    const result: GeoAuditResult = {
      target: targetDisplay,
      url: rawUrl,
      sourceType,
      metaDescription,
      wordCount,
      extractedSnippet: text.slice(0, 450),
      detectedSchemas: Array.from(new Set(detectedSchemas)),
      outboundCitations,
      overallScore,
      grade,
      aiSearchVisibilityIndex: visibilityIndex,
      signals: {
        statisticDensity: {
          score: statScore,
          count: uniqueStats.length,
          examples: uniqueStats.slice(0, 8),
          status: statScore >= 20 ? 'EXCELLENT' : (statScore >= 12 ? 'ADEQUATE' : 'NEEDS_DATA'),
          recommendation: statScore >= 20 ? 'Optimal numerical density for LLM fact extraction.' : 'Increase concrete data points to ground AI summaries.'
        },
        physicianQuotes: {
          score: quoteScore,
          count: quoteMatches.length,
          quotes: quoteMatches.slice(0, 3),
          attributions: mdAttributions.slice(0, 5),
          status: quoteScore >= 20 ? 'EXCELLENT' : (quoteScore >= 12 ? 'MODERATE' : 'MISSING_QUOTES'),
          recommendation: quoteScore >= 20 ? 'Authoritative quotes present.' : 'Inject expert commentary to fulfill E-E-A-T quotation heuristics.'
        },
        clinicalCitations: {
          score: citationScore,
          count: totalCitations.length,
          sources: totalCitations.slice(0, 8),
          status: citationScore >= 15 ? 'PEER_REVIEWED' : (citationScore >= 8 ? 'MINIMAL' : 'UNSUBSTANTIATED'),
          recommendation: citationScore >= 15 ? 'Strong medical grounding.' : 'Add peer-reviewed PubMed citations.'
        },
        tldrDirectAnswers: {
          score: tldrScore,
          detected: !!tldrCandidate,
          snippet: tldrCandidate?.slice(0, 250),
          wordCount: tldrCandidate ? tldrCandidate.split(/\s+/).length : 0,
          status: tldrCandidate ? 'OPTIMIZED' : 'ABSENT',
          recommendation: tldrCandidate ? 'Direct answer block detected.' : 'Add a standalone 40-60 word summary.'
        },
        medicalSchema: {
          score: schemaScore,
          hasMedicalWebPage,
          hasPhysician,
          hasDrug,
          detectedTypes: detectedSchemas,
          status: schemaScore >= 12 ? 'COMPLETE' : (schemaScore >= 7 ? 'PARTIAL' : 'MISSING'),
          recommendation: schemaScore >= 12 ? 'Structured data recognized.' : 'Ensure MedicalWebPage and Physician schema are rendered in HTML head.'
        }
      },
      quickFixes
    };

    return NextResponse.json({ success: true, result });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'Audit failed' }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCompetitorsSummary } from '@/lib/data';

export interface KeywordExplorerItem {
  id: number;
  keyword: string;
  url: string;
  competitor: string;
  position: number;
  volume: number;
  kd: number;
  traffic: number;
  intent: string;
  opportunityScore: number;
}

// Global in-memory cache for fast sub-millisecond filtering
let cachedKeywords: KeywordExplorerItem[] | null = null;

function loadKeywords(): KeywordExplorerItem[] {
  if (cachedKeywords) return cachedKeywords;

  try {
    const filePath = path.join(process.cwd(), 'data', 'keywords_explorer.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      cachedKeywords = JSON.parse(content) as KeywordExplorerItem[];
      return cachedKeywords;
    }
  } catch (err) {
    console.error('Error loading keywords_explorer.json:', err);
  }

  return [];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode') || 'explorer'; // 'explorer' or 'sitemap'
    const query = (searchParams.get('q') || '').trim().toLowerCase();

    // MODE 1: Sitemap raw URL search (legacy / URL crawler mode)
    if (mode === 'sitemap') {
      if (!query) {
        return NextResponse.json({ success: false, error: 'Query parameter q is required for sitemap mode' }, { status: 400 });
      }

      const competitors = getCompetitorsSummary();
      const dataDir = path.join(process.cwd(), 'data', 'sitemaps');

      const matches: {
        competitorName: string;
        domain: string;
        rank: number;
        folder: string;
        matchCount: number;
        sampleUrls: string[];
      }[] = [];

      let totalMatchingUrls = 0;

      for (const comp of competitors) {
        if (!comp.localFolder) continue;
        const urlsFile = path.join(dataDir, comp.localFolder, 'all_urls.txt');
        if (!fs.existsSync(urlsFile)) continue;

        try {
          const content = fs.readFileSync(urlsFile, 'utf8');
          const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
          const compMatches: string[] = [];

          for (const url of lines) {
            if (url.toLowerCase().includes(query)) {
              compMatches.push(url);
            }
          }

          if (compMatches.length > 0) {
            totalMatchingUrls += compMatches.length;
            matches.push({
              competitorName: comp.name,
              domain: comp.domain,
              rank: comp.rank,
              folder: comp.localFolder,
              matchCount: compMatches.length,
              sampleUrls: compMatches.slice(0, 10)
            });
          }
        } catch {}
      }

      matches.sort((a, b) => b.matchCount - a.matchCount);

      return NextResponse.json({
        success: true,
        mode: 'sitemap',
        query,
        totalCompetitorsMatched: matches.length,
        totalMatchingUrls,
        results: matches
      });
    }

    // MODE 2: Keyword Explorer (54,841 real Google Sheet keywords)
    const allKeywords = loadKeywords();

    const competitor = searchParams.get('competitor') || 'all';
    const intent = searchParams.get('intent') || 'all';
    const maxKdParam = searchParams.get('maxKd');
    const minVolParam = searchParams.get('minVolume');
    const minOppParam = searchParams.get('minOpp');
    const sort = searchParams.get('sort') || 'opportunity'; // opportunity, volume, kd, traffic, position, keyword
    const order = searchParams.get('order') || 'desc'; // desc or asc
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(200, Math.max(10, parseInt(searchParams.get('limit') || '50', 10)));

    const maxKd = maxKdParam !== null && maxKdParam !== '' ? parseInt(maxKdParam, 10) : null;
    const minVolume = minVolParam !== null && minVolParam !== '' ? parseInt(minVolParam, 10) : null;
    const minOpp = minOppParam !== null && minOppParam !== '' ? parseFloat(minOppParam) : null;

    // Filter pipeline
    let filtered = allKeywords;

    if (query) {
      filtered = filtered.filter(item => 
        item.keyword.toLowerCase().includes(query) || 
        item.url.toLowerCase().includes(query)
      );
    }

    if (competitor && competitor !== 'all') {
      const compLower = competitor.toLowerCase();
      filtered = filtered.filter(item => item.competitor.toLowerCase() === compLower);
    }

    if (intent && intent !== 'all') {
      const intentLower = intent.toLowerCase();
      filtered = filtered.filter(item => item.intent.toLowerCase().includes(intentLower));
    }

    if (maxKd !== null && !isNaN(maxKd)) {
      filtered = filtered.filter(item => item.kd <= maxKd);
    }

    if (minVolume !== null && !isNaN(minVolume)) {
      filtered = filtered.filter(item => item.volume >= minVolume);
    }

    if (minOpp !== null && !isNaN(minOpp)) {
      filtered = filtered.filter(item => item.opportunityScore >= minOpp);
    }

    // Calculate aggregated metrics across filtered set
    let totalVolume = 0;
    let totalTraffic = 0;
    let totalKd = 0;
    const competitorCounts: Record<string, number> = {};
    const intentCounts: Record<string, number> = {};

    for (let i = 0; i < filtered.length; i++) {
      const it = filtered[i];
      totalVolume += it.volume;
      totalTraffic += it.traffic;
      totalKd += it.kd;
      competitorCounts[it.competitor] = (competitorCounts[it.competitor] || 0) + 1;
      intentCounts[it.intent] = (intentCounts[it.intent] || 0) + 1;
    }

    const avgKd = filtered.length > 0 ? Math.round(totalKd / filtered.length) : 0;
    const topOpportunity = filtered.length > 0 ? filtered[0] : null;

    // Sort
    const isAsc = order === 'asc';
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sort) {
        case 'volume':
          comparison = a.volume - b.volume;
          break;
        case 'kd':
          comparison = a.kd - b.kd;
          break;
        case 'traffic':
          comparison = a.traffic - b.traffic;
          break;
        case 'position':
          comparison = a.position - b.position;
          break;
        case 'keyword':
          comparison = a.keyword.localeCompare(b.keyword);
          break;
        case 'opportunity':
        default:
          comparison = a.opportunityScore - b.opportunityScore;
          break;
      }
      return isAsc ? comparison : -comparison;
    });

    // Pagination
    const totalResults = filtered.length;
    const totalPages = Math.ceil(totalResults / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      mode: 'explorer',
      totalAvailable: allKeywords.length,
      totalResults,
      page,
      limit,
      totalPages,
      metrics: {
        totalVolume,
        totalTraffic,
        avgKd,
        competitorCounts,
        intentCounts,
        topOpportunity
      },
      items: paginatedItems
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

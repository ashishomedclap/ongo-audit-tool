import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCompetitorsSummary } from '@/lib/data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').trim().toLowerCase();

    if (!query) {
      return NextResponse.json({ success: false, error: 'Query parameter q is required' }, { status: 400 });
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
            sampleUrls: compMatches.slice(0, 10) // top 10 URLs
          });
        }
      } catch {}
    }

    // Sort by match count descending
    matches.sort((a, b) => b.matchCount - a.matchCount);

    return NextResponse.json({
      success: true,
      query,
      totalCompetitorsMatched: matches.length,
      totalMatchingUrls,
      results: matches
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

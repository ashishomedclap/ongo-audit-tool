import { NextRequest, NextResponse } from 'next/server';
import { generateCompetitorGapAnalysis } from '@/lib/competitor-gap-engine';

export async function GET() {
  try {
    const analysis = generateCompetitorGapAnalysis();
    return NextResponse.json({
      success: true,
      lastUpdated: new Date().toISOString(),
      ...analysis
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const analysis = generateCompetitorGapAnalysis();

    let roadmap = analysis.roadmap;
    if (body.priority && body.priority !== 'all') {
      roadmap = roadmap.filter(i => i.priority.startsWith(body.priority));
    }
    if (body.silo && body.silo !== 'all') {
      roadmap = roadmap.filter(i => i.targetSilo === body.silo);
    }
    if (body.status && body.status !== 'all') {
      roadmap = roadmap.filter(i => i.roadmapStatus === body.status);
    }
    if (body.search) {
      const q = body.search.toLowerCase();
      roadmap = roadmap.filter(i =>
        i.topicName.toLowerCase().includes(q) ||
        i.targetSlug.toLowerCase().includes(q) ||
        i.primaryKeywords.some(k => k.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      totalCompetitorUrlsAnalyzed: analysis.totalCompetitorUrlsAnalyzed,
      totalCompetitorsAnalyzed: analysis.totalCompetitorsAnalyzed,
      ongoLivePagesCount: analysis.ongoLivePagesCount,
      totalGapsIdentified: analysis.totalGapsIdentified,
      filteredCount: roadmap.length,
      p0Count: analysis.p0Count,
      p1Count: analysis.p1Count,
      p2Count: analysis.p2Count,
      siloCoverageBreakdown: analysis.siloCoverageBreakdown,
      roadmap
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}


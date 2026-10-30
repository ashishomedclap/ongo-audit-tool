import { NextRequest, NextResponse } from 'next/server';
import { generateInternalLinkAudit } from '@/lib/internal-links-engine';

export async function GET() {
  try {
    const audit = generateInternalLinkAudit();
    return NextResponse.json({
      success: true,
      lastAudited: new Date().toISOString(),
      ...audit
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const audit = generateInternalLinkAudit();

    let recs = audit.recommendations;
    if (body.priority && body.priority !== 'all') {
      recs = recs.filter(r => r.priority.startsWith(body.priority));
    }
    if (body.rule && body.rule !== 'all') {
      recs = recs.filter(r => r.linkRule === body.rule);
    }
    if (body.silo && body.silo !== 'all') {
      recs = recs.filter(r => r.targetSilo === body.silo);
    }
    if (body.sourceUrl) {
      recs = recs.filter(r => r.sourceUrl.includes(body.sourceUrl));
    }

    return NextResponse.json({
      success: true,
      lastAudited: new Date().toISOString(),
      totalPagesScanned: audit.totalPagesScanned,
      totalRecommendations: audit.totalRecommendations,
      filteredCount: recs.length,
      p0Count: audit.p0Count,
      p1Count: audit.p1Count,
      p2Count: audit.p2Count,
      ruleCounts: audit.ruleCounts,
      siloCounts: audit.siloCounts,
      recommendations: recs
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}


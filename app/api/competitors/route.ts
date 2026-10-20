import { NextResponse } from 'next/server';
import { getCompetitorsSummary, getArchitectureAnalysis } from '@/lib/data';

export async function GET() {
  try {
    const competitors = getCompetitorsSummary();
    const architecture = getArchitectureAnalysis();
    return NextResponse.json({
      success: true,
      count: competitors.length,
      competitors,
      architectureOverview: architecture?.master_category_counts || {}
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

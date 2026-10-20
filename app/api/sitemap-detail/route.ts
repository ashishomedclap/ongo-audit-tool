import { NextRequest, NextResponse } from 'next/server';
import { getCompetitorDetail } from '@/lib/data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get('folder');

    if (!folder) {
      return NextResponse.json({ success: false, error: 'Folder parameter is required' }, { status: 400 });
    }

    const detail = getCompetitorDetail(folder);
    if (!detail) {
      return NextResponse.json({ success: false, error: 'Competitor not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      detail
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getAvailableReports, getReportContent } from '@/lib/data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    if (name) {
      const content = getReportContent(name);
      return NextResponse.json({
        success: true,
        name,
        content
      });
    }

    const reports = getAvailableReports();
    return NextResponse.json({
      success: true,
      reports
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

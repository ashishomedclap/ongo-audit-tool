import { NextResponse } from 'next/server';
import { getBooksIndex } from '@/lib/data';

export async function GET() {
  try {
    const index = getBooksIndex();
    return NextResponse.json(index);
  } catch (error: any) {
    if (error?.digest === 'NEXT_PRERENDER_INTERRUPTED') {
      throw error;
    }
    console.error('API /api/books error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve books data' },
      { status: 500 }
    );
  }
}

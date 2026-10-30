import { NextRequest, NextResponse } from 'next/server';
import { getBookBySlug } from '@/lib/data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const book = getBookBySlug(slug);

    if (!book) {
      return NextResponse.json(
        { error: `Book '${slug}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error: any) {
    if (error?.digest === 'NEXT_PRERENDER_INTERRUPTED') {
      throw error;
    }
    console.error('API /api/books/[slug] error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve book' },
      { status: 500 }
    );
  }
}

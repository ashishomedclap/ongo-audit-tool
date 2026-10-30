import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getBookBySlug } from '@/lib/data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const book = getBookBySlug(slug);

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Resolve the clean PDF file from public/books
    const cleanFileName = book.pdfUrl.replace(/^\/books\//, '');
    const pdfPath = path.join(process.cwd(), 'public', 'books', cleanFileName);
    if (!fs.existsSync(pdfPath)) {
      // Fallback check
      const fallbackPath = path.join(process.cwd(), 'public', 'books', book.fileName);
      if (!fs.existsSync(fallbackPath)) {
        return NextResponse.json({ error: 'PDF file not found' }, { status: 404 });
      }
      const fileBuffer = fs.readFileSync(fallbackPath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${book.fileName}"`,
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200'
        }
      });
    }

    const fileBuffer = fs.readFileSync(pdfPath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${book.fileName}"`,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200'
      }
    });
  } catch (error) {
    console.error('API /api/books/pdf/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to serve PDF' }, { status: 500 });
  }
}

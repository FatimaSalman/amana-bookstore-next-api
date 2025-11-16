import { NextRequest, NextResponse } from 'next/server';
import booksData from '@/app/data/books.json';

// GET /api/books/[id] - Get single book by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;
    const book = booksData.books.find(b => b.id === bookId);

    if (!book) {
      return NextResponse.json(
        {
          success: false,
          message: `Book not found with ID: ${bookId}`,
          suggestedIds: booksData.books.map(b => b.id)
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: book
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching book', error: (error as Error).message },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import booksData from '@/app/data/books.json';

// GET /api/books/featured - Get featured books
export async function GET() {
  try {
    const featuredBooks = booksData.books.filter(book => book.featured);

    return NextResponse.json({
      success: true,
      count: featuredBooks.length,
      data: featuredBooks
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching featured books', error: (error as Error).message },
      { status: 500 }
    );
  }
}
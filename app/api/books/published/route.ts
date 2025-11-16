import { NextRequest, NextResponse } from 'next/server';
import booksData from '@/app/data/books.json';

// GET /api/books/published - Get books by date range
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sort = searchParams.get('sort') || 'date_desc';

    // Validate required parameters
    if (!startDate || !endDate) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Both startDate and endDate query parameters are required',
          example: '/api/books/published?startDate=2022-01-01&endDate=2023-12-31'
        },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    if (end < start) {
      return NextResponse.json(
        { success: false, message: 'endDate must be after or equal to startDate' },
        { status: 400 }
      );
    }

    // Filter books by publication date range
    const filteredBooks = booksData.books.filter(book => {
      const bookDate = new Date(book.datePublished);
      return bookDate >= start && bookDate <= end;
    });

    // Sort results
    let sortedBooks = [...filteredBooks];
    switch (sort) {
      case 'date_asc':
        sortedBooks.sort((a, b) => new Date(a.datePublished).getTime() - new Date(b.datePublished).getTime());
        break;
      case 'date_desc':
        sortedBooks.sort((a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime());
        break;
      case 'title_asc':
        sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating_desc':
        sortedBooks.sort((a, b) => b.rating - a.rating);
        break;
    }

    const dateStats = {
      totalBooksInRange: sortedBooks.length,
      dateRange: {
        start: startDate,
        end: endDate,
        daysInRange: Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      }
    };

    return NextResponse.json({
      success: true,
      statistics: dateStats,
      count: sortedBooks.length,
      data: sortedBooks
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching books by date range', error: (error as Error).message },
      { status: 500 }
    );
  }
}
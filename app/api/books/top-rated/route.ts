import { NextRequest, NextResponse } from 'next/server';
import booksData from '@/app/data/books.json';

// GET /api/books/top-rated - Get top rated books
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const minReviews = parseInt(searchParams.get('minReviews') || '0');

    let filteredBooks = booksData.books;
    
    if (minReviews > 0) {
      filteredBooks = filteredBooks.filter(book => book.reviewCount >= minReviews);
    }

    // Calculate weighted score (rating * reviewCount)
    const booksWithScores = filteredBooks.map(book => ({
      ...book,
      weightedScore: book.rating * book.reviewCount,
      scoreExplanation: `Rating (${book.rating}) × Reviews (${book.reviewCount}) = ${(book.rating * book.reviewCount).toFixed(1)}`
    }));

    // Sort by weighted score (descending) and take top N
    const topBooks = booksWithScores
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      statistics: {
        totalBooksConsidered: filteredBooks.length,
        algorithm: 'rating × reviewCount',
        minimumReviews: minReviews
      },
      count: topBooks.length,
      data: topBooks
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching top rated books', error: (error as Error).message },
      { status: 500 }
    );
  }
}
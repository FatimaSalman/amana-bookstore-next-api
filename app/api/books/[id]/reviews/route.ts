import { NextRequest, NextResponse } from 'next/server';
import booksData from '@/app/data/books.json';
import reviewsData from '@/app/data/reviews.json';

// GET /api/books/[id]/reviews - Get reviews for a specific book
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookId = params.id;
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'date_desc';
    const verified = searchParams.get('verified');
    const rating = searchParams.get('rating');

    // Check if book exists
    const book = booksData.books.find(b => b.id === bookId);
    if (!book) {
      return NextResponse.json(
        { success: false, message: `Book not found with ID: ${bookId}` },
        { status: 404 }
      );
    }

    // Get reviews for this book
    let bookReviews = reviewsData.reviews.filter(review => review.bookId === bookId);

    // Apply filters
    if (verified === 'true') {
      bookReviews = bookReviews.filter(review => review.verified);
    } else if (verified === 'false') {
      bookReviews = bookReviews.filter(review => !review.verified);
    }

    if (rating && !isNaN(parseInt(rating))) {
      const ratingValue = parseInt(rating);
      bookReviews = bookReviews.filter(review => review.rating === ratingValue);
    }

    // Sort reviews
    let sortedReviews = [...bookReviews];
    switch (sort) {
      case 'rating_desc':
        sortedReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating_asc':
        sortedReviews.sort((a, b) => a.rating - b.rating);
        break;
      case 'date_desc':
        sortedReviews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        break;
      case 'date_asc':
        sortedReviews.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        break;
    }

    // Calculate review statistics
    const reviewStats = {
      total: bookReviews.length,
      averageRating: bookReviews.length > 0
        ? parseFloat((bookReviews.reduce((sum, review) => sum + review.rating, 0) / bookReviews.length).toFixed(1))
        : 0,
      verifiedCount: bookReviews.filter(review => review.verified).length,
      ratingDistribution: {
        5: bookReviews.filter(review => review.rating === 5).length,
        4: bookReviews.filter(review => review.rating === 4).length,
        3: bookReviews.filter(review => review.rating === 3).length,
        2: bookReviews.filter(review => review.rating === 2).length,
        1: bookReviews.filter(review => review.rating === 1).length
      }
    };

    return NextResponse.json({
      success: true,
      book: {
        id: book.id,
        title: book.title,
        author: book.author,
        overallRating: book.rating,
        totalReviews: book.reviewCount
      },
      statistics: reviewStats,
      filters: {
        sort,
        verified: verified || 'all',
        rating: rating || 'all'
      },
      count: sortedReviews.length,
      data: sortedReviews
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching book reviews', error: (error as Error).message },
      { status: 500 }
    );
  }
}
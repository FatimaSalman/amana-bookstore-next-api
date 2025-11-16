import { NextRequest, NextResponse } from 'next/server';
import booksData from '@/app/data/books.json';
import reviewsData from '@/app/data/reviews.json';
import { authenticate, requireRole } from '@/app/lib/auth';

// POST /api/reviews - Add new review (protected route)
export async function POST(request: NextRequest) {
    try {
        // Authentication check
        const authResult = authenticate(request);
        if (!authResult.success) {
            return NextResponse.json(
                { success: false, message: authResult.error },
                { status: 401 }
            );
        }

        if (!authResult.user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 401 }
            );
        }

        // Authorization check
        const roleResult = requireRole(authResult.user, ['admin', 'reviewer']);
        if (!roleResult.success) {
            return NextResponse.json(
                { success: false, message: roleResult.error },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            bookId,
            author,
            rating,
            title,
            comment,
            verified = false
        } = body;

        // Validation
        if (!bookId || !author || !rating || !title || !comment) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Missing required fields',
                    required: ['bookId', 'author', 'rating', 'title', 'comment']
                },
                { status: 400 }
            );
        }

        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return NextResponse.json(
                { success: false, message: 'Rating must be a number between 1 and 5' },
                { status: 400 }
            );
        }

        // Check if book exists
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

        // Generate sequential review ID
        let newReviewId = '';
        let reviewNumber = 1;
        let idExists = true;

        while (idExists) {
            newReviewId = `review-${reviewNumber}`;
            const existingReview = reviewsData.reviews.find(review => review.id === newReviewId);
            if (!existingReview) {
                idExists = false;
            } else {
                reviewNumber++;
            }

            if (reviewNumber > 1000) {
                return NextResponse.json(
                    { success: false, message: 'Unable to generate unique review ID' },
                    { status: 500 }
                );
            }
        }

        // Create new review object
        const newReview = {
            id: newReviewId,
            bookId,
            author,
            rating: rating,
            title,
            comment,
            timestamp: new Date().toISOString(),
            verified: Boolean(verified),
            submittedBy: authResult.user?.username
        };

        // Note: In a real application, you would save to a database here

        return NextResponse.json({
            success: true,
            message: 'Review added successfully',
            data: newReview,
            submittedBy: authResult.user?.username,
            note: 'In a production environment, this review would be saved to the database'
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error adding review', error: (error as Error).message },
            { status: 500 }
        );
    }
}
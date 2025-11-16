import { NextRequest, NextResponse } from 'next/server';
import booksData from '@/app/data/books.json';
import { authenticate, requireRole } from '@/app/lib/auth';

// GET /api/books - Get all books
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured');
        const genre = searchParams.get('genre');
        const inStock = searchParams.get('inStock');

        let books = booksData.books;

        // Apply filters
        if (featured === 'true') {
            books = books.filter(book => book.featured);
        }

        if (genre) {
            books = books.filter(book =>
                book.genre.some(g => g.toLowerCase().includes(genre.toLowerCase()))
            );
        }

        if (inStock === 'true') {
            books = books.filter(book => book.inStock);
        } else if (inStock === 'false') {
            books = books.filter(book => !book.inStock);
        }

        return NextResponse.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error fetching books', error: (error as Error).message },
            { status: 500 }
        );
    }
}

// POST /api/books - Add new book (protected route)
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
        const roleResult = requireRole(authResult.user, ['admin', 'publisher']);
        if (!roleResult.success) {
            return NextResponse.json(
                { success: false, message: roleResult.error },
                { status: 403 }
            );
        }

        const body = await request.json();
        const {
            title,
            author,
            description,
            price,
            image = "/images/default-book.jpg",
            isbn,
            genre = [],
            tags = [],
            datePublished,
            pages,
            language = "English",
            publisher,
            rating = 0,
            reviewCount = 0,
            inStock = true,
            featured = false
        } = body;

        // Validation
        if (!title || !author || !description || !price || !isbn || !publisher) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Missing required fields',
                    required: ['title', 'author', 'description', 'price', 'isbn', 'publisher']
                },
                { status: 400 }
            );
        }
        // Check if ISBN already exists
        const existingBook = booksData.books.find(book => book.isbn === isbn);
        if (existingBook) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Book with this ISBN already exists',
                    existingBook: {
                        id: existingBook.id,
                        title: existingBook.title,
                        author: existingBook.author
                    }
                },
                { status: 409 }
            );
        }

        // Generate new book ID
        const newId = (Math.max(...booksData.books.map(book => parseInt(book.id))) + 1).toString();

        // Create new book object
        const newBook = {
            id: newId,
            title,
            author,
            description,
            price: parseFloat(price.toFixed(2)),
            image,
            isbn,
            genre: Array.isArray(genre) ? genre : [genre],
            tags: Array.isArray(tags) ? tags : [tags],
            datePublished: datePublished || new Date().toISOString().split('T')[0],
            pages: pages ? parseInt(pages) : undefined,
            language, publisher,
            rating: parseFloat(rating.toFixed(1)),
            reviewCount: parseInt(reviewCount),
            inStock: Boolean(inStock),
            featured: Boolean(featured),
            createdAt: new Date().toISOString(),
            createdBy: authResult.user?.username
        };

        // Note: In a real application, you would save to a database here
        // For this demo, we'll just return the book that would be created

        return NextResponse.json({
            success: true,
            message: 'Book added successfully',
            data: newBook,
            addedBy: authResult.user?.username,
            note: 'In a production environment, this book would be saved to the database'
        }, { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Error adding book', error: (error as Error).message },
            { status: 500 }
        );
    }
}
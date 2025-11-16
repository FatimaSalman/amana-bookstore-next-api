# Amana Bookstore Next.js API

A complete REST API for Amana Bookstore built with Next.js 14 and Vercel Serverless Functions.

## Features

- 📚 Complete book catalogue management
- ⭐ Review system with ratings
- 🔐 API key authentication
- 🚀 Serverless functions on Vercel
- 📊 Advanced filtering and search
- 🛡️ TypeScript for type safety

## API Endpoints

### Public GET Routes
- `GET /api/books` - Get all books (with optional filtering)
- `GET /api/books/featured` - Get featured books
- `GET /api/books/top-rated` - Get top rated books
- `GET /api/books/published` - Get books by date range
- `GET /api/books/[id]` - Get single book by ID
- `GET /api/books/[id]/reviews` - Get reviews for a book

### Authenticated POST Routes
- `POST /api/auth/login` - Login to get API key
- `POST /api/books` - Add new book (admin/publisher only)
- `POST /api/reviews` - Add new review (admin/reviewer only)

## Local Development

1. Install dependencies:
```bash
npm install
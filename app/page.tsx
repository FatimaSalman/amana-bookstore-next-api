export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>📚 Amana Bookstore API</h1>
      <p>Welcome to the Amana Bookstore API built with Next.js and Vercel Serverless Functions</p>

      <h2>Available Endpoints:</h2>
      <ul>
        <li><strong>GET</strong> /api/books - Get all books</li>
        <li><strong>GET</strong> /api/books/featured - Get featured books</li>
        <li><strong>GET</strong> /api/books/top-rated - Get top rated books</li>
        <li><strong>GET</strong> /api/books/published - Get books by date range</li>
        <li><strong>GET</strong> /api/books/[id] - Get single book by ID</li>
        <li><strong>GET</strong> /api/books/[id]/reviews - Get reviews for a book</li>
        <li><strong>POST</strong> /api/books - Add new book (authenticated)</li>
        <li><strong>POST</strong> /api/reviews - Add new review (authenticated)</li>
        <li><strong>POST</strong> /api/auth/login - Login to get API key</li>
      </ul>

      <h2>Quick Start:</h2>
      <pre>
        {`# Test the API
curl https://your-app.vercel.app/api/books
curl https://your-app.vercel.app/api/books/featured
curl https://your-app.vercel.app/api/books/1

# Login to get API key
curl -X POST https://your-app.vercel.app/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"username": "admin", "password": "bookstore2024"}'

# Use API key for protected routes
curl -X POST https://your-app.vercel.app/api/books \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer amana-admin-key-2024" \\
  -d '{
    "title": "New Book",
    "author": "Author Name",
    "description": "Book description",
    "price": 29.99,
    "isbn": "978-1234567890",
    "publisher": "Publisher Name"
  }'`}
      </pre>
    </main>
  );
}
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Amana Bookstore API',
  description: 'A comprehensive API for Amana Bookstore built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
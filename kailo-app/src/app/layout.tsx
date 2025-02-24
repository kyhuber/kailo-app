'use client';

import Link from 'next/link';
import '@/styles/globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="bg-blue-600 dark:bg-gray-800 text-white py-4 shadow-md">
          <nav className="container mx-auto flex justify-between px-4">
            <h1 className="text-xl font-bold">Kailo</h1>
            <div className="space-x-4">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/friends" className="hover:underline">Friends</Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 container mx-auto p-6">{children}</main>
        <footer className="bg-gray-800 text-white text-center py-4">
          <p>&copy; {new Date().getFullYear()} Kailo. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}


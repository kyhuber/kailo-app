// src/app/layout.tsx (modified)
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/styles/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <AuthProvider>
          <header className="bg-white dark:bg-gray-800 shadow-sm">
            {/* Existing header content */}
            <div className="container mx-auto px-4">
              {/* ... */}
            </div>
          </header>
          
          <main className="flex-1 py-6">{children}</main>
          
          <footer className="bg-white dark:bg-gray-800 shadow-inner py-4">
            <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Kailo. All rights reserved.
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
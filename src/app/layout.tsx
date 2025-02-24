'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/styles/globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  Kailo
                </Link>
              </div>
              
              <nav className="flex space-x-4">
                <Link 
                  href="/friends" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/friends') 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Friends
                </Link>
                <Link 
                  href="/tasks" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/tasks') 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Tasks
                </Link>
                <Link 
                  href="/calendar" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/calendar') 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  Calendar
                </Link>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="flex-1 py-6">{children}</main>
        
        <footer className="bg-white dark:bg-gray-800 shadow-inner py-4">
          <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Kailo. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
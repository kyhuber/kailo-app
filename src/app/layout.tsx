// src/app/layout.tsx
'use client';

import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Use dynamic import to prevent possible SSR issues with auth
const NavBar = dynamic(() => import('../components/layout/NavBar'), { ssr: false });

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  
  const showNavBar = !pathname?.includes('/login') && currentUser;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {showNavBar && (
        <header>
          <NavBar />
        </header>
      )}
      
      <main className="flex-1 py-6">{children}</main>
      
      <footer className="bg-white dark:bg-gray-800 shadow-inner py-4">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Kailo. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LayoutContent>{children}</LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
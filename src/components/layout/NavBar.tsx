// src/components/layout/NavBar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function NavBar() {
  const { currentUser, signOut } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const handleSignOut = async () => {
    await signOut();
    // Auth context will handle redirect to login
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">Kailo</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link href="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}>
                Home
              </Link>
              <Link href="/friends" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/friends') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}>
                Friends
              </Link>
              <Link href="/tasks" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/tasks') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}>
                Tasks
              </Link>
              <Link href="/calendar" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/calendar') 
                    ? 'text-teal-600 dark:text-teal-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
                }`}>
                Calendar
              </Link>
            </div>
          </div>
          
          {currentUser && (
            <div className="hidden md:ml-6 md:flex md:items-center">
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    {currentUser.photoURL ? (
  <div className="h-8 w-8 relative rounded-full overflow-hidden">
    <Image 
      src={currentUser.photoURL} 
      alt="User profile" 
      fill
      sizes="32px"
      style={{ objectFit: 'cover' }}
    />
  </div>
) : (
  <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center text-teal-800 dark:text-teal-100">
    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
  </div>
)}
                  </button>
                </div>
                
                {isMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <div className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                      {currentUser.displayName || currentUser.email}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'text-teal-600 dark:text-teal-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
              }`}>
              Home
            </Link>
            <Link href="/friends" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/friends') 
                  ? 'text-teal-600 dark:text-teal-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
              }`}>
              Friends
            </Link>
            <Link href="/tasks" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/tasks') 
                  ? 'text-teal-600 dark:text-teal-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
              }`}>
              Tasks
            </Link>
            <Link href="/calendar" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/calendar') 
                  ? 'text-teal-600 dark:text-teal-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400'
              }`}>
              Calendar
            </Link>
          </div>
          
          {currentUser && (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="">
                {currentUser.photoURL ? (
                  <div className="flex-shrink-0 h-10 w-10 relative rounded-full overflow-hidden">
                        <Image
                          src={currentUser.photoURL}
                          alt={`${currentUser.displayName || 'User'}'s profile`}
                          fill
                          sizes="40px"
                          style={{ objectFit: 'cover' }}
                        />
                  </div>
                ) : (
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-800 flex items-center justify-center text-teal-800 dark:text-teal-100">
                    {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                    {currentUser.displayName || ''}
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {currentUser.email || ''}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
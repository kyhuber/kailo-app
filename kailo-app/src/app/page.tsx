'use client';

import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-extrabold mb-4">Welcome to Kailo</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        Your personal tool for maintaining meaningful friendships.
      </p>
      <Link href="/friends" className="btn btn-primary">
        View Friends
      </Link>
    </div>
  );
};

export default HomePage;

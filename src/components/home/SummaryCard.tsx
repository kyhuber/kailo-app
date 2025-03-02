import Link from 'next/link';
import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  link: string;
  linkText: string;
}

export default function SummaryCard({ title, value, icon, color, link, linkText }: SummaryCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className={`rounded-full p-3 ${color}`}>
          {icon}
        </div>
      </div>
      <Link href={link} className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
        {linkText} →
      </Link>
    </div>
  );
}
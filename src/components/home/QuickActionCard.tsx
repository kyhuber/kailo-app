import Link from 'next/link';
import React from 'react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  bgColor: string;
}

export default function QuickActionCard({ title, description, icon, href, bgColor }: QuickActionCardProps) {
  return (
    <Link 
      href={href} 
      className={`block p-3 ${bgColor} rounded-lg hover:bg-opacity-80 transition`}
    >
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-white bg-opacity-30 flex items-center justify-center mr-3">
          {icon}
        </div>
        <div>
          <span className="font-medium">{title}</span>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );
}
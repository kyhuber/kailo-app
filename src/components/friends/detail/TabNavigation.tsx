// src/components/friends/detail/TabNavigation.tsx
import React from 'react';

type TabType = 'overview' | 'notes' | 'topics' | 'tasks' | 'dates';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex border-b mb-6 overflow-x-auto">
      <button 
        onClick={() => onTabChange('overview')}
        className={`px-4 py-2 whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
      >
        Overview
      </button>
      <button 
        onClick={() => onTabChange('notes')}
        className={`px-4 py-2 whitespace-nowrap ${activeTab === 'notes' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
      >
        Notes
      </button>
      <button 
        onClick={() => onTabChange('topics')}
        className={`px-4 py-2 whitespace-nowrap ${activeTab === 'topics' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
      >
        Topics
      </button>
      <button 
        onClick={() => onTabChange('tasks')}
        className={`px-4 py-2 whitespace-nowrap ${activeTab === 'tasks' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
      >
        Tasks
      </button>
      <button 
        onClick={() => onTabChange('dates')}
        className={`px-4 py-2 whitespace-nowrap ${activeTab === 'dates' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
      >
        Dates
      </button>
    </div>
  );
}
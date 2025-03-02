'use client';

import { useEffect, useState } from 'react';
import { DateStorage } from '@/utils/dates_storage';

interface DateEntry {
  id: string;
  friendId: string;
  title: string;
  date: string;
}

export default function DatesPage() {
  const [dates, setDates] = useState<DateEntry[]>([]);

  useEffect(() => {
    async function fetchDates() {
      const storedDates = await DateStorage.getAll();
      if (!Array.isArray(storedDates)) {
        throw new Error("Expected an array of dates");
      }
      setDates(storedDates as DateEntry[]);
    }
    fetchDates();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Important Dates</h1>
      <div className="mt-4 space-y-4">
        {dates.length > 0 ? (
          dates.map((entry) => (
            <div key={entry.id} className="card flex justify-between p-4">
              <span>{entry.title} - {new Date(entry.date).toLocaleDateString()}</span>
            </div>
          ))
        ) : (
          <p>No dates recorded yet.</p>
        )}
      </div>
    </div>
  );
}

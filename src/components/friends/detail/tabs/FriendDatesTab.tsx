// src/components/friends/detail/tabs/FriendDatesTab.tsx
import React, { useState } from 'react';
import { ImportantDate, DateStorage } from '@/utils/dates_storage';
import { ItemStatus } from '@/types/shared';
import AddDateForm from '../forms/AddDateForm';
import ManageableItemList from '@/components/shared/ManageableItemList';
import DateCard from '../cards/DateCard';
import ItemDetailModal, { GenericItem} from '@/components/shared/ItemDetailModal';

interface FriendDatesTabProps {
  friendId: string;
  dates: ImportantDate[];
  setDates: React.Dispatch<React.SetStateAction<ImportantDate[]>>;
}

export default function FriendDatesTab({ friendId, dates, setDates }: FriendDatesTabProps) {
  const [selectedDate, setSelectedDate] = useState<ImportantDate | null>(null);

  const handleUpdateDate = async (item: GenericItem): Promise<void> => {
    const date = item as ImportantDate;
    await DateStorage.updateDate(date);
    setDates(dates.map(existingDate => existingDate.id === date.id ? date : existingDate));
    setSelectedDate(null);
  };

  const handleDeleteDate = async (dateId: string) => {
    await DateStorage.deleteItem(dateId);
    setDates(prev => prev.filter(date => date.id !== dateId));
  };

  const handleStatusChange = async (dateId: string, status: string) => {
    const dateToUpdate = dates.find(d => d.id === dateId);
    if (dateToUpdate) {
      const updatedDate = { 
        ...dateToUpdate, 
        status: status as ItemStatus, 
        updatedAt: new Date().toISOString() 
      };
      await DateStorage.updateDate(updatedDate);
      setDates(dates.map(date => date.id === dateId ? updatedDate : date));
      setSelectedDate(null);
    }
  };

  const handleUpdateStatus = async () => { return; };

  return (
    <>
      <ManageableItemList<ImportantDate>
        title="Important Dates"
        description="Important dates related to your friend, such as travel dates, starting a new job, anniversaries, etc."
        addItemButtonLabel="Add Date"
        items={dates}
        setItems={setDates}
        CardComponent={({ item }) => (
          <DateCard 
            item={item} 
            onDateUpdated={handleUpdateDate}
            onClick={(date) => setSelectedDate(date)}
          />
        )}
        AddFormComponent={({ isOpen, onClose, onAdded }) => (
          <AddDateForm
            friendId={friendId}
            isOpen={isOpen}
            onClose={onClose}
            onDateAdded={onAdded}
          />
        )}
        onUpdateStatus={handleUpdateStatus}
        emptyMessage="No dates yet. Add an important date to start remembering."
      />

      <ItemDetailModal
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        item={selectedDate}
        itemType="date"
        onDelete={handleDeleteDate}
        onUpdate={handleUpdateDate}
        onStatusChange={handleStatusChange}
        friendId={friendId}
      />
    </>
  );
}
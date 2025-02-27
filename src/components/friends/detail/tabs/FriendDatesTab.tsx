// src/components/friends/detail/tabs/FriendDatesTab.tsx
import React from 'react';
import { ImportantDate, DateStorage } from '@/utils/dates_storage';
import AddDateForm from '../forms/AddDateForm';
import ManageableItemList, { ItemStatus } from '@/components/shared/ManageableItemList'; // Corrected import
import DateCard from '../cards/DateCard';

interface FriendDatesTabProps {
  friendId: string;
  dates: ImportantDate[];
  setDates: React.Dispatch<React.SetStateAction<ImportantDate[]>>;
}

export default function FriendDatesTab({ friendId, dates, setDates }: FriendDatesTabProps) {

  const handleUpdateDate = async (date:ImportantDate) => {
    await DateStorage.updateDate(date);
    setDates(dates.map(existingDate => existingDate.id === date.id ? date : existingDate));
  }

  const handleUpdateStatus = async (id:string, status: ItemStatus) => {return;}; // Added status parameter

  return (
    <ManageableItemList<ImportantDate>
      title="Important Dates"
      description="Important dates related to your friend, such as birthdays, or anniversaries."
      addItemButtonLabel="Add Date"
      items={dates}
      setItems={setDates}
      CardComponent={({ item }) => <DateCard item={item} onDateUpdated={handleUpdateDate}/>}
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
  );
}

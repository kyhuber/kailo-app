// src/components/shared/ManageableItemList.tsx

import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';
import { AiOutlineDown, AiOutlineRight } from 'react-icons/ai';
import { ItemStatus } from '@/types/shared';

interface ManageableItemListProps<T extends { id: string; status?: ItemStatus; updatedAt: string }> { // Status is now optional
  title: string;
  description: string;
  addItemButtonLabel: string;
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  CardComponent: React.ComponentType<{ item: T, onArchive?: (id: string) => void, onRestore?: (id: string) => void, isArchived?: boolean, isCompleted?: boolean, onComplete?: (id: string) => void, onReopen?: (id: string) => void }>;
  AddFormComponent: React.ComponentType<{ isOpen: boolean, onClose: () => void, onAdded: (item: T) => void }>;
  onUpdateStatus: (id: string, status: ItemStatus) => Promise<void>;
  emptyMessage: string;
  isCompletedList?: boolean;
  pendingSort?: (a: T, b: T) => number;
}

export default function ManageableItemList<T extends { id: string; status?: ItemStatus; updatedAt: string }>( // Status is now optional
  {
    title,
    description,
    addItemButtonLabel,
    items,
    setItems,
    CardComponent,
    AddFormComponent,
    onUpdateStatus,
    emptyMessage,
    isCompletedList,
    pendingSort
  }: ManageableItemListProps<T>
) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [itemToArchive, setItemToArchive] = useState<string | null>(null);
  const [itemToRestore, setItemToRestore] = useState<string | null>(null);
  const [itemToComplete, setItemToComplete] = useState<string | null>(null);
  const [itemToReopen, setItemToReopen] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const activeItems = items.filter(item => item.status === 'Active' || item.status === 'Pending');
  const completedItems = items.filter(item => item.status === 'Complete');
  const archivedItems = items.filter(item => item.status === 'Archived');

  const sortedPendingItems = [...activeItems].sort(pendingSort);

  const handleAddItem = (newItem: T) => {
    setItems(prev => [...prev, newItem]);
  };

  const handleArchiveItem = async (itemId: string) => {
    await onUpdateStatus(itemId, 'Archived');
    setItems(items.map(item =>
      item.id === itemId ? { ...item, status: 'Archived', updatedAt: new Date().toISOString() } : item
    ));
    setItemToArchive(null);
  };

  const handleRestoreItem = async (itemId: string) => {
    await onUpdateStatus(itemId, 'Active');
    setItems(items.map(item =>
      item.id === itemId ? { ...item, status: 'Active', updatedAt: new Date().toISOString() } : item
    ));
    setItemToRestore(null);
  };

  const handleCompleteItem = async (itemId: string) => {
    await onUpdateStatus(itemId, 'Complete');
    const completedAt = new Date().toISOString();
    setItems(items.map(item =>
      item.id === itemId ? { ...item, status: 'Complete', updatedAt: completedAt, completedAt } : item
    ));
    setItemToComplete(null);
  };

  const handleReopenItem = async (itemId: string) => {
    await onUpdateStatus(itemId, 'Pending');
    setItems(items.map(item =>
      item.id === itemId ? { ...item, status: 'Pending', updatedAt: new Date().toISOString() } : item
    ));
    setItemToReopen(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          {addItemButtonLabel}
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {description}
      </p>

      {/* Active Items */}
      {isCompletedList ?
        <h3 className="font-medium text-lg mb-3">Pending</h3>
        : <h3 className="font-medium text-lg mb-3">Active</h3>}

      {sortedPendingItems?.length > 0 ? (
        <div className="space-y-3 mb-6">
          {sortedPendingItems.map(item => (
            <CardComponent
              key={item.id}
              item={item}
              onArchive={setItemToArchive}
              onComplete={setItemToComplete}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          {emptyMessage}
        </p>
      )}

      {/* Completed Items */}
      {completedItems.length > 0 && (
        <>
          <h3 className="font-medium text-lg mb-3">Completed</h3>
          <div className="space-y-3 mb-6">
            {completedItems.map(item => (
              <CardComponent
                key={item.id}
                item={item}
                onReopen={setItemToReopen}
                onArchive={setItemToArchive}
                isCompleted
              />
            ))}
          </div>
        </>
      )}

      {/* Archived Items */}
      {archivedItems.length > 0 && (
        <div className="mt-6">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="flex items-center gap-2 font-medium text-lg hover:text-blue-500"
          >
            {showArchived ? <AiOutlineDown /> : <AiOutlineRight />} Archived
          </button>
          {showArchived && (
            <div className="space-y-3 mt-3">
              {archivedItems.map(item => (
                <CardComponent
                  key={item.id}
                  item={item}
                  onRestore={setItemToRestore}
                  isArchived
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddFormComponent
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdded={handleAddItem}
      />

      <ConfirmModal
        isOpen={!!itemToArchive}
        onClose={() => setItemToArchive(null)}
        onConfirm={() => itemToArchive && handleArchiveItem(itemToArchive)}
        title="Archive Item"
        message="Are you sure you want to archive this item? You can restore it later if needed."
        confirmButtonText="Archive"
        variant="warning"
      />

      <ConfirmModal
        isOpen={!!itemToRestore}
        onClose={() => setItemToRestore(null)}
        onConfirm={() => itemToRestore && handleRestoreItem(itemToRestore)}
        title="Restore Item"
        message="Do you want to restore this item to active status?"
        confirmButtonText="Restore"
        variant="info"
      />

      <ConfirmModal
        isOpen={!!itemToComplete}
        onClose={() => setItemToComplete(null)}
        onConfirm={() => itemToComplete && handleCompleteItem(itemToComplete)}
        title="Complete Item"
        message="Mark this item as complete?"
        confirmButtonText="Complete"
        variant="info"
      />

      <ConfirmModal
        isOpen={!!itemToReopen}
        onClose={() => setItemToReopen(null)}
        onConfirm={() => itemToReopen && handleReopenItem(itemToReopen)}
        title="Reopen Item"
        message="Do you want to reopen this item and mark it as pending?"
        confirmButtonText="Reopen"
        variant="warning"
      />
    </div>
  );
}
// src/components/shared/ItemDetailModal.tsx
import React, { useState } from 'react';
import Modal from './Modal';
import { ItemStatus } from '@/types/shared';
import { Note, NoteStorage } from '@/utils/notes_storage';
import { Topic, TopicStorage } from '@/utils/topics_storage';
import { Task, TaskStorage } from '@/utils/tasks_storage';
import { ImportantDate, DateStorage } from '@/utils/dates_storage';
import AddNoteForm from '@/components/friends/detail/forms/AddNoteForm';
import AddTopicForm from '@/components/friends/detail/forms/AddTopicForm';
import AddTaskForm from '@/components/friends/detail/forms/AddTaskForm';
import AddDateForm from '@/components/friends/detail/forms/AddDateForm';
import ConfirmModal from './ConfirmModal';

type ItemType = 'note' | 'topic' | 'task' | 'date';
type GenericItem = Note | Topic | Task | ImportantDate;

interface ItemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: GenericItem | null;
  itemType: ItemType;
  onDelete: (id: string) => void;
  onUpdate: (item: GenericItem) => void;
  onStatusChange?: (id: string, status: ItemStatus) => void;
  friendId: string;
}

export default function ItemDetailModal({
  isOpen,
  onClose,
  item,
  itemType,
  onDelete,
  onUpdate,
  onStatusChange,
  friendId
}: ItemDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  if (!item) return null;
  
  const handleDelete = () => {
    setIsConfirmDeleteOpen(true);
  };
  
  const confirmDelete = async () => {
    onDelete(item.id);
    setIsConfirmDeleteOpen(false);
    onClose();
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleUpdate = (updatedItem: GenericItem) => {
    onUpdate(updatedItem);
    setIsEditing(false);
  };
  
  const handleStatusChange = (status: ItemStatus) => {
    if (onStatusChange) {
      onStatusChange(item.id, status);
    }
  };

  // [Rest of the previous implementation remains the same]
  // Preserve all existing methods: renderContent, renderActionButtons, getModalTitle, renderEditForm

  // Updated handleStatusChange method to use ItemStatus
  const renderActionButtons = () => {
    const status = 'status' in item ? item.status as ItemStatus : undefined;
    
    return (
      <div className="flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
        {/* Status change buttons for tasks */}
        {itemType === 'task' && status === 'Pending' && (
          <button
            onClick={() => handleStatusChange('Complete')}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Complete
          </button>
        )}
        
        {itemType === 'task' && status === 'Complete' && (
          <button
            onClick={() => handleStatusChange('Pending')}
            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Reopen
          </button>
        )}
        
        {/* Archive/Restore buttons for all items */}
        {(status === 'Active' || status === 'Pending' || status === 'Complete') && (
          <button
            onClick={() => handleStatusChange('Archived')}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            Archive
          </button>
        )}
        
        {status === 'Archived' && (
          <button
            onClick={() => handleStatusChange('Active')}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Restore
          </button>
        )}
        
        {/* Edit and Delete buttons */}
        <button
          onClick={handleEdit}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Edit
        </button>
        
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    );
  };
  
  const getModalTitle = () => {
    switch (itemType) {
      case 'note':
        return 'Note Details';
      case 'topic':
        return 'Topic Details';
      case 'task':
        return 'Task Details';
      case 'date':
        return 'Date Details';
      default:
        return 'Item Details';
    }
  };
  
  const renderEditForm = () => {
    switch (itemType) {
      case 'note':
        return (
          <AddNoteForm
            friendId={friendId}
            isOpen={true}
            onClose={() => setIsEditing(false)}
            onNoteAdded={handleUpdate as (note: Note) => void}
            initialData={item as Note}
          />
        );
      case 'topic':
        return (
          <AddTopicForm
            friendId={friendId}
            isOpen={true}
            onClose={() => setIsEditing(false)}
            onTopicAdded={handleUpdate as (topic: Topic) => void}
            initialData={item as Topic}
          />
        );
      case 'task':
        return (
          <AddTaskForm
            friendId={friendId}
            isOpen={true}
            onClose={() => setIsEditing(false)}
            onTaskAdded={handleUpdate as (task: Task) => void}
            initialData={item as Task}
          />
        );
      case 'date':
        return (
          <AddDateForm
            friendId={friendId}
            isOpen={true}
            onClose={() => setIsEditing(false)}
            onDateAdded={handleUpdate as (date: ImportantDate) => void}
            initialData={item as ImportantDate}
          />
        );
      default:
        return null;
    }
  };
  
  // If editing, render the edit form
  if (isEditing) {
    return renderEditForm();
  }
  
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={getModalTitle()}
        size="md"
      >
        {renderContent()}
        {renderActionButtons()}
      </Modal>
      
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`}
        message={`Are you sure you want to delete this ${itemType}? This action cannot be undone.`}
        confirmButtonText="Delete"
        variant="danger"
      />
    </>
  );
}
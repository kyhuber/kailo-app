import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Note, NoteStorage } from '@/utils/notes_storage';
import Modal from '@/components/shared/Modal';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import VoiceInputButton from '@/components/shared/VoiceInputButton';

interface AddNoteFormProps {
  friendId: string;
  onNoteAdded: (note: Note) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddNoteForm({ friendId, onNoteAdded, isOpen, onClose }: AddNoteFormProps) {
  const [content, setContent] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    const newNote: Note = {
      id: uuidv4(),
      friendId,
      content,
      status: "Active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.uid,
    };

    await NoteStorage.addItem(newNote);
    onNoteAdded(newNote);
    setContent('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add a New Note">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="note-content">
            Note Content
          </label>
          <textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write a new note about your friend..."
            className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
          <div className="mt-2">
            <VoiceInputButton 
              targetInputId="note-content" 
              onTextChange={(text) => setContent(text)} 
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Note
          </button>
        </div>
      </form>
    </Modal>
  );
}
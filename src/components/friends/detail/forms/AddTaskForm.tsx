// src/components/friends/detail/forms/AddTaskForm.tsx
import React, { useState, useEffect } from 'react';
import { Task, TaskStorage } from '@/utils/tasks_storage';
import Modal from '@/components/shared/Modal';
import { Friend, FriendStorage } from '@/utils/friends_storage';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import VoiceInputButton from '@/components/shared/VoiceInputButton';

interface AddTaskFormProps {
  friendId?: string;
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: (task: Task) => void;
  friends?: Friend[];
  initialData?: Task;
}

export default function AddTaskForm({ friendId, isOpen, onClose, onTaskAdded, friends, initialData }: AddTaskFormProps) {
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'High'>('Normal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [allFriends, setAllFriends] = useState<Friend[]>([]);

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

  // Load friends data if not provided
  useEffect(() => {
    if (!friends && isOpen) {
      const loadFriends = async () => {
        try {
          const fetchedFriends = await FriendStorage.getAll();
          setAllFriends(fetchedFriends);
        } catch (error) {
          console.error("Error loading friends:", error);
        }
      };
      loadFriends();
    }
  }, [friends, isOpen]);

  // Set initial data when the modal opens or initialData changes
  useEffect(() => {
    if (initialData && isOpen) {
      setContent(initialData.content);
      setPriority(initialData.priority);
      setSelectedFriendId(initialData.friendId);
    } else if (isOpen) {
      // Reset form when opening without initial data
      setContent('');
      setPriority('Normal');
      
      // Set the selected friend if friendId is provided
      if (friendId) {
        setSelectedFriendId(friendId);
      } else {
        // Default to first friend if available
        const availableFriends = friends || allFriends;
        setSelectedFriendId(availableFriends.length > 0 ? availableFriends[0].id : '');
      }
    }
  }, [initialData, isOpen, friendId, friends, allFriends]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || content.trim() === '' || !user) return;
    setIsSubmitting(true);

    try {
      // Determine the friend ID to use
      let actualFriendId = selectedFriendId;
      if (!actualFriendId && friendId) {
        actualFriendId = friendId;
      }
      if (!actualFriendId) {
        throw new Error("Must select a friend when adding a task");
      }

      if (initialData) {
        // Update existing task
        const updatedTask: Task = {
          ...initialData,
          friendId: actualFriendId,
          content: content.trim(),
          priority,
          updatedAt: new Date().toISOString(),
        };
        await TaskStorage.updateItem(updatedTask);
        onTaskAdded(updatedTask);
      } else {
        // Create new task
        const newTask: Task = {
          id: crypto.randomUUID(),
          friendId: actualFriendId,
          content: content.trim(),
          status: 'Pending',
          priority,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: user.uid,
        };
        await TaskStorage.addItem(newTask);
        onTaskAdded(newTask);
      }
      onClose();
    } catch (error) {
      console.error('Error adding/updating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const actualFriends = friends || allFriends;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Task" : "Add Task"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Friend Select - Only show if friendId is not provided */}
        {!friendId && (
          <div>
            <label htmlFor="friend" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Friend <span className="text-rose-500">*</span>
            </label>
            <select
              id="friend"
              value={selectedFriendId}
              onChange={(e) => setSelectedFriendId(e.target.value)}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                         text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="" disabled>Select a friend</option>
              {actualFriends.map((friend) => (
                <option key={friend.id} value={friend.id}>
                  {friend.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Task Description <span className="text-rose-500">*</span>
          </label>
          <div className="mt-1">
            <textarea
              id="content"
              name="content"
              rows={3}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                         text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task description..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div className="mt-2">
              <VoiceInputButton targetInputId="content" onTextChange={setContent} />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 
                       text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'Normal' | 'High')}
          >
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || content.trim() === ''}
            className={`px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 ${isSubmitting || content.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Task' : 'Save Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
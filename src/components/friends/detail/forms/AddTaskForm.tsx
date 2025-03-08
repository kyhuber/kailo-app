// src/components/friends/detail/forms/AddTaskForm.tsx
import React, { useState, useEffect } from 'react';
import { Task, TaskStorage } from '@/utils/tasks_storage';
import Modal from '@/components/shared/Modal';
import { Friend, FriendStorage } from '@/utils/friends_storage';
import Select from 'react-select';
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
  const [selectedFriend, setSelectedFriend] = useState<{ value: string; label: string } | null>(null);
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
      
      // If we have friendId from initialData, set the selected friend
      if (initialData.friendId) {
        const actualFriends = friends || allFriends;
        const friend = actualFriends.find(f => f.id === initialData.friendId);
        if (friend) {
          setSelectedFriend({ value: friend.id, label: friend.name });
        }
      }
    } else if (isOpen) {
      // Reset form when opening without initial data
      setContent('');
      setPriority('Normal');
      
      // Set the selected friend if friendId is provided
      if (friendId) {
        const actualFriends = friends || allFriends;
        const friend = actualFriends.find(f => f.id === friendId);
        if (friend) {
          setSelectedFriend({ value: friend.id, label: friend.name });
        }
      } else {
        setSelectedFriend(null);
      }
    }
  }, [initialData, isOpen, friendId, friends, allFriends]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || content.trim() === '' || !user) return;
    setIsSubmitting(true);

    try {
      // Determine the friend ID to use
      let actualFriendId = selectedFriend ? selectedFriend.value : null;
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
  const friendOptions = actualFriends.map((friend) => ({
    value: friend.id,
    label: friend.name,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Task" : "Add Task"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Friend Select - Only show if friendId is not provided */}
        {!friendId && (
          <div>
            <label htmlFor="friend" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Friend
            </label>
            <Select
              className="mt-1 block w-full text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
              options={friendOptions}
              value={selectedFriend}
              onChange={(selectedOption) =>
                setSelectedFriend(selectedOption as { value: string; label: string })
              }
            />
          </div>
        )}

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Task Description
          </label>
          <div className="mt-1">
            <textarea
              id="content"
              name="content"
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-800 dark:text-gray-200"
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
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'Normal' | 'High')}
          >
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || content.trim() === ''}
            className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 ${isSubmitting || content.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Task' : 'Save Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
// src/app/tasks/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TaskStorage, Task } from '@/utils/tasks_storage';
import { FriendStorage, Friend } from '@/utils/friends_storage';
import AddTaskForm from '@/components/friends/detail/forms/AddTaskForm';
import ManageableItemList from '@/components/shared/ManageableItemList';
import { ItemStatus } from '@/types/shared';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function TasksPage() {
 const [tasks, setTasks] = useState<Task[]>([]);
 const [friends, setFriends] = useState<Record<string, Friend>>({});
 const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'archived'>('pending');
 const [loading, setLoading] = useState(true);
 const [isAddFormOpen, setIsAddFormOpen] = useState(false);

 useEffect(() => {
   async function fetchData() {
     try {
       setLoading(true);

       // Load all tasks
       const allTasks = await TaskStorage.getAll();
       if (Array.isArray(allTasks)) {
         setTasks(allTasks);
       }

       // Load all friends for reference
       const allFriends = await FriendStorage.getAll() as Friend[];
       if (Array.isArray(allFriends)) {
         const friendsMap: Record<string, Friend> = {};
         allFriends.forEach(friend => {
           friendsMap[friend.id] = friend;
         });
         setFriends(friendsMap);
       }
     } catch (error) {
       console.error("Error loading tasks:", error);
     } finally {
       setLoading(false);
     }
   }

   fetchData();
 }, []);

 const handleUpdateTaskStatus = async (taskId: string, newStatus: ItemStatus) => {
   await TaskStorage.updateTaskStatus(taskId, newStatus);
   const completedAt = new Date().toISOString();
   if (newStatus === 'Complete') {
     setTasks(tasks.map(task =>
       task.id === taskId
         ? { ...task, status: newStatus, updatedAt: completedAt, completedAt }
         : task
     ));
   } else {
     setTasks(tasks.map(task =>
       task.id === taskId
         ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
         : task
     ));
   }
 };

 const getFilteredTasks = () => {
   switch (filter) {
     case 'pending':
       return tasks.filter(task => task.status === 'Pending')
         .sort((a, b) => a.priority === 'High' ? -1 : b.priority === 'High' ? 1 : 0);
     case 'completed':
       return tasks.filter(task => task.status === 'Complete');
     case 'archived':
       return tasks.filter(task => task.status === 'Archived');
     default:
       return tasks
         .sort((a, b) => {
           // Sort by status first (Pending first, then Complete, then Archived)
           const statusOrder = { Pending: 0, Complete: 1, Archived: 2 };
           const statusDiff = statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
           if (statusDiff !== 0) return statusDiff;
           
           // For pending tasks, sort by priority
           if (a.status === 'Pending' && b.status === 'Pending') {
             if (a.priority === 'High' && b.priority !== 'High') return -1;
             if (a.priority !== 'High' && b.priority === 'High') return 1;
           }
           
           // Finally sort by creation date (newest first)
           return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
         });
   }
 };

 const filteredTasks = getFilteredTasks();
 
 const handleTaskAdded = (newTask: Task) => {
   setTasks(prev => [...prev, newTask]);
   setIsAddFormOpen(false);
 };

 if (loading) {
   return (
     <ProtectedRoute>
       <div className="container mx-auto p-4 text-center">
         <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
         <p className="mt-2">Loading tasks...</p>
       </div>
     </ProtectedRoute>
   );
 }

 return (
   <ProtectedRoute>
     <div className="container mx-auto p-4">
       <div className="flex justify-between items-center mb-6">
         <h1 className="text-2xl font-bold">Tasks</h1>
         <button
           onClick={() => setIsAddFormOpen(true)}
           className="btn btn-primary flex items-center gap-2"
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
           </svg>
           Add Task
         </button>
       </div>

       {/* Filter Controls */}
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
         <div className="flex flex-wrap gap-2">
           <button
             onClick={() => setFilter('all')}
             className={`px-4 py-2 rounded-md font-medium ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
               }`}
           >
             All Tasks
           </button>
           <button
             onClick={() => setFilter('pending')}
             className={`px-4 py-2 rounded-md font-medium ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
               }`}
           >
             Pending
           </button>
           <button
             onClick={() => setFilter('completed')}
             className={`px-4 py-2 rounded-md font-medium ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
               }`}
           >
             Completed
           </button>
           <button
             onClick={() => setFilter('archived')}
             className={`px-4 py-2 rounded-md font-medium ${filter === 'archived' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
               }`}
           >
             Archived
           </button>
         </div>
       </div>

       {/* Tasks List */}
       {filteredTasks.length > 0 ? (
         <div className="space-y-4">
           {filteredTasks.map(task => (
             <div 
               key={task.id}
               className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${
                 task.priority === 'High' && task.status === 'Pending' ? 'border-l-4 border-red-500' : ''
               }`}
             >
               <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                 <div className="mb-2 sm:mb-0">
                   <div className="flex items-center">
                     <p className={task.status === 'Complete' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}>
                       {task.content}
                     </p>
                     {task.priority === 'High' && task.status === 'Pending' && (
                       <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded dark:bg-red-900 dark:text-red-200">
                         High Priority
                       </span>
                     )}
                   </div>
                   <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                     <Link
                       href={`/friends/${task.friendId}`}
                       className="hover:underline text-blue-600 dark:text-blue-400"
                     >
                       {friends[task.friendId]?.name || 'Unknown Friend'}
                     </Link>
                     <span className="mx-2">•</span>
                     <span>
                       {task.status === 'Complete'
                         ? `Completed ${new Date(task.updatedAt).toLocaleDateString()}`
                         : task.status === 'Archived'
                         ? `Archived ${new Date(task.updatedAt).toLocaleDateString()}`
                         : `Created ${new Date(task.createdAt).toLocaleDateString()}`
                       }
                     </span>
                   </div>
                 </div>
                 <div className="flex space-x-2">
                   {task.status === 'Pending' && (
                     <button
                       onClick={() => handleUpdateTaskStatus(task.id, 'Complete')}
                       className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                     >
                       Complete
                     </button>
                   )}
                   {task.status === 'Complete' && (
                     <button
                       onClick={() => handleUpdateTaskStatus(task.id, 'Pending')}
                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                     >
                       Reopen
                     </button>
                   )}
                   {task.status !== 'Archived' && (
                     <button
                       onClick={() => handleUpdateTaskStatus(task.id, 'Archived')}
                       className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 py-1 rounded text-sm"
                     >
                       Archive
                     </button>
                   )}
                   {task.status === 'Archived' && (
                     <button
                       onClick={() => handleUpdateTaskStatus(task.id, 'Pending')}
                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                     >
                       Restore
                     </button>
                   )}
                 </div>
               </div>
             </div>
           ))}
         </div>
       ) : (
         <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
           <p className="text-gray-600 dark:text-gray-400 mb-4">
             {filter === 'all' 
               ? "You don't have any tasks yet." 
               : filter === 'pending'
               ? "You don't have any pending tasks." 
               : filter === 'completed'
               ? "You don't have any completed tasks." 
               : "You don't have any archived tasks."}
           </p>
           {filter === 'all' || filter === 'pending' ? (
             <button 
               onClick={() => setIsAddFormOpen(true)}
               className="btn btn-primary"
             >
               Add Your First Task
             </button>
           ) : null}
         </div>
       )}

       {/* Add Task Modal */}
       <AddTaskForm
         isOpen={isAddFormOpen}
         onClose={() => setIsAddFormOpen(false)}
         onTaskAdded={handleTaskAdded}
         friends={Object.values(friends)}
       />
     </div>
   </ProtectedRoute>
 );
}
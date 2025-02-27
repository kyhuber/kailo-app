// src/components/friends/detail/tabs/FriendTasksTab.tsx
import React, { useState } from 'react';
import { Task, TaskStorage } from '@/utils/tasks_storage';
import TopicCard from '../cards/TopicCard';
import AddTaskForm from '../forms/AddTaskForm';
import ConfirmModal from '@/components/shared/ConfirmModal';

interface FriendTasksTabProps {
  friendId: string;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function FriendTasksTab({ friendId, tasks, setTasks }: FriendTasksTabProps) {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [taskToComplete, setTaskToComplete] = useState<string | null>(null);
  const [taskToReopen, setTaskToReopen] = useState<string | null>(null);
  const [taskToArchive, setTaskToArchive] = useState<string | null>(null);
  const [taskToRestore, setTaskToRestore] = useState<string | null>(null);
  
  const pendingTasks = tasks.filter(task => task.status === 'Pending')
    .sort((a, b) => a.priority === 'High' ? -1 : b.priority === 'High' ? 1 : 0);
  const completedTasks = tasks.filter(task => task.status === 'Complete');
  const archivedTasks = tasks.filter(task => task.status === 'Archived');

  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleCompleteTask = async (taskId: string) => {
    await TaskStorage.updateTaskStatus(taskId, 'Complete');
    const completedAt = new Date().toISOString();
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'Complete', updatedAt: completedAt, completedAt } : task
    ));
    setTaskToComplete(null);
  };

  const handleReopenTask = async (taskId: string) => {
    await TaskStorage.updateTaskStatus(taskId, 'Pending');
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'Pending', updatedAt: new Date().toISOString() } : task
    ));
    setTaskToReopen(null);
  };

  const handleArchiveTask = async (taskId: string) => {
    await TaskStorage.updateTaskStatus(taskId, 'Archived');
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'Archived', updatedAt: new Date().toISOString() } : task
    ));
    setTaskToArchive(null);
  };

  const handleRestoreTask = async (taskId: string) => {
    await TaskStorage.updateTaskStatus(taskId, 'Pending');
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: 'Pending', updatedAt: new Date().toISOString() } : task
    ));
    setTaskToRestore(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <button 
          onClick={() => setIsAddTaskModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          Add Task
        </button>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Tasks are action items related to your friendship that you need to complete.
      </p>
      
      {/* Pending Tasks */}
      <h3 className="font-medium text-lg mb-3">Pending Tasks</h3>
      {pendingTasks.length > 0 ? (
        <div className="space-y-3 mb-6">
          {pendingTasks.map(task => (
            <TopicCard 
              key={task.id} 
              item={task} // changed prop name
              onComplete={() => setTaskToComplete(task.id)}
              onArchive={() => setTaskToArchive(task.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          No pending tasks. Great job!
        </p>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <>
          <h3 className="font-medium text-lg mb-3">Completed Tasks</h3>
          <div className="space-y-3 mb-6">
            {completedTasks.map(task => (
              <TopicCard 
                key={task.id} 
                item={task} // changed prop name
                onReopen={() => setTaskToReopen(task.id)}
                onArchive={() => setTaskToArchive(task.id)}
                isCompleted
              />
            ))}
          </div>
        </>
      )}

      {/* Archived Tasks */}
      {archivedTasks.length > 0 && (
        <>
          <h3 className="font-medium text-lg mb-3">Archived Tasks</h3>
          <div className="space-y-3">
            {archivedTasks.map(task => (
              <TopicCard 
                key={task.id} 
                item={task} // changed prop name
                onRestore={() => setTaskToRestore(task.id)}
                isArchived
              />
            ))}
          </div>
        </>
      )}
      
            {/* Modals */}
            <AddTaskForm 
        friendId={friendId} 
        onTaskAdded={handleAddTask} 
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
      />
      
      <ConfirmModal
        isOpen={!!taskToComplete}
        onClose={() => setTaskToComplete(null)}
        onConfirm={() => taskToComplete && handleCompleteTask(taskToComplete)}
        title="Complete Task"
        message="Mark this task as complete?"
        confirmButtonText="Complete"
        variant="info"
      />
      
      <ConfirmModal
        isOpen={!!taskToReopen}
        onClose={() => setTaskToReopen(null)}
        onConfirm={() => taskToReopen && handleReopenTask(taskToReopen)}
        title="Reopen Task"
        message="Do you want to reopen this task and mark it as pending?"
        confirmButtonText="Reopen"
        variant="warning"
      />
      
      <ConfirmModal
        isOpen={!!taskToArchive}
        onClose={() => setTaskToArchive(null)}
        onConfirm={() => taskToArchive && handleArchiveTask(taskToArchive)}
        title="Archive Task"
        message="Are you sure you want to archive this task? You can restore it later if needed."
        confirmButtonText="Archive"
        variant="warning"
      />
      
      <ConfirmModal
        isOpen={!!taskToRestore}
        onClose={() => setTaskToRestore(null)}
        onConfirm={() => taskToRestore && handleRestoreTask(taskToRestore)}
        title="Restore Task"
        message="Do you want to restore this task to pending status?"
        confirmButtonText="Restore"
        variant="info"
      />
    </div>
  );
}
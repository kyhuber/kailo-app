// src/components/tasks/AddTaskButton.tsx
import { AddButton } from '@/components/ui/buttons/AddButton';

export function AddTaskButton({ friendId }: { friendId?: string }) {
  // If friendId is provided, we'll navigate to the friend-specific task creation
  const href = friendId ? `/friends/${friendId}/tasks/new` : '/tasks/new';
  
  return (
    <AddButton 
      entityType="Task" 
      href={href}
    />
  );
}
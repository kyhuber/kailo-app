// src/components/dates/AddDateButton.tsx
import { AddButton } from '@/components/ui/buttons/AddButton';

export function AddDateButton({ friendId }: { friendId?: string }) {
  // If friendId is provided, we'll navigate to the friend-specific date creation
  const href = friendId ? `/friends/${friendId}/dates/new` : '/dates/new';
  
  return (
    <AddButton 
      entityType="Date" 
      href={href}
    />
  );
}
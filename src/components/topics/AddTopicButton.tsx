// src/components/topics/AddTopicButton.tsx
import { AddButton } from '@/components/ui/buttons/AddButton';

export function AddTopicButton({ friendId }: { friendId?: string }) {
  // Topics are always associated with a friend, so require friendId
  if (!friendId) {
    console.warn('AddTopicButton: No friendId provided');
  }
  
  const href = friendId ? `/friends/${friendId}/topics/new` : '/topics/new';
  
  return (
    <AddButton 
      entityType="Topic" 
      href={href}
    />
  );
}
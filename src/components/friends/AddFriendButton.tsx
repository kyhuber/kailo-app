// src/components/friends/AddFriendButton.tsx
import { AddButton } from '@/components/ui/buttons/AddButton';

export function AddFriendButton() {
  // You could add friend-specific logic here if needed
  // For example, modal handling, permissions, etc.
  return (
    <AddButton 
      entityType="Friend" 
      href="/friends/new"
      // Or if using modal: onClick={() => openFriendModal()} 
    />
  );
}
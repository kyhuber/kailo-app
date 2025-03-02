// src/components/friends/AddFriendButton.tsx
import React, { useState } from 'react';
import AddFriendModal from './FriendModal';

interface AddFriendButtonProps {
  onFriendAdded: () => void;
}

export default function AddFriendButton({ onFriendAdded }: AddFriendButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary"
      >
        Add Friend
      </button>
      
      <AddFriendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFriendAdded={onFriendAdded}
      />
    </>
  );
}
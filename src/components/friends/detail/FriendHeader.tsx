// src/components/friends/detail/FriendHeader.tsx
import React, { useState } from 'react';
import Image from 'next/image';
import { Friend, FriendStorage } from '@/utils/friends_storage';
import { AiOutlineEdit } from 'react-icons/ai';
import FriendModal from '@/components/friends/FriendModal';
import PhotoUpload from '@/components/friends/PhotoUpload';

interface FriendHeaderProps {
  friend: Friend;
  onFriendUpdated?: (friend: Friend) => void;
}

export default function FriendHeader({ friend, onFriendUpdated }: FriendHeaderProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);

  const handleFriendUpdated = () => {
    if (onFriendUpdated) {
      onFriendUpdated(friend);
    }
    // If no callback, reload the page
    else {
      window.location.reload();
    }
  };

  const handlePhotoUpload = async (photoUrl: string) => {
    // Update friend with new photo URL
    const updatedFriend = { ...friend, photoUrl };
    await FriendStorage.updateItem(updatedFriend);
    
    // If a callback exists, use it
    if (onFriendUpdated) {
      onFriendUpdated(updatedFriend);
    } else {
      // Fallback to page reload
      window.location.reload();
    }
  };

  // Generate initials for fallback display
  const initials = friend.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className={`p-6 rounded-lg shadow-md mb-6 ${
      friend.color || 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center">
        {/* Photo/Avatar Section */}
        <div className="flex items-center justify-center mb-4 md:mb-0 md:mr-6 relative group">
          {friend.photoUrl ? (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden relative">
              <Image 
                src={friend.photoUrl} 
                alt={`${friend.name}'s photo`} 
                fill
                sizes="(max-width: 768px) 96px, 128px"
                className="object-cover"
              />
              <div 
                onClick={() => setIsPhotoUploadOpen(true)}
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <span className="text-white text-sm">Change Photo</span>
              </div>
            </div>
          ) : (
            <div 
              className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-3xl font-bold ${friend.color} relative group`}
              onClick={() => setIsPhotoUploadOpen(true)}
            >
              {initials}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <span className="text-white text-sm">Add Photo</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {friend.name}
              </h1>
              {friend.contactInfo && (
                <p className="text-gray-800 dark:text-gray-100 mt-2">
                  {friend.contactInfo}
                </p>
              )}
            </div>
            
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 bg-white bg-opacity-20 dark:bg-gray-800 dark:bg-opacity-30 rounded-full hover:bg-opacity-30 dark:hover:bg-opacity-50 transition"
              aria-label="Edit friend"
            >
              <AiOutlineEdit className="text-xl" />
            </button>
          </div>
          
          {friend.tags && friend.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {friend.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="bg-white bg-opacity-70 dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium text-gray-800 dark:text-gray-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <FriendModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onFriendAdded={handleFriendUpdated}
        initialData={friend}
      />

      {/* Photo Upload Modal */}
      <PhotoUpload
        friendId={friend.id}
        isOpen={isPhotoUploadOpen}
        onClose={() => setIsPhotoUploadOpen(false)}
        onPhotoUploaded={handlePhotoUpload}
      />
    </div>
  );
}
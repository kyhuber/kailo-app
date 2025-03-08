import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FriendStorage } from '@/utils/friends_storage';
import Modal from '@/components/shared/Modal';

interface PhotoUploadProps {
  friendId: string;
  isOpen: boolean;
  onClose: () => void;
  onPhotoUploaded: (photoUrl: string) => void;
}

export default function PhotoUpload({ friendId, isOpen, onClose, onPhotoUploaded }: PhotoUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setIsUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `photos/${user.uid}/${friendId}/${file.name}`);
    
    try {
      await uploadBytes(storageRef, file);
      const photoUrl = await getDownloadURL(storageRef);
      
      // Update friend's photo URL in Firestore
      const friend = await FriendStorage.getById(friendId);
      if (!friend) {
        throw new Error('Friend not found');
      }
      await FriendStorage.updateItem({ ...friend, photoUrl });
      
      onPhotoUploaded(photoUrl);
      onClose();
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Photo">
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="photo-upload">
            Select Photo
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className={`px-4 py-2 text-white rounded-md ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isUploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
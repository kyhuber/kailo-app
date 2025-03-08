// src/app/friends/new/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FriendStorage } from '@/utils/friends_storage';
import { v4 as uuidv4 } from 'uuid';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AddFriendPage() {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [tags, setTags] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const colorOptions = [
    { value: 'bg-teal-100', label: 'Teal' },
    { value: 'bg-amber-100', label: 'Amber' },
    { value: 'bg-rose-100', label: 'Rose' },
    { value: 'bg-violet-100', label: 'Violet' },
    { value: 'bg-emerald-100', label: 'Emerald' },
    { value: 'bg-blue-100', label: 'Blue' },
  ];
  const [selectedColor, setSelectedColor] = useState(colorOptions[0].value);

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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user) return;

    const friendId = uuidv4();
    const newFriend = {
      id: friendId,
      name,
      contactInfo: contactInfo || undefined,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : undefined,
      color: selectedColor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.uid
    };

    // First save the basic friend info
    await FriendStorage.addItem(newFriend);

    // Then upload photo if provided
    if (photoFile) {
      await FriendStorage.uploadPhoto(friendId, photoFile);
    }

    router.push('/friends');
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-2xl font-bold mb-6">Add a New Friend</h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          {/* Photo Upload Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Profile Photo</label>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {photoPreview ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden relative">
                    <Image 
                      src={photoPreview}
                      alt="Profile preview"
                      fill
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold ${selectedColor}`}>
                    {name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'NA'}
                  </div>
                )}
              </div>
              
              <div className="flex-grow">
                <input
                  ref={fileInputRef}
                  type="file"
                  id="photo"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {photoPreview ? 'Change Photo' : 'Add Photo'}
                  </button>
                  {photoPreview && (
                    <button 
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: square photos up to 1MB
                </p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              placeholder="Friend's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="contactInfo" className="block text-sm font-medium mb-1">
              Contact Info (Optional)
            </label>
            <input
              type="text"
              id="contactInfo"
              placeholder="Email, phone, social media"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-1">
              Tags (Optional)
            </label>
            <input
              type="text"
              id="tags"
              placeholder="Comma-separated tags (work, family, etc.)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate tags with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Color Theme
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`h-10 rounded-md flex items-center justify-center ${color.value} ${
                    selectedColor === color.value ? 'ring-2 ring-blue-500' : ''
                  }`}
                  aria-label={`Select ${color.label} color`}
                >
                  {selectedColor === color.value && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
              disabled={!user}
            >
              Save Friend
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
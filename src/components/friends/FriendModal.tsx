// src/components/friends/FriendModal.tsx
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { Friend, FriendStorage } from '@/utils/friends_storage';
import Modal from '@/components/shared/Modal';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import GoogleContactsPicker from './GoogleContactsPicker';

// This interface is used in handleContactSelected
interface ContactPerson {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
}

interface FriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFriendAdded: () => void;
  initialData?: Partial<Friend>;
}

export default function FriendModal({ isOpen, onClose, onFriendAdded, initialData }: FriendModalProps) {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [contactDetails, setContactDetails] = useState<{email?: string, phone?: string}>({});
  const [tags, setTags] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colorOptions = useMemo(() => [
    { value: 'bg-teal-100', label: 'Teal' },
    { value: 'bg-amber-100', label: 'Amber' },
    { value: 'bg-rose-100', label: 'Rose' },
    { value: 'bg-violet-100', label: 'Violet' },
    { value: 'bg-emerald-100', label: 'Emerald' },
    { value: 'bg-blue-100', label: 'Blue' },
  ], []);

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

    return unsubscribe;
  }, []);

  // Update form when initialData changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setContactInfo(initialData?.contactInfo || '');
      setTags(initialData?.tags?.join(', ') || '');
      setSelectedColor(initialData?.color || colorOptions[0].value);
      
      // Set contact details if available
      setContactDetails(initialData?.contactDetails || {});
      
      // If the friend has a photoUrl, set it
      if (initialData?.photoUrl) {
        setPhotoUrl(initialData.photoUrl);
        setPhotoPreview(initialData.photoUrl);
      } else {
        setPhotoUrl(null);
        setPhotoPreview(null);
      }
      
      // Reset file input
      setPhotoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen, initialData, colorOptions]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoUrl(null); // Clear any Google photo URL when uploading a file
      
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
    setPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setName('');
    setContactInfo('');
    setContactDetails({});
    setTags('');
    setSelectedColor(colorOptions[0].value);
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleContactSelected = (contact: ContactPerson) => {
    setName(contact.name);
    
    // Store structured contact info
    if (contact.email || contact.phone) {
      const displayContact = [contact.email, contact.phone].filter(Boolean).join(' | ');
      setContactInfo(displayContact); // For display in the form
    }
    
    // Store contact details for submission
    setContactDetails({
      email: contact.email,
      phone: contact.phone
    });
    
    if (contact.photoUrl) {
      setPhotoUrl(contact.photoUrl);
      setPhotoPreview(contact.photoUrl);
      setPhotoFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !user || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Clean up input values to avoid undefined
      const cleanedContactInfo = contactInfo.trim() || undefined;
      const tagArray = tags
        ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      const friendId = initialData?.id || uuidv4();
      const newFriend: Friend = {
        id: friendId,
        name: name.trim(),
        contactInfo: cleanedContactInfo,
        tags: tagArray.length > 0 ? tagArray : [],
        color: selectedColor,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.uid,
      };

      // Add contact details if they exist
      if (contactDetails.email || contactDetails.phone) {
        newFriend.contactDetails = {
          email: contactDetails.email,
          phone: contactDetails.phone
        };
      }

      // If we have an existing photo URL and no new file, keep it
      if ((initialData?.photoUrl || photoUrl) && !photoFile) {
        newFriend.photoUrl = initialData?.photoUrl || (photoUrl || undefined);
      }

      // First save the friend data
      await FriendStorage.addItem(newFriend);

      // Then handle the photo if needed
      if (photoFile) {
        await FriendStorage.uploadPhoto(friendId, photoFile);
      }

      onFriendAdded();
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error saving friend:", error);
      alert("There was an error saving your friend. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData?.id ? "Edit Friend" : "Add a New Friend"}>
      {!initialData && (
        <div className="mb-4">
          <GoogleContactsPicker 
            onSelectContact={(contact) => {
              handleContactSelected(contact as unknown as ContactPerson); 
            }}
            onClose={() => {}} 
          />
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
                    width={80}
                    height={80}
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
                {photoUrl ? 'Using photo from Google Contacts' : 'Recommended: square photos up to 1MB'}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="friend-name">
            Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="friend-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter friend's name"
            className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="contact-info">
            Contact Info (Optional)
          </label>
          <input
            id="contact-info"
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="Email, phone, social media, etc."
            className="w-full p-3 border rounded-md dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="friend-tags">
            Tags (Optional)
          </label>
          <input
            id="friend-tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Comma-separated tags (e.g., work, college, family)"
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

        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting 
              ? "Saving..." 
              : initialData?.id 
                ? "Save Changes" 
                : "Add Friend"
            }
          </button>
        </div>
      </form>
    </Modal>
  );
}
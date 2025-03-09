// src/components/friends/FriendModal.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Friend, FriendStorage } from '@/utils/friends_storage';
import Modal from '@/components/shared/Modal';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

interface AddFriendModalProps {
 isOpen: boolean;
 onClose: () => void;
 onFriendAdded: () => void;
 initialData?: Partial<Friend>;
}

export default function FriendModal({ isOpen, onClose, onFriendAdded, initialData }: AddFriendModalProps) {
 const [name, setName] = useState('');
 const [contactInfo, setContactInfo] = useState('');
 const [tags, setTags] = useState('');
 const [user, setUser] = useState<User | null>(null);

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

   return () => unsubscribe();
 }, []);

 // Update form when initialData changes or modal opens
 useEffect(() => {
   if (isOpen) {
     setName(initialData?.name || '');
     setContactInfo(initialData?.contactInfo || '');
     setTags(initialData?.tags?.join(', ') || '');
     setSelectedColor(initialData?.color || colorOptions[0].value);
   }
 }, [isOpen, initialData, colorOptions]);

 const resetForm = () => {
   setName('');
   setContactInfo('');
   setTags('');
   setSelectedColor(colorOptions[0].value);
 };

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();

   if (!name.trim() || !user) {
     return;
   }

   // Clean up input values to avoid undefined
   const cleanedContactInfo = contactInfo.trim() || undefined;
   const tagArray = tags
     ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
     : [];

   const newFriend: Friend = {
     id: initialData?.id || uuidv4(),
     name: name.trim(),
     contactInfo: cleanedContactInfo,
     tags: tagArray.length > 0 ? tagArray : [],
     color: selectedColor,
     createdAt: initialData?.createdAt || new Date().toISOString(),
     updatedAt: new Date().toISOString(),
     userId: user.uid, // Include the user ID
   };

   await FriendStorage.addItem(newFriend);
   onFriendAdded();
   resetForm();
   onClose();
 };

 return (
   <Modal isOpen={isOpen} onClose={onClose} title={initialData?.id ? "Edit Friend" : "Add a New Friend"}>
     <form onSubmit={handleSubmit} className="space-y-4">
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
           className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
         >
           {initialData?.id ? "Save Changes" : "Add Friend"}
         </button>
       </div>
     </form>
   </Modal>
 );
}
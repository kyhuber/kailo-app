// src/components/friends/GoogleContactsPicker.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

interface GoogleContact {
  resourceName: string;
  names?: Array<{displayName: string}>;
  emailAddresses?: Array<{value: string}>;
  phoneNumbers?: Array<{value: string}>;
  photos?: Array<{url: string}>;
}

interface ContactPerson {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
}

interface GoogleContactsPickerProps {
  onContactSelected: (contact: ContactPerson) => void;
  buttonLabel?: string;
}

export default function GoogleContactsPicker({ 
  onContactSelected,
  buttonLabel = "Import from Google Contacts" 
}: GoogleContactsPickerProps) {
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { googleAccessToken, refreshGoogleToken } = useAuth();

  // Process contacts data from Google API response
  const processContactsData = (data: any): ContactPerson[] => {
    return (data.connections || []).map((contact: GoogleContact) => ({
      id: contact.resourceName,
      name: contact.names?.[0]?.displayName || 'Unknown',
      email: contact.emailAddresses?.[0]?.value,
      phone: contact.phoneNumbers?.[0]?.value,
      photoUrl: contact.photos?.[0]?.url
    })).filter((contact: ContactPerson) => contact.name !== 'Unknown');
  };

  // Fetch contacts when modal is opened
  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!googleAccessToken) {
        throw new Error("Google access token not available");
      }
      
      // Fetch contacts from our API endpoint using the Google token
      const response = await fetch(`/api/google-contacts`, {
        headers: { 
          'Authorization': `Bearer ${googleAccessToken}`,
        }
      });
      
      const errorData = await response.json();
      
      if (!response.ok) {
        // If token expired, try to refresh it
        if (response.status === 401 && errorData.error === 'Token expired') {
          const newToken = await refreshGoogleToken();
          if (newToken) {
            // Retry with the new token
            const retryResponse = await fetch(`/api/google-contacts`, {
              headers: { 
                'Authorization': `Bearer ${newToken}`,
              }
            });
            
            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              const formattedContacts = processContactsData(retryData);
              
              // Sort contacts alphabetically by name
              formattedContacts.sort((a, b) => a.name.localeCompare(b.name));
              
              setContacts(formattedContacts);
              return;
            }
          }
          
          throw new Error("Failed to refresh Google token. Please sign in again.");
        }
        
        throw new Error(errorData.error || 'Failed to fetch contacts');
      }
      
      // Process successful response
      const formattedContacts = processContactsData(errorData);
      
      // Sort contacts alphabetically by name
      formattedContacts.sort((a, b) => a.name.localeCompare(b.name));
      
      setContacts(formattedContacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    fetchContacts();
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSelectContact = (contact: ContactPerson) => {
    onContactSelected(contact);
    handleClose();
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (contact.phone && contact.phone.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="w-full px-4 py-2 mt-4 text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2.917 16.083c-2.258 0-4.083-1.825-4.083-4.083s1.825-4.083 4.083-4.083c1.103 0 2.024.402 2.735 1.067l-1.107 1.068c-.304-.292-.834-.63-1.628-.63-1.394 0-2.531 1.155-2.531 2.579 0 1.424 1.138 2.579 2.531 2.579 1.616 0 2.224-1.162 2.316-1.762h-2.316v-1.4h3.855c.036.204.064.408.064.677.001 2.332-1.563 3.988-3.919 3.988zm9.917-3.5h-1.75v1.75h-1.167v-1.75h-1.75v-1.166h1.75v-1.75h1.167v1.75h1.75v1.166z"/>
        </svg>
        {buttonLabel}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-800 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Select Google Contact</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md dark:bg-red-900/30 dark:text-red-100">
                <p>{error}</p>
                <button 
                  onClick={fetchContacts}
                  className="mt-2 text-sm font-medium text-red-700 underline dark:text-red-100"
                >
                  Try again
                </button>
              </div>
            ) : contacts.length === 0 ? (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                <p>No contacts found in your Google account.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                {filteredContacts.length === 0 ? (
                  <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                    No contacts found for "{searchQuery}"
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {filteredContacts.map(contact => (
                      <li key={contact.id}>
                        <button
                          onClick={() => handleSelectContact(contact)}
                          className="flex items-center w-full p-2 text-left transition rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <div className="flex-shrink-0 mr-3">
                            {contact.photoUrl ? (
                              <div className="relative w-10 h-10 overflow-hidden rounded-full">
                                <Image
                                  src={contact.photoUrl}
                                  alt={contact.name}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center w-10 h-10 text-lg font-bold text-white bg-blue-500 rounded-full">
                                {contact.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{contact.name}</div>
                            {contact.email && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</div>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            <div className="flex justify-end mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
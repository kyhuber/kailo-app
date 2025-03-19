import React, { useState } from 'react';
import { Friend } from '@/utils/friends_storage';
import { IoSearch } from 'react-icons/io5';
import { BsPerson } from 'react-icons/bs';
import Image from 'next/image';
import { FEATURES } from '@/config/features'; 

// Define the structure of a Google Contact
interface GoogleContact {
  resourceName: string;
  names?: Array<{ displayName: string }>;
  emailAddresses?: Array<{ value: string }>;
  phoneNumbers?: Array<{ value: string }>;
  photos?: Array<{ url: string }>;
}

// Define the structure of the Google Contacts API response
interface GoogleContactsResponse {
  connections: GoogleContact[];
}

interface ContactPerson {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
}

export interface GoogleContactsPickerProps {
  onSelectContact: (contact: Partial<Friend>) => void;
  onClose: () => void;
  buttonLabel?: string;
}

const GoogleContactsPicker: React.FC<GoogleContactsPickerProps> = ({
  onSelectContact,
  onClose,
  buttonLabel = 'Import from Google Contacts'
}) => {
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  const processContactsData = (data: GoogleContactsResponse): ContactPerson[] => {
    return (data.connections || []).map((contact: GoogleContact) => ({
      id: contact.resourceName,
      name: contact.names?.[0]?.displayName || 'Unknown',
      email: contact.emailAddresses?.[0]?.value,
      phone: contact.phoneNumbers?.[0]?.value,
      photoUrl: contact.photos?.[0]?.url
    })).filter((contact: ContactPerson) => contact.name !== 'Unknown');
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      
      // This is a simulated fetch - in a real application, you'd integrate with the Google People API
      // For demonstration purposes, we're just using mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data similar to what Google People API would return
      const mockData = {
        connections: [
          {
            resourceName: 'people/1',
            names: [{ displayName: 'John Doe' }],
            emailAddresses: [{ value: 'john@example.com' }],
            phoneNumbers: [{ value: '555-1234' }],
            photos: [{ url: 'https://via.placeholder.com/50' }]
          },
          {
            resourceName: 'people/2',
            names: [{ displayName: 'Jane Smith' }],
            emailAddresses: [{ value: 'jane@example.com' }],
            phoneNumbers: [{ value: '555-5678' }],
            photos: [{ url: 'https://via.placeholder.com/50' }]
          },
          {
            resourceName: 'people/3',
            names: [{ displayName: 'Robert Johnson' }],
            emailAddresses: [{ value: 'robert@example.com' }],
            phoneNumbers: [{ value: '555-9012' }]
          },
          {
            resourceName: 'people/4',
            names: [{ displayName: 'Emily Williams' }],
            emailAddresses: [{ value: 'emily@example.com' }]
          },
          {
            resourceName: 'people/5',
            names: [{ displayName: 'Michael Brown' }],
            phoneNumbers: [{ value: '555-3456' }]
          }
        ]
      };
      
      const processedContacts = processContactsData(mockData);
      setContacts(processedContacts);
      setIsAuthorized(true);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = () => {
    // In a real application, this would initiate the Google OAuth flow
    fetchContacts();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleContactSelect = (contact: ContactPerson) => {
    const newFriend: Partial<Friend> = {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      photoUrl: contact.photoUrl
    };
    onSelectContact(newFriend);
    onClose();
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (contact.phone && contact.phone.includes(searchQuery))
  );

  if (!FEATURES.GOOGLE_CONTACTS_INTEGRATION) {
    return (
      <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
        <p className="text-yellow-700">
          Google Contacts integration is currently disabled. 
          This feature will be re-enabled in a future update.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Google Contacts
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {!isAuthorized ? (
          <div className="p-6 flex flex-col items-center justify-center flex-grow">
            <p className="mb-4 text-center text-gray-700 dark:text-gray-300">
              Connect to Google Contacts to import your friends
            </p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={handleAuthorize}
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Connect to Google'}
            </button>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <IoSearch className="text-gray-500 dark:text-gray-400" />
                </div>
                <input
                  type="search"
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-grow">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredContacts.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredContacts.map((contact) => (
                    <li
                      key={contact.id}
                      className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      onClick={() => handleContactSelect(contact)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                          {contact.photoUrl ? (
                            <Image
                              src={contact.photoUrl}
                              alt={contact.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full">
                              <BsPerson className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {contact.name}
                          </p>
                          {contact.email && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {contact.email}
                            </p>
                          )}
                          {contact.phone && !contact.email && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {contact.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-4 text-center text-gray-500 dark:text-gray-400">
                  No contacts found for &quot;{searchQuery}&quot;
                </p>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleContactsPicker;
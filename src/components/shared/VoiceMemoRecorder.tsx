// src/components/shared/VoiceMemoRecorder.tsx
import React, { useState, useEffect, useRef } from 'react';
import { processVoiceInput, ProcessedItem, ProcessedVoiceResult } from '@/utils/voice_processing';
import { FriendStorage, Friend } from '@/utils/friends_storage';
import { TaskStorage } from '@/utils/tasks_storage';
import { NoteStorage } from '@/utils/notes_storage';
import { TopicStorage } from '@/utils/topics_storage';
import { DateStorage } from '@/utils/dates_storage';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { AiOutlineLoading } from 'react-icons/ai';

// Declare SpeechRecognition types for TypeScript
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

// Custom types for speech recognition
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface VoiceMemoRecorderProps {
  onClose?: () => void;
  onProcessingComplete?: (result: ProcessedVoiceResult) => void;
}

export default function VoiceMemoRecorder({ onClose, onProcessingComplete }: VoiceMemoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [availableFriends, setAvailableFriends] = useState<Friend[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [processedResult, setProcessedResult] = useState<ProcessedVoiceResult | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { currentUser } = useAuth();

  // Load available friends when component mounts
  useEffect(() => {
    const loadFriends = async () => {
      try {
        const friends = await FriendStorage.getAll();
        setAvailableFriends(friends);
      } catch (error) {
        console.error('Error loading friends:', error);
      }
    };

    loadFriends();
  }, []);

  // Set up and clean up speech recognition
  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognitionConstructor = (window as unknown as {
      SpeechRecognition?: new () => SpeechRecognition;
      webkitSpeechRecognition?: new () => SpeechRecognition;
    }).SpeechRecognition || (window as unknown as {
      SpeechRecognition?: new () => SpeechRecognition;
      webkitSpeechRecognition?: new () => SpeechRecognition;
    }).webkitSpeechRecognition;
    
    if (!SpeechRecognitionConstructor) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ');
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

  }, []);

  // Start recording
  const startRecording = () => {
    setError(null);
    setTranscript('');
    try {
      recognitionRef.current?.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Could not start recording. Please try again.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    try {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  // Process the voice input with OpenAI
  const handleProcessVoice = async () => {
    if (!transcript.trim()) {
      setError('Please record something first.');
      return;
    }

    setIsProcessing(true);
    setProcessingStatus('Analyzing your voice memo...');
    setError(null);

    try {
      // Pass available friend names to help with matching
      const friendNames = availableFriends.map(friend => ({ 
        id: friend.id, 
        name: friend.name 
      }));
      
      const results = await processVoiceInput(transcript, friendNames);
      setProcessedResult(results);
      setShowConfirmation(true);
      
      if (onProcessingComplete) {
        onProcessingComplete(results);
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      setError('Failed to process your voice memo. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  // Save the processed items to the database
  const handleSaveResults = async () => {
    if (!processedResult || !currentUser) return;
    
    setIsProcessing(true);
    setProcessingStatus('Saving your data...');
    
    try {
      // Process each friend's items
      for (const friend of processedResult.friends) {
        const friendId = friend.id;
        
        // Skip if no valid friend ID
        if (!friendId) continue;
        
        for (const item of friend.items) {
          await saveItem(item, friendId);
        }
      }
      
      // Process unassigned items if we should create a new friend for them
      if (processedResult.unassignedItems.length > 0 && processedResult.createNewFriend) {
        // Create a new friend
        const newFriendId = uuidv4();
        const newFriend = {
          id: newFriendId,
          name: processedResult.newFriendName || 'New Friend',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: currentUser.uid
        };
        
        await FriendStorage.addItem(newFriend);
        
        // Save the unassigned items to the new friend
        for (const item of processedResult.unassignedItems) {
          await saveItem(item, newFriendId);
        }
      }
      
      // Reset states after successful save
      setTranscript('');
      setShowConfirmation(false);
      setProcessedResult(null);
      
      // Close the modal if a callback is provided
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving items:', error);
      setError('Failed to save some items. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  // Helper function to save an individual item
  const saveItem = async (item: ProcessedItem, friendId: string) => {
    if (!currentUser) return;
    
    const now = new Date().toISOString();
    const userId = currentUser.uid;
    
    switch (item.type) {
      case 'task':
        const task = {
          id: uuidv4(),
          friendId,
          content: item.content,
          status: 'Pending' as const,
          priority: item.priority || 'Normal' as const,
          createdAt: now,
          updatedAt: now,
          userId
        };
        await TaskStorage.addItem(task);
        break;
        
      case 'note':
        const note = {
          id: uuidv4(),
          friendId,
          content: item.content,
          status: 'Active' as const,
          createdAt: now,
          updatedAt: now,
          userId
        };
        await NoteStorage.addItem(note);
        break;
        
      case 'topic':
        const topic = {
          id: uuidv4(),
          friendId,
          content: item.content,
          status: 'Active' as const,
          createdAt: now,
          updatedAt: now,
          userId
        };
        await TopicStorage.addItem(topic);
        break;
        
        case 'date':
          const date = {
            id: uuidv4(),
            friendId,
            title: item.title || 'Important Date',
            date: item.date || now,
            type: item.recurring ? 'Recurring' as const : 'One-time' as const,
            description: item.content,
            createdAt: now,
            updatedAt: now,
            userId
          };
          await DateStorage.addItem(date);
          break;
    }
  };

  // Cancel the current process
  const handleCancel = () => {
    setTranscript('');
    setProcessedResult(null);
    setShowConfirmation(false);
    
    if (onClose) {
      onClose();
    }
  };

  // Render confirmation view with processed results
  const renderConfirmation = () => {
    if (!processedResult) return null;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Confirm Your Voice Memo</h3>
        
        {processedResult.friends.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-lg mb-2">Items by Friend</h4>
            {processedResult.friends.map((friend, index) => (
              <div key={index} className="mb-4 border-b pb-3 last:border-b-0 dark:border-gray-700">
                <h5 className="font-medium text-teal-600 dark:text-teal-400">{friend.name}</h5>
                <ul className="pl-4 mt-2 space-y-2">
                  {friend.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <span className={`inline-block w-16 text-sm font-medium px-2 py-1 rounded mr-2 ${
                        item.type === 'task' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' :
                        item.type === 'note' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' :
                        item.type === 'topic' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200' :
                        'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200'
                      }`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                      <span>{item.content}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        
        {processedResult.unassignedItems.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-lg mb-2">Unassigned Items</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {processedResult.createNewFriend
                ? `These will be assigned to a new friend named "${processedResult.newFriendName || 'New Friend'}"`
                : "These items couldn't be assigned to any friend."}
            </p>
            <ul className="pl-4 space-y-2">
              {processedResult.unassignedItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className={`inline-block w-16 text-sm font-medium px-2 py-1 rounded mr-2 ${
                    item.type === 'task' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' :
                    item.type === 'note' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' :
                    item.type === 'topic' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200' :
                    'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200'
                  }`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                  <span>{item.content}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveResults}
            disabled={isProcessing}
            className={`px-4 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-700 flex items-center gap-2 ${
              isProcessing ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? (
              <>
                <AiOutlineLoading className="animate-spin" /> Saving...
              </>
            ) : (
              'Save All Items'
            )}
          </button>
        </div>
      </div>
    );
  };

  // Render the main recording interface
  const renderRecordingInterface = () => {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!!error && !isRecording}
          className={`w-full py-3 px-4 rounded-full flex items-center justify-center gap-2 ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors ${
            !!error && !isRecording ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isRecording ? (
            <>
              <FaMicrophone className="h-5 w-5" /> Stop Recording
            </>
          ) : (
            <>
              <FaStop className="h-5 w-5" /> Start Voice Memo
            </>
          )}
        </button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}
        
        {transcript && (
          <div className="mt-4">
            <p className="font-medium mb-2">Transcript:</p>
            <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded">{transcript}</p>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleProcessVoice}
                disabled={isProcessing || !transcript.trim()}
                className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 ${
                  isProcessing || !transcript.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isProcessing ? (
                  <>
                    <AiOutlineLoading className="animate-spin" /> Processing...
                  </>
                ) : (
                  'Process Voice Memo'
                )}
              </button>
            </div>
          </div>
        )}
        
        {isProcessing && processingStatus && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md flex items-center gap-2">
            <AiOutlineLoading className="animate-spin" />
            {processingStatus}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="voice-memo-recorder">
      {showConfirmation && processedResult ? renderConfirmation() : renderRecordingInterface()}
    </div>
  );
}
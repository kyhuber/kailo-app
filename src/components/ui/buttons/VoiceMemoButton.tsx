// src/components/ui/buttons/VoiceMemoButton.tsx
import React, { useState } from 'react';
import { MdMic } from 'react-icons/md'; // Using Material Design icons instead
import VoiceMemoModal from '@/components/shared/VoiceMemoModal';
import { ProcessedVoiceResult } from '@/utils/voice_processing';

interface VoiceMemoButtonProps {
  label?: string;
  variant?: 'primary' | 'secondary' | 'floating';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onProcessingComplete?: (result: ProcessedVoiceResult) => void;
}

export default function VoiceMemoButton({
  label = 'Voice Memo',
  variant = 'primary',
  position = 'bottom-right',
  onProcessingComplete
}: VoiceMemoButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define position classes for floating button
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  // Define variant classes
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
    floating: 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg'
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Render floating button
  if (variant === 'floating') {
    return (
      <>
        <button
          onClick={handleOpenModal}
          className={`fixed ${positionClasses[position]} ${variantClasses[variant]} p-4 rounded-full z-20 flex items-center justify-center`}
          aria-label="Record voice memo"
        >
          <MdMic className="h-6 w-6" />
        </button>
        
        <VoiceMemoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onProcessingComplete={onProcessingComplete}
        />
      </>
    );
  }

  // Render standard button
  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`px-4 py-2 rounded-md flex items-center gap-2 ${variantClasses[variant]}`}
      >
        <MdMic className="h-5 w-5" />
        {label}
      </button>
      
      <VoiceMemoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onProcessingComplete={onProcessingComplete}
      />
    </>
  );
}
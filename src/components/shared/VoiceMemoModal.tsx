import React from 'react';
import Modal from '@/components/shared/Modal';
import VoiceMemoRecorder from './VoiceMemoRecorder';
import { ProcessedVoiceResult } from '@/utils/voice_processing';

interface VoiceMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessingComplete?: (result: ProcessedVoiceResult) => void;
}

export default function VoiceMemoModal({ isOpen, onClose, onProcessingComplete }: VoiceMemoModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Voice Memo" 
      size="md"
    >
      <div className="p-2">
        <VoiceMemoRecorder 
          onClose={onClose}
          onProcessingComplete={onProcessingComplete}
        />
      </div>
    </Modal>
  );
}
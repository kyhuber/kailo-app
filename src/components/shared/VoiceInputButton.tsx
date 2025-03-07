import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onend: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface VoiceInputButtonProps {
  targetInputId: string;
  onTextChange: (text: string) => void;
}

export default function VoiceInputButton({ targetInputId, onTextChange }: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Web Speech API is not supported in this browser.');
      return;
    }

    const speechRecognition = new (window as any).webkitSpeechRecognition();
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;
    speechRecognition.lang = 'en-US';

    speechRecognition.onstart = () => {
      setIsListening(true);
    };

    speechRecognition.onend = () => {
      setIsListening(false);
    };

    speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      const targetInput = document.getElementById(targetInputId) as HTMLInputElement;
      if (targetInput) {
        targetInput.value = transcript;
        onTextChange(transcript); // Update the state in the parent component
      }
    };

    setRecognition(speechRecognition);
  }, [targetInputId, onTextChange]);

  const handleButtonClick = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
  };

  return (
    <button
      onClick={handleButtonClick}
      className={`px-4 py-2 rounded-md text-white flex items-center gap-2 ${isListening ? 'bg-red-600' : 'bg-blue-600'} hover:bg-blue-700`}
    >
      <FontAwesomeIcon icon={isListening ? faMicrophoneSlash : faMicrophone} />
      {isListening ? 'Stop Listening' : 'Start Listening'}
    </button>
  );
}
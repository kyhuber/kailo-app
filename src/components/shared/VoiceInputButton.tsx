import React, { useState, useEffect } from 'react';

// Add type declaration for SpeechRecognition
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
  results: {
    isFinal: boolean;
    [index: number]: {
      transcript: string;
    };
  }[];
}

interface VoiceInputButtonProps {
  targetInputId: string;
}

export default function VoiceInputButton({ targetInputId }: VoiceInputButtonProps) {
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
      }
    };

    setRecognition(speechRecognition);
  }, [targetInputId]);

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
      className={`px-4 py-2 rounded-md text-white ${isListening ? 'bg-red-600' : 'bg-blue-600'} hover:bg-blue-700`}
    >
      {isListening ? 'Stop Listening' : 'Start Listening'}
    </button>
  );
}
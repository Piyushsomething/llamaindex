import { useEffect, useState, useRef } from 'react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface MicrophoneComponentProps {
  onTranscription: (text: string) => void; // Callback to pass transcribed text to parent component
}

const MicrophoneComponent: React.FC<MicrophoneComponentProps> = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const recognitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event: any) => {
      // Clear any existing timeout when new results are received
      if (recognitionTimeoutRef.current) {
        clearTimeout(recognitionTimeoutRef.current);
      }

      const transcript = event.results[event.results.length - 1][0].transcript;
      console.log('Interim result:', transcript);

      // Set a timeout to send the transcription after a pause in speech
      recognitionTimeoutRef.current = setTimeout(() => {
        console.log('Final result:', transcript);
        onTranscription(transcript); // Pass transcribed text to parent component
      }, 1000); // Adjust this delay as needed
    };

    recognitionRef.current.start();
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (recognitionTimeoutRef.current) {
        clearTimeout(recognitionTimeoutRef.current);
      }
    }
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  return (
    <button
      onClick={handleToggleRecording}
      className={`mt-10 m-auto flex items-center justify-center ${
        isRecording ? 'bg-red-400 hover:bg-red-500' : 'bg-blue-400 hover:bg-blue-500'
      } rounded-full w-10 h-10 focus:outline-none`}
    >
      {isRecording ? (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white">
          <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      ) : (
        <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white">
          <path
            fill="currentColor"
            d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
          />
        </svg>
      )}
    </button>
  );
};

export default MicrophoneComponent;

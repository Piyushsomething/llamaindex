'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CircleX, LoaderCircle, Trash } from 'lucide-react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MicrophoneComponent from "./MicroPhoneComponent";// Import the MicrophoneComponent

import { resetChatEngine } from "@/app/actions";

export interface ChatMessage {
  role: "human" | "ai"
  statement: string
}

interface ChatWindowProps {
  isLoading: boolean,
  loadingMessage: string,
  startChat: (input: string) => void,
  messages: ChatMessage[],
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>,
  setSelectedFile: Dispatch<SetStateAction<File | null>>,
  setPage: Dispatch<SetStateAction<number>>
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  isLoading,
  loadingMessage,
  messages,
  setMessages,
  startChat,
  setPage,
  setSelectedFile
}) => {
  const [input, setInput] = useState("");
  const [transcript, setTranscript] = useState(""); // State to hold the transcribed text
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const messageClass = "rounded-3xl p-3 block relative max-w-max";
  const aiMessageClass = `text-start rounded-bl bg-gray-300 float-left text-gray-700 ${messageClass}`;
  const humanMessageClass = `text-end rounded-br bg-blue-400 text-gray-50 float-right ${messageClass}`;

  const closePDF = async () => {
    await resetChatEngine();
    setMessages([]);
    setSelectedFile(null);
    setPage(1)
  }

  const resetChat = async () => {
    await resetChatEngine();
    setMessages([]);
    setPage(1);
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSend();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [input]);

  useEffect(() => {
    console.log("changes here-->",chatHistory);
  },[chatHistory])

  const handleSend = () => {
    if (input.trim() === "") {
      return; // Do not send empty messages
    }

    const newMessage: ChatMessage = {
      role: "human",
      statement: input
    };
    const newChatHistory = [...chatHistory, newMessage]; // Append the new message to the chat history
    setChatHistory(newChatHistory); // Update the chat history

    startChat(input); // Submit the message
    setInput(""); // Clear the input field
  };

  // Function to handle microphone transcription
  const handleTranscription = (text: string) => {
    setInput(text);
    const newMessage: ChatMessage = {
      role: "human",
      statement: input
    };
    // const newChatHistory = [...chatHistory, newMessage]; // Append the new message to the chat history
    // setChatHistory(newChatHistory); // Update the chat history
    setChatHistory(prevChatHistory => [...prevChatHistory, newMessage]);
    startChat(text)
    setInput("");
    // handleSend();



    //startChat(text); // Submit the transcription
    // setInput("")
  };

  return (
    <div className="h-full flex flex-col justify-stretch w-[42vw] border-2 border-gray-200 rounded-xl p-2">
      <div className="flex gap2 justify-between mx-4">
        <span className="flex gap-2 mt-2 text-gray-500">
          {isLoading && (
            <LoaderCircle className="animate-spin" />
          )}
          {loadingMessage}
        </span>
        <span className="flex items-center">
          <Button onClick={resetChat} className="px-2 py-0" disabled={isLoading} title="Refresh Chat">
            <Trash size={20} className="text-gray-400" />
          </Button>
          <Button onClick={closePDF} className="px-2 py-0" disabled={isLoading} title="Close PDF">
            <CircleX size={20} className="text-red-500" />
          </Button>
        </span>
      </div>
      <hr className="mt-3" />
      <div className="flex flex-col justify-end gap-3 flex-grow">
        <div className="invisible flex-grow h-max" />
        {messages.map((message, index) => {
          return (
            <div key={index} className="w-full">
              <div className={message.role === "ai" ? aiMessageClass : humanMessageClass}>{message.statement}</div>
            </div>
          );
        })}
        <div className="flex gap-2 mx-2 items-center justify-between">
          <Input
            disabled={isLoading}
            className="text-md"
            type="text"
            placeholder="Send a message..."
            value={input}
            onChange={e => { setInput(e.target.value) }}
          />
          <div className="flex gap-2 items-center">
            <Button
              variant={"outline"}
              disabled={isLoading}
              onClick={handleSend}>
              Send
            </Button>
            {/* Integrate MicrophoneComponent for voice transcription */}
            <MicrophoneComponent onTranscription={handleTranscription} />
            {isLoading && (
              <LoaderCircle className="animate-spin" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;

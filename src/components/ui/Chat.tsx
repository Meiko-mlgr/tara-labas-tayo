"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

// Define the structure of a message object for TypeScript
type Message = {
  id: number;
  content: string;
  inserted_at: string;
  // profile info 
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // This function will handle sending messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    // Supabase insert logic here
    console.log("Sending message:", newMessage);

    setNewMessage('');
  };

  return (
    <div className="absolute bottom-4 left-4 w-full max-w-sm bg-black/50 backdrop-blur-sm rounded-lg shadow-lg p-4 text-white z-10">
      <div className="flex flex-col h-80">
        {/* Message Display Area */}
        <div className="flex-1 overflow-y-auto pr-2">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Nobody is talking... start chatting! say hi.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="mb-2">
                <p className="text-sm">{msg.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="mt-4 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-gray-800/70 border border-gray-600 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-2 rounded-r-md text-sm transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
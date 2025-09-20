"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { type Session } from '@supabase/supabase-js';

type Message = {
  id: number;
  content: string;
  inserted_at: string;
  user_id: string;
  profiles: {
    username: string | null;
  } | null;
};

const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const formatDateSeparator = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chat = chatContainerRef.current;
    if (chat) {
      const scrollThreshold = 100; 
      const isAtBottom = chat.scrollHeight - chat.scrollTop - chat.clientHeight < scrollThreshold;
      if (isAtBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);


  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*, profiles(username)')
        .order('inserted_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else if (data) {
        setMessages(data as Message[]);
      }
    };

    // Initial session check and fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchMessages();
      }
    });
    
    // message polling
    const intervalId = setInterval(fetchMessages, 1000);

 
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup function
    return () => {
      clearInterval(intervalId);
      subscription?.unsubscribe();
    };
  }, []); 

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !session) return;
    setLoading(true);
    
    await supabase
      .from('messages')
      .insert({ content: newMessage, user_id: session.user.id });
    
    const { data } = await supabase.from('messages').select('*, profiles(username)').order('inserted_at', { ascending: true });
    if (data) setMessages(data as Message[]);

    setNewMessage('');
    setLoading(false);
  };

  const getSenderName = (message: Message) => {
    return message.profiles?.username || 'Anonymous';
  };

  return (
    <div className="absolute bottom-4 left-4 w-full max-w-sm bg-black/50 backdrop-blur-sm rounded-lg shadow-lg p-4 text-white z-10">
      <div className="flex flex-col h-80">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {messages.map((msg, index) => {
            const prevMessage = messages[index - 1];
            const showDateSeparator = !prevMessage || 
              new Date(msg.inserted_at).toDateString() !== new Date(prevMessage.inserted_at).toDateString();
            
            const isMyMessage = session?.user.id === msg.user_id;
            
            return (
              <React.Fragment key={msg.id}>
                {showDateSeparator && (
                  <div className="relative text-center my-4">
                    <hr className="absolute top-1/2 w-full border-t border-gray-600" />
                    <span className="relative bg-gray-800/80 px-3 text-xs text-gray-400 rounded-full">
                      {formatDateSeparator(msg.inserted_at)}
                    </span>
                  </div>
                )}
                
                <div className={`flex mb-3 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                  {/* This inner div holds the original message style. */}
                  <div>
                    <p className={`font-bold text-cyan-300 text-sm ${isMyMessage ? 'text-right' : 'text-left'}`}>
                      {!isMyMessage ? getSenderName(msg) : 'You'}
                      <span className="ml-2 text-xs text-gray-400 font-normal">
                        {formatMessageTime(msg.inserted_at)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-200 break-all">{msg.content}</p>
                  </div>
                </div>
              </React.Fragment>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="mt-4 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-gray-800/70 border border-gray-600 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Type your message..."
          />
          <button type="submit" disabled={loading} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-2 rounded-r-md text-sm transition-colors disabled:opacity-50">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
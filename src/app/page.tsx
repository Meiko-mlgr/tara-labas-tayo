"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import AuthComponent from '@/components/ui/Auth';
import Chat from '@/components/ui/Chat';
import { supabase } from '@/lib/supabaseClient';
import { Session, RealtimeChannel } from '@supabase/supabase-js';

type PresencePayload = {
  online_at: string;
  user_id: string; 
};


const Experience = dynamic(() => import('@/components/scene/Experience').then(mod => mod.Experience), {
  ssr: false,
  loading: () => <p className="text-center text-lg absolute inset-0 flex items-center justify-center text-white">Loading 3D Scene...</p>,
});

const MainScene = () => {

  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const setupChannel = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {

        const channel = supabase.channel('room-presence', {
          config: { presence: { key: session.user.id } }
        });

        channel.on('presence', { event: 'sync' }, () => {
          const presenceState = channel.presenceState<PresencePayload>();
          const userIds = Object.keys(presenceState).map(presenceId => presenceState[presenceId][0].user_id);
          

        });

        channel.subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ 
              online_at: new Date().toISOString(),
              user_id: session.user.id 
            });
          }
        });

        channelRef.current = channel;
      }
    };

    setupChannel();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);


  const handleSignOut = async () => {
    const channel = channelRef.current;
    
    if (channel) {
      try {
        const presenceState = channel.presenceState();
        const userCount = Object.keys(presenceState).length;

        console.log(`Users in room before I leave: ${userCount}`);
        // checks the person in the room
        if (userCount <= 1) {
          console.log(`No users left, cleaning chatbox`);
          await supabase.from('messages').delete().gt('id', 0);
        }
        
        await channel.untrack();

      } catch (error) {
        console.error("Error during sign out cleanup:", error);
      }
    }
    
    await supabase.auth.signOut();
  };


  return (
    <div className="w-full h-screen relative bg-gray-800">
      <Experience />
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold text-white transition-colors"
        >
          Sign Out
        </button>
      </div>
      <Chat />
    </div>
  );
};


export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900">
        <p className="text-xl text-white">Loading...</p>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-gray-900">
      {!session ? <AuthComponent /> : <MainScene />}
    </main>
  );
}
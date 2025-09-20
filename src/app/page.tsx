"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import AuthComponent from '@/components/ui/Auth';
import Chat from '@/components/ui/Chat';
import { supabase } from '@/lib/supabaseClient';
import { Session, RealtimeChannel } from '@supabase/supabase-js';
import MainMenu from '@/components/ui/MainMenu';

type PresencePayload = {
  online_at: string;
  user_id: string; 
};


const Experience = dynamic(() => import('@/components/scene/Experience').then(mod => mod.Experience), {
  ssr: false,
  loading: () => <p className="text-center text-lg absolute inset-0 flex items-center justify-center text-white">Loading 3D Scene...</p>,
});

const MainScene = () => {
  const [gameState, setGameState] = useState('menu');
  const [hasCharacter, setHasCharacter] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const checkCharacter = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from('characters')
          .select('id')
          .eq('user_id', session.user.id);
        
        if (data && data.length > 0) {
          setHasCharacter(true);
        }
      }
    };
    checkCharacter();
    
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
    <div className={`absolute inset-0 ${gameState === 'menu' ? 'blur-sm' : ''}`}>
      <Experience />
    </div>

      {/* Conditional UI based on game state */}
      {gameState === 'menu' && (
        <MainMenu
          hasCharacter={hasCharacter}
          onPlay={() => setGameState('in_game')}
          onCreateCharacter={() => console.log("Go to character creation!")}
          onSignOut={handleSignOut}
        />
      )}

      {/* The button inside the 3D experience now opens the menu */}
      {gameState === 'in_game' && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setGameState('menu')} // <-- THIS IS THE CHANGE
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold text-white transition-colors"
          >
            Menu
          </button>
        </div>
      )}
      
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
    <main className="min-h-screen bg-gray-900 flex items-center justify-center">
      {!session ? <AuthComponent /> : <MainScene />}
    </main>
  );
}
"use client";

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import AuthComponent from '@/components/ui/Auth';
import Chat from '@/components/ui/Chat';
import { supabase } from '@/lib/supabaseClient';
import { Session, RealtimeChannel } from '@supabase/supabase-js';
import MainMenu, { type Character } from '@/components/ui/MainMenu';
import CharacterCreator from '@/components/ui/CharacterCreator';

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
  const [characters, setCharacters] = useState<(Character | null)[]>([]); 
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [avatarColor, setAvatarColor] = useState<string>('#87CEEB');
  const [systemMessage, setSystemMessage] = useState<string | null>(null);

 useEffect(() => {
    const fetchCharacters = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase.from('characters').select('*').eq('user_id', session.user.id);
        if (error) console.error("Error fetching characters:", error);
        else if (data) setCharacters(data as Character[]);
      }
    };
    fetchCharacters();
    
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

        channel.on('presence', { event: 'join' }, ({ newPresences }) => {
            const userId = newPresences[0].user_id.substring(0, 8);
            setSystemMessage(`User ${userId}... joined the room.`);
            // Clear the message after 5 seconds
            setTimeout(() => setSystemMessage(null), 5000);
          });
  
          channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
            const userId = leftPresences[0].user_id.substring(0, 8);
            setSystemMessage(`User ${userId}... left the room.`);
            // Clear the message after 5 seconds
            setTimeout(() => setSystemMessage(null), 5000);
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

  const handleSaveCharacter = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !selectedSlot) return;

    const { data, error } = await supabase
      .from('characters')
      .insert({ user_id: user.id, avatar_color: avatarColor, slot_number: selectedSlot })
      .select().single();

    if (error) {
      console.error("Error saving character:", error);
    } else if (data) {
      setCharacters([...characters, data as Character]);
      setActiveCharacter(data as Character);
      setGameState('in_game');
    }
  };

  const handleDeleteCharacter = async (characterId: string) => {
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', characterId);

    if (error) {
      console.error('Error deleting character:', error);
    } else {
      // remove the character from the local state
      setCharacters(characters.filter(c => c?.id !== characterId));
      console.log('Character deleted successfully');
    }
  };

  const handlePlay = (character: Character) => {
    setActiveCharacter(character);
    setGameState('in_game');
  };

  const handleCreateCharacter = (slot: number) => {
    setSelectedSlot(slot);
    setGameState('character_creation');
  };


  return (
  <div className="w-full h-screen relative bg-gray-800">
      <div className={`absolute inset-0 ${gameState === 'menu' ? 'blur-sm' : ''}`}>
        <Experience gameState={gameState} avatarColor={avatarColor} />
      </div>

      {gameState === 'menu' && (
        <MainMenu
          characters={characters}
          onPlay={handlePlay}
          onCreateCharacter={handleCreateCharacter}
          onSignOut={handleSignOut}
          onDelete={handleDeleteCharacter}
        />
      )}

      {gameState === 'character_creation' && (
        <CharacterCreator 
          avatarColor={avatarColor}
          setAvatarColor={setAvatarColor}
          onSave={handleSaveCharacter}
          onBack={() => setGameState('menu')}
        />
      )}
      {gameState === 'in_game' && (
        <div className="absolute top-4 right-4 z-10">
          <button onClick={() => setGameState('menu')} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold text-white transition-colors">
            Menu
          </button>
        </div>
      )}
      {gameState !== 'menu' && <Chat systemMessage={systemMessage} />}
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
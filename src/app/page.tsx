"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AuthComponent from '@/components/ui/Auth';
import Chat from '@/components/ui/Chat'; // Make sure this is imported
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

// Dynamically import the 3D Experience component
const Experience = dynamic(() => import('@/components/scene/Experience').then(mod => mod.Experience), {
  ssr: false,
  loading: () => <p className="text-center text-lg absolute inset-0 flex items-center justify-center text-white">Loading 3D Scene...</p>,
});

// This is the main view for a logged-in user
const MainScene = () => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    // This parent is now a positioning context for its children
    <div className="w-full h-screen relative bg-gray-800">
      
      {/* The 3D scene */}
      <Experience />

      {/* UI Overlays: These are positioned on top of the 3D scene */}
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


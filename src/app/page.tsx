"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AuthComponent from '@/components/ui/Auth';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';


const Experience = dynamic(() => import('@/components/scene/Experience').then(mod => mod.Experience), {
  ssr: false,
  loading: () => <p className="text-center text-lg">Loading 3D Scene...</p>,
});

// The MainScene component now renders our dynamic 3D Experience.
const MainScene = () => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="w-full h-screen relative">
      {/* The 3D scene will fill the entire screen */}
      <Experience />

      {/* We can add UI elements on top of the 3D scene later */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-semibold transition-colors"
        >
          Sign Out
        </button>
      </div>
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
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen">
      {!session ? <AuthComponent /> : <MainScene />}
    </main>
  );
}
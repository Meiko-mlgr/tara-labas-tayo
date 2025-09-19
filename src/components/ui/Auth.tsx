"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// A simple Coffee Icon component
const CoffeeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 20.5c.9-.1 1.8-.3 2.5-.6 2.3-1.1 3.4-3.9 2.8-6.2-1.3-4.8-5.3-8.2-10-8.2-.1 0-.3 0-.4.1" />
    <path d="M4.2 10.3c-.7.5-1.2 1.2-1.4 2.1-.3 1.4.3 2.9 1.3 3.8 1.4 1.3 3.3 1.9 5.2 1.9h.1" />
    <path d="M18 14c.4.2.8.3 1.2.5 1.2.4 2.6.2 3.6-.6.8-.7 1.2-1.7 1.2-2.8-.1-2.4-2.5-4.2-4.9-3.9" />
    <path d="M8 3.5c1.4-1 3.3-1.4 5.2-1.2 3.4.4 6 3 6.6 6.4.1.6.1 1.2.1 1.8" />
  </svg>
);

export default function AuthComponent() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignIn) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <CoffeeIcon className="mx-auto h-12 w-auto text-cyan-400" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            {isSignIn ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            to enter the Kapihan
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuthAction}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full appearance-none rounded-md border border-gray-700 bg-gray-800 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full appearance-none rounded-md border border-gray-700 bg-gray-800 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          {message && <p className="text-sm text-green-400 text-center">{message}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-cyan-600 py-3 px-4 text-sm font-semibold text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isSignIn ? 'Sign In' : 'Sign Up')}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="ml-2 font-medium text-cyan-400 hover:text-cyan-300"
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
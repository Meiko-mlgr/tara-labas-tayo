"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

// A simple Coffee Icon component
const NewLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="512px" height="512px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="var(--ci-primary-color, currentColor)" d="M353.415,200l-30.981-57.855-60.717-20.239-.14.432L167.21,149.3A32.133,32.133,0,0,0,144,180.068V264h32V180.069l73.6-21.028-32.512,99.633-.155-.056-29.464,82.5a16.088,16.088,0,0,1-20.127,9.8L101.06,328.821,90.94,359.179l66.282,22.093A48,48,0,0,0,217.6,351.881l24.232-67.849,17.173,5.6,48.3,48.3A15.9,15.9,0,0,1,312,349.255V456h32V349.255a47.694,47.694,0,0,0-14.059-33.942l-48.265-48.264,26.783-82.077,19.269,34.683A24.011,24.011,0,0,0,348.707,232H432V200Z" />
    <path fill="var(--ci-primary-color, currentColor)" d="M286.828,109.707a36,36,0,1,0-12.916-27.619A35.851,35.851,0,0,0,286.828,109.707Z" />
  </svg>
);

export default function AuthComponent() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!isSignIn && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

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
          options: {
            data: {
              username: username,
            }
          }
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
      }
    } catch (error: any) {
      if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
        setError('This username is already taken. Please choose another one.');
      } else {
        setError(error.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <NewLogoIcon className="mx-auto h-35 w-auto text-cyan-400" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            {isSignIn ? 'Sign in to your account' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Got time? Spend it here
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuthAction}>
          <div className="space-y-4 rounded-md shadow-sm">
            {!isSignIn && (
              <>
                <div>
                  <label htmlFor="username" className="sr-only">Username</label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    minLength={3}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="relative block w-full appearance-none rounded-md border border-gray-700 bg-gray-800 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
                    placeholder="Username"
                  />
                </div>
              </>
            )}
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
                autoComplete={isSignIn ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full appearance-none rounded-md border border-gray-700 bg-gray-800 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
            {!isSignIn && (
                <div>
                  <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="relative block w-full appearance-none rounded-md border border-gray-700 bg-gray-800 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm"
                    placeholder="Confirm Password"
                  />
                </div>
            )}
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
            onClick={() => { setIsSignIn(!isSignIn); setError(null); setMessage(null); }}
            className="ml-2 font-medium text-cyan-400 hover:text-cyan-300"
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
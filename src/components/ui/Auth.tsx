"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const NewLogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} width="512px" height="512px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="var(--ci-primary-color, currentColor)" d="M353.415,200l-30.981-57.855-60.717-20.239-.14.432L167.21,149.3A32.133,32.133,0,0,0,144,180.068V264h32V180.069l73.6-21.028-32.512,99.633-.155-.056-29.464,82.5a16.088,16.088,0,0,1-20.127,9.8L101.06,328.821,90.94,359.179l66.282,22.093A48,48,0,0,0,217.6,351.881l24.232-67.849,17.173,5.6,48.3,48.3A15.9,15.9,0,0,1,312,349.255V456h32V349.255a47.694,47.694,0,0,0-14.059-33.942l-48.265-48.264,26.783-82.077,19.269,34.683A24.011,24.011,0,0,0,348.707,232H432V200Z" />
    <path fill="var(--ci-primary-color, currentColor)" d="M286.828,109.707a36,36,0,1,0-12.916-27.619A35.851,35.851,0,0,0,286.828,109.707Z" />
  </svg>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M12,2.2467A10.00042,10.00042,0,0,0,8.83752,21.73419c.5.08752.6875-.21247.6875-.475,0-.23749-.01251-1.025-.01251-1.86249C7,19.85919,6.35,18.78423,6.15,18.22173A3.636,3.636,0,0,0,5.125,16.8092c-.35-.1875-.85-.65-.01251-.66248A2.00117,2.00117,0,0,1,6.65,17.17169a2.13742,2.13742,0,0,0,2.91248.825A2.10376,2.10376,0,0,1,10.2,16.65923c-2.225-.25-4.55-1.11254-4.55-4.9375a3.89187,3.89187,0,0,1,1.025-2.6875,3.59373,3.59373,0,0,1,.1-2.65s.83747-.26251,2.75,1.025a9.42747,9.42747,0,0,1,5,0c1.91248-1.3,2.75-1.025,2.75-1.025a3.59323,3.59323,0,0,1,.1,2.65,3.869,3.869,0,0,1,1.025,2.6875c0,3.83747-2.33752,4.6875-4.5625,4.9375a2.36814,2.36814,0,0,1,.675,1.85c0,1.33752-.01251,2.41248-.01251,2.75,0,.26251.1875.575.6875.475A10.0053,10.0053,0,0,0,12,2.2467Z"/></svg>
);

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1"><path d="M20.47,2H3.53A1.45,1.45,0,0,0,2.06,3.43V20.57A1.45,1.45,0,0,0,3.53,22H20.47a1.45,1.45,0,0,0,1.47-1.43V3.43A1.45,1.45,0,0,0,20.47,2ZM8.09,18.74h-3v-9h3ZM6.59,8.48h0a1.56,1.56,0,1,1,0-3.12,1.57,1.57,0,1,1,0,3.12ZM18.91,18.74h-3V13.91c0-1.21-.43-2-1.52-2A1.65,1.65,0,0,0,12.85,13a2,2,0,0,0-.1.73v5h-3s0-8.18,0-9h3V11A3,3,0,0,1,15.46,9.5c2,0,3.45,1.29,3.45,4.06Z"/></svg>
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
    } catch (err: unknown) {
      const error = err as Error;
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <NewLogoIcon className="mx-auto h-35 w-auto text-cyan-400" />
            <div className="relative text-center mt-2">
                <h1 className="text-4xl font-bold text-white tracking-tight">Tara, Labas Tayo?</h1>
                <p className="text-md text-cyan-300 italic absolute -bottom-5 right-0">&quot;Come on, let&rsquo;s go out?&quot;</p>
            </div>
        </div>

        <form className="mt-8 space-y-6 pt-8" onSubmit={handleAuthAction}>
          {/* Form inputs remain the same */}
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

        <div className="border-t border-gray-700 my-6"></div>

        <div className="flex items-center justify-center space-x-6 text-gray-400">
            <a href="https://www.linkedin.com/in/mikko-melgar-447069233" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <LinkedInIcon className="w-6 h-6" />
            </a>
            <a href="https://github.com/Meiko-mlgr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                <GitHubIcon className="w-6 h-6" />
            </a>
        </div>
      </div>
    </div>
  );
}
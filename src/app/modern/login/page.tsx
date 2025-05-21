'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";

const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { ssr: false }
);
const MotionInput = dynamic(
  () => import('framer-motion').then(mod => mod.motion.input),
  { ssr: false }
);
const MotionButton = dynamic(
  () => import('framer-motion').then(mod => mod.motion.button),
  { ssr: false }
);

export default function ModernLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [firebaseAvailable, setFirebaseAvailable] = useState(true);
  const router = useRouter();

  // Check if Firebase auth is available
  useEffect(() => {
    setFirebaseAvailable(!!auth);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Add your login logic here
    setTimeout(() => {
      setIsLoading(false);
      // Just for demo, redirect after "login"
      router.push("/#");
    }, 2000);
  };

  const handleGoogleSignIn = async () => {
    if (!firebaseAvailable || !auth) {
      alert("Firebase authentication is not configured. Please set up your Firebase credentials.");
      return;
    }
    
    try {
      setIsGoogleLoading(true);
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        // Redirect after successful login
        router.push("/#");
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        alert('Sign-in popup was closed before completing the sign-in.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        alert('Sign-in popup was cancelled.');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Sign-in popup was blocked by the browser. Please allow popups for this site.');
      } else {
        alert('An error occurred during sign-in. Please try again.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#000000] py-16 px-4">
      <MotionDiv
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="flex flex-col w-full max-w-md justify-center items-center"
      >
        {/* Login Card */}
        <MotionDiv
          whileHover={{ scale: 1.04, boxShadow: '0 12px 32px 0 rgba(0, 252, 252, 0.8)' }}
          className="relative bg-gradient-to-br from-purple-800 via-purple-900 to-purple-950/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center border border-purple-400/20 transition-all duration-300"
        >
          {/* 3D floating circle */}
          <MotionDiv
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#FFD23F] to-[#FF914D] rounded-full shadow-lg blur-[1px] z-10 border-4 border-white"
          />
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-white drop-shadow-lg text-center">Already A Member?<br />Sign In:</h2>
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login-email" className="block text-base font-semibold text-white mb-2">Email</label>
              <MotionInput
                whileFocus={{ scale: 1.03, boxShadow: '0 0 0 4px rgba(255,210,63,0.3)' }}
                type="email"
                id="login-email"
                placeholder="Enter Email"
                className="w-full h-12 px-4 rounded-lg border border-white/10 bg-[#280137] text-white font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200 placeholder-white/30"
                name="email"
                required
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-base font-semibold text-white mb-2">Password</label>
              <MotionInput
                whileFocus={{ scale: 1.03, boxShadow: '0 0 0 4px rgba(255,210,63,0.3)' }}
                type="password"
                id="login-password"
                placeholder="Enter Password"
                className="w-full h-12 px-4 rounded-lg border border-white/10 bg-black/70 text-white font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200 placeholder-white/30"
                name="password"
                required
              />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block w-5 h-5 rounded-full bg-[#FFD23F] shadow-md border-2 border-[#FFD23F] mr-2"></span>
              <label htmlFor="remember" className="text-base text-white font-medium select-none cursor-pointer">Remember Password</label>
            </div>
            <MotionButton
              whileHover={{ scale: 1.03, boxShadow: '0 6px 24px 0 rgba(34, 197, 94, 0.4)' }}
              className="w-full h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Login'
              )}
            </MotionButton>

            {/* Google Sign In */}
            <div className="relative mt-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-purple-400/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-purple-900 text-white/80">Or continue with</span>
              </div>
            </div>

            <MotionButton
              whileHover={{ scale: 1.03, boxShadow: '0 6px 24px 0 rgba(255,145,77,0.4)' }}
              className="w-full h-12 rounded-lg bg-gradient-to-r from-[#FFD23F] to-[#FF914D] text-[#0F0521] font-bold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFD23F] flex items-center justify-center gap-2"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || !firebaseAvailable}
            >
              {isGoogleLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#0F0521] mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </MotionButton>
            
            {!firebaseAvailable && (
              <div className="text-yellow-300 text-sm text-center bg-yellow-900/50 p-2 rounded-md mt-2 border border-yellow-500/30">
                Firebase authentication not configured. Google login is disabled.
              </div>
            )}
          </form>
          <div className="mt-6 text-white/80 text-base text-center">
            <p>Don't have an account?{' '}
              <Link href="/modern/signup" className="text-sky-400 font-semibold hover:text-sky-300 transition-colors">
                Sign up
              </Link>
            </p>
            <Link href="/forgot-password" className="block mt-3 text-[#FF914D] hover:text-[#FFD23F] text-base font-bold underline underline-offset-2 transition-all hover:scale-105">
              Forgot password?
            </Link>
          </div>
        </MotionDiv>
      </MotionDiv>
    </section>
  );
} 
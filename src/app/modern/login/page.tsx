'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, provider, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from 'framer-motion';

const MotionInput = dynamic(() => import('framer-motion').then(mod => mod.motion.input), { ssr: false });
const MotionButton = dynamic(() => import('framer-motion').then(mod => mod.motion.button), { ssr: false });

export default function ModernLogin() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Progress for background color
  const getProgress = () => {
    let progress = 0;
    if (email.length > 0) progress += 0.5;
    if (password.length > 0) progress += 0.5;
    return progress;
  };
  const progress = getProgress();

  // Animated background color stages
  const bgColors = [
    "linear-gradient(135deg, #6d28d9 0%, #a21caf 100%)", // purple
    "linear-gradient(135deg, #2563eb 0%, #6d28d9 100%)", // blue
    "linear-gradient(135deg, #22c55e 0%, #2563eb 100%)", // green
  ];
  const getBg = () => {
    if (progress === 0) return bgColors[0];
    if (progress === 0.5) return bgColors[1];
    return bgColors[2];
  };

  // Firebase login logic
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!auth) throw new Error("Authentication service is not available.");
      if (!db) throw new Error("Database service is not available.");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await signOut(auth);
        toast.error("Account not found. Please sign up first.");
        setIsLoading(false);
        return;
      }
      toast.success("Login successful!");
      router.push("/user");
    } catch (error: any) {
      let message = "Login failed. Please try again.";
      if (error.code === "auth/user-not-found") message = "No account found with this email.";
      else if (error.code === "auth/wrong-password") message = "Incorrect password.";
      else if (error.code === "auth/too-many-requests") message = "Too many failed attempts. Please try again later.";
      else if (error.message) message = error.message;
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);

      if (!auth) {
        throw new Error("Authentication service is not available.");
      }
      if (!provider) {
        throw new Error("GoogleAuthProvider is not initialized.");
      }
      if (!db) {
        throw new Error("Database service is not available.");
      }

      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        const userRef = doc(db, "users", result.user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: result.user.uid,
            email: result.user.email,
            firstName: result.user.displayName?.split(" ")[0] || "",
            surname: result.user.displayName?.split(" ").slice(1).join(" ") || "",
            dob: "",
            createdAt: new Date().toISOString(),
          });
        }
        router.push("/user");
      }
    } catch (error: any) {
      console.error("Google sign-in failed:", error);
      toast.error(error.message || "Google sign-in failed.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // SVG fluid background with animated waves
  const FluidBg = () => (
    <motion.div
      className="absolute inset-0 -z-10"
      animate={{ background: getBg() }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{
        background: getBg(),
        transition: "background 0.8s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <svg className="absolute top-0 left-0 w-full h-full opacity-40" viewBox="0 0 800 600" fill="none">
        <motion.ellipse
          cx="400" cy="300" rx="300" ry="200"
          fill="#a21caf"
          animate={{ rx: 320 + 20 * progress, ry: 210 + 10 * progress, fill: progress === 1 ? "#22c55e" : "#a21caf" }}
          transition={{ duration: 1.2, type: "spring" }}
        />
        <motion.ellipse
          cx="600" cy="100" rx="120" ry="80"
          fill="#2563eb"
          animate={{ rx: 120 + 30 * progress, fill: progress === 1 ? "#22c55e" : "#2563eb" }}
          transition={{ duration: 1.2, type: "spring" }}
        />
        <motion.ellipse
          cx="200" cy="500" rx="100" ry="60"
          fill="#FFD23F"
          animate={{ rx: 100 + 10 * progress, fill: progress === 1 ? "#22c55e" : "#FFD23F" }}
          transition={{ duration: 1.2, type: "spring" }}
        />
        {/* Animated SVG Waves */}
        <motion.path
          d="M0 500 Q200 550 400 500 T800 500 V600 H0 Z"
          fill="#fff"
          opacity={0.08}
          animate={{
            d: [
              "M0 500 Q200 550 400 500 T800 500 V600 H0 Z",
              "M0 500 Q200 520 400 540 T800 500 V600 H0 Z",
              "M0 500 Q200 550 400 500 T800 500 V600 H0 Z"
            ]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0 520 Q200 570 400 520 T800 520 V600 H0 Z"
          fill="#fff"
          opacity={0.06}
          animate={{
            d: [
              "M0 520 Q200 570 400 520 T800 520 V600 H0 Z",
              "M0 520 Q200 540 400 560 T800 520 V600 H0 Z",
              "M0 520 Q200 570 400 520 T800 520 V600 H0 Z"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <FluidBg />
      <Toaster position="top-center" />
      <AnimatePresence>
        {!showLogin && (
          <motion.div
            key="card-initial"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -40 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-12 flex flex-col items-center cursor-pointer"
            onClick={() => setShowLogin(true)}
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1.1 }}
              transition={{ yoyo: Infinity, duration: 1.2, ease: "easeInOut" }}
              className="mb-6"
            >
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="30" fill="#a21caf" />
                <text x="32" y="40" textAnchor="middle" fontSize="28" fill="#fff" fontWeight="bold">🔒</text>
              </svg>
            </motion.div>
            <motion.h2
              className="text-3xl font-extrabold text-white drop-shadow-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Skill Swap
            </motion.h2>
            <p className="text-white/80 mt-2 text-center">Login</p>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showLogin && (
          <motion.div
            key="card-login"
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -40 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center border border-purple-400/20"
          >
            {/* Animated loading text when user is typing */}
            <AnimatePresence>
              {(email.length > 0 || password.length > 0) && !isLoading && !isGoogleLoading && (
                <motion.div
                  key="loading-text"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="mb-4 text-base text-green-200 font-semibold flex items-center gap-2"
                >
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="3" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#22c55e" strokeWidth="3" strokeLinecap="round"/></svg>
                  Getting things ready...
                </motion.div>
              )}
            </AnimatePresence>
            <motion.h2
              className="text-2xl md:text-3xl font-extrabold mb-8 text-white drop-shadow-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Sign In:
            </motion.h2>
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
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="login-password" className="block text-base font-semibold text-white mb-2">Password</label>
                <div className="relative flex items-center gap-2">
                  <MotionInput
                    whileFocus={{ scale: 1.03, boxShadow: '0 0 0 4px rgba(255,210,63,0.3)' }}
                    type={showPassword ? "text" : "password"}
                    id="login-password"
                    placeholder="Enter Password"
                    className="w-full h-12 px-4 rounded-lg border border-white/10 bg-black/70 text-white font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200 placeholder-white/30"
                    name="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <MotionButton
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center justify-center h-12 w-12 text-white/70 hover:text-white transition-colors bg-black/70 rounded-lg border border-white/10 hover:bg-black/80"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AnimatePresence mode="wait">
                      {showPassword ? (
                        <motion.svg
                          key="eye-open"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3 }}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </motion.svg>
                      ) : (
                        <motion.svg
                          key="eye-closed"
                          initial={{ opacity: 0, rotate: 90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: -90 }}
                          transition={{ duration: 0.2 }}
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.3 }}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </MotionButton>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <MotionButton
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    rememberMe ? 'bg-[#FFD23F]' : 'bg-gray-600/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    animate={{
                      x: rememberMe ? 24 : 0,
                      backgroundColor: rememberMe ? '#0F0521' : 'white'
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </MotionButton>
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
                  <span className="px-2 text-white/80">Or continue with</span>
                </div>
              </div>
              <MotionButton
                whileHover={{ scale: 1.03, boxShadow: '0 6px 24px 0 rgba(255,145,77,0.4)' }}
                className="w-full h-12 rounded-lg bg-gradient-to-r from-[#FFD23F] to-[#FF914D] text-[#0F0521] font-bold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFD23F] flex items-center justify-center gap-2"
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#0F0521] mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </MotionButton>
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
            {/* Back button */}
            <button
              className="absolute top-4 left-4 text-white/60 hover:text-white transition"
              onClick={() => setShowLogin(false)}
              type="button"
              aria-label="Back"
            >
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { LampContainer } from '@/components/ui/lamp';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { useRouter } from "next/navigation"; // for Next.js 13+ app router

const fadeIn = (direction: "up" | "down" | "left" | "right" = "up", delay: number = 0) => ({
  hidden: {
    opacity: 0,
    y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
    x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: "spring",
      delay,
      duration: 0.8,
    },
  },
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Add your login logic here
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard"); // Redirect to dashboard after sign in
    }, 2000);
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        // Redirect after successful login
        router.push("/dashboard");
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 relative overflow-hidden">
      {/* Animated background elements */}
      <LampContainer className="fixed top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="h-full w-full bg-transparent"></div>
      </LampContainer>

      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeIn("up")}
        className="w-full max-w-md"
      >
        <Card className="bg-purple-900/80 backdrop-blur-sm border-purple-400/20 shadow-2xl">
          <div className="p-8">
            {/* Logo and Title */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="relative h-24 w-24 mx-auto mb-4">
                <Image
                  src="/images/logo.png"
                  alt="SkillSwap Logo"
                  width={96}
                  height={96}
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-br from-purple-300 to-purple-500 bg-clip-text text-transparent">
                SkillSwap
              </h1>
              <p className="text-purple-200 mt-2">Connect, Learn, and Grow Together</p>
            </motion.div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                animate="show"
              >
                <Label htmlFor="email" className="text-purple-200">Email</Label>
                <div className="flex items-center gap-3 w-full">
                  <Mail className="text-purple-400 flex-shrink-0" size={22} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-purple-800/50 border-purple-400/20 text-white placeholder-purple-300/50 h-11 text-base"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                animate="show"
              >
                <Label htmlFor="password" className="text-purple-200">Password</Label>
                <div className="flex items-center gap-3 w-full">
                  <Lock className="text-purple-400 flex-shrink-0" size={22} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="flex-1 bg-purple-800/50 border-purple-400/20 text-white placeholder-purple-300/50 h-11 text-base"
                    style={{ fontSize: '1rem', letterSpacing: '0.1em' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-purple-400 hover:text-purple-300 flex-shrink-0"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                variants={fadeIn("up", 0.4)}
                initial="hidden"
                animate="show"
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-purple-400/20 bg-purple-800/50"
                  />
                  <Label htmlFor="remember" className="ml-2 text-purple-200">Remember me</Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-purple-300 hover:text-purple-200 text-base"
                >
                  Forgot password?
                </Link>
              </motion.div>

              <motion.div
                variants={fadeIn("up", 0.5)}
                initial="hidden"
                animate="show"
              >
                <Button
                  type="submit"
                  className="w-full py-6 bg-purple-600 hover:bg-purple-700 text-lg font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Social Login */}
            <motion.div
              variants={fadeIn("up", 0.6)}
              initial="hidden"
              animate="show"
              className="mt-8"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-purple-400/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-purple-900/80 text-purple-300">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full mt-6 py-6 bg-white hover:bg-gray-100 text-gray-800 font-semibold flex items-center justify-center gap-2"
              >
                {isGoogleLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-800 mr-2"></div>
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
              </Button>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              variants={fadeIn("up", 0.7)}
              initial="hidden"
              animate="show"
              className="mt-8 text-center"
            >
              <p className="text-purple-300">
                Don't have an account?{' '}
                <Link href="/signup" className="text-purple-200 hover:text-purple-100 font-semibold">
                  Sign up
                </Link>
              </p>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

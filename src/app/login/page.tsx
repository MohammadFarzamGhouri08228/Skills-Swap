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
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Add your login logic here
    setTimeout(() => setIsLoading(false), 2000);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      // Redirect after successful login
      router.push("/dashboard"); // Change to your desired route
    } catch (error) {
      console.error("Google sign-in error:", error);
      // Optionally show an error message to the user
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
                  src="/logo.png"
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
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 pointer-events-none" size={22} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-12 bg-purple-800/50 border-purple-400/20 text-white placeholder-purple-300/50 h-12 text-base"
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
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 pointer-events-none" size={22} />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-12 bg-purple-800/50 border-purple-400/20 text-white placeholder-purple-300/50 h-12 text-base"
                    style={{ fontSize: '1.25rem', letterSpacing: '0.1em' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
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
                  className="text-purple-300 hover:text-purple-200 text-sm"
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
              <div className="mt-6 flex flex-col gap-4">
                <Button
                  type="button"
                  className="w-full py-6 bg-white text-purple-800 font-semibold flex items-center justify-center gap-2 hover:bg-purple-100"
                  onClick={handleGoogleSignIn}
                >
                  <i className="bx bxl-google text-2xl mr-2"></i>
                  Sign in with Google
                </Button>
                <Button
                  type="button"
                  className="w-full py-4 bg-purple-700 hover:bg-purple-800 text-white font-semibold"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Go to Dashboard
                </Button>
              </div>
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

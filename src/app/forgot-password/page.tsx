'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { LampContainer } from '@/components/ui/lamp';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

const fadeIn = (direction = "up", delay = 0) => {
  return {
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
  }
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [emailValidation, setEmailValidation] = useState({ isValid: false, message: '', checking: false });
  const [emailWarning, setEmailWarning] = useState('');

  const validateEmail = async (email: string) => {
    try {
      setIsValidatingEmail(true);
      setEmailWarning('');
      setEmailValidation({ isValid: false, message: '', checking: true });
      const response = await fetch('/api/validate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      const { isValid, message, warning } = data;

      if (!isValid) {
        setEmailValidation({ isValid: false, message: message || 'Invalid email address', checking: false });
        setEmailWarning('');
        return false;
      }

      if (warning) {
        setEmailWarning(message || 'Email domain is valid, but the address could not be verified. Please double-check your email.');
      } else {
        setEmailWarning('');
      }
      setEmailValidation({ isValid: true, message: message || 'Valid email address', checking: false });
      return true;
    } catch (error) {
      console.error('Email validation error:', error);
      setEmailValidation({ isValid: false, message: 'Error validating email. Please try again.', checking: false });
      setEmailWarning('');
      return false;
    } finally {
      setIsValidatingEmail(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      // Validate email first
      const isEmailValid = await validateEmail(email);
      if (!isEmailValid && !emailWarning) {
        setIsLoading(false);
        return;
      }

      // Check if auth is available before using it
      if (!auth) {
        toast.error('Authentication service is not available. Please try again later.');
        return;
      }

      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset link sent to your email!');
      setEmail('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        toast.error('No account found with this email address.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 relative overflow-hidden">
      <Toaster position="top-center" />
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
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-br from-purple-300 to-purple-500 bg-clip-text text-transparent">
                Reset Password
              </h1>
              <p className="text-purple-200 mt-2">Enter your email to receive reset instructions</p>
            </motion.div>

            <form onSubmit={handleReset} className="space-y-6">
              <motion.div
                variants={fadeIn("up", 0.2)}
                initial="hidden"
                animate="show"
              >
                <Label htmlFor="email" className="text-purple-200">Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="text-purple-400" size={22} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-purple-800/50 border-purple-400/20 text-white placeholder-purple-300/50 h-12 text-base"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {emailValidation.checking && (
                  <p className="text-purple-300/50 text-sm mt-1">Validating email...</p>
                )}
                {!emailValidation.checking && email && emailValidation.message && !emailWarning && (
                  <p className={`text-sm mt-1 ${emailValidation.isValid ? 'text-green-400' : 'text-red-400'}`}>{emailValidation.message}</p>
                )}
                {!emailValidation.checking && emailWarning && (
                  <p className="text-orange-400 text-sm mt-1">{emailWarning}</p>
                )}
              </motion.div>

              <motion.div
                variants={fadeIn("up", 0.3)}
                initial="hidden"
                animate="show"
              >
                <Button
                  type="submit"
                  className="w-full py-6 bg-purple-600 hover:bg-purple-700 text-lg font-semibold"
                  disabled={isLoading || isValidatingEmail}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Sending reset link...
                    </div>
                  ) : isValidatingEmail ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                      Validating email...
                    </div>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              animate="show"
              className="mt-8 text-center"
            >
              <p className="text-purple-300">
                Remember your password?{' '}
                <Link href="/login" className="text-purple-200 hover:text-purple-100 font-semibold">
                  Sign in
                </Link>
              </p>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
} 
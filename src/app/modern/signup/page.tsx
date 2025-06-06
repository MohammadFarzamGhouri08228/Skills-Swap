'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { UserData, userDataService } from '@/app/api/profile/userDataService';
import Lottie from 'lottie-react';
import type { LottieComponentProps } from 'lottie-react';
import signupAnimation from '../../../../public/animations/signup.json';
import emailAnimation from '../../../../public/animations/email.json';
import passwordAnimation from '../../../../public/animations/password.json';
// import signupPeopleAnimation from '../../../../public/animations/signup-people.json';

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

export default function ModernSignup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDob] = useState({ day: '', month: '', year: '' });
  const [emailValidation, setEmailValidation] = useState({ isValid: false, message: '', checking: false });
  const [emailExists, setEmailExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailWarning, setEmailWarning] = useState('');
  const [emailAnimationState, setEmailAnimationState] = useState('idle');
  const router = useRouter();
  const emailAnimationRef = React.useRef<any>(null);

  const currentDate = new Date();

  const months = [
    { value: 'Jan', label: 'January', days: 31 },
    { value: 'Feb', label: 'February', days: 28 },
    { value: 'Mar', label: 'March', days: 31 },
    { value: 'Apr', label: 'April', days: 30 },
    { value: 'May', label: 'May', days: 31 },
    { value: 'Jun', label: 'June', days: 30 },
    { value: 'Jul', label: 'July', days: 31 },
    { value: 'Aug', label: 'August', days: 31 },
    { value: 'Sep', label: 'September', days: 30 },
    { value: 'Oct', label: 'October', days: 31 },
    { value: 'Nov', label: 'November', days: 30 },
    { value: 'Dec', label: 'December', days: 31 }
  ];

  const getDaysInMonth = (month: string, year: string) => {
    const monthObj = months.find(m => m.value === month);
    if (!monthObj) return [];
    const isLeap = month === 'Feb' && parseInt(year) % 4 === 0;
    const days = isLeap ? 29 : monthObj.days;
    return Array.from({ length: days }, (_, i) => i + 1);
  };

  const handleDateChange = (type: 'day' | 'month' | 'year', value: string) => {
    const newDob = { ...dob, [type]: value };

    if (type === 'year' && value) {
      const selectedYear = parseInt(value);
      const currentYear = currentDate.getFullYear();
      if (selectedYear > currentYear) {
        toast.error('Please select a year in the past');
        return;
      }
    }

    if (type === 'month' && value && newDob.year === currentDate.getFullYear().toString()) {
      const selectedMonth = months.findIndex(m => m.value === value);
      const currentMonth = currentDate.getMonth();
      if (selectedMonth > currentMonth) {
        toast.error('Please select a month in the past');
        return;
      }
    }

    if (newDob.day && newDob.month && newDob.year) {
      const selectedDate = new Date(
        parseInt(newDob.year),
        months.findIndex(m => m.value === newDob.month),
        parseInt(newDob.day)
      );

      if (selectedDate > currentDate) {
        toast.error('Please select a date in the past');
        return;
      }
    }

    setDob(newDob);
  };

  const getPasswordStrength = () => {
    if (!password) return { level: '', color: '' };
    if (password.length < 6) return { level: 'Weak', color: 'red' };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { level: 'Medium', color: 'orange' };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password))
      return { level: 'Strong', color: '#00FF99' };
    return { level: 'Medium', color: 'orange' };
  };

  const isPasswordMatch = password && confirmPassword && password === confirmPassword;

  useEffect(() => {
    const validateEmail = async () => {
      if (!email) {
        setEmailValidation({ isValid: false, message: '', checking: false });
        setEmailWarning('');
        setEmailAnimationState('idle');
        return;
      }

      // Basic format validation first
      const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!basicRegex.test(email)) {
        setEmailValidation({ 
          isValid: false, 
          message: 'Please enter a valid email format.',
          checking: false 
        });
        setEmailWarning('');
        setEmailAnimationState('error');
        return;
      }

      setEmailValidation(prev => ({ ...prev, checking: true }));
      setEmailWarning('');
      setEmailAnimationState('checking');
      
      try {
        const response = await axios.post('/api/validate-email', { email });
        const { isValid, message, details, warning } = response.data;

        if (!isValid) {
          setEmailValidation({ 
            isValid: false,
            message: message || 'Invalid email address',
            checking: false
          });
          setEmailWarning('');
          setEmailExists(false);
          setEmailAnimationState('error');
          return;
        }

        // If warning is present, set warning state
        if (warning) {
          setEmailWarning(message || 'Email domain is valid, but the address could not be verified. Please double-check your email.');
          setEmailAnimationState('warning');
        } else {
          setEmailWarning('');
          setEmailAnimationState('success');
        }

        setEmailValidation({ 
          isValid: true,
          message: message || 'Valid email address',
          checking: false
        });
      } catch (error) {
        console.error('Email validation error:', error);
        setEmailValidation({ 
          isValid: false, 
          message: 'Unable to validate email. Please try again.',
          checking: false
        });
        setEmailWarning('');
        setEmailAnimationState('error');
      }
    };

    // Debounce email validation to avoid excessive API calls
    const timeoutId = setTimeout(validateEmail, 800);
    return () => clearTimeout(timeoutId);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!firstName.trim() || !surname.trim()) {
        toast.error('Please enter your full name');
        return;
      }

      if (!dob.day || !dob.month || !dob.year) {
        toast.error('Please enter a valid date of birth');
        return;
      }

      if (!email || !emailValidation.isValid) {
        toast.error(emailValidation.message || 'Please enter a valid email address');
        return;
      }

      // Check if email already exists in Firestore
      setIsLoading(true);
      const existingUser = await userDataService.getUserByEmail(email);
      if (existingUser) {
        setEmailExists(true);
        toast.error('This email is already registered. Please use a different email.');
        setIsLoading(false);
        return;
      }

      if (!password || password.length < 8) {
        toast.error('Password must be at least 8 characters long');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        setIsLoading(false);
        return;
      }

      const passwordStrength = getPasswordStrength();
      if (passwordStrength.level === 'Weak') {
        toast.error('Please choose a stronger password');
        setIsLoading(false);
        return;
      }

      // Check if auth and db are available before using them
      if (!auth) {
        toast.error('Authentication service is not available. Please try again later.');
        setIsLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData: UserData = {
        uid: user.uid,
        email,
        firstName: firstName.trim(),
        surname: surname.trim(),
        dob: `${dob.day} ${dob.month} ${dob.year}`,
        gender: '', // Removed gender field as per request
        createdAt: new Date().toISOString(),
      };

      // Check if db is available before using it
      if (!db) {
        toast.error('Database service is not available. Account created but profile data could not be saved.');
        router.push('/login');
        setIsLoading(false);
        return;
      }

      await setDoc(doc(db, 'users', user.uid), userData);

      toast.success('Account created successfully!');
      router.push('/modern/login');
    } catch (error: any) {
      console.error('Signup error:', error);
      
      const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': 'This email is already registered',
        'auth/invalid-email': 'Invalid email address',
        'auth/weak-password': 'Password is too weak',
      };
      
      const errorMessage = errorMessages[error?.code] || error?.message || JSON.stringify(error) || 'Failed to create account. Please try again.';

      if (error.code === 'auth/email-already-in-use') {
        setEmailExists(true);
      }

      toast.error(`Signup failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Progress for background color (based on filled signup fields)
  const getProgress = () => {
    let progress = 0;
    if (firstName.length > 0) progress += 0.15;
    if (surname.length > 0) progress += 0.15;
    if (email.length > 0) progress += 0.2;
    if (dob.day && dob.month && dob.year) progress += 0.2;
    if (password.length > 0) progress += 0.15;
    if (confirmPassword.length > 0) progress += 0.15;
    return Math.min(progress, 1);
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
    if (progress < 1) return bgColors[1];
    return bgColors[2];
  };

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
      <div className="flex w-full max-w-6xl gap-8 items-center justify-center">
        {/* Left Animation */}
        <div className="hidden lg:flex flex-1 justify-end">
          <div className="relative h-[400px] w-[300px] flex items-center">
            <Lottie animationData={signupAnimation} loop={true} style={{ height: 350, width: 250 }} />
          </div>
        </div>
        {/* Center Signup Card */}
        <MotionDiv
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="flex-1 max-w-md z-10"
        >
          <MotionDiv
            whileHover={{ scale: 1.02, boxShadow: '0 12px 32px 0 rgba(0, 252, 252, 0.8)' }}
            className="relative bg-gradient-to-br from-purple-800 via-purple-900 to-purple-950/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 w-full flex flex-col items-center border border-purple-400/20 transition-all duration-300"
          >
            {/* 3D floating circle */}
            <MotionDiv
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#FFD23F] to-[#FF914D] rounded-full shadow-lg blur-[1px] z-10 border-4 border-white"
            />
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-white drop-shadow-lg text-center">Create A New Account:</h2>
            <form className="w-full space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="signup-firstname" className="block text-base font-semibold text-white mb-2">First Name</label>
                  <MotionInput
                    whileFocus={{ scale: 1.03, boxShadow: '0 0 0 4px rgba(255,210,63,0.3)' }}
                    type="text"
                    id="signup-firstname"
                    placeholder="Enter First Name"
                    className="w-full h-12 px-4 rounded-lg border border-white/10 bg-[#280137] text-white font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200 placeholder-white/30"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-surname" className="block text-base font-semibold text-white mb-2">Surname</label>
                  <MotionInput
                    whileFocus={{ scale: 1.03, boxShadow: '0 0 0 4px rgba(255,210,63,0.3)' }}
                    type="text"
                    id="signup-surname"
                    placeholder="Enter Surname"
                    className="w-full h-12 px-4 rounded-lg border border-white/10 bg-[#280137] text-white font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200 placeholder-white/30"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-base font-semibold text-white mb-2">Email Address</label>
                <MotionInput
                  whileFocus={{ scale: 1.03, boxShadow: '0 0 0 4px rgba(255,210,63,0.3)' }}
                  type="email"
                  id="signup-email"
                  placeholder="Enter Email Address"
                  className="w-full h-12 px-4 rounded-lg border border-white/10 bg-[#280137] text-white font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200 placeholder-white/30"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailExists(false);
                  }}
                  required
                />
                {emailValidation.checking && (
                  <p className="text-purple-300/50 text-sm mt-1">Validating email...</p>
                )}
                {!emailValidation.checking && email && emailValidation.message && !emailWarning && (
                  <p className={`text-sm mt-1 ${emailValidation.isValid ? 'text-green-400' : 'text-red-400'}`}>
                    {emailValidation.message}
                  </p>
                )}
                {!emailValidation.checking && emailWarning && (
                  <p className="text-orange-400 text-sm mt-1">{emailWarning}</p>
                )}
                {emailExists && (
                  <p className="text-red-400 text-sm mt-1">
                    This email is already registered. Please use a different email.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-base font-semibold text-white mb-2">Date of Birth</label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="relative">
                    <select 
                      value={dob.year} 
                      onChange={(e) => handleDateChange('year', e.target.value)}
                      className={`w-full h-12 px-4 rounded-lg border border-white/10 bg-[#280137] text-white font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200 appearance-none ${!dob.year ? 'text-white/30' : 'text-white'}`}
                    >
                      <option value="" disabled hidden>Year</option>
                      {Array.from({ length: 100 }, (_, i) => (
                        <option key={2025 - i} value={2025 - i}>{2025 - i}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-300">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <select 
                      value={dob.month} 
                      onChange={(e) => handleDateChange('month', e.target.value)}
                      className={`w-full h-12 px-4 rounded-lg border border-white/10 bg-[#280137] text-white font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200 appearance-none ${!dob.month ? 'text-white/30' : 'text-white'}`}
                    >
                      <option value="" disabled hidden>Month</option>
                      {months.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-300">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <select 
                      value={dob.day} 
                      onChange={(e) => {
                        if (!dob.month) {
                          toast.error('Please select a month first');
                          return;
                        }
                        handleDateChange('day', e.target.value);
                      }}
                      onClick={(e) => {
                        if (!dob.month) {
                          e.preventDefault();
                          toast.error('Please select a month first');
                          return;
                        }
                      }}
                      className={`w-full h-12 px-4 rounded-lg border border-white/10 bg-[#280137] text-white font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200 appearance-none ${!dob.day ? 'text-white/30' : 'text-white'}`}
                    >
                      <option value="" disabled hidden>Day</option>
                      {dob.month && getDaysInMonth(dob.month, dob.year).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-300">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-base font-semibold text-white mb-2">Password</label>
                <MotionInput
                  whileFocus={{ scale: 1.03, boxShadow: '0 0 0 4px rgba(255,210,63,0.3)' }}
                  type="password"
                  id="signup-password"
                  placeholder="Enter Password"
                  className="w-full h-12 px-4 rounded-lg border border-white/10 bg-black/70 text-white font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200 placeholder-white/30"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {password && (
                  <p className="text-sm mt-1" style={{ color: getPasswordStrength().color }}>
                    Strength: {getPasswordStrength().level}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="signup-confirm-password" className="block text-base font-semibold text-white mb-2">Confirm Password</label>
                <MotionInput
                  whileFocus={{ scale: 1.03, boxShadow: '0 0 0 4px rgba(255,210,63,0.3)' }}
                  type="password"
                  id="signup-confirm-password"
                  placeholder="Confirm Password"
                  className="w-full h-12 px-4 rounded-lg border border-white/10 bg-black/70 text-white font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200 placeholder-white/30"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {confirmPassword && (
                  <p className={`text-sm mt-1 ${isPasswordMatch ? 'text-green-400' : 'text-red-400'}`}>
                    {isPasswordMatch ? "Passwords match" : "Passwords do not match"}
                  </p>
                )}
              </div>

              <MotionButton
                whileHover={{ scale: 1.03, boxShadow: '0 6px 24px 0 rgba(34, 197, 94, 0.4)' }}
                className="w-full h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                type="submit"
                disabled={isLoading || emailExists || Boolean(email && !emailValidation.isValid && !emailValidation.checking)}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Signup Now'
                )}
              </MotionButton>
            </form>
            <div className="mt-6 text-white/80 text-base text-center">
              <p>Already have an account?{' '}
                <Link href="/modern/login" className="text-sky-400 font-semibold hover:text-sky-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </MotionDiv>
        </MotionDiv>
        {/* Right Animation */}
        <div className="hidden lg:flex flex-1 justify-start">
          <div className="relative h-[400px] w-[300px] flex items-center">
            <Lottie animationData={signupAnimation} loop={true} style={{ height: 350, width: 250 }} />
          </div>
        </div>
      </div>
    </div>
  );
} 
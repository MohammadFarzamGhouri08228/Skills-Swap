'use client';

import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/app/firebase';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LampContainer } from '@/components/ui/lamp';
import Link from 'next/link';
import { UserData } from '../api/profile/userDataService';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

//singup page
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

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState({ day: '', month: '', year: '' });
  const [emailValidation, setEmailValidation] = useState({ isValid: false, message: '', checking: false });
  const [emailExists, setEmailExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      return { level: 'Strong', color: 'green' };
    return { level: 'Medium', color: 'orange' };
  };

  const isPasswordMatch = password && confirmPassword && password === confirmPassword;

  const handleSignup = async () => {
    try {
      if (!firstName.trim() || !surname.trim()) {
        toast.error('Please enter your full name');
        return;
      }

      if (!gender) {
        toast.error('Please select your gender');
        return;
      }

      if (!dob.day || !dob.month || !dob.year) {
        toast.error('Please enter a valid date of birth');
        return;
      }

      if (!email || !emailValidation.isValid) {
        toast.error('Please enter a valid email address');
        return;
      }

      if (!password || password.length < 8) {
        toast.error('Password must be at least 8 characters long');
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      const passwordStrength = getPasswordStrength();
      if (passwordStrength.level === 'Weak') {
        toast.error('Please choose a stronger password');
        return;
      }

      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData: UserData = {
        uid: user.uid,
        email,
        firstName: firstName.trim(),
        surname: surname.trim(),
        dob: `${dob.day} ${dob.month} ${dob.year}`,
        gender,
        currentBalance: 0, // Initialize current balance to zero
        createdAt: new Date().toISOString(),
        emailValidated: emailValidation.isValid,
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      toast.success('Account created successfully!');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (error: any) {
      console.error('Signup error:', error);
      
      const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': 'This email is already registered',
        'auth/invalid-email': 'Invalid email address',
        'auth/weak-password': 'Password is too weak',
      };
      
      const errorMessage = errorMessages[error?.code] || 'Failed to create account. Please try again.';

      if (error.code === 'auth/email-already-in-use') {
        setEmailExists(true);
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const validateEmail = async () => {
      if (!email) {
        setEmailValidation({ isValid: false, message: '', checking: false });
        return;
      }

      setEmailValidation(prev => ({ ...prev, checking: true }));
      
      try {
        const response = await axios.post('/api/validate-email', { email });
        setEmailValidation({ 
          ...response.data, 
          checking: false,
          message: response.data.message
        });
      } catch (error) {
        console.error('Email validation error:', error);
        // Fall back to basic validation
        const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = basicRegex.test(email);
        
        setEmailValidation({ 
          isValid, 
          message: isValid ? 'Valid Email' : 'Please enter a valid email.',
          checking: false
        });
      }
    };

    // Debounce email validation to avoid excessive API calls
    const timeoutId = setTimeout(validateEmail, 800);
    return () => clearTimeout(timeoutId);
  }, [email]);

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex flex-col min-h-screen overflow-x-hidden relative bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 text-white">
        {/* Subtle Lamp Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/50 via-purple-900/50 to-purple-950/50 z-0" />
        
        {/* Fixed LampContainer */}
        <LampContainer className="fixed top-0 left-0 w-full h-full -z-10 opacity-30">
          <div className="h-full w-full bg-transparent"></div>
        </LampContainer>

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-4">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn("up")}
            className="w-full max-w-2xl"
          >
            <motion.div
              animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="bg-purple-900/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/20 shadow-2xl"
            >
              {/* Logo Section */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-[#a78bfa]">Skill</h1>
                <p className="text-4xl font-bold text-[#a78bfa] mb-4">SWAP</p>
                <img src="/logo.png" alt="Logo" className="h-32 mx-auto mb-8" />
                <h2 className="text-4xl font-bold bg-gradient-to-br from-purple-300 to-purple-500 bg-clip-text text-transparent">
                  Create Account
                </h2>
                <p className="text-purple-200 mt-2">It's quick and easy.</p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input 
                        type="text" 
                        placeholder="First name" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        className="w-full p-3 rounded-lg bg-purple-800/50 border border-purple-400/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder="Surname" 
                        value={surname} 
                        onChange={(e) => setSurname(e.target.value)} 
                        className="w-full p-3 rounded-lg bg-purple-800/50 border border-purple-400/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailExists(false);
                      }}
                      className="w-full p-3 rounded-lg bg-purple-800/50 border border-purple-400/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    {emailValidation.checking && (
                      <p className="text-purple-300/50 text-sm mt-1">Validating email...</p>
                    )}
                    {!emailValidation.checking && email && emailValidation.message && (
                      <p className={`text-sm mt-1 ${emailValidation.isValid ? 'text-green-400' : 'text-red-400'}`}>
                        {emailValidation.message}
                      </p>
                    )}
                    {emailExists && (
                      <p className="text-red-400 text-sm mt-1">
                        This email is already registered. Please use a different email.
                      </p>
                    )}
                  </div>

                  {/* Password Fields */}
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 rounded-lg bg-purple-800/50 border border-purple-400/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300/50 hover:text-purple-300"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {password && (
                      <p className="text-sm" style={{ color: getPasswordStrength().color }}>
                        Strength: {getPasswordStrength().level}
                      </p>
                    )}

                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 rounded-lg bg-purple-800/50 border border-purple-400/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300/50 hover:text-purple-300"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {confirmPassword && (
                      <p className={`text-sm ${isPasswordMatch ? 'text-green-400' : 'text-red-400'}`}>
                        {isPasswordMatch ? "Passwords match" : "Passwords do not match"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Date of Birth */}
                  <div>
                    <label className="text-purple-200 mb-2 block">Date of Birth</label>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="relative">
                        <select 
                          value={dob.year} 
                          onChange={(e) => handleDateChange('year', e.target.value)}
                          className={`w-full p-3 rounded-lg bg-purple-800/50 border border-purple-400/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none ${!dob.year ? 'text-purple-300/50' : 'text-white'}`}
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
                          className={`w-full p-3 rounded-lg bg-purple-800/50 border border-purple-400/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none ${!dob.month ? 'text-purple-300/50' : 'text-white'}`}
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
                          className={`w-full p-3 rounded-lg bg-purple-800/50 border border-purple-400/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none ${!dob.day ? 'text-purple-300/50' : 'text-white'}`}
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

                  {/* Gender */}
                  <div>
                    <label className="text-purple-200 mb-2 block">Gender</label>
                    <div className="grid grid-cols-3 gap-4">
                      {["Female", "Male", "Custom"].map(g => (
                        <label key={g} className="flex items-center justify-center p-2 rounded-lg bg-purple-800/50 border border-purple-400/20 hover:bg-purple-800/70 cursor-pointer">
                          <input 
                            type="radio" 
                            name="gender" 
                            value={g} 
                            checked={gender === g} 
                            onChange={(e) => setGender(e.target.value)} 
                            className="accent-purple-500 mr-2" 
                          />
                          <span className="text-white text-sm">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sign Up Button */}
              <Button
                onClick={handleSignup}
                disabled={!!(emailExists || loading || (email && !emailValidation.isValid && !emailValidation.checking))}
                className={`w-full py-6 rounded-lg text-lg font-semibold mt-8 ${
                  emailExists || loading || (email && !emailValidation.isValid && !emailValidation.checking) 
                    ? 'bg-purple-600/50 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Sign Up'
                )}
              </Button>

              {/* Login Link */}
              <p className="text-center mt-6 text-purple-300/70">
                Already have an account?{' '}
                <Link href="/login" className="text-purple-300 hover:text-purple-200 underline">
                  Login here
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import React from 'react';

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

export default function ModernLoginSignup() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaffd0] via-[#A8E66A] to-[#eaffd0] py-16 px-4">
      <MotionDiv
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="flex flex-col md:flex-row gap-10 md:gap-16 w-full max-w-5xl justify-center items-center"
      >
        {/* Login Card */}
        <MotionDiv
          whileHover={{ scale: 1.04, boxShadow: '0 12px 32px 0 rgba(168,230,106,0.25)' }}
          className="relative bg-[#A8E66A] rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center border border-[#d6f7b0] backdrop-blur-md transition-all duration-300"
        >
          {/* 3D floating circle */}
          <MotionDiv
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, type: 'spring' }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#FFD23F] to-[#A8E66A] rounded-full shadow-lg blur-[1px] z-10 border-4 border-white"
          />
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-[#1A1A1A] drop-shadow-lg text-center">Already A Member?<br />Sign In:</h2>
          <form className="w-full space-y-6">
            <div>
              <label htmlFor="login-username" className="block text-base font-semibold text-[#1A1A1A] mb-2">Username</label>
              <MotionInput
                whileFocus={{ scale: 1.03, boxShadow: '0 0 0 4px #FFD23F55' }}
                type="text"
                id="login-username"
                placeholder="Enter Username"
                className="w-full h-12 px-4 rounded-lg border border-[#e0e0e0] bg-white text-[#1A1A1A] font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200"
                name="name"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block text-base font-semibold text-[#1A1A1A] mb-2">Password</label>
              <MotionInput
                whileFocus={{ scale: 1.03, boxShadow: '0 0 0 4px #FFD23F55' }}
                type="password"
                id="login-password"
                placeholder="Enter Password"
                className="w-full h-12 px-4 rounded-lg border border-[#e0e0e0] bg-white text-[#1A1A1A] font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200"
                name="password"
              />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-block w-5 h-5 rounded-full bg-[#FFD23F] shadow-md border-2 border-[#FFD23F] mr-2"></span>
              <label htmlFor="remember" className="text-base text-[#1A1A1A] font-medium select-none cursor-pointer">Remember Password</label>
            </div>
            <MotionButton
              whileHover={{ scale: 1.03, boxShadow: '0 6px 24px 0 #FFD23F99' }}
              className="w-full h-12 rounded-lg bg-[#FFD23F] text-[#1A1A1A] font-bold text-lg shadow-lg hover:bg-yellow-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFD23F]"
              type="submit"
              name="submit"
            >
              Login
            </MotionButton>
          </form>
          <p className="mt-6 text-[#1A1A1A] text-base text-center">Don't have an account?{' '}
            <Link href="/register" className="text-[#5EC8F2] font-semibold hover:underline transition-colors">Register Now</Link>
          </p>
        </MotionDiv>

        {/* Signup Card */}
        <MotionDiv
          whileHover={{ scale: 1.04, boxShadow: '0 12px 32px 0 rgba(168,230,106,0.25)' }}
          className="relative bg-[#A8E66A] rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center border border-[#d6f7b0] backdrop-blur-md transition-all duration-300"
        >
          {/* 3D floating circle */}
          <MotionDiv
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, type: 'spring' }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-[#FFD23F] to-[#A8E66A] rounded-full shadow-lg blur-[1px] z-10 border-4 border-white"
          />
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-[#1A1A1A] drop-shadow-lg text-center">Create A New Account:</h2>
          <form className="w-full space-y-6">
            <div>
              <label htmlFor="signup-username" className="block text-base font-semibold text-[#1A1A1A] mb-2">Username</label>
              <MotionInput
                whileFocus={{ scale: 1.03, boxShadow: '0 0 0 4px #FFD23F55' }}
                type="text"
                id="signup-username"
                placeholder="Enter Username"
                className="w-full h-12 px-4 rounded-lg border border-[#e0e0e0] bg-white text-[#1A1A1A] font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200"
                name="signup-username"
              />
            </div>
            <div>
              <label htmlFor="signup-fullname" className="block text-base font-semibold text-[#1A1A1A] mb-2">Full Name</label>
              <MotionInput
                whileFocus={{ scale: 1.03, boxShadow: '0 0 0 4px #FFD23F55' }}
                type="text"
                id="signup-fullname"
                placeholder="Enter Full Name"
                className="w-full h-12 px-4 rounded-lg border border-[#e0e0e0] bg-white text-[#1A1A1A] font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200"
                name="signup-fullname"
              />
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-base font-semibold text-[#1A1A1A] mb-2">Email Address</label>
              <MotionInput
                whileFocus={{ scale: 1.03, boxShadow: '0 0 0 4px #FFD23F55' }}
                type="email"
                id="signup-email"
                placeholder="Enter Email Address"
                className="w-full h-12 px-4 rounded-lg border border-[#e0e0e0] bg-white text-[#1A1A1A] font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200"
                name="signup-email"
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-base font-semibold text-[#1A1A1A] mb-2">Password</label>
              <MotionInput
                whileFocus={{ scale: 1.03, boxShadow: '0 0 0 4px #FFD23F55' }}
                type="password"
                id="signup-password"
                placeholder="Enter Password"
                className="w-full h-12 px-4 rounded-lg border border-[#e0e0e0] bg-white text-[#1A1A1A] font-medium shadow-inner focus:outline-none focus:ring-2 focus:ring-[#FFD23F] transition-all duration-200"
                name="signup-password"
              />
            </div>
            <MotionButton
              whileHover={{ scale: 1.03, boxShadow: '0 6px 24px 0 #FFD23F99' }}
              className="w-full h-12 rounded-lg bg-[#FFD23F] text-[#1A1A1A] font-bold text-lg shadow-lg hover:bg-yellow-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFD23F]"
              type="submit"
              name="submit"
            >
              Signup Now
            </MotionButton>
          </form>
        </MotionDiv>
      </MotionDiv>
    </section>
  );
} 
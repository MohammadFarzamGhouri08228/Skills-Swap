'use client';
import HeaderOne from '@/layouts/headers/HeaderOne'
import React, { useEffect, useState } from 'react';
import HeroHomeOne from './HeroHomeOne'
import FeatureHomeOne from './FeatureHomeOne'
import AboutHomeOne from './AboutHomeOne'
import CounterHomeOne from './CounterHomeOne'
import CoursesHomeOne from './CoursesHomeOne'
import CourseCategoryHomeOne from './CourseCategoryHomeOne'
import WorkingProcessHomeOne from './WorkingProcessHomeOne'
import InstructorsHomeOne from './InstructorsHomeOne'
import VideoHomeOne from './VideoHomeOne'
import ReviewHomeOne from './ReviewHomeOne'
import BrandHomeOne from './BrandHomeOne'
import BlogHomeOne from './BlogHomeOne'
import FooterOne from '@/layouts/footers/FooterOne'
import { User } from 'firebase/auth';
import { UserData as ImportedUserData } from '@/app/api/profile/userDataService';

// Compose with ImportedUserData instead of extending to avoid type conflicts
type UserData = ImportedUserData & {
  skillsOffered?: string[];
  skillsWanted?: string[];
};

interface HomeOneProps {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
}

export default function HomeOne({ user, userData, isLoading }: HomeOneProps) {
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);

  useEffect(() => {
    if (
      user &&
      userData &&
      !isLoading &&
      (!userData.skillsOffered?.length || !userData.skillsWanted?.length)
    ) {
      setShowProfilePrompt(true);
    }
  }, [user, userData, isLoading]);

  const goToSkillsOffered = () => {
    setShowProfilePrompt(false);
    window.location.href = "/my-skills"; // Update with your actual route
  };

  const goToSkillsWanted = () => {
    setShowProfilePrompt(false);
    window.location.href = "/skillsToLearn"; // Update with your actual route
  };

  return (
    <>
      <HeaderOne />
      <HeroHomeOne user={user} userData={userData} isLoading={isLoading} />
      <FeatureHomeOne />
      <AboutHomeOne />
      {/* <CounterHomeOne /> */}
      {/* <CoursesHomeOne /> */}
      {/* <CourseCategoryHomeOne /> */}
      <WorkingProcessHomeOne />
      {/* <InstructorsHomeOne /> */}
      <VideoHomeOne />
      {/* <ReviewHomeOne />
      <BrandHomeOne /> */}
      {/* <BlogHomeOne /> */}
      <FooterOne />

      {/* Profile completion modal */}
      {showProfilePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900/80 via-purple-700/80 to-fuchsia-900/80 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl shadow-2xl px-8 py-12 max-w-md w-full text-center border-4 border-purple-200 overflow-visible">
            {/* Decorative icon INSIDE the box */}
            <div className="flex justify-center mb-6 mt-0">
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-purple-200 via-fuchsia-100 to-yellow-100 shadow-xl p-3 border-4 border-white">
                <svg className="w-10 h-10 text-purple-700 drop-shadow" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="#a78bfa" strokeWidth="2.5" fill="#ede9fe"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" stroke="#7c3aed" strokeWidth="2.5"/>
                </svg>
              </span>
            </div>
            <h2 className="text-2xl font-extrabold mb-3 text-purple-800 drop-shadow">Complete Your Profile</h2>
            <p className="mb-7 text-gray-700 text-base">
              {((!userData?.skillsOffered || userData.skillsOffered.length === 0) && (!userData?.skillsWanted || userData.skillsWanted.length === 0)) && (
                <>
                  Please add both your <span className="font-semibold text-purple-700">Skills You Offer</span> and <span className="font-semibold text-purple-700">Skills You Want To Learn</span> to get the most out of SkillSwap!
                </>
              )}
              {((!userData?.skillsOffered || userData.skillsOffered.length === 0) && (userData?.skillsWanted && userData.skillsWanted.length > 0)) && (
                <>
                  Please add your <span className="font-semibold text-purple-700">Skills You Offer</span> to get the most out of SkillSwap!
                </>
              )}
              {(userData?.skillsOffered && userData.skillsOffered.length > 0 && (!userData?.skillsWanted || userData.skillsWanted.length === 0)) && (
                <>
                  Please add your <span className="font-semibold text-purple-700">Skills You Want To Learn</span> to get the most out of SkillSwap!
                </>
              )}
            </p>
            <div className="flex flex-col gap-3">
              {(!userData?.skillsOffered || userData.skillsOffered.length === 0) && (
                <button
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-5 py-2 rounded-xl font-semibold shadow hover:from-purple-700 hover:to-fuchsia-600 transition"
                  onClick={goToSkillsOffered}
                >
                  Go to My Skills
                </button>
              )}
              {(!userData?.skillsWanted || userData.skillsWanted.length === 0) && (
                <button
                  className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-purple-900 px-5 py-2 rounded-xl font-semibold shadow hover:from-yellow-400 hover:to-yellow-600 transition"
                  onClick={goToSkillsWanted}
                >
                  Go to Skills I Want To Learn
                </button>
              )}
              <button
                className="mt-2 text-purple-400 hover:text-purple-700 underline transition"
                onClick={() => setShowProfilePrompt(false)}
              >
                Maybe Later
              </button>
            </div>
            {/* Decorative accent */}
            <div className="absolute left-1/2 -bottom-4 -translate-x-1/2 w-28 h-2 bg-gradient-to-r from-purple-400 via-fuchsia-300 to-yellow-200 rounded-full blur-sm opacity-70"></div>
          </div>
        </div>
      )}
    </>
  );
}
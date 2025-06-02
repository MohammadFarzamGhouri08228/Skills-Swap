'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UserProfileClient from './UserProfileClient';
import Wrapper from '@/layouts/Wrapper';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Mock data for initial setup
const mockSkills = {
  canTeach: [
    { name: "Python Programming", level: "Advanced", category: "Programming" },
    { name: "Web Development", level: "Intermediate", category: "Programming" },
    { name: "Digital Marketing", level: "Expert", category: "Marketing" },
  ],
  wantToLearn: [
    { name: "UI/UX Design", level: "Beginner", category: "Design" },
    { name: "Data Science", level: "Intermediate", category: "Programming" },
    { name: "Spanish Language", level: "Beginner", category: "Language" },
  ],
};

const mockCalendarData = {
  upcoming: [
    { date: new Date(2024, 2, 15), title: "Python Programming Session", partner: "John Smith", type: "Teaching" },
    { date: new Date(2024, 2, 18), title: "UI/UX Design Learning", partner: "Sarah Johnson", type: "Learning" },
  ],
  past: [
    { date: new Date(2024, 1, 15), title: "Digital Marketing Session", partner: "Emma Wilson", type: "Teaching", rating: 5 },
    { date: new Date(2024, 1, 10), title: "Data Science Learning", partner: "Alex Chen", type: "Learning", rating: 4.5 },
  ]
};

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      console.error('Firebase Auth is not initialized');
      router.push('/login');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User authenticated:', user.uid);
        setCurrentUserId(user.uid);
      } else {
        console.log('No user authenticated, redirecting to login');
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!params.id) {
    return (
      <Wrapper>
        <div className="min-h-screen bg-[#FFD23F] py-8">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#2E1065] mb-2">User Not Found</h1>
              <p className="text-[#5B21B6]/70 mb-4">The requested user profile could not be found.</p>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <UserProfileClient
        userId={params.id as string}
        initialSkills={mockSkills}
        initialCalendarData={mockCalendarData}
        showSidebarUser={false}
      />
    </Wrapper>
  );
}

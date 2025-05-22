'use client';
import HomeOne from '@/components/homes/home'
import React, { useEffect, useState } from 'react'
import Wrapper from '@/layouts/Wrapper'
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { userDataService } from '@/app/api/profile/userDataService';
import { UserData } from '@/app/api/profile/userDataService';
import { useRouter } from 'next/navigation';

export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      console.error('Firebase Auth is not initialized');
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // If no user is logged in, redirect to login page
        router.push('/modern/login');
        return;
      }

      setUser(user);
      try {
        const data = await userDataService.getUser(user.uid);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <Wrapper>
      <HomeOne user={user} userData={userData} isLoading={isLoading} />
    </Wrapper>
  )
} 
'use client';

// user feed page
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
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/modern/login');
        return;
      }

      setUser(user);
      try {
        let data = await userDataService.getUser(user.uid);
        // Defensive fix: ensure skillsWanted and skillsOffered are arrays
        if (data) {
          data = {
            ...data,
            skillsWanted: Array.isArray(data.skillsWanted) ? data.skillsWanted : [],
            skillsOffered: Array.isArray(data.skillsOffered) ? data.skillsOffered : [],
          } as UserData; // <--- Explicit cast here
        }
        setUserData(data as UserData); // <--- And here
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);
  const normalizedUserData = userData
    ? {
        ...userData,
        skillsWanted: Array.isArray(userData.skillsWanted) ? userData.skillsWanted : [],
        skillsOffered: Array.isArray(userData.skillsOffered) ? userData.skillsOffered : [],
      }
    : null;
  return (
    <Wrapper>
      <HomeOne user={user} userData={normalizedUserData} isLoading={isLoading} />
    </Wrapper>
  );
}
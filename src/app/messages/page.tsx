'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { UserData, userDataService } from '@/app/api/profile/userDataService';
import { ChatList } from '@/components/chat/ChatList';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useRouter } from 'next/navigation';

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth?.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const userData = await userDataService.getUser(user.uid);
        if (userData) {
          setCurrentUser(userData);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe?.();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-semibold mb-6">Messages</h1>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex">
        <ChatList
          currentUser={currentUser}
          onSelectChat={setSelectedUser}
          selectedUserId={selectedUser?.uid}
        />
        {selectedUser ? (
          <div className="flex-1">
            <ChatInterface
              currentUser={currentUser}
              otherUser={selectedUser}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
} 
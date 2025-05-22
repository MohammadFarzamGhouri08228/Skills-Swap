'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { UserData } from '@/app/api/profile/userDataService';
import { cn } from '@/lib/utils';

interface UserProfileButtonProps {
  user: UserData | null;
}

export function UserProfileButton({ user }: UserProfileButtonProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      if (!auth) {
        throw new Error('Authentication service is not available');
      }
      await signOut(auth);
      router.push('/modern/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <Button
        variant="outline"
        onClick={() => router.push('/modern/login')}
        className="bg-black text-white hover:bg-gray-800 border-gray-700 font-bold px-6 py-2"
      >
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full hover:bg-gray-800 transition-colors"
        >
          <Avatar className="h-10 w-10 border-2 border-gray-700">
            <AvatarImage src={user.profilePicture} alt={user.firstName} />
            <AvatarFallback className="bg-gray-800 text-white font-bold">
              {user.firstName[0]}{user.surname[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 bg-gray-900 border-gray-700 shadow-xl" 
        align="end" 
        forceMount
      >
        <DropdownMenuLabel className="font-normal p-4">
          <div className="flex flex-col space-y-1">
            <p className="text-base font-bold text-white leading-none">
              {user.firstName} {user.surname}
            </p>
            <p className="text-sm text-gray-400 leading-none mt-1">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          onClick={() => router.push(`/user/${user.uid}`)}
          className="p-3 text-white hover:bg-gray-800 cursor-pointer focus:bg-gray-800 focus:text-white"
        >
          <User className="mr-3 h-5 w-5 text-gray-400" />
          <span className="font-semibold">Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleLogout}
          className="p-3 text-white hover:bg-gray-800 cursor-pointer focus:bg-gray-800 focus:text-white"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          <span className="font-semibold">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 
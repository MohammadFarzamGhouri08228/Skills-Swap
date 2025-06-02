'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Star } from 'lucide-react';
import { userDataService, UserData } from '@/app/api/profile/userDataService';
import Wrapper from '@/layouts/Wrapper';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from '@/components/ui/use-toast';

export default function PeersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUserId) {
        console.log('No current user ID, skipping fetch');
        return;
      }

      try {
        console.log('Fetching all users...');
        setIsLoading(true);
        setError(null);
        
        const allUsers = await userDataService.getAllUsers();
        console.log('Users fetched successfully:', allUsers);
        
        if (allUsers.length === 0) {
          const msg = 'No peers found in the database';
          console.warn(msg);
          setError(msg);
          toast({
            title: "No Peers Found",
            description: "There are currently no peers registered in the system.",
            variant: "destructive",
          });
        }
        
        setUsers(allUsers);
        setFilteredUsers(allUsers);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch peers';
        console.error('Error fetching peers:', error);
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  const handleSearch = () => {
    console.log('Handling search for query:', searchQuery);
    if (!searchQuery.trim()) {
      console.log('Empty search query, showing all peers');
      setFilteredUsers(users);
      setShowDropdown(false);
      return;
    }

    const searchLower = searchQuery.toLowerCase();
    console.log('Searching with lowercase query:', searchLower);
    
    const filtered = users.filter(user => {
      const fullName = `${user.firstName} ${user.surname}`.toLowerCase();
      const skills = user.skills?.join(' ').toLowerCase() || '';
      const location = user.location?.toLowerCase() || '';
      const email = user.email.toLowerCase();
      
      const matches = fullName.includes(searchLower) || 
                     skills.includes(searchLower) ||
                     location.includes(searchLower) ||
                     email.includes(searchLower);
      
      if (matches) {
        console.log('Found matching peer:', user);
      }
      
      return matches;
    });

    console.log(`Found ${filtered.length} matching peers`);
    setFilteredUsers(filtered);
    setShowDropdown(true);
  };

  useEffect(() => {
    console.log('Search query changed:', searchQuery);
    handleSearch();
  }, [searchQuery, users]);

  if (isLoading) {
    return (
      <Wrapper>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5B21B6]"></div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="min-h-screen bg-[#FFD23F]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-[#5B21B6] to-[#2E1065] rounded-xl shadow-xl p-6 mb-6 text-center">
              <h1 className="text-3xl font-bold mb-2 text-white">Find Skill Exchange Partners</h1>
              <p className="text-gray-200 mb-2">
                {users.length} peers found. Search by name, email, skills, or location.
              </p>
              {error && (
                <p className="text-[#FFD23F] mt-2 font-medium">{error}</p>
              )}
            </div>

            <div className="relative flex items-center max-w-xl mx-auto">
              <label htmlFor="peer-search" className="sr-only">Search peers</label>
              <input
                id="peer-search"
                name="peer-search"
                type="text"
                placeholder="Start typing to search..."
                className="pl-5 pr-12 py-3 w-full rounded-full border-2 border-[#5B21B6] shadow-xl focus:outline-none focus:ring-2 focus:ring-[#5B21B6] text-[#2E1065] bg-white placeholder-[#5B21B6]/50"
                value={searchQuery}
                onChange={(e) => { 
                  console.log('Search input changed:', e.target.value);
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    console.log('Enter key pressed, triggering search');
                    handleSearch();
                    setShowDropdown(false);
                  }
                }}
                aria-label="Search peers"
                autoComplete="off"
                onFocus={() => {
                  if (searchQuery) {
                    console.log('Input focused with existing query, showing dropdown');
                    setShowDropdown(true);
                  }
                }}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5B21B6] hover:text-[#2E1065] focus:outline-none transition-colors"
                onClick={() => {
                  console.log('Search button clicked');
                  handleSearch();
                  setShowDropdown(true);
                }}
                aria-label="Search"
                type="button"
              >
                <Search className="h-5 w-5" />
              </button>

              {showDropdown && searchQuery && (
                <div className="absolute left-0 right-0 top-14 z-20 bg-white border-2 border-[#5B21B6] rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user.uid}
                        className={`flex items-center px-4 py-2 cursor-pointer hover:bg-[#5B21B6]/5 transition-colors ${
                          user.uid === currentUserId ? 'bg-[#FFD23F]/10' : ''
                        }`}
                        onClick={() => {
                          console.log('User selected from dropdown:', user.uid);
                          router.push(`/user/${user.uid}`);
                          setShowDropdown(false);
                        }}
                      >
                        <Avatar className="h-10 w-10 mr-3 border-2 border-[#5B21B6]">
                          <AvatarImage src={user.profilePicture} />
                          <AvatarFallback className="bg-[#5B21B6]/10 text-[#5B21B6] font-medium">
                            {user.firstName?.[0]}{user.surname?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#2E1065] truncate">
                              {user.firstName} {user.surname}
                            </span>
                            {user.isVerified && (
                              <Star className="h-4 w-4 text-[#FFD23F] fill-current" />
                            )}
                            {user.uid === currentUserId && (
                              <Badge className="bg-[#FFD23F] text-[#2E1065] font-medium">
                                You
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-center">No peers found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 max-w-2xl mx-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Card 
                  key={user.uid} 
                  className={`p-6 hover:shadow-xl transition-all bg-white ${
                    user.uid === currentUserId 
                      ? 'border-2 border-[#5B21B6] bg-gradient-to-br from-[#5B21B6]/5 to-[#2E1065]/5' 
                      : 'hover:border-[#5B21B6]/30 border border-[#5B21B6]/20'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-[#5B21B6]">
                      <AvatarImage src={user.profilePicture} />
                      <AvatarFallback className="bg-[#5B21B6]/10 text-[#5B21B6] font-medium">
                        {user.firstName?.[0]}{user.surname?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-semibold text-[#2E1065]">
                          {user.firstName} {user.surname}
                        </h2>
                        {user.isVerified && (
                          <Star className="h-5 w-5 text-[#FFD23F] fill-current" />
                        )}
                        {user.uid === currentUserId && (
                          <Badge className="bg-[#FFD23F] text-[#2E1065] font-medium">
                            You
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-[#1eaace]">{user.email}</p>
                      {user.location && (
                        <p className="text-sm text-[#1dbb90] mt-1">{user.location}</p>
                      )}
                      {user.skills && user.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 mb-4">
                          {user.skills.slice(0, 3).map((skill, index) => (
                            <Badge 
                              key={index} 
                              className="bg-[#FF914D]/10 text-[#FF914D] border border-[#FF914D]/20 font-medium"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {user.skills.length > 3 && (
                            <Badge 
                              variant="outline" 
                              className="border-[#FF914D] text-[#FF914D] font-medium"
                            >
                              +{user.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      <Button
                        variant="outline"
                        className="w-full mt-2 border-2 border-[#5B21B6] text-[#5B21B6] hover:bg-[#5B21B6] hover:text-white transition-all"
                        onClick={() => router.push(`/user/${user.uid}`)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-[#5B21B6]/20 shadow-xl">
                <h3 className="text-xl font-medium text-[#2E1065]">No peers found</h3>
                <p className="mt-2 text-[#5B21B6]/70">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
} 
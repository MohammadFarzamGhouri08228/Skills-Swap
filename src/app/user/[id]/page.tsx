'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Clock, Star, Video } from 'lucide-react';
import { userDataService, UserData } from '@/app/api/profile/userDataService';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Wrapper from '@/layouts/Wrapper';

interface LessonPreview {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  skill: string;
}

interface ExchangeSession {
  id: string;
  date: string;
  skill: string;
  partner: {
    name: string;
    avatar: string;
  };
  rating: number;
  feedback: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [lessonPreviews, setLessonPreviews] = useState<LessonPreview[]>([]);
  const [exchangeHistory, setExchangeHistory] = useState<ExchangeSession[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the profile user data
        const profileData = await userDataService.getUser(params.id as string);
        setUserData(profileData);

        // Get current user data if logged in
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            const currentUserData = await userDataService.getUser(user.uid);
            setCurrentUser(currentUserData);
          }
          setIsLoading(false);
        });

        // Mock data for lesson previews (replace with actual data fetching)
        setLessonPreviews([
          {
            id: '1',
            title: 'Introduction to JavaScript',
            thumbnail: '/lessons/js-intro.jpg',
            duration: '5:00',
            skill: 'JavaScript'
          },
          {
            id: '2',
            title: 'React Hooks Basics',
            thumbnail: '/lessons/react-hooks.jpg',
            duration: '5:00',
            skill: 'React'
          }
        ]);

        // Mock data for exchange history (replace with actual data fetching)
        setExchangeHistory([
          {
            id: '1',
            date: '2024-03-15',
            skill: 'JavaScript',
            partner: {
              name: 'John Doe',
              avatar: '/avatars/john.jpg'
            },
            rating: 5,
            feedback: 'Great teaching session! Very knowledgeable.'
          }
        ]);

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <Wrapper>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#5B2E9D] via-[#7C3AED] to-[#5B2E9D]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD23F]"></div>
        </div>
      </Wrapper>
    );
  }

  if (!userData) {
    return (
      <Wrapper>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#5B2E9D] via-[#7C3AED] to-[#5B2E9D]">
          <h1 className="text-2xl font-bold text-white">User not found</h1>
        </div>
      </Wrapper>
    );
  }

  const isOwnProfile = currentUser?.uid === userData.uid;

  return (
    <Wrapper>
      <div className="min-h-screen bg-gradient-to-br from-[#5B2E9D] via-[#7C3AED] to-[#5B2E9D] py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {/* Profile Card */}
          <Card className="p-8 col-span-1 bg-white/90 rounded-2xl shadow-2xl border-4 border-[#FFD23F]">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32 border-4 border-[#FFD23F] shadow-lg">
                <AvatarImage src={userData.profilePicture} />
                <AvatarFallback className="bg-[#FFD23F] text-[#5B2E9D] text-4xl font-bold">
                  {userData.firstName[0]}{userData.surname[0]}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h1 className="text-3xl font-extrabold text-[#5B2E9D] drop-shadow">{userData.firstName} {userData.surname}</h1>
                {userData.isVerified && (
                  <div className="flex items-center justify-center mt-2">
                    <CheckCircle className="h-5 w-5 text-[#FFD23F] mr-1" />
                    <span className="text-sm text-[#5B2E9D] font-semibold">Verified User</span>
                  </div>
                )}
              </div>
              <div className="w-full space-y-4">
                <div>
                  <h3 className="font-semibold text-[#5B2E9D] mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {userData.skills?.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-[#FFD23F] text-[#5B2E9D] font-bold px-3 py-1 rounded-full shadow hover:bg-[#FFB800] transition">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-[#5B2E9D] mb-2">Location</h3>
                  <p className="text-sm text-[#7C3AED]">{userData.location || 'Not specified'}</p>
                </div>
                {isOwnProfile && (
                  <Button 
                    variant="outline" 
                    className="w-full bg-[#FFD23F] text-[#5B2E9D] font-bold border-[#FFD23F] hover:bg-[#FFB800] hover:text-[#5B2E9D] shadow"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </Card>
          {/* Main Content */}
          <div className="col-span-2">
            <Tabs defaultValue="lessons" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/80 border-2 border-[#FFD23F] rounded-xl shadow mb-4">
                <TabsTrigger value="lessons" className="data-[state=active]:bg-[#FFD23F] data-[state=active]:text-[#5B2E9D] text-[#5B2E9D] font-bold rounded-xl transition">Lesson Previews</TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-[#FFD23F] data-[state=active]:text-[#5B2E9D] text-[#5B2E9D] font-bold rounded-xl transition">Skills & Availability</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-[#FFD23F] data-[state=active]:text-[#5B2E9D] text-[#5B2E9D] font-bold rounded-xl transition">Exchange History</TabsTrigger>
              </TabsList>
              <TabsContent value="lessons" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lessonPreviews.map((lesson) => (
                    <Card key={lesson.id} className="overflow-hidden bg-white/90 border-2 border-[#FFD23F] rounded-xl shadow-lg">
                      <div className="relative aspect-video">
                        <img
                          src={lesson.thumbnail}
                          alt={lesson.title}
                          className="object-cover w-full h-full rounded-t-xl"
                        />
                        <div className="absolute bottom-2 right-2 bg-[#5B2E9D]/90 text-white px-3 py-1 rounded text-sm font-bold shadow">
                          {lesson.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-[#5B2E9D]">{lesson.title}</h3>
                        <Badge variant="secondary" className="mt-2 bg-[#FFD23F] text-[#5B2E9D] font-bold px-3 py-1 rounded-full shadow hover:bg-[#FFB800] transition">
                          {lesson.skill}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="skills">
                <Card className="p-6 bg-white/90 border-2 border-[#FFD23F] rounded-xl shadow-lg">
                  <h2 className="text-xl font-extrabold mb-4 text-[#5B2E9D]">Skills & Availability</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-2 text-[#5B2E9D]">Teaching Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {userData.skills?.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center bg-[#FFD23F] text-[#5B2E9D] font-bold px-3 py-1 rounded-full shadow hover:bg-[#FFB800] transition">
                            <Star className="h-4 w-4 mr-1 text-[#5B2E9D]" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2 text-[#5B2E9D]">Learning Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {userData.interests?.map((interest, index) => (
                          <Badge key={index} variant="outline" className="border-[#FFD23F] text-[#5B2E9D] font-bold px-3 py-1 rounded-full hover:bg-[#FFD23F] hover:text-[#5B2E9D] transition">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="history">
                <div className="space-y-4">
                  {exchangeHistory.map((session) => (
                    <Card key={session.id} className="p-4 bg-white/90 border-2 border-[#FFD23F] rounded-xl shadow-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="border-2 border-[#FFD23F]">
                            <AvatarImage src={session.partner.avatar} />
                            <AvatarFallback className="bg-[#FFD23F] text-[#5B2E9D]">
                              {session.partner.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-[#5B2E9D]">{session.partner.name}</h3>
                            <p className="text-sm text-[#7C3AED]">{session.skill}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-[#FFD23F] font-bold">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1">{session.rating}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-[#7C3AED]">{session.feedback}</p>
                      <div className="mt-2 flex items-center text-sm text-[#5B2E9D]">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(session.date).toLocaleDateString()}
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Wrapper>
  );
} 
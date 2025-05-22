'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Star } from 'lucide-react';
import { userDataService, UserData } from '@/app/api/profile/userDataService';
import Wrapper from '@/layouts/Wrapper';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // TODO: Replace with actual API call to get all users
        const mockUsers: UserData[] = [
          {
            uid: '1',
            email: 'john@example.com',
            firstName: 'John',
            surname: 'Doe',
            skills: ['JavaScript', 'React', 'Node.js'],
            interests: ['Python', 'Machine Learning'],
            isVerified: true,
            profilePicture: '/avatars/john.jpg',
            location: 'New York, USA',
            createdAt: new Date().toISOString(),
            dob: '1990-01-01',
            gender: 'male'
          },
          {
            uid: '2',
            email: 'jane@example.com',
            firstName: 'Jane',
            surname: 'Smith',
            skills: ['Python', 'Data Science', 'Machine Learning'],
            interests: ['JavaScript', 'Web Development'],
            isVerified: true,
            profilePicture: '/avatars/jane.jpg',
            location: 'London, UK',
            createdAt: new Date().toISOString(),
            dob: '1992-05-15',
            gender: 'female'
          }
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => {
      const fullName = `${user.firstName} ${user.surname}`.toLowerCase();
      const skills = user.skills?.join(' ').toLowerCase() || '';
      const searchLower = searchQuery.toLowerCase();
      
      return fullName.includes(searchLower) || 
             skills.includes(searchLower) ||
             user.location?.toLowerCase().includes(searchLower);
    });
    
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  if (isLoading) {
    return (
      <Wrapper>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Find Skill Exchange Partners</h1>
          <p className="text-center text-gray-600 mb-8">
            Connect with other users to exchange skills and learn together
          </p>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search by name, skills, or location..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.uid} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>{user.firstName[0]}{user.surname[0]}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold truncate">
                      {user.firstName} {user.surname}
                      {user.isVerified && (
                        <Star className="inline-block ml-1 h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </h2>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{user.location}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {user.skills?.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                    {user.skills && user.skills.length > 3 && (
                      <Badge variant="outline">+{user.skills.length - 3} more</Badge>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/user/${user.uid}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No users found</h3>
            <p className="mt-2 text-gray-600">Try adjusting your search query</p>
          </div>
        )}
      </div>
    </Wrapper>
  );
} 
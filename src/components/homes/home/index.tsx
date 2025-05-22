'use client';
import HeaderOne from '@/layouts/headers/HeaderOne'
import React from 'react'
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
import { UserData } from '@/app/api/profile/userDataService';

interface HomeOneProps {
  user: User | null;
  userData: UserData | null;
  isLoading: boolean;
}

export default function HomeOne({ user, userData, isLoading }: HomeOneProps) {
  return (
    <>
      <HeaderOne />
      <HeroHomeOne user={user} userData={userData} isLoading={isLoading} />
      <FeatureHomeOne />
      <AboutHomeOne />
      <CounterHomeOne />
      <CoursesHomeOne />
      <CourseCategoryHomeOne />
      <WorkingProcessHomeOne />
      <InstructorsHomeOne />
      <VideoHomeOne />
      <ReviewHomeOne />
      <BrandHomeOne />
      <BlogHomeOne />
      <FooterOne />
    </>
  )
}

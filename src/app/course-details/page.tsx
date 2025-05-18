import CourseDetails from '@/components/course-details'
import Wrapper from '@/layouts/Wrapper'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Course Details SkillSwap - Education Next JS Template',
  description: 'Transform your educational website with SkillSwap - the ultimate Next template thats powered by the latest Bootstrap technology. Impress your visitors with sleek animations, a user-friendly contact form, and seamless course integration. Elevate your online presence and engage your audience like never before with SkillSwap!',
}

export default function index() {
  return (
    <Wrapper>
      <CourseDetails />
    </Wrapper>
  )
}

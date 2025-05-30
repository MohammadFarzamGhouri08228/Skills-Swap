import CourseDetails from '@/components/skillsToLearn'
import Wrapper from '@/layouts/Wrapper'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Skills I Want To Learn - SkillSwap',
  description: 'Explore the skills you want to learn with SkillSwap. Find courses and resources tailored to your interests.',
}

export default function index() {
  return (
    <Wrapper>
      <CourseDetails />
    </Wrapper>
  )
}

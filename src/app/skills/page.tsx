import Courses from '@/components/courses'
import Wrapper from '@/layouts/Wrapper'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Skills on SkillSwap',
  description: 'Transform your skills with SkillSwap',
}


export default function index() {
  return (
    <Wrapper>
      <Courses />
    </Wrapper>
  )
}

import CoursesTwo from '@/components/my-skills'
import Wrapper from '@/layouts/Wrapper'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'My Skills - SkillSwap',
  description: 'View and manage your skills on SkillSwap',
}


export default function index() {
  return (
    <Wrapper>
      <CoursesTwo />
    </Wrapper>
  )
}

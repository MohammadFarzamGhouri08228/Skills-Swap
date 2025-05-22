'use client';
import HomeOne from '@/components/homes/home'
import React from 'react'
import Wrapper from '@/layouts/Wrapper'

export default function Home() {
  return (
    <Wrapper>
      <HomeOne user={null} userData={null} isLoading={false} />
    </Wrapper>
  )
}
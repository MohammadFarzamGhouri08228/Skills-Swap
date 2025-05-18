import React from 'react'
import { Metadata } from 'next'
import HomeTwo from '@/components/homes/home-2'
import Wrapper from '@/layouts/Wrapper'

 
export const metadata: Metadata = {
  title: 'Home Two SkillSwap - Education Next JS Template',
  description: 'Transform your educational website with SkillSwap - the ultimate Next template thats powered by the latest Bootstrap technology. Impress your visitors with sleek animations, a user-friendly contact form, and seamless course integration. Elevate your online presence and engage your audience like never before with SkillSwap!',
}


export default function index() {
  return (
    <Wrapper>
      <HomeTwo />
    </Wrapper>
  )
}

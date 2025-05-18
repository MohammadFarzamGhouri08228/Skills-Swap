import React from 'react'

import type { Metadata } from 'next'
import About from '@/components/about'
import Wrapper from '@/layouts/Wrapper'
export const metadata: Metadata = {
  title: 'About SkillSwap - Education Next JS Template',
  description: 'Transform your educational website with SkillSwap - the ultimate Next template thats powered by the latest Bootstrap technology. Impress your visitors with sleek animations, a user-friendly contact form, and seamless course integration. Elevate your online presence and engage your audience like never before with SkillSwap!',
}


export default function index() {
  return (
    <Wrapper>
      <About />
    </Wrapper>
  )
}

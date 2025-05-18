
import Cart from '@/components/cart'
import React from 'react'

import type { Metadata } from 'next'
import Wrapper from '@/layouts/Wrapper'
export const metadata: Metadata = {
  title: 'Cart Edumon - Education Next JS Template',
  description: 'Transform your educational website with Edumon - the ultimate Next template thats powered by the latest Bootstrap technology. Impress your visitors with sleek animations, a user-friendly contact form, and seamless course integration. Elevate your online presence and engage your audience like never before with Edumon!',
}


export default function index() {
  return (
    <Wrapper>
      <Cart />
    </Wrapper>
  )
}

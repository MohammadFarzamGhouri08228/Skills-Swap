
"use client"
import ScrollToTop from '@/components/common/ScrollToTop'
import { animationCreate } from '@/utils/utils';
import React, { useEffect } from 'react'

export default function Wrapper({ children }: any) {

  useEffect(() => {
    // animation
    const timer = setTimeout(() => {
      animationCreate();
    }, 100);
  
    return () => clearTimeout(timer);  
  }, []);


  return (
    <>
      {children}
      <ScrollToTop />
    </>
  )
}

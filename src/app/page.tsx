'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { LampContainer } from '@/components/ui/lamp';

const fadeIn = (direction: "up" | "down" | "left" | "right" = "up", delay: number = 0) => ({
  hidden: {
    opacity: 0,
    y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
    x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
  },
  show: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      type: "spring",
      delay,
      duration: 0.8,
    },
  },
});

export default function Home() {
  return (
    <Wrapper>
      <div className="bg-red-500 text-white p-10 text-2xl mb-4">
        If this box is red, Tailwind CSS is working!
      </div>
      <HomeOne />
    </Wrapper>
  )
}
 
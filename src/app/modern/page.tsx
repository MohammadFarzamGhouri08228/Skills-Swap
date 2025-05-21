'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => mod.motion.div),
  { ssr: false }
);
const MotionInput = dynamic(
  () => import('framer-motion').then(mod => mod.motion.input),
  { ssr: false }
);
const MotionButton = dynamic(
  () => import('framer-motion').then(mod => mod.motion.button),
  { ssr: false }
);

export default function ModernLoginSignup() {
  const router = useRouter();

  useEffect(() => {
    router.push('/modern/login');
  }, [router]);

  return null;
} 
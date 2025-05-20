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

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-purple-700 to-purple-950 relative overflow-hidden">
      {/* Animated background elements */}
      <LampContainer className="fixed top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="h-full w-full bg-transparent"></div>
      </LampContainer>

      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeIn("up")}
        className="w-full max-w-xl"
      >
        <Card className="bg-gradient-to-br from-purple-800 via-purple-900 to-purple-950/90 backdrop-blur-sm border-purple-400/20 shadow-2xl">
          <div className="p-10 flex flex-col items-center">
            {/* Logo and Title */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="relative h-24 w-24 mx-auto mb-4">
                <Image
                  src="/images/logo.png"
                  alt="SkillSwap Logo"
                  width={96}
                  height={96}
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-br from-purple-300 to-purple-500 bg-clip-text text-transparent">
                SkillSwap
              </h1>
              <p className="text-purple-200 mt-2 text-lg">
                Exchange Skills. Learn Together.<br />
                Connect with like-minded people to share your skills and learn something new in return.
              </p>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              variants={fadeIn("up", 0.3)}
              initial="hidden"
              animate="show"
              className="w-full flex flex-col items-center gap-6"
            >
              <Link
                href="/login"
                className="w-full py-4 rounded-lg text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-center shadow-lg transition"
              >
                Get Started / Login
              </Link>
              <Link
                href="/signup"
                className="w-full py-4 rounded-lg text-lg font-semibold bg-gradient-to-r from-purple-200 to-purple-400 hover:from-purple-300 hover:to-purple-500 text-purple-900 text-center shadow-lg transition"
              >
                Create an Account
              </Link>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
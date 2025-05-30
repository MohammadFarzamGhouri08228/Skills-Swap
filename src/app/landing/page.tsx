'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [45, 0, 45],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left content */}
          <div className="flex-1 text-white">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Exchange Skills,<br />
              <span className="text-yellow-400">Grow Together</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Connect with others who share your passion for learning. 
              Teach what you know, learn what you don't.
            </motion.p>

            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link 
                href="/modern/signup" 
                className="px-8 py-4 bg-yellow-400 text-purple-900 rounded-full font-bold hover:bg-yellow-300 transition-colors"
              >
                Get Started
              </Link>
              <Link 
                href="/modern/login" 
                className="px-8 py-4 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-colors"
              >
                Sign In
              </Link>
            </motion.div>
          </div>

          {/* Right content - Skill exchange animation */}
          <div className="flex-1 relative h-[500px]">
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Skill exchange circles */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
                  Your Skills
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"
                animate={{
                  scale: [1.1, 1, 1.1],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-purple-900 text-2xl font-bold">
                  New Skills
                </div>
              </motion.div>

              {/* Floating skill icons */}
              {['🎨', '💻', '🎵', '📚', '🔧', '🎭'].map((icon, index) => (
                <motion.div
                  key={index}
                  className="absolute text-4xl"
                  animate={{
                    x: [
                      Math.cos(index * Math.PI / 3) * 200,
                      Math.cos((index + 0.5) * Math.PI / 3) * 200,
                      Math.cos((index + 1) * Math.PI / 3) * 200,
                    ],
                    y: [
                      Math.sin(index * Math.PI / 3) * 200,
                      Math.sin((index + 0.5) * Math.PI / 3) * 200,
                      Math.sin((index + 1) * Math.PI / 3) * 200,
                    ],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                    delay: index * 0.5,
                  }}
                >
                  {icon}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Features section */}
        <motion.div 
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            {
              title: "Find Your Match",
              description: "Connect with people who have the skills you want to learn and want to learn what you know.",
              icon: "🎯"
            },
            {
              title: "Learn & Teach",
              description: "Share your expertise and gain new knowledge through interactive skill exchange sessions.",
              icon: "🤝"
            },
            {
              title: "Grow Together",
              description: "Build meaningful connections while expanding your skill set in a supportive community.",
              icon: "🌱"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 
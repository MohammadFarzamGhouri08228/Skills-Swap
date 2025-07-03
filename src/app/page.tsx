'use client';
import React from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const skills = [
  { icon: '🎨', label: 'Design', category: 'Creative' },
  { icon: '💻', label: 'Coding', category: 'Tech' },
  { icon: '🎵', label: 'Music', category: 'Creative' },
  { icon: '📚', label: 'Tutoring', category: 'Education' },
  { icon: '🔧', label: 'DIY', category: 'Practical' },
  { icon: '🎭', label: 'Drama', category: 'Performance' },
  { icon: '📊', label: 'Analytics', category: 'Business' },
  { icon: '🍳', label: 'Cooking', category: 'Lifestyle' },
];

const chatMessages = [
  "Let's collaborate!",
  "I can teach that!",
  "Amazing skill!",
  "Ready to learn?",
  "Perfect match!",
  "Let's get started!"
];

// Minimalistic floating particles
function AdvancedParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => {
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 15 + 20;
        const delay = Math.random() * 8;
        const colors = ['255, 210, 63', '255, 145, 77', '91, 33, 182'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              background: `rgba(${color}, ${Math.random() * 0.3 + 0.1})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-30, -80, -30],
              opacity: [0, 0.6, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
}

// Enhanced 3D-looking avatar with custom colors
function ModernAvatar({ armUp = false, side = 'left' }: { armUp?: boolean; side?: 'left' | 'right' }) {
  const isLeft = side === 'left';
  
  return (
    <motion.div
      className="relative group"
      whileHover={{ scale: 1.08, y: -8 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
    >
      {/* Glow ring */}
      <motion.div
        className="absolute -inset-4 bg-gradient-to-r from-[#FFD23F]/30 to-[#FF914D]/30 rounded-full blur-xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.svg
        width="140"
        height="200"
        viewBox="0 0 140 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-2xl"
      >
        <defs>
          <linearGradient id={`avatar-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5B21B6" />
            <stop offset="50%" stopColor="#2E1065" />
            <stop offset="100%" stopColor="#5B21B6" />
          </linearGradient>
          <filter id={`avatar-glow-${side}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id={`face-${side}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD23F" />
            <stop offset="100%" stopColor="#FF914D" />
          </linearGradient>
        </defs>
        
        {/* Head with face */}
        <circle cx="70" cy="40" r="28" fill={`url(#face-${side})`} filter={`url(#avatar-glow-${side})`} />
        
        {/* Simple face features */}
        <circle cx="62" cy="35" r="2" fill="#2E1065" />
        <circle cx="78" cy="35" r="2" fill="#2E1065" />
        <path d="M 65 45 Q 70 50 75 45" stroke="#2E1065" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Body */}
        <rect x="50" y="68" width="40" height="80" rx="20" fill={`url(#avatar-${side})`} filter={`url(#avatar-glow-${side})`} />
        
        {/* Arms */}
        <rect x="20" y="80" width="18" height="55" rx="9" fill={`url(#avatar-${side})`} transform="rotate(-20 29 107)" filter={`url(#avatar-glow-${side})`} />
        
        {/* Animated arm */}
        <motion.rect
          x="102"
          y="80"
          width="18"
          height="55"
          rx="9"
          fill={`url(#avatar-${side})`}
          filter={`url(#avatar-glow-${side})`}
          animate={{
            rotate: armUp ? [0, -50, 0] : [0, 20, 0],
            y: armUp ? [0, -25, 0] : [0, 8, 0],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: 0.5, originY: 0.1 }}
        />
        
        {/* Legs */}
        <rect x="58" y="148" width="12" height="48" rx="6" fill={`url(#avatar-${side})`} filter={`url(#avatar-glow-${side})`} />
        <rect x="70" y="148" width="12" height="48" rx="6" fill={`url(#avatar-${side})`} filter={`url(#avatar-glow-${side})`} />
      </motion.svg>
      
      {/* Status indicator */}
      <motion.div
        className={`absolute top-4 ${isLeft ? 'right-4' : 'left-4'} w-4 h-4 bg-[#FFD23F] rounded-full`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

// Modern chat bubble with better styling
function EnhancedChatBubble({ message, align, skillIcon }: { message: string; align: 'left' | 'right'; skillIcon?: string }) {
  const isLeft = align === 'left';
  return (
    <motion.div
      className={`absolute top-0 ${isLeft ? 'left-[calc(20%-50px)]' : 'right-[calc(20%-50px)]'} z-20`}
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: -20 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
    >
      <div className={`relative bg-white/95 backdrop-blur-md border border-[#5B21B6]/20 rounded-2xl px-6 py-3 shadow-lg ${isLeft ? 'rounded-bl-sm' : 'rounded-br-sm'}`}>
        <div className="flex items-center gap-2">
          {skillIcon && <span className="text-lg">{skillIcon}</span>}
          <span className="text-[#2E1065] font-semibold text-sm">{message}</span>
        </div>
        
        {/* Tail */}
        <div className={`absolute top-full ${isLeft ? 'left-6' : 'right-6'} w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white/95`} />
      </div>
    </motion.div>
  );
}

// Completely redesigned skill exchange animation
function NextGenSkillExchange() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setShowChat(true);
      
      setTimeout(() => {
        setShowChat(false);
        setIsAnimating(false);
      }, 2000);
      
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % skills.length);
      }, 3500);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentSkill = skills[currentIndex];
  const isLeftToRight = currentIndex % 2 === 0;

  return (
    <div className="relative w-full h-[320px] flex items-center justify-center">
      {/* Background skill orbit */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        {skills.slice(0, 6).map((skill, index) => {
          const angle = (index * 60) * (Math.PI / 180);
          const radius = 120;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <motion.div
              key={skill.label}
              className="absolute text-3xl opacity-20"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              {skill.icon}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main skill exchange animation */}
      <AnimatePresence mode="wait">
        {isAnimating && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            key={currentIndex}
          >
            {/* Skill traveling animation */}
            <motion.div
              className="flex items-center justify-center text-7xl"
              style={{
                filter: 'drop-shadow(0 0 30px rgba(255, 210, 63, 0.8))',
              }}
              initial={{
                x: isLeftToRight ? -200 : 200,
                y: -20,
                scale: 0.5,
                rotate: isLeftToRight ? -180 : 180,
                opacity: 0,
              }}
              animate={{
                x: [isLeftToRight ? -200 : 200, 0, isLeftToRight ? 200 : -200],
                y: [-20, -60, -20],
                scale: [0.5, 1.3, 0.5],
                rotate: [isLeftToRight ? -180 : 180, 0, isLeftToRight ? 180 : -180],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.5, 1],
              }}
            >
              {currentSkill.icon}
            </motion.div>

            {/* Energy waves */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-[#FFD23F] to-[#FF914D]"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 2, 0],
                  opacity: [0, 0.6, 0],
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2 + 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat bubbles */}
      <AnimatePresence>
        {showChat && (
          <EnhancedChatBubble
            message={chatMessages[currentIndex % chatMessages.length]}
            align={isLeftToRight ? 'left' : 'right'}
            skillIcon={currentSkill.icon}
          />
        )}
      </AnimatePresence>

      {/* Connection beam */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-px h-px overflow-hidden"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <motion.div
          className="absolute h-1 bg-gradient-to-r from-transparent via-[#FFD23F] via-[#FF914D] to-transparent rounded-full"
          animate={{
            width: isAnimating ? [0, 400, 0] : 0,
            x: isAnimating ? [-200, 0, 200] : 0,
            opacity: isAnimating ? [0, 1, 0] : 0,
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}

// Skill showcase carousel
function SkillShowcase() {
  return (
    <motion.div
      className="flex gap-4 mb-8 justify-center flex-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      {skills.slice(0, 6).map((skill, index) => (
        <motion.div
          key={skill.label}
          className="bg-white/10 backdrop-blur-sm border border-[#FFD23F]/20 rounded-2xl px-4 py-2 text-white hover:bg-white/15 hover:border-[#FFD23F]/40 transition-all duration-300 cursor-pointer"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 + index * 0.1 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{skill.icon}</span>
            <span className="text-sm font-medium">{skill.label}</span>
            <span className="text-xs text-[#FFD23F] bg-[#5B21B6]/30 px-2 py-1 rounded-full">
              {skill.category}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  // State to simulate user login status
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2E1065] via-[#5B21B6] to-[#2E1065] overflow-hidden relative">
      
      {/* MINIMALISTIC IMPROVED BACKGROUND */}
      {/* Animated gradient mesh */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 20%, rgba(255, 210, 63, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 70% 80%, rgba(255, 145, 77, 0.08) 0%, transparent 50%),
            linear-gradient(45deg, rgba(91, 33, 182, 0.03) 0%, transparent 100%)
          `,
        }}
        animate={{
          background: [
            `radial-gradient(circle at 30% 20%, rgba(255, 210, 63, 0.12) 0%, transparent 45%), radial-gradient(circle at 70% 80%, rgba(255, 145, 77, 0.08) 0%, transparent 50%), linear-gradient(45deg, rgba(91, 33, 182, 0.03) 0%, transparent 100%)`,
            `radial-gradient(circle at 70% 30%, rgba(255, 210, 63, 0.08) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(255, 145, 77, 0.12) 0%, transparent 45%), linear-gradient(45deg, rgba(91, 33, 182, 0.03) 0%, transparent 100%)`,
            `radial-gradient(circle at 30% 20%, rgba(255, 210, 63, 0.12) 0%, transparent 45%), radial-gradient(circle at 70% 80%, rgba(255, 145, 77, 0.08) 0%, transparent 50%), linear-gradient(45deg, rgba(91, 33, 182, 0.03) 0%, transparent 100%)`
          ],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating geometric shapes - minimal */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 120 + Math.random() * 80,
            height: 120 + Math.random() * 80,
            background: `radial-gradient(circle, rgba(255, 210, 63, 0.06) 0%, transparent 70%)`,
            left: `${20 + i * 30}%`,
            top: `${20 + i * 25}%`,
            filter: 'blur(30px)',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 210, 63, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 210, 63, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Minimalistic particles */}
      <AdvancedParticles />

      {/* Main content */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col"
        style={{ y: y1 }}
      >
        {/* Hero header */}
        <header className="pt-16 pb-8 text-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* Main title with advanced effects */}
            <motion.h1
              className="text-8xl md:text-9xl lg:text-[12rem] font-black leading-none"
              style={{
                background: 'linear-gradient(135deg, #FFD23F 0%, #FF914D 25%, #FF686B 50%, #FFD23F 75%, #FF914D 100%)',
                backgroundSize: '400% 400%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 4px 20px rgba(255, 210, 63, 0.3))',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              SkillSwap
            </motion.h1>
            
            {/* Subtitle with modern typography */}
            <motion.div
              className="mt-6 space-y-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Exchange Skills,{' '}
                <span className="text-transparent bg-gradient-to-r from-[#FFD23F] via-[#FF914D] to-[#FF686B] bg-clip-text">
                  Transform Lives
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mt-6">
                Join a revolutionary platform where knowledge flows freely.{' '}
                <span className="text-[#FFD23F] font-semibold">
                  Master new skills while sharing your expertise.
                </span>
              </p>
            </motion.div>
          </motion.div>
        </header>

        {/* Skill showcase */}
        <div className="px-8">
          <SkillShowcase />
        </div>

        {/* Main interaction area */}
        <motion.div
          className="flex-1 flex items-center justify-center px-8"
          style={{ y: y2 }}
        >
          <div className="w-full max-w-7xl">
            {/* User interaction showcase */}
            <div className="relative flex items-center justify-between mb-16">
              {/* Left user */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <ModernAvatar armUp={false} side="left" />
                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="text-white font-bold text-xl mb-2">You</div>
                  <div className="text-[#FFD23F] text-sm bg-white/10 px-3 py-1 rounded-full">
                    Ready to Learn
                  </div>
                </motion.div>
              </motion.div>

              {/* Center animation */}
              <div className="flex-1 mx-8">
                <NextGenSkillExchange />
              </div>

              {/* Right user */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <ModernAvatar armUp={true} side="right" />
                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="text-white font-bold text-xl mb-2">Expert</div>
                  <div className="text-[#FF914D] text-sm bg-white/10 px-3 py-1 rounded-full">
                    Ready to Teach
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Call-to-action */}
            <motion.div
              className="text-center space-y-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  onClick={() => {
                    if (isLoggedIn) {
                      router.push('/dashboard');
                    } else {
                      router.push('/modern/login');
                    }
                  }}
                  className="group relative px-12 py-5 bg-gradient-to-r from-[#FFD23F] via-[#FF914D] to-[#FF686B] text-[#2E1065] rounded-2xl font-bold text-xl shadow-xl overflow-hidden transform-gpu"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {isLoggedIn ? 'Continue Your Journey' : 'Start Your Journey'}
                    <span className="text-2xl">🚀</span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#FF914D] to-[#FFD23F]"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </div>
              
              <p className="text-gray-300 text-lg">
                Join our growing community of passionate learners and educators
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced features section */}
        <motion.section
          className="mt-24 mb-16 px-8"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h3
              className="text-4xl md:text-5xl font-bold text-center text-white mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2 }}
            >
              Why Choose{' '}
              <span className="text-transparent bg-gradient-to-r from-[#FFD23F] to-[#FF914D] bg-clip-text">
                SkillSwap?
              </span>
            </motion.h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI-Powered Matching",
                  description: "Our advanced algorithm connects you with the perfect learning partners based on your skills, goals, and learning style.",
                  icon: "🧠",
                  gradient: "from-[#FFD23F] via-[#FF914D] to-[#FF686B]",
                  delay: 2.4
                },
                {
                  title: "Live Skill Sessions",
                  description: "Engage in real-time video sessions with interactive whiteboards, screen sharing, and collaborative tools.",
                  icon: "🎯",
                  gradient: "from-[#5B21B6] via-[#2E1065] to-[#5B21B6]",
                  delay: 2.6
                },
                {
                  title: "Global Community",
                  description: "Connect with passionate learners and experts from around the world in our vibrant skill-sharing ecosystem.",
                  icon: "🌍",
                  gradient: "from-[#FF686B] via-[#FF914D] to-[#FFD23F]",
                  delay: 2.8
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: feature.delay }}
                >
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-[#FFD23F]/20 rounded-3xl p-8 h-full transform-gpu transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 group-hover:border-[#FFD23F]/40">
                    {/* Feature icon */}
                    <motion.div
                      className="text-6xl mb-6 inline-block"
                      whileHover={{ 
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      {feature.icon}
                    </motion.div>
                    
                    <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-[#FFD23F] transition-colors">
                      {feature.title}
                    </h4>
                    
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                    
                    {/* Animated border */}
                    <motion.div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10`}
                      style={{ filter: 'blur(20px)' }}
                    />
                    
                    {/* Bottom accent */}
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} rounded-b-3xl`}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Mission statement section */}
        <motion.section
          className="py-16 px-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-[#FFD23F]/20 rounded-3xl p-8 md:p-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 3.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-5xl mb-6">🌱</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Our Mission
              </h3>
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                We believe that everyone has valuable knowledge to share and the capacity to learn something new. 
                SkillSwap creates a global community where education is accessible, collaborative, and empowering 
                for learners from all backgrounds.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Testimonial section */}
        <motion.section
          className="py-16 px-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.5 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="bg-white/10 backdrop-blur-2xl border border-[#FF914D]/30 rounded-3xl p-8 md:p-12"
              whileHover={{ scale: 1.02, borderColor: 'rgba(255, 145, 77, 0.5)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-6xl mb-6">🎓</div>
              <blockquote className="text-xl md:text-2xl text-white italic mb-6 leading-relaxed">
                "SkillSwap represents the future of education - peer-to-peer learning that breaks down barriers and makes knowledge accessible to everyone, regardless of their background or circumstances."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FFD23F] to-[#FF914D] rounded-full flex items-center justify-center text-[#2E1065] font-bold">
                  JN
                </div>
                <div className="text-left">
                  <div className="text-white font-semibold">Jaan Nisar</div>
                  <div className="text-gray-300 text-sm">Director, Learning Initiative Foundation</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats section */}
        <motion.section
          className="py-16 px-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.8 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {[
                { number: "10K+", label: "Active Learners", icon: "👥" },
                { number: "500+", label: "Skills Available", icon: "💡" },
                { number: "95%", label: "Satisfaction Rate", icon: "⭐" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-lg border border-[#FFD23F]/20 rounded-2xl p-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(255, 210, 63, 0.4)' }}
                >
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-[#FFD23F] to-[#FF914D] bg-clip-text mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Final CTA section */}
        <motion.section
          className="py-20 px-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 4 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h3
              className="text-4xl md:text-6xl font-bold text-white mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.2 }}
            >
              Ready to{' '}
              <span className="text-transparent bg-gradient-to-r from-[#FFD23F] via-[#FF914D] to-[#FF686B] bg-clip-text">
                Transform
              </span>{' '}
              Your Skills?
            </motion.h3>
            
            <motion.p
              className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.4 }}
            >
              Join thousands of learners who are already expanding their horizons through skill exchange. Your next breakthrough is just one swap away.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.6 }}
            >
              <motion.button
                onClick={() => {
                  if (isLoggedIn) {
                    router.push('/dashboard');
                  } else {
                    router.push('/modern/login');
                  }
                }}
                className="group relative px-16 py-6 bg-gradient-to-r from-[#FFD23F] via-[#FF914D] to-[#FF686B] text-[#2E1065] rounded-2xl font-bold text-2xl shadow-xl overflow-hidden"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {isLoggedIn ? 'Continue Your Journey' : 'Get Started Free'}
                  <motion.span
                    className="text-3xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    🎯
                  </motion.span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#FF914D] to-[#FFD23F]"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>
            
            <motion.p
              className="text-gray-400 text-sm mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 4.8 }}
            >
              No credit card required • Free forever • Join in 30 seconds
            </motion.p>
          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          className="py-12 px-8 border-t border-[#FFD23F]/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5 }}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-[#FFD23F] to-[#FF914D] bg-clip-text mb-4">
                  SkillSwap
                </div>
                <p className="text-gray-300 max-w-md">
                  Empowering global learning through skill exchange. Connect, learn, and grow with passionate individuals worldwide.
                </p>
                <div className="flex gap-4 mt-6">
                  {['📧', '🐦', '📘', '💼'].map((icon, index) => (
                    <motion.button
                      key={index}
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FFD23F]/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <span className="text-lg">{icon}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-transparent bg-gradient-to-r from-[#FFD23F] to-[#FF914D] bg-clip-text">Platform</h4>
                <ul className="space-y-2 text-white">
                  <li><a href="#" className="text-white hover:text-[#FFD23F] transition-colors">How it works</a></li>
                  <li><a href="#" className="text-white hover:text-[#FFD23F] transition-colors">Browse Skills</a></li>
                  <li><a href="#" className="text-white hover:text-[#FFD23F] transition-colors">Success Stories</a></li>
                  <li><a href="#" className="text-white hover:text-[#FFD23F] transition-colors">Pricing</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-transparent bg-gradient-to-r from-[#FFD23F] to-[#FF914D] bg-clip-text">Support</h4>
                <ul className="space-y-2 text-white">
                  <li><a href="#" className="text-white hover:text-[#FFD23F] transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-white hover:text-[#FFD23F] transition-colors">Safety</a></li>
                  <li><a href="#" className="text-white hover:text-[#FFD23F] transition-colors">Community Guidelines</a></li>
                  <li><a href="#" className="text-white hover:text-[#FFD23F] transition-colors">Contact Us</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-[#FFD23F]/10 mt-12 pt-8 text-center text-white">
              <p>&copy; 2025 SkillSwap. All rights reserved. Made with ❤️ for learners worldwide.</p>
            </div>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
}
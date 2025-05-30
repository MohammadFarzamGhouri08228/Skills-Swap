'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const skills = [
  { icon: '🎨', label: 'Design' },
  { icon: '💻', label: 'Coding' },
  { icon: '🎵', label: 'Music' },
  { icon: '📚', label: 'Tutoring' },
  { icon: '🔧', label: 'DIY' },
  { icon: '🎭', label: 'Drama' },
];

const chatMessages = [
  "Let's swap!",
  "Your turn!",
  "Thanks!",
  "Cool skill!",
  "Ready?",
  "Awesome!"
];

function StickFigurePictogram({ armUp = false }: { armUp?: boolean }) {
  return (
    <motion.svg
      width="100"
      height="160"
      viewBox="0 0 100 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 8px 20px rgba(80,80,160,0.13))' }}
      initial={false}
    >
      <defs>
        <radialGradient id="body3d" cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#6366f1" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#312e81" stopOpacity="1" />
        </radialGradient>
      </defs>
      {/* Head */}
      <circle cx="50" cy="30" r="20" fill="url(#body3d)" />
      {/* Body */}
      <rect x="40" y="50" width="20" height="60" rx="10" fill="url(#body3d)" />
      {/* Left Arm (down) */}
      <rect x="25" y="60" width="12" height="45" rx="6" fill="url(#body3d)" transform="rotate(-15 31 82)" />
      {/* Right Arm (animated up/down) */}
      <motion.rect
        x="63"
        y="60"
        width="12"
        height="45"
        rx="6"
        fill="url(#body3d)"
        animate={{
          rotate: armUp ? [0, -60, 0] : [0, 0, 0],
          y: armUp ? [0, -30, 0] : [0, 0, 0],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originX: 0.5, originY: 0.1 }}
      />
      {/* Legs */}
      <rect x="42" y="110" width="8" height="38" rx="4" fill="url(#body3d)" />
      <rect x="50" y="110" width="8" height="38" rx="4" fill="url(#body3d)" />
    </motion.svg>
  );
}

function ChatBubbleSVG({ message, align }: { message: string; align: 'left' | 'right' }) {
  const isLeft = align === 'left';
  return (
    <svg
      width="170"
      height="60"
      viewBox="0 0 170 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute ${isLeft ? 'left-[calc(25%-30px)]' : 'right-[calc(25%-30px)]'} top-0`}
      style={{ zIndex: 10, pointerEvents: 'none' }}
    >
      <rect x="10" y="10" width="140" height="36" rx="18" fill="#fff" stroke="#a78bfa" strokeWidth="2" />
      {isLeft ? (
        <polygon points="30,46 40,46 20,58" fill="#fff" stroke="#a78bfa" strokeWidth="2" />
      ) : (
        <polygon points="130,46 140,46 150,58" fill="#fff" stroke="#a78bfa" strokeWidth="2" />
      )}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="18"
        fontWeight="bold"
        fill="#6d28d9"
        style={{ fontFamily: 'inherit' }}
      >
        {message}
      </text>
    </svg>
  );
}

function SkillSwapWithChat() {
  const [index, setIndex] = React.useState(0);
  const [showChat, setShowChat] = React.useState(true);

  React.useEffect(() => {
    setShowChat(true);
    const chatTimeout = setTimeout(() => setShowChat(false), 1000);
    const swapTimeout = setTimeout(() => setIndex(i => (i + 1) % skills.length), 2600);
    return () => {
      clearTimeout(chatTimeout);
      clearTimeout(swapTimeout);
    };
  }, [index]);

  const skill = skills[index];
  const chat = chatMessages[index % chatMessages.length];
  const isLeftToRight = index % 2 === 0;
  const path = isLeftToRight
    ? [
        { x: -120, y: -40 },
        { x: 0, y: -80 },
        { x: 120, y: -40 },
      ]
    : [
        { x: 120, y: 40 },
        { x: 0, y: 80 },
        { x: -120, y: 40 },
      ];
  return (
    <>
      <motion.div
        className={`absolute top-0 w-[170px] h-[60px] ${isLeftToRight ? 'left-[calc(25%-30px)]' : 'right-[calc(25%-30px)]'}`}
        style={{ zIndex: 10, pointerEvents: 'none' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showChat ? 1 : 0, scale: showChat ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
        key={index + '-chat'}
      >
        <ChatBubbleSVG message={chat} align={isLeftToRight ? 'left' : 'right'} />
      </motion.div>
      {!showChat && (
        <motion.div
          className="absolute left-1/2 top-1/2 text-5xl drop-shadow-xl"
          style={{ zIndex: 2 }}
          key={index + '-' + isLeftToRight}
          initial={{ x: path[0].x, y: path[0].y, opacity: 0, scale: 0.7 }}
          animate={{
            x: [path[0].x, path[1].x, path[2].x],
            y: [path[0].y, path[1].y, path[2].y],
            opacity: [0, 1, 0],
            scale: [0.7, 1.2, 0.7],
          }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        >
          {skill.icon}
        </motion.div>
      )}
    </>
  );
}

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 overflow-hidden flex flex-col justify-center items-center">
      {/* Hero Section */}
      <div className="relative w-full flex flex-col items-center justify-center pt-20 pb-10">
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-6 text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Exchange Skills,<br />
          <span className="text-yellow-400">Grow Together</span>
        </motion.h1>
        <motion.p
          className="text-xl text-gray-300 mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Connect with others who share your passion for learning. <br />
          Teach what you know, learn what you don't.
        </motion.p>
        {/* Animated Skill Swap Illustration */}
        <div className="relative flex flex-row items-center justify-center w-full max-w-3xl h-[260px] mb-8">
          {/* Left User: Pictogram */}
          <div className="flex flex-col items-center">
            <StickFigurePictogram armUp={false} />
            <span className="mt-2 text-white font-semibold">You</span>
          </div>
          {/* Animated Skills Swapping with Chat */}
          <div className="relative flex-1 flex items-center justify-center h-full">
            <SkillSwapWithChat />
          </div>
          {/* Right User: Pictogram */}
          <div className="flex flex-col items-center">
            <StickFigurePictogram armUp={true} />
            <span className="mt-2 text-white font-semibold">Other</span>
          </div>
        </div>
        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-4 bg-yellow-400 text-purple-900 rounded-full font-bold hover:bg-yellow-300 transition-colors"
          >
            Get Started
          </button>
          <button
            onClick={() => router.push('/modern/login')}
            className="px-8 py-4 bg-white/10 text-white rounded-full font-bold hover:bg-white/20 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
      {/* Features section */}
      <motion.div
        className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl"
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
  );
}

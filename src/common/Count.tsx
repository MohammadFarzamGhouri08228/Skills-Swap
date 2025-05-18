"use client"
import type { FC } from 'react';
import { useEffect, useState } from 'react';

interface CountProps {
  number: number;
  text?: string;
}

const Count: FC<CountProps> = ({ number, text }) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let start = 0;
    const end = number;
    const duration = 2000; // 2 seconds
    const incrementTime = 20; // Update every 20ms
    const totalSteps = duration / incrementTime;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [number]);

  return (
    <span>
      {count}
      {text}
    </span>
  );
};

export default Count; 
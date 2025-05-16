'use client';
import Image from 'next/image';
import skillExchange1 from './images/skill-exchange1.png';
import skillExchange2 from './images/skill-exchange2.png';
import React, { useEffect, CSSProperties } from 'react';

export default function Home() {
  useEffect(() => {
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.width = '100%';
    document.documentElement.style.height = '100%';

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overflowX = 'hidden';
  }, []);

  const imageWrapperStyle: CSSProperties = {
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    maxWidth: '250px',   // max width to scale down on small screens
    width: '100%',       // responsive width
    flex: '1 1 250px',   // allow flex shrinking/growing but default 250px
  };

  const buttonStyle: CSSProperties = {
    padding: '15px 40px',
    backgroundColor: '#2ecc71',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    userSelect: 'none',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        padding: '20px',
        background: 'linear-gradient(135deg, #3498db 0%, #8e44ad 100%)',
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <header style={{ marginBottom: 40, textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: 10 }}>
          Welcome to SkillSwap
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: 600, margin: '0 auto' }}>
          Share your skills, learn from others, and connect to exchange knowledge.
        </p>
      </header>

      <div
        style={{
          display: 'flex',
          gap: 40,
          marginBottom: 40,
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '850px',
        }}
      >
        <div style={imageWrapperStyle}>
          <Image
            src={skillExchange1}
            alt="Skill Exchange 1"
            layout="responsive"
            width={skillExchange1.width}
            height={skillExchange1.height}
          />
        </div>
        <div style={imageWrapperStyle}>
          <Image
            src={skillExchange2}
            alt="Skill Exchange 2"
            layout="responsive"
            width={skillExchange2.width}
            height={skillExchange2.height}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <a href="/login" style={buttonStyle}>
          Login to SkillSwap
        </a>
      </div>
    </div>
  );
}

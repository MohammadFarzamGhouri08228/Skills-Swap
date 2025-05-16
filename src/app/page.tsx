'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.location.href = '/index.html';
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h1>Redirecting to SkillSwap Home...</h1>
      <p>If you are not redirected automatically, <a href="/index.html">click here</a>.</p>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [emailError, setEmailError] = useState('');
  const router = useRouter();

  // Dummy email login handler (replace with your backend/Firebase logic)
  const handleLogin = async () => {
    setLoading(true);
    setEmailError('');
    // TODO: Replace with your real email/password auth logic
    if (!email) {
        setEmailError('Email is required');
        setLoading(false);
        return;
    }
    if (!password) {
        setEmailError('Password is required');
        setLoading(false);
        return;
    }
    // Simulate login
    setTimeout(() => {
        setLoading(false);
        router.push('/index.html'); // Redirect to index.html after login
    }, 1000);
    };
  // Google sign-in with NextAuth
  const signInWithGoogle = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/' });
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #3498db 0%, #8e44ad 100%)',
      color: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(30,30,60,0.85)',
        borderRadius: 16,
        padding: 32,
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        minWidth: 320,
        maxWidth: 400,
        width: '100%',
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: 24, textAlign: 'center' }}>Login to SkillSwap</h1>
        {!resetMode && (
          <>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: emailError ? '1px solid #ff5252' : '1px solid #ccc',
                marginBottom: 12,
                fontSize: 16,
              }}
              disabled={loading}
            />
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: 12,
                  borderRadius: 8,
                  border: '1px solid #ccc',
                  fontSize: 16,
                }}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 12,
                  background: 'none',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer'
                }}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {emailError && (
              <div style={{ color: '#ffbaba', marginBottom: 8, fontSize: 14 }}>{emailError}</div>
            )}
            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              <button
                onClick={() => setResetMode(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffe082',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: 14,
                }}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 8,
                background: loading ? '#2ecc71aa' : '#2ecc71',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 18,
                border: 'none',
                marginBottom: 16,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '16px 0'
            }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #444' }} />
              <span style={{ margin: '0 12px', color: '#aaa' }}>or</span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #444' }} />
            </div>
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 8,
                background: '#fff',
                color: '#444',
                fontWeight: 'bold',
                fontSize: 18,
                border: 'none',
                marginBottom: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={24}
                height={24}
                style={{ marginRight: 8 }}
              />
              Sign in with Google
            </button>
          </>
        )}
        {resetMode && (
          <>
            <input
              type="email"
              placeholder="Enter your email for reset"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: '1px solid #ccc',
                marginBottom: 12,
                fontSize: 16,
              }}
              disabled={loading}
            />
            <button
              onClick={() => setResetMode(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffe082',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: 14,
                marginBottom: 16,
              }}
              disabled={loading}
            >
              Back to login
            </button>
            <button
              onClick={() => alert('Implement password reset logic')}
              disabled={loading}
              style={{
                width: '100%',
                padding: 14,
                borderRadius: 8,
                background: '#2ecc71',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 18,
                border: 'none',
                marginBottom: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              Send Reset Link
            </button>
          </>
        )}
        <p style={{ textAlign: 'center', marginTop: 16 }}>
          Don't have an account?{' '}
          <Link href="/signup" style={{ color: '#ffe082', textDecoration: 'underline' }}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
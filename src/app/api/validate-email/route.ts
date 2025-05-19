import { NextResponse } from 'next/server';
import { auth } from '@/app/firebase';
import { fetchSignInMethodsForEmail } from 'firebase/auth';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        isValid: false,
        message: 'Please enter a valid email.'
      });
    }

    // Check if email exists in Firebase
    const methods = await fetchSignInMethodsForEmail(auth, email);
    if (methods.length > 0) {
      return NextResponse.json({
        isValid: true,
        message: 'Valid Email'
      });
    }

    return NextResponse.json({
      isValid: false,
      message: 'Please enter a valid email.'
    });
  } catch (error) {
    console.error('Email validation error:', error);
    return NextResponse.json({
      isValid: false,
      message: 'Please enter a valid email.'
    }, { status: 500 });
  }
} 
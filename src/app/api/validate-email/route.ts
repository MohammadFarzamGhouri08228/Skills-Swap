import { NextResponse } from 'next/server';

const ZERUH_API_KEY = '8e3a3c3ee9da5ac747103be1181eb5b7c9b6276d0d6adce4f46454ed001e8289';
const ZERUH_API_URL = 'https://api.zeruh.com/v1/verify';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        isValid: false,
        message: 'Please enter a valid email format.'
      });
    }

    // Call Zeruh API for email validation
    const apiUrl = `${ZERUH_API_URL}?api_key=${ZERUH_API_KEY}&email_address=${encodeURIComponent(email)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('Zeruh API error:', {
        status: response.status,
        statusText: response.statusText,
        data,
        apiUrl,
      });
      return NextResponse.json({
        isValid: false,
        message: `Email validation service error: ${data.message || 'Unknown error'}`,
        details: data,
      }, { status: 500 });
    }

    // Interpret Zeruh API result
    const result = data.result;
    if (!result.validation_details.format_valid) {
      return NextResponse.json({
        isValid: false,
        message: 'Invalid email format.'
      });
    }
    if (!result.validation_details.mx_found) {
      return NextResponse.json({
        isValid: false,
        message: 'Email domain does not exist.'
      });
    }
    if (!result.validation_details.smtp_check) {
      // Allow if MX is found, but warn the user
      if (result.validation_details.mx_found) {
        return NextResponse.json({
          isValid: true,
          message: 'Email domain is valid, but the address could not be verified. Please double-check your email.',
          details: result,
          warning: true
        });
      } else {
        return NextResponse.json({
          isValid: false,
          message: 'Email address does not exist or is undeliverable.'
        });
      }
    }
    if (result.validation_details.disposable) {
      return NextResponse.json({
        isValid: false,
        message: 'Disposable email addresses are not allowed.'
      });
    }
    if (result.validation_details.role) {
      return NextResponse.json({
        isValid: false,
        message: 'Role-based email addresses are not allowed.'
      });
    }

    // If all checks pass
    return NextResponse.json({
      isValid: true,
      message: 'Valid email address.',
      details: result
    });

  } catch (error) {
    console.error('Email validation error:', error);
    return NextResponse.json({
      isValid: false,
      message: 'Error validating email. Please try again.'
    }, { status: 500 });
  }
}

import UserModel from '@/lib/models/user';
import { dbConnect } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    await dbConnect();

    // Find user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ 
        verified: false, 
        userExists: false,
        message: 'Invalid email or password.' 
      }, { status: 200 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ 
        verified: false, 
        userExists: true,
        message: 'Invalid email or password.' 
      }, { status: 200 });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return NextResponse.json({ 
        verified: false, 
        userExists: true,
        credentialsValid: true,
        message: 'Please verify your email before logging in.',
        email: user.email
      }, { status: 200 });
    }

    return NextResponse.json({ 
      verified: true, 
      userExists: true,
      credentialsValid: true,
      message: 'Email is verified. You can proceed with login.'
    }, { status: 200 });

  } catch (error) {
    console.error('Check verification error:', error);
    return NextResponse.json({ message: 'An error occurred.' }, { status: 500 });
  }
}

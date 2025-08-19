import UserModel from '@/lib/models/user';
import { dbConnect } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required.' }, { status: 400 });
    }

    await dbConnect();

    // Find user with the email
    const user = await UserModel.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ message: 'Email is already verified.' }, { status: 400 });
    }

    // Check if OTP exists and is not expired
    if (!user.otp || !user.otpExpires) {
      return NextResponse.json({ message: 'No OTP found. Please request a new one.' }, { status: 400 });
    }

    if (new Date() > user.otpExpires) {
      return NextResponse.json({ message: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return NextResponse.json({ message: 'Invalid OTP. Please try again.' }, { status: 400 });
    }

    // Mark email as verified and clear OTP fields
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return NextResponse.json({ 
      message: 'Email verified successfully. You can now log in.',
      success: true 
    }, { status: 200 });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ message: 'An error occurred during verification.' }, { status: 500 });
  }
}

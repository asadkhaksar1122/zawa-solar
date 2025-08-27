
import UserModel from '@/lib/models/user';
import { dbConnect } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { sendOTPEmail, generateOTP } from '@/lib/email';
import { WebsiteSettings } from '@/lib/models/websiteSettings';

export async function POST(request: Request) {
  try {
    const { fullName, email, password } = await request.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    await dbConnect();

    // Check if registration is enabled
    const settings = await WebsiteSettings.findOne({ isActive: true });
    if (settings && !settings.system.enableRegistration) {
      return NextResponse.json({ 
        message: 'Registration is currently disabled. Please contact the administrator.' 
      }, { status: 403 });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser && existingUser.isEmailVerified) {
      return NextResponse.json({ message: 'User already exists with this email.' }, { status: 400 });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    if (existingUser && !existingUser.isEmailVerified) {
      // Update existing unverified user
      existingUser.name = fullName;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();
    } else {
      // Create new user
      const newUser = new UserModel({
        name: fullName,
        email: email,
        password: hashedPassword,
        isEmailVerified: false,
        otp: otp,
        otpExpires: otpExpires,
      });
      await newUser.save();
    }

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, fullName);

    if (!emailResult.success) {
      return NextResponse.json({ message: 'Failed to send verification email. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Registration initiated. Please check your email for the verification code.',
      email: email
    }, { status: 200 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'An error occurred during registration.' }, { status: 500 });
  }
}

import UserModel from '@/lib/models/user';
import { dbConnect } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { sendPasswordResetEmail, generateResetToken } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    await dbConnect();

    // Find user with the email
    const user = await UserModel.findOne({ email });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: 'If an account with that email exists, we have sent a password reset link.',
        success: true
      }, { status: 200 });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Update user with reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(email, resetToken, user.name);

    if (!emailResult.success) {
      return NextResponse.json({ message: 'Failed to send password reset email. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'If an account with that email exists, we have sent a password reset link.',
      success: true
    }, { status: 200 });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ message: 'An error occurred while processing your request.' }, { status: 500 });
  }
}

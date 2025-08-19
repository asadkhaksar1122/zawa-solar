import UserModel from '@/lib/models/user';
import { dbConnect } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ message: 'Token and password are required.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    await dbConnect();

    // Find user with the reset token
    const user = await UserModel.findOne({ 
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() } // Token not expired
    });
    
    if (!user) {
      return NextResponse.json({ message: 'Invalid or expired reset token.' }, { status: 400 });
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({ 
      message: 'Password has been reset successfully. You can now log in with your new password.',
      success: true 
    }, { status: 200 });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ message: 'An error occurred while resetting your password.' }, { status: 500 });
  }
}

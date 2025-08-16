import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import UserModel from '@/lib/models/user';
import { dbConnect } from '@/lib/mongodb';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // Parse request body
    const { newName, password } = await request.json();

    // Validate input
    if (!newName || !password) {
      return NextResponse.json(
        { message: 'Name and password are required.' },
        { status: 400 }
      );
    }

    if (newName.trim().length < 2) {
      return NextResponse.json(
        { message: 'Name must be at least 2 characters long.' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the user by email
    const user = await UserModel.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      );
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid password. Please check your password and try again.' },
        { status: 400 }
      );
    }

    // Update the user's name
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      { name: newName.trim() },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: 'Failed to update name.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Name updated successfully.',
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error updating user name:', error);
    return NextResponse.json(
      { message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

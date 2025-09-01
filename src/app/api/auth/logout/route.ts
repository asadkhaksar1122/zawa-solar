import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/mongodb';
import SessionModel from '@/lib/models/session';
import UserModel from '@/lib/models/user';

// This endpoint handles user logout
export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'No active session found.' },
        { status: 400 }
      );
    }

    // Get the session ID from the request body
    const { sessionId } = await request.json();
    const currentSessionId = (session.user as any).sessionId;
    
    // If no sessionId is provided, use the current session ID
    const targetSessionId = sessionId || currentSessionId;

    if (!targetSessionId) {
      return NextResponse.json(
        { message: 'No session ID available.' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the user
    const user = await UserModel.findOne({ email: (session.user as any).email });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found.' },
        { status: 404 }
      );
    }

    // Remove the session from the user's sessions array
    user.sessions = user.sessions.filter(
      (s: any) => s.toString() !== targetSessionId.toString()
    );
    await user.save();

    // Delete the session from the sessions collection
    await SessionModel.findByIdAndDelete(targetSessionId);

    // Return success response
    return NextResponse.json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { message: 'Failed to process logout.' },
      { status: 500 }
    );
  }
}
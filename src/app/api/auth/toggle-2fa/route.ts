import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import { dbConnect } from '@/lib/mongodb';
import UserModel from '@/lib/models/user';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { enabled } = await request.json();

    await dbConnect();

    // Update the current admin user's 2FA setting
    const user = await UserModel.findOne({ email: (session.user as any).email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    user.twoFactorEnabled = enabled;
    await user.save();

    return NextResponse.json({ 
      message: `Two-factor authentication ${enabled ? 'enabled' : 'disabled'} successfully`,
      twoFactorEnabled: enabled
    });
  } catch (error) {
    console.error('Toggle 2FA error:', error);
    return NextResponse.json({ error: 'Failed to update 2FA setting' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { seedColorThemes, resetAndSeedColorThemes } from '@/lib/seeders/colorThemes';

// POST - Seed default color themes
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Only allow admins to seed themes
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reset = searchParams.get('reset') === 'true';

    let result;
    if (reset) {
      result = await resetAndSeedColorThemes();
    } else {
      result = await seedColorThemes();
    }

    if (result.success) {
      return NextResponse.json({
        message: result.message,
        themes: 'themes' in result ? result.themes || [] : [],
        existingCount: 'existingCount' in result ? result.existingCount || 0 : 0
      }, { status: 200 });
    } else {
      return NextResponse.json({
        message: result.message,
        error: result.error
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error in seed color themes API:', error);
    return NextResponse.json(
      { message: 'Failed to seed color themes', error: error.message },
      { status: 500 }
    );
  }
}
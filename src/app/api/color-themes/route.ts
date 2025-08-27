import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/mongodb';
import { ColorTheme } from '@/lib/models/colorTheme';
import { z } from 'zod';

// Validation schema for color theme
const colorThemeSchema = z.object({
  name: z.string().min(1, 'Theme name is required').max(50, 'Theme name must be less than 50 characters'),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color'),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Please enter a valid hex color'),
});

// GET - Fetch all color themes
export async function GET() {
  try {
    await dbConnect();

    // Get all color themes, sorted by creation date
    const themes = await ColorTheme.find({})
      .sort({ isDefault: -1, createdAt: -1 })
      .select('name primaryColor secondaryColor accentColor isDefault createdBy createdAt');

    return NextResponse.json({ themes }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching color themes:', error);
    return NextResponse.json(
      { message: 'Failed to fetch color themes', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new color theme
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate the request body
    const validatedData = colorThemeSchema.parse(body);

    await dbConnect();

    // Check if theme name already exists
    const existingTheme = await ColorTheme.findOne({ 
      name: { $regex: new RegExp(`^${validatedData.name}$`, 'i') }
    });

    if (existingTheme) {
      return NextResponse.json(
        { message: 'A theme with this name already exists' },
        { status: 400 }
      );
    }

    // Create new color theme
    const newTheme = new ColorTheme({
      ...validatedData,
      createdBy: session.user.email || session.user.name || 'Unknown',
    });

    const savedTheme = await newTheme.save();

    return NextResponse.json({
      message: 'Color theme created successfully',
      theme: savedTheme
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating color theme:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return NextResponse.json(
        { message: 'Validation failed', errors: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to create color theme', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete color theme
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('id');

    if (!themeId) {
      return NextResponse.json(
        { message: 'Theme ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the theme
    const theme = await ColorTheme.findById(themeId);
    
    if (!theme) {
      return NextResponse.json(
        { message: 'Color theme not found' },
        { status: 404 }
      );
    }

    // Prevent deletion of default themes
    if (theme.isDefault) {
      return NextResponse.json(
        { message: 'Cannot delete default themes' },
        { status: 400 }
      );
    }

    // Delete the theme
    await ColorTheme.findByIdAndDelete(themeId);

    return NextResponse.json({
      message: 'Color theme deleted successfully'
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error deleting color theme:', error);
    return NextResponse.json(
      { message: 'Failed to delete color theme', error: error.message },
      { status: 500 }
    );
  }
}
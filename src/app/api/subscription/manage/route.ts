import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect } from '@/lib/mongodb';
import SubscriptionModel from '@/lib/models/subscription';
import mongoose from 'mongoose';

// Validation schemas
const updateSubscriptionSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  isActive: z.boolean(),
});

const deleteSubscriptionSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

// GET - Get all subscriptions with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
        mongoose.connection.once('connected', () => {
          clearTimeout(timeout);
          resolve(true);
        });
      });
    }

    const { searchParams } = new URL(request.url);
    
    // Validate and parse query parameters
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const statusParam = searchParams.get('status');
    const searchParam = searchParams.get('search');

    const page = Math.max(1, parseInt(pageParam || '1') || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitParam || '10') || 10));
    const status = ['all', 'active', 'inactive'].includes(statusParam || '') ? statusParam : 'all';
    const search = searchParam?.trim() || '';

    // Build query
    let query: any = {};
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    // Get total count for pagination
    const total = await SubscriptionModel.countDocuments(query);
    
    // Calculate pagination
    const pages = Math.ceil(total / limit);
    const skip = Math.max(0, (page - 1) * limit);
    
    // Get subscriptions with pagination
    const subscriptions = await SubscriptionModel.find(query)
      .sort({ subscribedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('email isActive subscribedAt unsubscribedAt source ipAddress')
      .lean(); // Use lean() for better performance

    return NextResponse.json({
      success: true,
      data: subscriptions,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to retrieve subscriptions.' 
      },
      { status: 500 }
    );
  }
}

// PUT - Update subscription status
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
        mongoose.connection.once('connected', () => {
          clearTimeout(timeout);
          resolve(true);
        });
      });
    }

    const body = await request.json();
    const validatedData = updateSubscriptionSchema.parse(body);

    const subscription = await SubscriptionModel.findById(validatedData.id);
    
    if (!subscription) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Subscription not found.' 
        },
        { status: 404 }
      );
    }

    // Update subscription status
    if (validatedData.isActive && !subscription.isActive) {
      // Reactivate subscription
      subscription.isActive = true;
      subscription.unsubscribedAt = undefined;
    } else if (!validatedData.isActive && subscription.isActive) {
      // Deactivate subscription
      subscription.isActive = false;
      subscription.unsubscribedAt = new Date();
    }

    // Save the updated subscription
    const updatedSubscription = await subscription.save();

    return NextResponse.json({
      success: true,
      message: `Subscription ${validatedData.isActive ? 'activated' : 'deactivated'} successfully.`,
      data: updatedSubscription
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.errors[0].message 
        },
        { status: 400 }
      );
    }

    console.error('Update subscription error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to update subscription.' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete subscription permanently
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
        mongoose.connection.once('connected', () => {
          clearTimeout(timeout);
          resolve(true);
        });
      });
    }

    const body = await request.json();
    const validatedData = deleteSubscriptionSchema.parse(body);

    const subscription = await SubscriptionModel.findByIdAndDelete(validatedData.id);
    
    if (!subscription) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Subscription not found.' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription deleted successfully.',
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.errors[0].message 
        },
        { status: 400 }
      );
    }

    console.error('Delete subscription error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to delete subscription.' 
      },
      { status: 500 }
    );
  }
}
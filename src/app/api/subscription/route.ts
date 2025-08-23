import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect } from '@/lib/mongodb';
import SubscriptionModel from '@/lib/models/subscription';
import mongoose from 'mongoose';

// Validation schema for subscription
const subscriptionSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

// Helper function to get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const remoteAddr = request.headers.get('remote-addr');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (remoteAddr) {
    return remoteAddr;
  }
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Ensure connection is ready
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

    // Validate the request body
    const validatedData = subscriptionSchema.parse(body);

    // Check if email is already subscribed and active
    const existingSubscription = await SubscriptionModel.findOne({
      email: validatedData.email.toLowerCase()
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return NextResponse.json(
          {
            success: false,
            message: 'This email is already subscribed to our newsletter.'
          },
          { status: 400 }
        );
      } else {
        // Reactivate existing subscription
        existingSubscription.isActive = true;
        existingSubscription.unsubscribedAt = undefined;
        await existingSubscription.save();

        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.'
        });
      }
    }

    // Get client information
    const ipAddress = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create new subscription
    const newSubscription = new SubscriptionModel({
      email: validatedData.email.toLowerCase(),
      source: 'footer',
      ipAddress,
      userAgent,
    });

    await newSubscription.save();

    // TODO: In a production application, you might want to:
    // 1. Send welcome email
    // 2. Add to email marketing service (like Mailchimp, SendGrid, etc.)
    // 3. Log the subscription event

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! You will receive updates about solar energy solutions.'
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

    // Handle MongoDB duplicate key error
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'This email is already subscribed to our newsletter.'
        },
        { status: 400 }
      );
    }

    console.error('Subscription error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again later.'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to database
    await dbConnect();

    // Ensure connection is ready
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
        mongoose.connection.once('connected', () => {
          clearTimeout(timeout);
          resolve(true);
        });
      });
    }

    // Get subscription statistics
    const stats = await SubscriptionModel.getSubscriptionStats();
    const recentSubscriptions = await SubscriptionModel.getRecentSubscriptions(10);

    const totalSubscriptions = stats[0]?.totalSubscriptions || 0;
    const activeSubscriptions = stats[0]?.activeSubscriptions || 0;
    const inactiveSubscriptions = stats[0]?.inactiveSubscriptions || 0;

    return NextResponse.json({
      totalSubscriptions,
      activeSubscriptions,
      inactiveSubscriptions,
      recentSubscriptions: recentSubscriptions.map((sub: { email: string; subscribedAt: Date; source: string }) => ({
        email: sub.email,
        subscribedAt: sub.subscribedAt,
        source: sub.source
      }))
    });

  } catch (error) {
    console.error('Get subscription stats error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to retrieve subscription statistics.'
      },
      { status: 500 }
    );
  }
}
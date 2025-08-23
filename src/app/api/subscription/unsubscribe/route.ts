import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect } from '@/lib/mongodb';
import SubscriptionModel from '@/lib/models/subscription';
import mongoose from 'mongoose';

// Validation schema for unsubscribe
const unsubscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

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
    const validatedData = unsubscribeSchema.parse(body);
    
    // Find the subscription
    const subscription = await SubscriptionModel.findOne({ 
      email: validatedData.email.toLowerCase() 
    });
    
    if (!subscription) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email address not found in our subscription list.' 
        },
        { status: 404 }
      );
    }
    
    if (!subscription.isActive) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'This email is already unsubscribed.' 
        },
        { status: 400 }
      );
    }
    
    // Unsubscribe the user
    subscription.isActive = false;
    subscription.unsubscribedAt = new Date();
    await subscription.save();
    
    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter.'
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
    
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Something went wrong. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// GET method to handle unsubscribe links (common in email newsletters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email parameter is required.' 
        },
        { status: 400 }
      );
    }

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

    // Validate email format
    const validatedData = unsubscribeSchema.parse({ email });
    
    // Find and unsubscribe
    const subscription = await SubscriptionModel.findOne({ 
      email: validatedData.email.toLowerCase() 
    });
    
    if (!subscription) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Email address not found in our subscription list.' 
        },
        { status: 404 }
      );
    }
    
    if (!subscription.isActive) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'This email is already unsubscribed.' 
        }
      );
    }
    
    // Unsubscribe the user
    subscription.isActive = false;
    subscription.unsubscribedAt = new Date();
    await subscription.save();
    
    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter.'
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
    
    console.error('Unsubscribe error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Something went wrong. Please try again later.' 
      },
      { status: 500 }
    );
  }
}
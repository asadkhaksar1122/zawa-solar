import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { dbConnect } from '@/lib/mongodb';
import SubscriptionModel from '@/lib/models/subscription';
import mongoose from 'mongoose';

// Validation schema for admin add subscription
const adminAddSubscriptionSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  source: z.enum(['footer', 'popup', 'landing', 'admin']).default('admin'),
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
    const validatedData = adminAddSubscriptionSchema.parse(body);
    
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
          message: 'Subscription reactivated successfully!'
        });
      }
    }
    
    // Create new subscription
    const newSubscription = new SubscriptionModel({
      email: validatedData.email.toLowerCase(),
      source: validatedData.source,
      ipAddress: 'admin-added',
      userAgent: 'admin-panel',
    });
    
    await newSubscription.save();
    
    return NextResponse.json({
      success: true,
      message: 'Subscription added successfully!'
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
    
    console.error('Admin add subscription error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Something went wrong. Please try again later.' 
      },
      { status: 500 }
    );
  }
}
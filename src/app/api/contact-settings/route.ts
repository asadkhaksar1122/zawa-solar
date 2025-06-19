import { NextResponse } from 'next/server';
import mongoose, { Types } from 'mongoose';
import type { ContactSettings as contacttype } from '@/lib/types';
import { dbConnect } from '@/lib/mongodb';
import { ContactSettings } from '@/lib/models/contactsetting';
// Adjust path if different


export async function GET() {
  await dbConnect();

  // In a real app, you'd fetch this from a database
  // For this prototype, we're serving the in-memory mock data
  const contactsettingdata = await ContactSettings.find();
  return NextResponse.json<any>(contactsettingdata);
}

// Make sure you have this connection utility

export async function POST(request: Request) {
  try {
    await dbConnect(); // Ensure DB connection

    const body = await request.json();

    const {
      whatsappNumbers,
      emailAddresses,
      phoneNumbers,
      facebookUrl,
      officeAddress
    } = body;

    const newContactSettings = new ContactSettings({
      whatsappNumbers,
      emailAddresses,
      phoneNumbers,
      facebookUrl,
      officeAddress
    });

    const savedData = await newContactSettings.save();

    return NextResponse.json(savedData, { status: 201 });
  } catch (error: any) {
    console.error('Error saving contact settings:', error);
    return NextResponse.json(
      { message: 'Failed to save contact settings', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
      });
    } // Ensure DB connection

    const body = await request.json();
    const {
      id, // Make sure the client includes this
      whatsappNumbers,
      emailAddresses,
      phoneNumbers,
      facebookUrl,
      officeAddress
    } = body;

    // Validate ID
    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid or missing ID for update' },
        { status: 400 }
      );
    }

    // Find and update the document
    const updatedData = await ContactSettings.findByIdAndUpdate(
      id,
      {
        whatsappNumbers,
        emailAddresses,
        phoneNumbers,
        facebookUrl,
        officeAddress
      },
      { new: true } // Return the updated document
    );

    if (!updatedData) {
      return NextResponse.json(
        { message: 'Contact settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedData, { status: 200 });
  } catch (error: any) {
    console.error('Error updating contact settings:', error);
    return NextResponse.json(
      { message: 'Failed to update contact settings', error: error.message },
      { status: 500 }
    );
  }
}
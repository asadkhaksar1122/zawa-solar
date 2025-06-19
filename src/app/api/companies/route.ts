
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Company } from '@/lib/models/company';
import mongoose from 'mongoose';
export async function GET() {
  await dbConnect();

  // Wait for connection to be ready
  if (mongoose.connection.readyState !== 1) {
    await new Promise((resolve) => {
      mongoose.connection.once('connected', resolve);
    });
  }

  let companies = await Company.find();
  return NextResponse.json<any[]>(companies);
}


export async function POST(request: NextRequest) {
  try {
    const { name }: { name: string } = await request.json();
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
      });
    }// Ensure database connection is established
    let company = new Company({ name })
    let savedcompany = await company.save()
    return NextResponse.json({ message: "company has been added" }, { status: 200 })
    // Here you would typically save the new company to the database
    // For now, we're just returning the new company as a response

  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
export async function PUT(request: NextRequest) {
  try {
    const { name, _id } = await request.json()

    const updatedcompany = await Company.findByIdAndUpdate(_id, { name })
    return NextResponse.json({ message: "company has been updated" }, { status: 200 })

  } catch (error) {
    NextResponse.json({ message: "internel Server error" }, { status: 500 })
  }
}
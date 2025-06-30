
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Company } from '@/lib/models/company';
import mongoose from 'mongoose';

export async function GET() {
  try {
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
    
    const companies = await Company.find();
    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
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
    
    const { name }: { name: string } = await request.json();
    const company = new Company({ name });
    await company.save();
    return NextResponse.json({ message: "company has been added" }, { status: 200 });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
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
    
    const { name, _id } = await request.json();
    await Company.findByIdAndUpdate(_id, { name });
    return NextResponse.json({ message: "company has been updated" }, { status: 200 });
  } catch (error) {
    console.error('Error updating company:', error);
    return NextResponse.json({ message: "internal server error" }, { status: 500 });
  }
}
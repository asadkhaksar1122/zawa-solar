
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { SolarSolution } from '@/lib/models/solution';
import mongoose from 'mongoose';

export async function GET() {
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
    
    const allsolution = await SolarSolution.find();
    return NextResponse.json(allsolution);
  } catch (error) {
    console.error('Error fetching solutions:', error);
    return NextResponse.json({ error: 'Failed to fetch solutions' }, { status: 500 });
  }
}
export async function POST(request: Request) {
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
    
    const { name, company, description, imageUrl, powerOutput, efficiency, features, warranty, companyId } = await request.json();

    const newSolution = new SolarSolution({
      name,
      company,
      description,
      imageUrl,
      powerOutput,
      companyId,
      efficiency,
      features,
      warranty
    });

    const savedSolution = await newSolution.save();
    return NextResponse.json({ message: "Solar solution has been added", solution: savedSolution });
  } catch (error) {
    console.error('Error creating solar solution:', error);
    return NextResponse.json({ error: 'Failed to create solar solution', message: (error as Error).message || "unknown error" }, { status: 500 });
  }
}
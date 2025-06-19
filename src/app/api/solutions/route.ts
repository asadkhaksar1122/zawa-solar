
import { NextResponse } from 'next/server';
import { solarSolutions } from '@/lib/data';

import { dbConnect } from '@/lib/mongodb';
import { SolarSolution } from '@/lib/models/solution';
import mongoose from 'mongoose';

export async function GET() {

  if (mongoose.connection.readyState !== 1) {
    await new Promise((resolve) => {
      mongoose.connection.once('connected', resolve);
    });
  }
  let allsolution = await SolarSolution.find()
  // In a real app, you might fetch this from a database
  // For now, we're serving the mock data
  return NextResponse.json<any[]>(allsolution);
}
export async function POST(request: Request) {
  try {
    const { name, company, description, imageUrl, powerOutput, efficiency, features, warranty, companyId } = await request.json();

    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
      });
    }

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

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { SolarSolution } from '@/lib/models/solution';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
      });
    }

    const solution = await SolarSolution.findById(id);

    if (solution) {
      return NextResponse.json(solution);
    } else {
      return NextResponse.json({ message: 'Solution not found' }, { status: 404 });
    }
  } catch (error: unknown) {
    console.error('Error fetching solution:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate required fields (you can add more validation as needed)
    if (!body.name || !body.companyId || !body.description) {
      return NextResponse.json(
        { message: 'Missing required fields: name, companyId, and description are required' },
        { status: 400 }
      );
    }

    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
      });
    }

    // Check if solution exists
    const existingSolution = await SolarSolution.findById(id);
    if (!existingSolution) {
      return NextResponse.json({ message: 'Solution not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData = {
      name: body.name,
      company: body.company,
      companyId: body.companyId,
      description: body.description,
      ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
      ...(body.powerOutput !== undefined && { powerOutput: body.powerOutput }),
      ...(body.efficiency !== undefined && { efficiency: body.efficiency }),
      ...(body.features !== undefined && { features: body.features }),
      ...(body.warranty !== undefined && { warranty: body.warranty }),
    };

    // Update the solution
    const updatedSolution = await SolarSolution.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true // Run mongoose validators
      }
    );

    if (!updatedSolution) {
      return NextResponse.json({ message: 'Failed to update solution' }, { status: 500 });
    }

    return NextResponse.json(updatedSolution);

  } catch (error: unknown) {
    console.error('Error updating solution:', error);

    // Handle specific mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: 'Validation Error', errors: validationErrors },
        { status: 400 }
      );
    }

    // Handle mongoose cast errors (invalid ObjectId)
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json(
        { message: 'Invalid solution ID format' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}


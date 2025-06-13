
import { NextResponse } from 'next/server';
import { solarSolutions } from '@/lib/data';
import type { SolarSolution } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params; // This 'id' is the route parameter value
  const solution = solarSolutions.find((s) => s._id === id);

  if (solution) {
    return NextResponse.json<SolarSolution>(solution);
  } else {
    return NextResponse.json({ message: 'Solution not found' }, { status: 404 });
  }
}

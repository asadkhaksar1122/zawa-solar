
import { NextResponse } from 'next/server';
import { companies } from '@/lib/data';
import type { Company } from '@/lib/types';

export async function GET() {
  // In a real app, you might fetch this from a database
  // For now, we're serving the mock data
  return NextResponse.json<Company[]>(companies);
}

import { NextResponse } from 'next/server';
import { contactSettingsData } from '@/lib/data';
import type { ContactSettings } from '@/lib/types';

export async function GET() {
  // In a real app, you'd fetch this from a database
  // For this prototype, we're serving the in-memory mock data
  return NextResponse.json<ContactSettings>(contactSettingsData);
}

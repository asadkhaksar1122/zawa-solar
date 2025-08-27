import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { WebsiteSettings } from '@/lib/models/websiteSettings';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const settings = await WebsiteSettings.findOneAndUpdate(
      { isActive: true },
      {
        $set: {
          'emailConfig.smtpHost': 'smtp.gmail.com',
          'emailConfig.smtpPort': 587,
          'emailConfig.smtpSecure': false,
          'emailConfig.smtpUser': 'zawasoler@gmail.com',
          'emailConfig.fromEmail': 'zawasoler@gmail.com',
          'emailConfig.fromName': 'Zawa Solar Energy',
        }
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ 
      message: 'Email configuration seeded successfully',
      emailConfig: settings.emailConfig
    });
  } catch (error) {
    console.error('Seed email config error:', error);
    return NextResponse.json({ error: 'Failed to seed email configuration' }, { status: 500 });
  }
}
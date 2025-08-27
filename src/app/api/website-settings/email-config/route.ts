import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { dbConnect } from '@/lib/mongodb';
import { WebsiteSettings } from '@/lib/models/websiteSettings';
import { EnvManager, EMAIL_ENV_KEYS } from '@/lib/env-manager';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { smtpHost, smtpPort, smtpSecure, smtpUser, smtpPassword, fromEmail, fromName } = await request.json();

    await dbConnect();

    // Update database configuration (without password)
    const settings = await WebsiteSettings.findOneAndUpdate(
      { isActive: true },
      {
        $set: {
          'emailConfig.smtpHost': smtpHost,
          'emailConfig.smtpPort': smtpPort,
          'emailConfig.smtpSecure': smtpSecure,
          'emailConfig.smtpUser': smtpUser,
          'emailConfig.fromEmail': fromEmail,
          'emailConfig.fromName': fromName,
        }
      },
      { new: true, upsert: true }
    );

    // Store password securely in environment variables
    if (smtpPassword) {
      EnvManager.updateEnvVariable(EMAIL_ENV_KEYS.SMTP_PASSWORD, smtpPassword);
    }

    return NextResponse.json({ 
      message: 'Email configuration updated successfully',
      emailConfig: settings.emailConfig
    });
  } catch (error) {
    console.error('Update email config error:', error);
    return NextResponse.json({ error: 'Failed to update email configuration' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const settings = await WebsiteSettings.findOne({ isActive: true });
    
    const passwordConfigured = EnvManager.hasEnvVariable(EMAIL_ENV_KEYS.SMTP_PASSWORD);

    return NextResponse.json({ 
      emailConfig: {
        ...settings?.emailConfig,
        passwordConfigured
      }
    });
  } catch (error) {
    console.error('Get email config error:', error);
    return NextResponse.json({ error: 'Failed to get email configuration' }, { status: 500 });
  }
}
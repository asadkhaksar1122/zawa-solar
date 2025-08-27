import nodemailer from 'nodemailer';
import { dbConnect } from '@/lib/mongodb';
import { WebsiteSettings } from '@/lib/models/websiteSettings';
import { EnvManager, EMAIL_ENV_KEYS } from '@/lib/env-manager';
import type { EmailConfig } from '@/lib/types';

// Get email configuration from database and environment variables
async function getEmailConfig(): Promise<EmailConfig & { smtpPassword: string } | null> {
  try {
    await dbConnect();
    const settings = await WebsiteSettings.findOne({ isActive: true });
    
    if (!settings?.emailConfig) {
      return null;
    }

    // Get password from environment variables
    const smtpPassword = process.env.EMAIL_SMTP_PASSWORD;
    
    if (!smtpPassword) {
      console.warn('SMTP password not found in environment variables');
      return null;
    }
    
    console.log('Email config loaded from database:', {
      host: settings.emailConfig.smtpHost,
      port: settings.emailConfig.smtpPort,
      user: settings.emailConfig.smtpUser
    });

    return {
      ...settings.emailConfig,
      smtpPassword,
    };
  } catch (error) {
    console.error('Failed to get email config:', error);
    return null;
  }
}

// Get site information
async function getSiteInfo() {
  try {
    await dbConnect();
    const settings = await WebsiteSettings.findOne({ isActive: true });
    return {
      siteName: settings?.siteName || 'Zawa Soler Energy',
      siteUrl: settings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    };
  } catch (error) {
    console.error('Failed to get site info:', error);
    return {
      siteName: 'Zawa Soler Energy',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    };
  }
}

// Create transporter with dynamic configuration
async function createTransporter() {
  const emailConfig = await getEmailConfig();
  
  // Fallback to environment variables if no database config
  if (!emailConfig) {
    console.warn('No email configuration found in database, falling back to environment variables');
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Use database configuration with environment password
  const config = {
    host: emailConfig.smtpHost || 'smtp.gmail.com',
    port: emailConfig.smtpPort || 587,
    secure: emailConfig.smtpSecure || false,
    auth: {
      user: emailConfig.smtpUser || 'zawasoler@gmail.com',
      pass: emailConfig.smtpPassword || process.env.EMAIL_SMTP_PASSWORD
    },
    tls: {
      rejectUnauthorized: false,
    },
  };
  
  console.log('Final transporter config:', config);
  return nodemailer.createTransport(config);
}

// Get sender information
async function getSenderInfo() {
  const emailConfig = await getEmailConfig();
  
  if (!emailConfig) {
    return {
      fromEmail: 'zawasoler@gmail.com',
      fromName: 'Zawa Solar Energy',
    };
  }

  return {
    fromEmail: emailConfig.fromEmail,
    fromName: emailConfig.fromName,
  };
}

export async function sendOTPEmail(email: string, otp: string, name: string) {
  const transporter = await createTransporter();
  const senderInfo = await getSenderInfo();
  const siteInfo = await getSiteInfo();

  const mailOptions = {
    from: `${senderInfo.fromName} <${senderInfo.fromEmail}>`,
    to: email,
    subject: `Email Verification - ${siteInfo.siteName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #333; margin-bottom: 20px;">Welcome to ${siteInfo.siteName}!</h1>
          <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
            Hi ${name}, please verify your email address to complete your registration.
          </p>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px dashed #007bff;">
            <h2 style="color: #007bff; margin: 0; font-size: 32px; letter-spacing: 8px;">
              ${otp}
            </h2>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This OTP will expire in 10 minutes. If you didn't request this verification, please ignore this email.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              © 2024 ${siteInfo.siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string, name: string) {
  const transporter = await createTransporter();
  const senderInfo = await getSenderInfo();
  const siteInfo = await getSiteInfo();
  
  const resetUrl = `${siteInfo.siteUrl}/auth/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `${senderInfo.fromName} <${senderInfo.fromEmail}>`,
    to: email,
    subject: `Password Reset - ${siteInfo.siteName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #333; margin-bottom: 20px;">Password Reset Request</h1>
          <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
            Hi ${name}, we received a request to reset your password for your ${siteInfo.siteName} account.
          </p>

          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #333; margin-bottom: 20px;">
              Click the button below to reset your password:
            </p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
          </p>

          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <span style="word-break: break-all;">${resetUrl}</span>
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              © 2024 ${siteInfo.siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Password reset email sending error:', error);
    return { success: false, error };
  }
}

// Generic email sending function for custom emails
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}) {
  const transporter = await createTransporter();
  const senderInfo = await getSenderInfo();

  const mailOptions = {
    from: `${senderInfo.fromName} <${senderInfo.fromEmail}>`,
    to,
    subject,
    html,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

// Send welcome email to new users
export async function sendWelcomeEmail(email: string, name: string) {
  const siteInfo = await getSiteInfo();

  return await sendEmail({
    to: email,
    subject: `Welcome to ${siteInfo.siteName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #333; margin-bottom: 20px;">Welcome to ${siteInfo.siteName}!</h1>
          <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
            Hi ${name}, thank you for joining our community! We're excited to have you on board.
          </p>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #333; margin-bottom: 20px;">
              Get started by exploring our solar solutions:
            </p>
            <a href="${siteInfo.siteUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Explore Solutions
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you have any questions, feel free to contact our support team.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              © 2024 ${siteInfo.siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `,
  });
}

// Send notification email to admins
export async function sendAdminNotification({
  subject,
  message,
  adminEmail,
}: {
  subject: string;
  message: string;
  adminEmail?: string;
}) {
  const siteInfo = await getSiteInfo();
  
  // Get admin email from settings if not provided
  let targetEmail = adminEmail;
  if (!targetEmail) {
    try {
      await dbConnect();
      const settings = await WebsiteSettings.findOne({ isActive: true });
      targetEmail = settings?.adminEmail;
    } catch (error) {
      console.error('Failed to get admin email:', error);
    }
  }

  if (!targetEmail) {
    console.error('No admin email configured');
    return { success: false, error: 'No admin email configured' };
  }

  return await sendEmail({
    to: targetEmail,
    subject: `[${siteInfo.siteName}] ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h1 style="color: #333; margin-bottom: 20px;">${subject}</h1>
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #333; line-height: 1.6;">
              ${message}
            </p>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              This is an automated notification from ${siteInfo.siteName}.
            </p>
          </div>
        </div>
      </div>
    `,
  });
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Test email configuration
export async function testEmailConfiguration() {
  const senderInfo = await getSenderInfo();
  const siteInfo = await getSiteInfo();

  return await sendEmail({
    to: senderInfo.fromEmail, // Send test email to the configured sender
    subject: `Email Configuration Test - ${siteInfo.siteName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: #333; margin-bottom: 20px;">Email Configuration Test</h1>
          <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
            Congratulations! Your email configuration is working correctly.
          </p>
          
          <div style="background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #28a745; font-weight: bold; margin-bottom: 20px;">
              ✅ Email system is ready!
            </p>
            <p style="color: #333;">
              Your ${siteInfo.siteName} email system is now configured and ready to send notifications, password resets, and other important communications.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 12px;">
              © 2024 ${siteInfo.siteName}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `,
  });
}
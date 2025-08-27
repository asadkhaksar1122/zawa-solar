import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { emailConfig, testEmail } = body;

        // Validate required fields
        if (!emailConfig || !testEmail) {
            return NextResponse.json(
                { success: false, message: 'Email configuration and test email are required' },
                { status: 400 }
            );
        }

        const { smtpHost, smtpPort, smtpSecure, smtpUser, smtpPassword: bodyPassword, fromEmail, fromName } = emailConfig;

        // Try to get password from environment if not provided in body
        const smtpPassword = bodyPassword || process.env.EMAIL_SMTP_PASSWORD;

        // Validate email configuration
        if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword || !fromEmail || !fromName) {
            return NextResponse.json(
                { success: false, message: 'Incomplete email configuration' },
                { status: 400 }
            );
        }

        // Create transporter (use createTransport - createTransporter is not part of nodemailer API)
        const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure, // true for 465, false for other ports
            auth: {
                user: smtpUser,
                pass: smtpPassword,
            },
            // Add timeout settings
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 5000, // 5 seconds
            socketTimeout: 10000, // 10 seconds
            // Allow self-signed certificates when necessary (e.g., some SMTP providers)
            tls: { rejectUnauthorized: false },
        });

        // Verify connection configuration
        try {
            await transporter.verify();
        } catch (verifyError: any) {
            console.error('SMTP verification failed:', verifyError);
            return NextResponse.json(
                {
                    success: false,
                    message: 'SMTP configuration verification failed. Please check your settings.',
                    error: verifyError.message
                },
                { status: 400 }
            );
        }

        // Send test email
        const mailOptions = {
            from: `${fromName} <${fromEmail}>`,
            to: testEmail,
            subject: 'Test Email from Zawa Solar Energy - Configuration Successful',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #7EC4CF; margin: 0;">Zawa Solar Energy</h1>
                        <p style="color: #666; margin: 5px 0;">Email Configuration Test</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h2 style="color: #333; margin-top: 0;">✅ Email Configuration Successful!</h2>
                        <p style="color: #666; line-height: 1.6;">
                            Congratulations! Your email configuration is working correctly. This test email was sent successfully using your SMTP settings.
                        </p>
                    </div>
                    
                    <div style="background: #fff; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #333; margin-top: 0;">Configuration Details:</h3>
                        <ul style="color: #666; line-height: 1.6;">
                            <li><strong>SMTP Host:</strong> ${smtpHost}</li>
                            <li><strong>Port:</strong> ${smtpPort}</li>
                            <li><strong>Security:</strong> ${smtpSecure ? 'SSL/TLS Enabled' : 'STARTTLS'}</li>
                            <li><strong>From Email:</strong> ${fromEmail}</li>
                            <li><strong>From Name:</strong> ${fromName}</li>
                        </ul>
                    </div>
                    
                    <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
                        <p style="color: #1976d2; margin: 0; font-size: 14px;">
                            <strong>Next Steps:</strong> Your email system is ready to send notifications, password resets, and other important communications to your users.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                        <p style="color: #999; font-size: 12px; margin: 0;">
                            This is an automated test email from your Zawa Solar Energy admin panel.
                        </p>
                        <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
                            Sent on ${new Date().toLocaleString()}
                        </p>
                    </div>
                </div>
            `,
            text: `
Email Configuration Test - Zawa Solar Energy

✅ Email Configuration Successful!

Congratulations! Your email configuration is working correctly. This test email was sent successfully using your SMTP settings.

Configuration Details:
- SMTP Host: ${smtpHost}
- Port: ${smtpPort}
- Security: ${smtpSecure ? 'SSL/TLS Enabled' : 'STARTTLS'}
- From Email: ${fromEmail}
- From Name: ${fromName}

Next Steps: Your email system is ready to send notifications, password resets, and other important communications to your users.

This is an automated test email from your Zawa Solar Energy admin panel.
Sent on ${new Date().toLocaleString()}
            `
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Test email sent successfully:', info.messageId);

            return NextResponse.json({
                success: true,
                message: 'Test email sent successfully! Please check your inbox.',
                messageId: info.messageId
            });
        } catch (sendError: any) {
            console.error('Failed to send test email:', sendError);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Failed to send test email. Please check your configuration.',
                    error: sendError.message
                },
                { status: 500 }
            );
        }

    } catch (error: any) {
        console.error('Test email API error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error while testing email configuration.',
                error: error.message
            },
            { status: 500 }
        );
    }
}

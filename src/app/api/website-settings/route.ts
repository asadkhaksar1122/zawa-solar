import { NextResponse } from 'next/server';
import mongoose, { Types } from 'mongoose';
import { dbConnect } from '@/lib/mongodb';
import { WebsiteSettings } from '@/lib/models/websiteSettings';
import { EnvManager, CAPTCHA_ENV_KEYS } from '@/lib/env-manager';
import type { IWebsiteSettings } from '@/lib/models/websiteSettings';

// GET - Fetch website settings
export async function GET() {
    try {
        await dbConnect();

        // Find the active settings document (there should only be one)
        let settings = await WebsiteSettings.findOne({ isActive: true });

        // If no settings exist, create default settings
        if (!settings) {
            settings = new WebsiteSettings({
                siteName: 'Zawa Solar Energy',
                siteDescription: 'Leading provider of sustainable solar energy solutions',
                siteUrl: 'https://zawasoler.com',
                adminEmail: 'admin@zawasoler.com',
                timezone: 'UTC',
                language: 'en',
                emailConfig: {
                    smtpHost: 'smtp.gmail.com',
                    smtpPort: 587,
                    smtpSecure: false,
                    smtpUser: 'asadkhaksar1122@outlook.com',
                    smtpPassword: 'placeholder-password', // This should be set by admin
                    fromEmail: 'asadkhaksar1122@outlook.com',
                    fromName: 'Zawa Solar Energy',
                },
                appearance: {
                    primaryColor: '#7EC4CF',
                    secondaryColor: '#FFB347',
                    accentColor: '#4A90E2',
                },
                security: {
                    enableTwoFactor: false,
                    sessionTimeout: 60,
                    maxLoginAttempts: 5,
                    lockoutDuration: 15,
                    enableCaptcha: true,
                    captcha: {
                        provider: 'recaptcha',
                        siteKey: '6Ldaa7MrAAAAAIxMBvJSBsZB4jdIV_CU6wx6DhVv',
                    },
                    allowedDomains: [],
                },
                system: {
                    maintenanceMode: false,
                    maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
                    enableRegistration: true,
                    enableEmailVerification: true,
                    defaultUserRole: 'user',
                    maxFileUploadSize: 10,
                    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
                },
                isActive: true,
            });

            await settings.save();
        }

        return NextResponse.json(settings, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching website settings:', error);
        return NextResponse.json(
            { message: 'Failed to fetch website settings', error: error.message },
            { status: 500 }
        );
    }
}

// POST - Create new website settings (admin only)
export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();

        // Validate required fields
        const requiredFields = ['siteName', 'siteDescription', 'siteUrl', 'adminEmail'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { message: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Deactivate any existing settings
        await WebsiteSettings.updateMany({}, { isActive: false });

        // Create new settings
        const newSettings = new WebsiteSettings({
            ...body,
            isActive: true,
        });

        const savedSettings = await newSettings.save();

        return NextResponse.json(savedSettings, { status: 201 });
    } catch (error: any) {
        console.error('Error creating website settings:', error);
        return NextResponse.json(
            { message: 'Failed to create website settings', error: error.message },
            { status: 500 }
        );
    }
}

// PUT - Update existing website settings
export async function PUT(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { id, lastUpdatedBy, ...updateData } = body;

        // If client sent a `site` object (nested), flatten it into top-level fields
        if (updateData.site && typeof updateData.site === 'object') {
            for (const k of Object.keys(updateData.site)) {
                (updateData as any)[k] = (updateData as any).site[k];
            }
            delete (updateData as any).site;
        }

        // If no ID provided, find the active settings
        let settingsId = id;
        if (!settingsId) {
            const activeSettings = await WebsiteSettings.findOne({ isActive: true });
            if (!activeSettings) {
                return NextResponse.json(
                    { message: 'No active settings found to update' },
                    { status: 404 }
                );
            }
            settingsId = activeSettings._id;
        }

        // Validate ID format
        if (!Types.ObjectId.isValid(settingsId)) {
            return NextResponse.json(
                { message: 'Invalid settings ID format' },
                { status: 400 }
            );
        }

        // Debug log incoming update payload
        console.log('Website settings update request body:', updateData, 'lastUpdatedBy:', lastUpdatedBy, 'id:', settingsId);

        // If captcha secret is provided, persist it to .env and remove from payload
        try {
            if (
                updateData.security &&
                (updateData.security as any).captcha &&
                (updateData.security as any).captcha.secretKey
            ) {
                const secretKey = (updateData.security as any).captcha.secretKey;
                // Save secret to .env via EnvManager
                EnvManager.updateEnvVariable(CAPTCHA_ENV_KEYS.SECRET_KEY, secretKey);
                // Remove secret from updateData so it isn't stored in DB
                delete (updateData.security as any).captcha.secretKey;
                console.log('Captcha secret persisted to .env and removed from DB payload');
            }
        } catch (envError) {
            console.error('Failed to persist captcha secret to .env:', envError);
            // Continue without failing the whole request; admin can retry saving secret separately
        }

        // Load existing settings document and apply updates to ensure nested objects merge correctly
        const settingsDoc = await WebsiteSettings.findById(settingsId);
        if (!settingsDoc) {
            return NextResponse.json(
                { message: 'Settings not found' },
                { status: 404 }
            );
        }

        // Apply each top-level update field
        for (const key of Object.keys(updateData)) {
            // Use mongoose document.set to correctly set nested objects when needed
            settingsDoc.set(key as any, (updateData as any)[key]);
        }

        // Update meta fields
        if (lastUpdatedBy) settingsDoc.lastUpdatedBy = lastUpdatedBy;
        settingsDoc.updatedAt = new Date();

        // Save and validate
        const saved = await settingsDoc.save();

        return NextResponse.json(saved, { status: 200 });
    } catch (error: any) {
        console.error('Error updating website settings:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json(
                { message: 'Validation failed', errors: validationErrors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Failed to update website settings', error: error.message },
            { status: 500 }
        );
    }
}

// DELETE - Delete website settings (admin only, with caution)
export async function DELETE(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id || !Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: 'Valid settings ID is required' },
                { status: 400 }
            );
        }

        // Instead of deleting, we'll deactivate the settings
        const deactivatedSettings = await WebsiteSettings.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!deactivatedSettings) {
            return NextResponse.json(
                { message: 'Settings not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Settings deactivated successfully', settings: deactivatedSettings },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error deactivating website settings:', error);
        return NextResponse.json(
            { message: 'Failed to deactivate website settings', error: error.message },
            { status: 500 }
        );
    }
}

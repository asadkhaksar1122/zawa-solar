import mongoose, { Schema, model, Document, Types } from 'mongoose';

// Interface for email configuration
interface IEmailConfig {
    smtpHost: string;
    smtpPort: number;
    smtpSecure: boolean;
    smtpUser: string;
    fromEmail: string;
    fromName: string;
    // Note: smtpPassword is stored in environment variables for security
}

// Interface for appearance settings
interface IAppearanceSettings {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl?: string;
    faviconUrl?: string;
    customCSS?: string;
}

// Interface for security settings
interface ISecuritySettings {
    enableTwoFactor: boolean;
    sessionTimeout: number; // in minutes
    maxLoginAttempts: number;
    lockoutDuration: number; // in minutes
    enableCaptcha: boolean;
    allowedDomains: string[];
    // If true, users connecting through VPN will be shown a warning modal and required to disable VPN
    isVpnProtected?: boolean;
    // CAPTCHA configuration (provider and siteKey stored in DB; secretKey stored in env)
    captcha?: {
        provider?: 'none' | 'recaptcha' | 'hcaptcha';
        siteKey?: string;
        secretKey?: string;
    };
}

// Interface for system settings
interface ISystemSettings {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    enableRegistration: boolean;
    enableEmailVerification: boolean;
    defaultUserRole: 'user' | 'admin';
    maxFileUploadSize: number; // in MB
    allowedFileTypes: string[];
}

// Main interface for website settings
interface IWebsiteSettings extends Document {
    // Site Information
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;

    // Email Configuration
    emailConfig: IEmailConfig;

    // Appearance Settings
    appearance: IAppearanceSettings;

    // Security Settings
    security: ISecuritySettings;

    // System Settings
    system: ISystemSettings;

    // Meta fields
    isActive: boolean;
    lastUpdatedBy?: string;
}

// Email configuration schema
const emailConfigSchema = new Schema<IEmailConfig>({
    smtpHost: {
        type: String,
        required: true,
        default: 'smtp.gmail.com',
    },
    smtpPort: {
        type: Number,
        required: true,
        default: 587,
    },
    smtpSecure: {
        type: Boolean,
        default: false,
    },
    smtpUser: {
        type: String,
        required: true,
    },
    fromEmail: {
        type: String,
        required: true,
    },
    fromName: {
        type: String,
        required: true,
        default: 'Zawa Solar Energy',
    },

});

// Appearance settings schema
const appearanceSchema = new Schema<IAppearanceSettings>({
    primaryColor: {
        type: String,
        default: '#7EC4CF',
    },
    secondaryColor: {
        type: String,
        default: '#FFB347',
    },
    accentColor: {
        type: String,
        default: '#4A90E2',
    },
    logoUrl: {
        type: String,
        trim: true,
    },
    faviconUrl: {
        type: String,
        trim: true,
    },
    customCSS: {
        type: String,
        trim: true,
    },
});

// Security settings schema
const securitySchema = new Schema<ISecuritySettings>({
    enableTwoFactor: {
        type: Boolean,
        default: false,
    },
    sessionTimeout: {
        type: Number,
        default: 60, // 1 hour
    },
    maxLoginAttempts: {
        type: Number,
        default: 5,
    },
    lockoutDuration: {
        type: Number,
        default: 15, // 15 minutes
    },
    enableCaptcha: {
        type: Boolean,
        default: false,
    },
    allowedDomains: {
        type: [String],
        default: [],
    },
    isVpnProtected: {
        type: Boolean,
        default: false,
    },
    // CAPTCHA configuration
    captcha: {
        provider: {
            type: String,
            enum: ['none', 'recaptcha', 'hcaptcha'],
            default: 'none',
        },
        siteKey: {
            type: String,
            trim: true,
        },
        // secretKey is stored in env for security, so we don't persist it here by default
        secretKey: {
            type: String,
            trim: true,
        },
    },
});

// System settings schema
const systemSchema = new Schema<ISystemSettings>({
    maintenanceMode: {
        type: Boolean,
        default: false,
    },
    maintenanceMessage: {
        type: String,
        default: 'We are currently performing maintenance. Please check back soon.',
    },
    enableRegistration: {
        type: Boolean,
        default: true,
    },
    enableEmailVerification: {
        type: Boolean,
        default: true,
    },
    defaultUserRole: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    maxFileUploadSize: {
        type: Number,
        default: 10, // 10 MB
    },
    allowedFileTypes: {
        type: [String],
        default: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
    },
});

// Main website settings schema
const websiteSettingsSchema = new Schema<IWebsiteSettings>({
    // Site Information
    siteName: {
        type: String,
        required: true,
        default: 'Zawa Solar Energy',
        trim: true,
    },
    siteDescription: {
        type: String,
        required: true,
        default: 'Leading provider of sustainable solar energy solutions',
        trim: true,
    },
    siteUrl: {
        type: String,
        required: true,
        default: 'https://zawasoler.com',
        trim: true,
    },
    adminEmail: {
        type: String,
        required: true,
        default: 'admin@zawasoler.com',
        trim: true,
        lowercase: true,
    },
    timezone: {
        type: String,
        default: 'UTC',
    },
    language: {
        type: String,
        default: 'en',
    },

    // Nested configurations
    emailConfig: {
        type: emailConfigSchema,
        required: true,
    },
    appearance: {
        type: appearanceSchema,
        required: true,
    },
    security: {
        type: securitySchema,
        required: true,
    },
    system: {
        type: systemSchema,
        required: true,
    },

    // Meta fields
    isActive: {
        type: Boolean,
        default: true,
    },
    lastUpdatedBy: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
    collection: 'websitesettings',
});

// Create indexes for better performance
websiteSettingsSchema.index({ isActive: 1 });
websiteSettingsSchema.index({ lastUpdatedBy: 1 });

export const WebsiteSettings =
    mongoose.models.WebsiteSettings || model<IWebsiteSettings>('WebsiteSettings', websiteSettingsSchema);

// Export interfaces for use in other files
export type {
    IWebsiteSettings,
    IEmailConfig,
    IAppearanceSettings,
    ISecuritySettings,
    ISystemSettings
};

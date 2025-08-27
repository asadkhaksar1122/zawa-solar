
// Add NextAuth types
import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      // Keep `id` so code that reads `session.user.id` compiles correctly.
      id?: string | null;
    } & DefaultSession['user']; // Keep existing user properties like name, email, image
  }
}


export interface Company {
  _id: string;
  name: string;
  logoUrl?: string;
}

export interface SolarSolution {
  _id: string;
  name: string;
  company: string;
  companyId: string;
  description: string;
  imageUrl: string;
  powerOutput?: string;
  efficiency?: string;
  features?: string[];
  warranty?: string;
  createdAt?: string;  // ISO string date
  updatedAt?: string;  // ISO string date
  __v?: number;
}


export interface ContactItem {
  _id: string;
  value: string;
}



// lib/types.ts
export interface DashboardData {
  userCount: number;
  solutionCount: number;
}

export interface ContactSettings {
  _id: any;
  whatsappNumbers: ContactItem[];
  emailAddresses: ContactItem[];
  phoneNumbers: ContactItem[];
  facebookUrl: string;
  officeAddress: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  img: string;
  education: string;
  experience: string;
  achievements: string;
  createdAt?: string;
  updatedAt?: string;
}

// Website Settings Types
export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpSecure: boolean;
  smtpUser: string;
  smtpPassword?: string; // optional: may be present when loading settings, stored securely in env for production
  fromEmail: string;
  fromName: string;
  // Note: smtpPassword is stored in environment variables for security
}

export interface AppearanceSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  faviconUrl?: string;
  customCSS?: string;
}

export interface SecuritySettings {
  enableTwoFactor: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  enableCaptcha: boolean;
  allowedDomains: string[];
  captcha?: {
    provider?: 'none' | 'recaptcha' | 'hcaptcha';
    siteKey?: string;
    secretKey?: string; // stored in env in production, but optional here
  };
}

export interface SystemSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  enableRegistration: boolean;
  enableEmailVerification: boolean;
  defaultUserRole: 'user' | 'admin';
  maxFileUploadSize: number;
  allowedFileTypes: string[];
}

export interface WebsiteSettings {
  _id: string;
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  adminEmail: string;
  timezone: string;
  language: string;
  emailConfig: EmailConfig;
  appearance: AppearanceSettings;
  security: SecuritySettings;
  system: SystemSettings;
  isActive: boolean;
  lastUpdatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

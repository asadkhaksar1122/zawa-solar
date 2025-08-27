import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';

// Safely import WebsiteSettings
let WebsiteSettings: any;
try {
  const websiteSettingsModule = require('@/lib/models/websiteSettings');
  WebsiteSettings = websiteSettingsModule.WebsiteSettings;
} catch (error) {
  console.error('Failed to import WebsiteSettings:', error);
  WebsiteSettings = null;
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

export async function securityMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Extract client IP from various headers
  const getClientIP = (req: NextRequest): string => {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIP = req.headers.get('x-real-ip');
    const cfConnectingIP = req.headers.get('cf-connecting-ip');
    
    if (forwarded) {
      // x-forwarded-for can contain multiple IPs, take the first one
      return forwarded.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }
    
    if (cfConnectingIP) {
      return cfConnectingIP;
    }
    
    // Fallback to a default value
    return '127.0.0.1';
  };
  
  const clientIP = getClientIP(request);
  const host = request.headers.get('host') || '';

  try {
    // Check if WebsiteSettings is available
    if (!WebsiteSettings) {
      console.warn('WebsiteSettings model not available, skipping security checks');
      return NextResponse.next();
    }

    // Get security settings
    await dbConnect();
    const settings = await WebsiteSettings.findOne({ isActive: true });
    
    if (!settings || !settings.security) {
      return NextResponse.next();
    }
    
    const securitySettings = settings.security;

    // 1. Domain Access Control
    if (securitySettings.allowedDomains && securitySettings.allowedDomains.length > 0) {
      const isAllowed = securitySettings.allowedDomains.some((domain: string) => 
        host.includes(domain) || domain === '*'
      );

      if (!isAllowed) {
        return new NextResponse('Access denied: Domain not allowed', { status: 403 });
      }
    }

    // 2. Login Attempt Limiting (for auth routes)
    if (pathname.startsWith('/api/auth/') || pathname.includes('/signin')) {
      const attemptKey = `${clientIP}:login`;
      const attempts = loginAttempts.get(attemptKey);

      if (attempts && attempts.lockedUntil > Date.now()) {
        const remainingTime = Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60);
        return new NextResponse(
          JSON.stringify({ 
            error: 'Account temporarily locked', 
            remainingTime: `${remainingTime} minutes` 
          }), 
          { 
            status: 429,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      // If this is a failed login attempt (you'd need to check the response)
      if (request.method === 'POST') {
        const currentAttempts = attempts?.count || 0;
        
        // This would be set after checking login credentials
        const response = NextResponse.next();
        response.headers.set('x-max-login-attempts', securitySettings.maxLoginAttempts.toString());
        response.headers.set('x-current-attempts', currentAttempts.toString());
        
        return response;
      }
    }

    // 3. Rate Limiting for API routes
    if (pathname.startsWith('/api/')) {
      const rateLimitKey = `${clientIP}:${pathname}`;
      const now = Date.now();
      const windowMs = 15 * 60 * 1000; // 15 minutes
      const maxRequests = 100; // Max requests per window

      const current = rateLimitStore.get(rateLimitKey);
      
      if (current && current.resetTime > now) {
        if (current.count >= maxRequests) {
          return new NextResponse('Rate limit exceeded', { status: 429 });
        }
        current.count++;
      } else {
        rateLimitStore.set(rateLimitKey, { count: 1, resetTime: now + windowMs });
      }
    }

    return NextResponse.next();

  } catch (error) {
    console.error('Security middleware error:', error);
    // If there's an error with WebsiteSettings, continue without security checks
    return NextResponse.next();
  }
}

// Helper function to record failed login attempt
export function recordFailedLoginAttempt(clientIP: string, maxAttempts: number, lockoutDuration: number) {
  const attemptKey = `${clientIP}:login`;
  const current = loginAttempts.get(attemptKey);
  const newCount = (current?.count || 0) + 1;

  if (newCount >= maxAttempts) {
    const lockoutMs = lockoutDuration * 60 * 1000;
    loginAttempts.set(attemptKey, {
      count: newCount,
      lockedUntil: Date.now() + lockoutMs
    });
  } else {
    loginAttempts.set(attemptKey, {
      count: newCount,
      lockedUntil: 0
    });
  }

  return {
    attempts: newCount,
    isLocked: newCount >= maxAttempts,
    remainingAttempts: Math.max(0, maxAttempts - newCount)
  };
}

// Helper function to clear login attempts on successful login
export function clearLoginAttempts(clientIP: string) {
  const attemptKey = `${clientIP}:login`;
  loginAttempts.delete(attemptKey);
}
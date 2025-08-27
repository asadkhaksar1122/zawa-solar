import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import { securityMiddleware } from '@/middleware/security';

export default withAuth(
  async function middleware(request: NextRequest) {
    try {
      // Apply security middleware first
      const securityResponse = await securityMiddleware(request);
      if (securityResponse && securityResponse.status !== 200) {
        return securityResponse;
      }

      // Continue with normal flow
      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (req.nextUrl.pathname.startsWith('/api/auth/') || 
            req.nextUrl.pathname === '/auth/signin' ||
            req.nextUrl.pathname === '/auth/signup' ||
            req.nextUrl.pathname === '/' ||
            req.nextUrl.pathname.startsWith('/solutions') ||
            req.nextUrl.pathname.startsWith('/about') ||
            req.nextUrl.pathname.startsWith('/contact')) {
          return true;
        }

        // Require authentication for admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token && (token as any).role === 'admin';
        }

        // Allow authenticated users for other protected routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
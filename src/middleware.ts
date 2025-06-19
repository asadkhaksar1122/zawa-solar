import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isAdminPath = path.startsWith('/admin');

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    });

    // Debug: Log token contents (remove in production)
    if (isAdminPath) {
        console.log('Accessing admin path:', path);
        console.log('Token exists:', !!token);
        console.log('User role:', token?.role);
    }

    if (isAdminPath) {
        // Check if user is not logged in
        if (!token) {
            console.log('No token found, redirecting to login');
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        // Check if user doesn't have admin role
        if (token.role !== 'admin') {
            console.log(`User role "${token.role}" is not admin, redirecting to home`);
            return NextResponse.redirect(new URL('/', request.url));
        }

        console.log('Admin access granted');
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
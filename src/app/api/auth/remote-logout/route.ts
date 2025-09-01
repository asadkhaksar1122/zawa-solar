import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/mongodb';
import SessionModel from '@/lib/models/session';
import UserModel from '@/lib/models/user';

// This endpoint is used to remotely log out a user from a specific device
export async function GET(request: NextRequest) {
  try {
    // Get the current session
    const session = await getServerSession(authOptions);
    
    // Only allow admins to perform remote logout
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    // Get the session ID from the query parameters
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        { message: 'Session ID is required.' },
        { status: 400 }
      );
    }

    // Connect to database
    await dbConnect();

    // Find the session
    const targetSession = await SessionModel.findById(sessionId);
    
    if (!targetSession) {
      return NextResponse.json(
        { message: 'Session not found.' },
        { status: 404 }
      );
    }

    // Generate HTML with JavaScript that will clear the session
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Remote Logout</title>
        <script src="https://cdn.jsdelivr.net/npm/next-auth@4/dist/client/_next-auth.js"></script>
        <script>
          // Clear all cookies as a fallback
          function clearAllCookies() {
            const cookies = document.cookie.split(';');
            
            for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i];
              const eqPos = cookie.indexOf('=');
              const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
              document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
              document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + window.location.hostname;
            }
            
            // Also try to clear the next-auth session cookie specifically
            document.cookie = 'next-auth.session-token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
            document.cookie = 'next-auth.csrf-token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
            document.cookie = 'next-auth.callback-url=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
            
            // For secure cookies
            document.cookie = 'next-auth.session-token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;secure';
            document.cookie = 'next-auth.csrf-token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;secure';
            document.cookie = 'next-auth.callback-url=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;secure';
            
            // Try with different domains
            const domain = window.location.hostname;
            document.cookie = 'next-auth.session-token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + domain;
            document.cookie = 'next-auth.csrf-token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + domain;
            document.cookie = 'next-auth.callback-url=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + domain;
          }
          
          // Handle the logout process
          async function handleLogout() {
            try {
              // First call our custom logout API to remove the session from the database
              const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId: '${sessionId}' }),
              });
              
              // Clear cookies as a fallback
              clearAllCookies();
              
              // Use a direct form submission to the NextAuth signout endpoint
              const form = document.createElement('form');
              form.method = 'POST';
              form.action = '/api/auth/signout';
              form.style.display = 'none';
              
              // Add CSRF token if available
              const csrfToken = document.cookie.split('next-auth.csrf-token=')[1]?.split(';')[0];
              if (csrfToken) {
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = 'csrfToken';
                csrfInput.value = csrfToken;
                form.appendChild(csrfInput);
              }
              
              // Add callbackUrl
              const callbackInput = document.createElement('input');
              callbackInput.type = 'hidden';
              callbackInput.name = 'callbackUrl';
              callbackInput.value = '/auth/login?message=logged_out';
              form.appendChild(callbackInput);
              
              // Add to document and submit
              document.body.appendChild(form);
              form.submit();
              
              // Send a message to the parent window that logout is complete
              if (window.parent) {
                window.parent.postMessage('logout-complete', '*');
              }
            } catch (error) {
              console.error('Error during logout:', error);
              clearAllCookies();
              
              // Still try to redirect
              window.location.href = '/auth/login?message=logged_out';
              
              // Send a message to the parent window that logout is complete
              if (window.parent) {
                window.parent.postMessage('logout-complete', '*');
              }
            }
          }
          
          // Execute the logout when the page loads
          window.onload = handleLogout;
        </script>
      </head>
      <body>
        <p>Logging out...</p>
      </body>
      </html>
    `;

    // Return the HTML
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error during remote logout:', error);
    return NextResponse.json(
      { message: 'Failed to process remote logout.' },
      { status: 500 }
    );
  }
}
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function SessionMonitor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const lastSessionRef = useRef<any>(null);
  const isHandlingLogoutRef = useRef(false);

  useEffect(() => {
    // Skip if we're already handling a logout or if session is loading
    if (isHandlingLogoutRef.current || status === 'loading') {
      return;
    }

    // If we had a session before but now we don't (and we're not loading)
    if (lastSessionRef.current && !session && status === 'unauthenticated') {
      console.log('Session was invalidated, user logged out automatically');
      lastSessionRef.current = null;
      return;
    }

    // If session exists but user is null (session was revoked)
    if (session && !session.user) {
      console.log('Session user is null, forcing logout');
      isHandlingLogoutRef.current = true;
      
      signOut({ 
        redirect: false,
        callbackUrl: '/auth/login'
      }).then(() => {
        router.push('/auth/login');
        isHandlingLogoutRef.current = false;
      }).catch((error) => {
        console.error('Error during automatic logout:', error);
        router.push('/auth/login');
        isHandlingLogoutRef.current = false;
      });
      
      return;
    }

    // Update the last session reference
    lastSessionRef.current = session;
  }, [session, status, router]);

  // This component doesn't render anything
  return null;
}
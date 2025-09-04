
'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

interface NextAuthProviderProps {
  children: ReactNode;
}

export function NextAuthProvider({ children }: NextAuthProviderProps) {
  return (
    <SessionProvider
      // Refetch session every 5 minutes to check if it's still valid
      refetchInterval={5 * 60}
      // Refetch when window gets focus
      refetchOnWindowFocus={true}
      // Refetch when user comes back online
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  );
}

"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider
            refetchOnWindowFocus={true}
            refetchInterval={30} // seconds; tweak to 30–60s for your needs
        >
            {children}
        </SessionProvider>
    );
}
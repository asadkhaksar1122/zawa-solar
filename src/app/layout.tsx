
import type { Metadata } from 'next';
import './globals.css';
import { ReduxProvider } from '@/lib/redux/ReduxProvider';
import { NextAuthProvider } from './NextAuthProvider';
import { Toaster } from 'sonner'; // We'll create this next
import Chatbot from '@/components/Chatbot';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { SecurityProvider } from '@/contexts/SecurityContext';
import { MaintenanceMode } from '@/components/system/MaintenanceMode';
import { SessionTimeoutWarning } from '@/components/security/SessionTimeoutWarning';
import VpnWarning from '@/components/security/VpnWarning';
import { Providers } from './Providers';

// Dynamic metadata will be handled by the SettingsProvider
export const metadata: Metadata = {
  title: 'Zawa Solar Energy',
  description: 'Your gateway to solar energy solutions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
      </head>
      <body className="font-body antialiased">
        <NextAuthProvider>
          <ReduxProvider>
            <SettingsProvider>
              <SecurityProvider>
                <Toaster richColors position="top-center" closeButton />
                <MaintenanceMode>
                  <Providers>
                    {children}
                  </Providers>
                  <Chatbot></Chatbot>
                  <SessionTimeoutWarning />
                  <VpnWarning />
                </MaintenanceMode>
              </SecurityProvider>
            </SettingsProvider>
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

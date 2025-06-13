
import type {Metadata} from 'next';
import './globals.css';
import { ReduxProvider } from '@/lib/redux/ReduxProvider';
import { NextAuthProvider } from './NextAuthProvider'; // We'll create this next

export const metadata: Metadata = {
  title: 'Zawa Energy Hub',
  description: 'Your gateway to solar energy solutions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <NextAuthProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

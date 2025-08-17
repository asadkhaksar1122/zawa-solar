
import { UserHeader } from '@/components/user/Header';
import { UserFooter } from '@/components/user/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Zawa Soler Energy',
  description: 'Login or Sign Up to Zawa Soler Energy Hub.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <main className="flex-grow flex items-center justify-center py-12 md:py-16 bg-muted/20">
        <div className="container mx-auto px-4 flex justify-center">
          {children}
        </div>
      </main>
      <UserFooter />
    </div>
  );
}

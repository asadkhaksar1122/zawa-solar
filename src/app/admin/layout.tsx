
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Zawa Energy Hub',
  description: 'Manage Zawa Energy Hub solar solutions.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="flex flex-col h-screen"> {/* Added h-screen here */}
        <AdminHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20 overflow-auto"> {/* Added overflow-auto here */}
          {children}

        </main>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { AdminSidebarNav } from './AdminSidebarNav';

export function AdminSidebar() {
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Logo href="/admin" />
        </div>
        <div className="flex-1 overflow-auto py-2">
          <AdminSidebarNav className="px-4" />
        </div>
        {/* Optional: Footer content for sidebar */}
        {/* <div className="mt-auto p-4 border-t">
            <p className="text-xs text-muted-foreground">&copy; Zawa Energy Hub</p>
        </div> */}
      </div>
    </div>
  );
}

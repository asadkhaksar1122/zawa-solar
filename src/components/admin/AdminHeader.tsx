'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Sun, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSidebarNav } from './AdminSidebarNav';
import { DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    // Clear any stored auth tokens/data
    await signOut({ redirect: false, callbackUrl: '/' });
    router.push('/'); // Or any other page you want to redirect to after logout
    router.refresh();
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between">
      <div className="flex items-center gap-2">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col p-0">
            <VisuallyHidden>
              <DialogTitle>Navigation Menu</DialogTitle>
            </VisuallyHidden>
            <div className="p-4 border-b">
              <Logo href="/admin" iconSize={40} textSize="text-xl" />
            </div>
            <AdminSidebarNav className="p-4" onLinkClick={closeSidebar} />
          </SheetContent>
        </Sheet>
        {/* On desktop, this part of the header might be minimal as nav is in sidebar */}
        <div className="hidden md:block">
          <h1 className="font-headline text-lg font-semibold">Admin Dashboard</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/" aria-label="View Live Site" title="View Live Site">
            <Sun className="h-5 w-5" />
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <UserCircle className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/admin/setting" >
              <DropdownMenuItem >
                Settings
              </DropdownMenuItem>
            </Link>
            <Link href="/admin/support" >
              <DropdownMenuItem  >
                Support
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className='cursor-pointer' >Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

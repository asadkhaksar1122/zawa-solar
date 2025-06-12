'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Box, Building, Settings, Phone } from 'lucide-react'; // Added Building and Phone icons

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/solutions', label: 'Solar Solutions', icon: Box },
  { href: '/admin/companies', label: 'Companies', icon: Building },
  { href: '/admin/contact-settings', label: 'Contact Settings', icon: Phone },
  // { href: '/admin/settings', label: 'Settings', icon: Settings },
];

interface AdminSidebarNavProps {
  className?: string;
}

export function AdminSidebarNav({ className }: AdminSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-2 text-sm font-medium", className)}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
              isActive ? 'bg-muted text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

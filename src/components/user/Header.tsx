
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function UserHeader() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Solutions', activeCondition: () => pathname === '/' || pathname.startsWith('/solutions') },
    { href: '/#about', label: 'About Us', activeCondition: () => pathname === '/' && !!(typeof window !== 'undefined' && window.location.hash === '#about') || pathname === '/#about' }, // Basic check, more complex for hash
    { href: '/contact', label: 'Contact', activeCondition: () => pathname === '/contact' },
  ];

  const authLinks = [
    { href: '/auth/login', label: 'Login', activeCondition: () => pathname === '/auth/login' },
    { href: '/auth/signup', label: 'Sign Up', activeCondition: () => pathname === '/auth/signup' },
  ];


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              asChild
              className={cn(
                link.activeCondition() && 'text-primary font-semibold'
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <div className="mx-2 h-6 border-l border-border/70"></div>
          {authLinks.map((link, index) => (
             <Button
              key={link.href}
              variant={index === 0 ? "ghost" : "default"}
              asChild
              className={cn(
                link.activeCondition() && index === 0 && 'text-primary font-semibold',
                link.activeCondition() && index === 1 && 'ring-2 ring-primary-foreground ring-offset-2 ring-offset-primary' // Example active style for primary button
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="flex-grow overflow-y-auto">
                <nav className="flex flex-col gap-1 p-4">
                  {navLinks.map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={cn(
                          'block px-3 py-2 text-base rounded-md hover:bg-muted',
                          link.activeCondition() && 'bg-muted text-primary font-semibold'
                        )}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </div>
              <Separator />
              <div className="p-4 border-t space-y-2">
                <SheetClose asChild>
                  <Button variant="outline" className={cn("w-full", pathname === '/auth/login' && 'border-primary text-primary')} asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button className={cn("w-full", pathname === '/auth/signup' && 'ring-2 ring-primary ring-offset-2 ring-offset-background')} asChild>
                     <Link href="/auth/signup">Sign Up</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

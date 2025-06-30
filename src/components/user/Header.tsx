
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { Menu, UserCircle, LogOut } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Assuming you have Avatar

export function UserHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoadingSession = status === 'loading';

  const navLinks = [
    { href: '/', label: 'Solutions', activeCondition: () => pathname === '/' || pathname.startsWith('/solutions') },
    { href: '/#about', label: 'About Us', activeCondition: () => pathname === '/' && !!(typeof window !== 'undefined' && window.location.hash === '#about') || pathname === '/#about' },
    { href: '/contact', label: 'Contact', activeCondition: () => pathname === '/contact' },
  ];

  const handleSignOut = async () => {
    await signOut({ redirect: false, callbackUrl: '/' });
    router.push('/'); // Or any other page you want to redirect to after logout
    router.refresh();
  };


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
                'hover:bg-primary/10',
                link.activeCondition() && 'text-primary font-semibold bg-primary/5'
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <div className="mx-2 h-6 border-l border-border/70"></div>
          {isLoadingSession ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
              <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div>
            </div>
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user.image || undefined} alt={session.user.name || session.user.email || 'User'} />
                    <AvatarFallback>
                      {session.user.name ? session.user.name.charAt(0).toUpperCase() : session.user.email ? session.user.email.charAt(0).toUpperCase() : <UserCircle className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(session?.user as any)?.role === "admin" && <DropdownMenuItem onClick={() => router.push('/admin')}> {/* Or profile page */}
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Admin Page</span> {/* Or Dashboard */}
                </DropdownMenuItem>}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className={cn(pathname === '/auth/login' && 'text-primary font-semibold bg-primary/5', 'hover:bg-primary/10')}
              >
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button
                variant="default"
                asChild
                className={cn(pathname === '/auth/signup' && 'ring-2 ring-primary-foreground ring-offset-2 ring-offset-primary')}
              >
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
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
                {isLoadingSession ? (
                  <div className="space-y-2">
                    <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
                    <div className="h-10 w-full animate-pulse rounded-md bg-muted"></div>
                  </div>
                ) : session?.user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{session.user.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    </div>
                    {(session?.user as any)?.role === "admin" && <SheetClose asChild>
                      <Button variant="outline" className="w-full" onClick={() => router.push('/admin')}>
                        Admin Page
                      </Button>
                    </SheetClose>}
                    <SheetClose asChild>
                      <Button variant="destructive" className="w-full" onClick={handleSignOut}>
                        Log Out
                      </Button>
                    </SheetClose>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

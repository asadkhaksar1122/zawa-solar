
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { UserCircle, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

export function UserHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Solutions</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/#about">About Us</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/contact">Contact</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
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
                  <SheetClose asChild>
                    <Link
                      href="/"
                      className="block px-3 py-2 text-base rounded-md hover:bg-muted"
                    >
                      Solutions
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/#about"
                      className="block px-3 py-2 text-base rounded-md hover:bg-muted"
                    >
                      About Us
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/contact"
                      className="block px-3 py-2 text-base rounded-md hover:bg-muted"
                    >
                      Contact
                    </Link>
                  </SheetClose>
                </nav>
              </div>
              <Separator />
              <div className="p-4 border-t space-y-2">
                <SheetClose asChild>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button className="w-full" asChild>
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

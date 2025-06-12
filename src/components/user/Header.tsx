
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { UserCircle } from 'lucide-react';

export function UserHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Solutions</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/#about">About Us</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/contact">Contact</Link>
          </Button>
           <Button variant="ghost" size="icon" asChild>
            <Link href="/profile"> {/* Placeholder for user profile/login */}
              <UserCircle className="h-6 w-6" />
              <span className="sr-only">User Profile</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

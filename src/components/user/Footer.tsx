
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function UserFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/50">
      <div className="container flex flex-col items-center gap-6 py-10 md:flex-row md:justify-between md:items-center md:gap-4 md:py-8">
        {/* Logo Section */}
        <Logo iconSize={24} textSize="text-xl" />

        {/* Middle Section: Copyright & Admin Button */}
        <div className="flex flex-col items-center md:flex-row md:items-center gap-4 text-center md:text-left">
          <p className="text-sm leading-loose text-muted-foreground">
            Built by Zawa Solar Energy Solutions. &copy; {new Date().getFullYear()} All rights reserved.
          </p>

        </div>

        {/* Links Section: Privacy & Terms */}
        <div className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
          <a href="/privacy" className="hover:text-foreground">Privacy Policy</a>
          <a href="/terms" className="hover:text-foreground">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

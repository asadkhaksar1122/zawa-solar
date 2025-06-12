
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function UserFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/50">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <Logo iconSize={24} textSize="text-xl" />
        <div className="flex flex-col md:flex-row items-center gap-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Zawa Solar Energy Solutions. &copy; {new Date().getFullYear()} All rights reserved.
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin">Admin Panel</Link>
          </Button>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <a href="/privacy" className="hover:text-foreground">Privacy Policy</a>
          <a href="/terms" className="hover:text-foreground">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

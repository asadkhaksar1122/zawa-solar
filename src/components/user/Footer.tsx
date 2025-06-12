import { Logo } from '@/components/shared/Logo';

export function UserFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/50">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <Logo iconSize={24} textSize="text-xl" />
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by Zawa Solar Energy Solutions. &copy; {new Date().getFullYear()} All rights reserved.
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <a href="/privacy" className="hover:text-foreground">Privacy Policy</a>
          <a href="/terms" className="hover:text-foreground">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

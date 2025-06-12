import { Sun } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  href?: string;
}

export function Logo({ className, iconSize = 28, textSize = 'text-2xl', href = '/' }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 text-primary ${className}`}>
      <Sun size={iconSize} className="text-accent" />
      <span className={`font-headline font-semibold ${textSize}`}>Zawa Energy Hub</span>
    </Link>
  );
}

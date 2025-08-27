'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSiteBranding } from '@/contexts/SettingsContext';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  href?: string;
}

export function Logo({ className, iconSize = 60, textSize = 'text-2xl', href = '/' }: LogoProps) {
  const { siteName, logoUrl } = useSiteBranding();

  return (
    <Link href={href} className={`flex items-center gap-2 text-primary ${className}`}>
      <Image 
        src={logoUrl || "/icon.png"} 
        alt={`${siteName} Logo`} 
        width={iconSize} 
        height={iconSize} 
        className="object-contain rounded-full flex-shrink-0" 
      />
      <span className={`font-headline font-semibold ${textSize} whitespace-nowrap`}>
        {siteName}
      </span>
    </Link>
  );
}

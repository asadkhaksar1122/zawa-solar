import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  href?: string;
}

export function Logo({ className, iconSize = 60, textSize = 'text-2xl', href = '/' }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 text-primary ${className}`}>
      <Image src="/icon.png" alt="Zawa Soler Energy " width={iconSize} height={iconSize} className="object-contain rounded-full" />
      <span className={`font-headline font-semibold ${textSize}`}>Zawa Soler Energy </span>
    </Link>
  );
}

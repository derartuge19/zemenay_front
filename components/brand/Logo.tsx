import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function Logo({ className = '', width = 180, height = 60, priority = false }: LogoProps) {
  return (
    <Link href="/" className={`inline-block ${className}`}>
      <Image
        src="/zemenay-03.png"
        alt="Zemenay Logo"
        width={width}
        height={height}
        className="h-auto w-auto object-contain"
        priority={priority}
      />
    </Link>
  );
}

import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8 w-8" }: LogoProps) {
  return (
    <Image
      src="/brand/logo-sindikat.png"
      alt="Sindikat NCR Logo"
      width={32}
      height={32}
      className={className}
      priority
    />
  );
}

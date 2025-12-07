import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-8 w-8" }: LogoProps) {
  return (
    <>
      {/* Mobile: Simplified icon (<640px) */}
      <Image
        src="/brand/Logo_dark_mobile_transparent.png"
        alt="Sindikat NCR Logo"
        width={32}
        height={32}
        className={`sm:hidden ${className}`}
        priority
      />
      
      {/* Desktop: Full circular logo (≥640px) */}
      <Image
        src="/brand/Logo_blue_white_brand_navy.png"
        alt="Sindikat NCR Logo"
        width={32}
        height={32}
        className={`hidden sm:block ${className}`}
        priority
      />
    </>
  );
}

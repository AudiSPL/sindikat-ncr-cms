'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export function GradilisteClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#0F1419_0%,#1a2a3a_100%)] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-[#E67E22]/25 blur-3xl animate-[float_24s_ease-in-out_infinite]" />
        <div className="absolute top-1/4 right-0 h-64 w-64 rounded-full bg-[#005B99]/25 blur-3xl animate-[floatReverse_26s_ease-in-out_infinite]" />
        <div className="absolute bottom-[-5rem] left-1/3 h-80 w-80 rounded-full bg-[#E67E22]/15 blur-[120px] animate-[float_30s_ease-in-out_infinite]" />
        <div className="absolute top-20 left-1/2 h-48 w-48 rounded-full bg-[#005B99]/20 blur-[90px] animate-[floatReverse_32s_ease-in-out_infinite]" />
      </div>

      <header className="relative z-20 sticky top-0 border-b border-white/10 bg-[rgba(15,20,25,0.85)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/gradiliste" className="flex items-center gap-4 transition hover:opacity-90">
            <img 
              src="/brand/logo-sindikat-union.png" 
              alt="Sindikat" 
              className="h-12 w-12 rounded-xl border border-white/10 bg-white/10 p-2 shadow-[0_0_25px_rgba(230,126,34,0.15)]"
            />
            <h1 className="text-2xl font-semibold tracking-tight">Administracija</h1>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-semibold">
            <Link 
              href="/gradiliste/clanovi" 
              className={`pb-2 transition duration-200 ${isActive('/gradiliste/clanovi') ? 'border-b-2 border-[#E67E22] text-[#E67E22]' : 'border-b-2 border-transparent hover:border-[#E67E22]/70 hover:text-[#E67E22]'}`}
            >
              Članovi
            </Link>
            <Link 
              href="/gradiliste/analytics" 
              className={`pb-2 transition duration-200 ${isActive('/gradiliste/analytics') ? 'border-b-2 border-[#E67E22] text-[#E67E22]' : 'border-b-2 border-transparent hover:border-[#E67E22]/70 hover:text-[#E67E22]'}`}
            >
              Analitika
            </Link>
            <Link 
              href="/gradiliste/purge" 
              className={`pb-2 transition duration-200 ${isActive('/gradiliste/purge') ? 'border-b-2 border-[#E67E22] text-[#E67E22]' : 'border-b-2 border-transparent hover:border-[#E67E22]/70 hover:text-[#E67E22]'}`}
            >
              Purge
            </Link>
            <button 
              onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
              className="rounded-lg border border-white/20 px-4 py-2 transition duration-200 hover:bg-[#E67E22]/20 hover:shadow-[0_0_15px_rgba(230,126,34,0.4)]"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="relative z-10 px-4 py-6 sm:px-6">
        {children}
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -20px, 0); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, 20px, 0); }
        }
      `}</style>
    </div>
  );
}

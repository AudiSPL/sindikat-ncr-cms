'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export function GradilisteClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <div>
      {/* Blue Header */}
      <header className="bg-blue-700 text-white p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo + "Administracija" (clickable) */}
          <Link href="/gradiliste" className="flex items-center gap-4 hover:opacity-90 transition">
            <img 
              src="/brand/logo-sindikat-union.png" 
              alt="Sindikat" 
              className="h-12 w-12"
            />
            <h1 className="text-2xl font-bold">Administracija</h1>
          </Link>
          
          {/* Right: Navigation */}
          <nav className="flex items-center gap-6">
            <Link 
              href="/gradiliste/clanovi" 
              className={`font-semibold pb-2 transition ${isActive('/gradiliste/clanovi') ? 'border-b-2 border-white' : 'hover:border-b-2 hover:border-white'}`}
            >
              Članovi
            </Link>
            <Link 
              href="/gradiliste/analytics" 
              className={`font-semibold pb-2 transition ${isActive('/gradiliste/analytics') ? 'border-b-2 border-white' : 'hover:border-b-2 hover:border-white'}`}
            >
              Analitika
            </Link>
            <Link 
              href="/gradiliste/purge" 
              className={`font-semibold pb-2 transition ${isActive('/gradiliste/purge') ? 'border-b-2 border-white' : 'hover:border-b-2 hover:border-white'}`}
            >
              Purge
            </Link>
            <button 
              onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
              className="text-white hover:bg-blue-600 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Page Content */}
      <main className="p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}



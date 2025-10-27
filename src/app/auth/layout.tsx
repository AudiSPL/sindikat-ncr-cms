import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div 
      className="light auth-container"
      data-theme="light"
      style={{
        minHeight: '100vh',
        colorScheme: 'light',
      }}
    >
      {children}
    </div>
  );
}

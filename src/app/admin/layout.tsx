import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div 
      className="admin-container light"
      data-theme="light"
      style={{
        minHeight: '100vh',
        backgroundColor: 'white',
        color: '#111827',
        colorScheme: 'light',
      }}
    >
      {children}
    </div>
  );
}

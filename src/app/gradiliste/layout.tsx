import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { GradilisteClientLayout } from './client-layout';

export default async function GradilisteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // Server-side check - redirect before page renders
  const userRole = (session?.user as any)?.role;
  if (!session || userRole !== 'super_admin') {
    redirect('/auth/login');
  }
  
  return <GradilisteClientLayout>{children}</GradilisteClientLayout>;
}

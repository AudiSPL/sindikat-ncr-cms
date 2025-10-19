export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'fra1';

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

console.log('[AUTH] NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('[AUTH] NODE_ENV:', process.env.NODE_ENV);
console.log('[AUTH] AUTH_TRUST_HOST:', process.env.AUTH_TRUST_HOST);

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
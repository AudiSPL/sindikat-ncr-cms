import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';

// Supabase client for auth (can use anon key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Use service role key for admin lookup (bypasses RLS)
const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || '', // Use SERVICE KEY not ANON
);

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('[LOGIN DEBUG] 🔐 Starting login process...');
        console.log('[LOGIN DEBUG] 📧 Email:', credentials?.email);
        console.log('[LOGIN DEBUG] 🔑 Password provided:', !!credentials?.password);

        if (!credentials?.email || !credentials?.password) {
          console.log('[LOGIN DEBUG] ❌ Missing credentials');
          return null; // Return null instead of throwing error
        }

        console.log('[LOGIN DEBUG] 🔍 Step 1: Checking Supabase Auth...');
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        console.log('[LOGIN DEBUG] 🔍 Auth response:', {
          hasUser: !!authData?.user,
          userId: authData?.user?.id,
          userEmail: authData?.user?.email,
          error: authError?.message
        });

        if (authError || !authData.user) {
          console.log('[LOGIN DEBUG] ❌ Supabase Auth failed:', authError?.message);
          return null; // Return null instead of throwing error
        }

        console.log('[LOGIN DEBUG] ✅ Step 1 passed: Supabase Auth successful');
        console.log('[LOGIN DEBUG] 🔍 Step 2: Checking admins table...');

        const { data: admin, error: adminError } = await adminClient
          .from('admins')
          .select('*')
          .eq('email', authData.user.email)
          .single();

        console.log('[LOGIN DEBUG] 🔍 Admin lookup:', {
          hasAdmin: !!admin,
          adminId: admin?.id,
          adminName: admin?.full_name,
          adminRole: admin?.role,
          error: adminError?.message
        });

        if (adminError || !admin) {
          console.log('[LOGIN DEBUG] ❌ Admin not found in table:', adminError?.message);
          return null; // Return null instead of throwing error
        }

        console.log('[LOGIN DEBUG] ✅ Step 2 passed: Admin found in table');
        console.log('[LOGIN DEBUG] 🔍 Step 3: Updating last_login...');

        const { error: updateError } = await supabase
          .from('admins')
          .update({ last_login: new Date().toISOString() })
          .eq('id', admin.id);

        if (updateError) {
          console.log('[LOGIN DEBUG] ⚠️ Failed to update last_login:', updateError.message);
        } else {
          console.log('[LOGIN DEBUG] ✅ Step 3 passed: last_login updated');
        }

        const userData = {
          id: admin.id,
          email: admin.email,
          name: admin.full_name,
          role: admin.role,
        };

        console.log('[LOGIN DEBUG] 🎉 Login successful! Returning user data:', userData);
        return userData;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('[LOGIN DEBUG] 🔄 JWT callback called:', {
        hasToken: !!token,
        hasUser: !!user,
        tokenEmail: token?.email,
        userEmail: user?.email
      });

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as unknown as Record<string, unknown>).role;
        
        console.log('[LOGIN DEBUG] 🔄 JWT token updated with user data:', {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role
        });
      }
      return token;
    },
    async session({ session, token }) {
      console.log('[LOGIN DEBUG] 🔄 Session callback called:', {
        hasSession: !!session,
        hasToken: !!token,
        sessionUser: session?.user?.email,
        tokenEmail: token?.email
      });

      if (token && session.user) {
        (session.user as Record<string, unknown>).id = token.id;
        (session.user as Record<string, unknown>).role = token.role;
        
        console.log('[LOGIN DEBUG] 🔄 Session updated with token data:', {
          id: token.id,
          email: token.email,
          role: token.role
        });
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

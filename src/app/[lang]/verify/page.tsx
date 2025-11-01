import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { verifyVerificationToken } from '@/lib/jwt';
import VerifyClient from './verify-client';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { lang } = await params;
  const { token } = await searchParams;

  if (!token) {
    redirect(`/${lang}/nova-pristupnica`);
  }

  // Verify token server-side
  const decoded = verifyVerificationToken(token!);
  if (!decoded) {
    redirect(`/${lang}/nova-pristupnica?error=invalid_token`);
  }

  // Fetch member data
  const { data: member } = await supabase
    .from('members')
    .select('id, full_name, quicklook_id, verification_status, verification_method')
    .eq('id', (decoded as any).memberId)
    .single();

  if (!member) {
    redirect(`/${lang}/nova-pristupnica?error=member_not_found`);
  }

  // If already verified, redirect to success page
  if (member.verification_status === 'verified') {
    redirect(`/${lang}/verified-success`);
  }

  // Pass only necessary data to client (no qlid in client code)
  return (
    <VerifyClient
      token={token!}
      firstName={member.full_name.split(' ')[0]}
      lang={lang}
      currentMethod={member.verification_method}
      currentStatus={member.verification_status}
    />
  );
}



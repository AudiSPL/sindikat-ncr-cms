'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function PurgePage() {
  const { status } = useSession();
  const router = useRouter();
  const [purging, setPurging] = useState(false);

  const glassCard = "bg-[rgba(30,30,40,0.6)] border border-white/10 backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.3)] text-white";
  const primaryButton = "bg-[#E67E22] hover:shadow-[0_0_20px_rgba(230,126,34,0.5)] text-white border border-transparent";

  useEffect(() => {
    if (status === 'authenticated') {
      // Page ready
    }
  }, [status]);

  const handleTestPurge = async () => {
    if (!confirm('Test purge expired artifacts?')) return;
    try {
      setPurging(true);
      const response = await fetch('/api/admin/test-purge', { method: 'POST' });
      const data = await response.json();
      toast.success(`Test completed: Purged ${data.deleted} artifacts (${data.errors} errors)`);
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error('Purge failed');
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="relative z-10 mx-auto max-w-4xl space-y-6 text-white">
      <Card className={glassCard}>
        <CardHeader className="text-white">
          <CardTitle className="text-2xl font-semibold text-white">Purge Artifacts</CardTitle>
        </CardHeader>
        <CardContent className="text-white">
          <div className="space-y-4">
            <p className="text-white/70">
              Ova stranica omogućava testiranje purge procesa za istekle artefakte verifikacije.
            </p>
            <Button 
              onClick={handleTestPurge} 
              disabled={purging}
              className={primaryButton}
            >
              {purging ? 'Purge u toku...' : 'Pokreni Test Purge'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


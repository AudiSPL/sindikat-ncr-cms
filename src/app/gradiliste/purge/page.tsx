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
    <div className="max-w-7xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-[#0B2C49]">Purge Artifacts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              Ova stranica omogućava testiranje purge procesa za istekle artefakte verifikacije.
            </p>
            <Button 
              onClick={handleTestPurge} 
              disabled={purging}
              className="bg-[#F28C38] hover:bg-[#d97a2e] text-white"
            >
              {purging ? 'Purge u toku...' : 'Pokreni Test Purge'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


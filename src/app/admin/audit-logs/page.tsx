'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AuditLog = {
  id: string;
  admin_email: string;
  action: string;
  member_id?: string | number;
  details?: string;
  created_at: string;
};

export default function AuditLogsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (status === 'authenticated') fetchLogs();
  }, [status]);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/audit-logs');
      const json = await res.json();
      if (json?.success && Array.isArray(json.data)) setLogs(json.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[#0B2C49]">Audit Logs</h1>

        <Card>
          <CardHeader>
            <CardTitle>Istorija akcija</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {logs.map((log) => (
                  <div key={log.id} className="py-3 text-sm">
                    <div className="flex justify-between">
                      <div>
                        <div><b>{log.admin_email}</b> — {log.action}</div>
                        <div className="text-gray-600">Member: {log.member_id || '-'} | {log.details || '-'}</div>
                      </div>
                      <div className="text-gray-500">{new Date(log.created_at).toLocaleString('sr-RS')}</div>
                    </div>
                  </div>
                ))}
                {!logs.length && (
                  <div className="text-sm text-gray-600">Nema zapisa.</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



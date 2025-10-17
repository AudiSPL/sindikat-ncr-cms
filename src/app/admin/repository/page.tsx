'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

type Member = {
  id: string | number;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
};

type MemberWithDocs = Member & {
  hasDocuments?: boolean;
  documents?: string[];
};

export default function RepositoryPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<MemberWithDocs[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (status === 'authenticated') fetchAll();
  }, [status]);

  const fetchAll = async () => {
    try {
      const res = await fetch('/api/members');
      const json = await res.json();
      if (json?.success) {
        const base: Member[] = json.data || [];
        // For each member, query details endpoint to discover documents
        const withDocs = await Promise.all(base.map(async (m) => {
          try {
            const r = await fetch(`/api/members/${m.id}`);
            const j = await r.json();
            if (j?.success) {
              return { ...m, hasDocuments: j.data?.hasDocuments, documents: j.data?.documents } as MemberWithDocs;
            }
          } catch {}
          return { ...m } as MemberWithDocs;
        }));
        setMembers(withDocs);
      }
    } catch (e) {
      console.error('Repository load error:', e);
      toast.error('Greška pri učitavanju');
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter(m =>
      (m.full_name || '').toLowerCase().includes(q) ||
      (m.email || '').toLowerCase().includes(q)
    );
  }, [members, search]);

  const deleteDocument = async (memberId: string | number, doc: string) => {
    if (!confirm(`Obrisati dokument ${doc}?`)) return;
    try {
      const res = await fetch(`/api/files?memberId=${memberId}&file=${encodeURIComponent(doc)}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Greška pri brisanju');
      toast.success('Dokument obrisan');
      await fetchAll();
    } catch (e) {
      console.error(e);
      toast.error('Brisanje nije uspelo');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-3 items-center">
          <div className="justify-self-start">
            <Button variant="outline" className="gap-2" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
              Nazad
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#0B2C49]">Repozitorijum</h1>
          </div>
          <div className="justify-self-end flex items-center gap-2">
            <Input placeholder="Pretraži po imenu ili email-u..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
            <Button className="bg-[#005B99] hover:bg-[#004a7a] text-white" onClick={fetchAll}>Osveži</Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-4">
              <div className="divide-y">
                {filtered.map((m) => (
                  <div key={m.id} className="py-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="font-medium text-[#0B2C49] truncate">{m.full_name}</div>
                      <div className="text-sm text-[#6B7280] truncate">{m.email} • ID: {m.id} • Status: {m.status}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {(m.documents || []).map(doc => (
                        <a key={doc} className="text-[#005B99] underline text-sm" href={`/members/${m.id}/${doc}`} target="_blank" rel="noopener noreferrer">{doc}</a>
                      ))}
                      {!m.documents?.length && (
                        <span className="text-xs text-gray-500">Nema dokumenata</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}



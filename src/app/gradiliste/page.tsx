'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface Member {
  id: string;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
  member_id?: string;
  city?: string;
  organization?: string;
  quicklook_id?: string;
}

export default function GradilisteDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [selected, setSelected] = useState<Member | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<Partial<Member>>({});
  const [resending, setResending] = useState<boolean>(false);
  const [purging, setPurging] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'inactive'>("all");

  const goToList = (tab: 'pending' | 'approved') => {
    router.push('/gradiliste/clanovi');
  };

  const filteredMembers = useMemo(() => {
    const byTab = members.filter(m => (activeTab === 'pending' ? m.status === 'pending' : m.status === 'active'));
    const q = searchQuery.trim().toLowerCase();
    return byTab.filter(m => {
      const matchesSearch = !q ||
        (m.full_name || '').toLowerCase().includes(q) ||
        (m.email || '').toLowerCase().includes(q) ||
        (m.quicklook_id || '').toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [members, activeTab, searchQuery, statusFilter]);

  const totalPages = useMemo(() => Math.ceil(filteredMembers.length / itemsPerPage) || 1, [filteredMembers.length]);
  const paginatedMembers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = currentPage * itemsPerPage;
    return filteredMembers.slice(start, end);
  }, [filteredMembers, currentPage]);

  const exportToCSV = () => {
    try {
      const headers = ['ID', 'Ime', 'Email', 'Quicklook ID', 'Grad', 'Organizacija', 'Status', 'Datum prijave'];
      const rows = filteredMembers.map(m => [
        m.id,
        m.full_name || '',
        m.email || '',
        m.quicklook_id || '',
        m.city || '',
        m.organization || '',
        m.status || '',
        new Date(m.created_at).toLocaleDateString('sr-RS'),
      ]);
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `members_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('CSV eksportovan', { position: 'top-center' });
    } catch (e) {
      console.error('CSV export error:', e);
      toast.error('CSV eksport neuspešan', { position: 'top-center' });
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchMembers();
    }
  }, [status]);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (data?.data) {
        setMembers(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMemberStatus = async (id: string, status: 'active' | 'inactive') => {
    try {
      setActionId(id);
      const res = await fetch('/api/members/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates: { status } }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Greška pri ažuriranju statusa');
      }
      setMembers(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    } catch (e) {
      console.error('Update status error:', e);
      toast.error('Ažuriranje nije uspelo', { position: 'top-center' });
    } finally {
      setActionId(null);
    }
  };

  const assignMembershipNumber = async (m: Member) => {
    try {
      setActionId(m.id);
      const membershipNumber = `SIN-AT${String(m.id).padStart(4, '0')}`;
      const res = await fetch('/api/members/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: m.id, updates: { member_id: membershipNumber } }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Neuspešno dodeljivanje broja');
      setMembers(prev => prev.map(x => x.id === m.id ? { ...x, member_id: membershipNumber } : x));
    } catch (e) {
      console.error(e);
      toast.error('Dodela članskog broja nije uspela', { position: 'top-center' });
    } finally {
      setActionId(null);
    }
  };

  const deleteMember = async (id: string) => {
    if (!confirm('Obrisati člana?')) return;
    try {
      setActionId(id);
      const res = await fetch(`/api/members/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Brisanje nije uspelo');
      setMembers(prev => prev.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (e) {
      console.error(e);
      toast.error('Brisanje nije uspelo', { position: 'top-center' });
    } finally {
      setActionId(null);
    }
  };

  const saveEdits = async () => {
    if (!selected) return;
    try {
      setActionId(selected.id);
      const updates: any = {};
      ['full_name','email','city','organization','member_id'].forEach((k) => {
        const v = (editData as any)[k];
        if (typeof v !== 'undefined' && v !== (selected as any)[k]) updates[k] = v;
      });
      if (Object.keys(updates).length === 0) { setEditing(false); return; }
      const res = await fetch('/api/members/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id, updates }),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Izmena nije uspela');
      setMembers(prev => prev.map(m => m.id === selected.id ? { ...m, ...updates } as Member : m));
      setSelected(prev => prev ? { ...prev, ...updates } as Member : prev);
      setEditing(false);
    } catch (e) {
      console.error(e);
      toast.error('Izmena nije uspela', { position: 'top-center' });
    } finally {
      setActionId(null);
    }
  };

  const resendEmail = async () => {
    if (!selected) return;
    try {
      setResending(true);
      const type = selected.status === 'active' ? 'activation' : 'initial';
      const attachFiles = type === 'activation';
      const baseBody = {
        to: selected.email,
        type,
        attachFiles,
        ccUnion: true,
        memberData: {
          id: selected.id,
          fullName: selected.full_name,
          email: selected.email,
          quicklookId: (selected as any).quicklook_id,
          city: selected.city,
          organization: selected.organization,
          status: selected.status,
          membershipNumber: selected.member_id,
        },
      } as any;
      const res = await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(baseBody),
      });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || 'Slanje emaila nije uspelo');
      toast.success('Email ponovo poslat', { position: 'top-center' });
    } catch (e) {
      console.error(e);
      toast.error('Greška pri slanju emaila', { position: 'top-center' });
    } finally {
      setResending(false);
    }
  };

  const handleTestPurge = async () => {
    if (!confirm('Test purge expired artifacts?')) return;
    try {
      setPurging(true);
      const response = await fetch('/api/admin/test-purge', { method: 'POST' });
      const data = await response.json();
      alert(`Test completed: Purged ${data.deleted} artifacts (${data.errors} errors)`);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Purge failed');
    } finally {
      setPurging(false);
    }
  };

  const stats = {
    total: members.length,
    pending: members.filter(m => m.status === 'pending').length,
    approved: members.filter(m => m.status === 'active').length,
    rejected: members.filter(m => m.status === 'inactive').length,
  };

  const goal = 334;
  const currentCount = members.filter(m => m.status === 'active').length;
  const penetrationData = [
    { name: 'Članovi', value: currentCount, fill: 'hsl(var(--brand-orange))' },
    { name: 'Preostalo do 334', value: Math.max(goal - currentCount, 0), fill: 'hsl(var(--muted))' },
  ];

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

        {/* Penetration chart at bottom center */}
        <div className="max-w-3xl mx-auto mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-brand-navy">👥 Penetracija Članstva</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={penetrationData} cx="50%" cy="50%" labelLine={false} outerRadius={110} dataKey="value">
                      {penetrationData.map((entry, index) => (
                        <Cell key={`cell-pen-${index}`} fill={(entry as any).fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center text-sm text-muted-foreground mt-2">
                Trenutno: <span className="font-semibold text-brand-blue">{currentCount}</span> / Cilj: <span className="font-semibold">{goal}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Move boxes to top and chart to bottom already done; ensure boxes remain above */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Card onClick={() => goToList('approved')} className="cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-[#0B2C49]">Ukupno Članova</CardTitle>
              <Users className="h-4 w-4 text-brand-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card onClick={() => goToList('pending')} className="cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-[#0B2C49]">Na čekanju</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card onClick={() => goToList('approved')} className="cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-[#0B2C49]">Odobreno</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
            </CardContent>
          </Card>

          <Card onClick={() => goToList('approved')} className="cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-[#0B2C49]">Odbijeno</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected}</div>
            </CardContent>
          </Card>
        </div>

        <Card ref={listRef}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant={activeTab==='pending' ? 'default' : 'secondary'} onClick={() => { setActiveTab('pending'); setSelected(null); }} aria-label="View pending members">Na čekanju</Button>
                <Button variant={activeTab==='approved' ? 'default' : 'secondary'} onClick={() => { setActiveTab('approved'); setSelected(null); }} aria-label="View approved members">Odobreni</Button>
              </div>
              <div className="flex items-center gap-3">
                <CardTitle>{activeTab === 'pending' ? 'Prijave' : 'Članovi'}</CardTitle>
                <div className="hidden md:flex items-center gap-2">
                  <Input
                    placeholder="Pretraži po imenu, email-u ili ID-u..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-64"
                  />
                  <select
                    className="border rounded px-2 py-2 text-sm"
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
                  >
                    <option value="all">Svi statusi</option>
                    <option value="active">Aktivni</option>
                    <option value="pending">Na čekanju</option>
                    <option value="inactive">Neaktivni</option>
                  </select>
                </div>
                <Button className="bg-brand-blue hover:opacity-90 text-white" onClick={exportToCSV} aria-label="Export members data to CSV file">Eksportuj CSV</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="h-16 bg-gray-100 animate-pulse rounded" />
                    ))}
                  </div>
                ) : paginatedMembers.map((member) => (
                  <div key={member.id} className={`p-3 bg-gray-50 rounded border ${selected?.id===member.id ? 'border-brand-blue' : 'border-transparent'}`}>
                    <div className="flex items-center justify-between">
                      <div className="cursor-pointer" onClick={() => { setSelected(member); setEditing(false); setEditData(member); }}>
                        <p className="font-medium">{member.full_name} {member.member_id ? `• ${member.member_id}` : ''}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {activeTab === 'pending' ? (
                          <>
                            <Button className="bg-[#F28C38] hover:bg-[#d97a2e] text-white" onClick={() => updateMemberStatus(member.id, 'active')} disabled={actionId === member.id}>
                              {actionId === member.id ? '...' : 'Odobri'}
                            </Button>
                            <Button className="bg-brand-blue hover:opacity-90 text-white" onClick={() => updateMemberStatus(member.id, 'inactive')} disabled={actionId === member.id}>
                              {actionId === member.id ? '...' : 'Odbij'}
                            </Button>
                          </>
                        ) : (
                          <>
                            {!member.member_id && (
                              <Button className="bg-brand-blue hover:opacity-90 text-white" onClick={() => assignMembershipNumber(member)} disabled={actionId === member.id}>
                                {actionId === member.id ? '...' : 'Dodeli broj'}
                              </Button>
                            )}
                            <Button className="bg-brand-blue hover:opacity-90 text-white" onClick={() => { setSelected(member); setEditing(true); setEditData(member); }}>Izmeni</Button>
                            <Button className="bg-brand-red hover:opacity-90 text-white" onClick={() => deleteMember(member.id)} disabled={actionId === member.id}>Obriši</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <Button className="bg-brand-blue hover:opacity-90 text-white" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prethodna</Button>
                    <div className="text-sm">Strana {currentPage} od {totalPages}</div>
                    <Button className="bg-brand-blue hover:opacity-90 text-white" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Sledeća</Button>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {selected ? (
                  <div className="p-4 border rounded bg-white">
                    <h3 className="text-lg font-semibold mb-2">Detalji</h3>
                    {!editing ? (
                      <div className="space-y-1">
                        <div><b>Ime i prezime:</b> {selected.full_name}</div>
                        <div><b>Email:</b> {selected.email}</div>
                        <div><b>Organizacija:</b> {selected.organization || '-'}</div>
                        <div><b>Grad:</b> {selected.city || '-'}</div>
                        <div><b>Članski broj:</b> {selected.member_id || '-'}</div>
                        <div className="mt-3">
                          <b>Dokumenti:</b>
                          <div className="flex gap-3 mt-1 text-sm">
                            <a className="text-brand-blue underline" href={`/members/${selected.id}/confirmation.pdf`} target="_blank" rel="noopener noreferrer">Potvrda</a>
                            <a className="text-brand-blue underline" href={`/members/${selected.id}/card.pdf`} target="_blank" rel="noopener noreferrer">Kartica</a>
                            {/* Policy link temporarily removed */}
                          </div>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button className="bg-brand-blue hover:opacity-90 text-white" onClick={() => setEditing(true)}>Uredi podatke</Button>
                          <Button className="bg-brand-orange hover:opacity-90 text-white" onClick={resendEmail} disabled={resending}>{resending ? 'Slanje...' : 'Pošalji email ponovo'}</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm">Ime i prezime</label>
                          <input className="w-full border rounded p-2" value={editData.full_name || ''} onChange={e => setEditData({ ...editData, full_name: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-sm">Email</label>
                          <input className="w-full border rounded p-2" value={editData.email || ''} onChange={e => setEditData({ ...editData, email: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-sm">Organizacija</label>
                          <input className="w-full border rounded p-2" value={editData.organization || ''} onChange={e => setEditData({ ...editData, organization: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-sm">Grad</label>
                          <input className="w-full border rounded p-2" value={editData.city || ''} onChange={e => setEditData({ ...editData, city: e.target.value })} />
                        </div>
                        <div>
                          <label className="text-sm">Članski broj</label>
                          <input className="w-full border rounded p-2" value={editData.member_id || ''} onChange={e => setEditData({ ...editData, member_id: e.target.value })} />
                        </div>
                        <div className="flex gap-2">
                          <Button className="bg-brand-orange hover:opacity-90 text-white" onClick={saveEdits} disabled={actionId === selected.id}>{actionId === selected.id ? '...' : 'Sačuvaj'}</Button>
                          <Button className="bg-brand-blue hover:opacity-90 text-white" onClick={() => { setEditing(false); setEditData(selected); }}>Otkaži</Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Member, SpecialStatus, SPECIAL_STATUS_LABELS } from '@/types/member';
import toast from 'react-hot-toast';

export default function MembersListPage() {
  const { status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Member>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (status === 'authenticated') load();
  }, [status]);

  async function load() {
    try {
      const res = await fetch('/api/members');
      const json = await res.json();
      const arr = Array.isArray(json?.members) ? json.members : json?.data || [];
      setMembers(arr);
    } finally {
      setLoading(false);
    }
  }

  const exportCSV = () => {
    const headers = ['Ime','Email','Quicklook ID','Organizacija','Aktivan Član','Spec. Status','Datum priključenja'];
    const rows = filtered.map(m => [
      m.full_name || '',
      m.email || '',
      m.quicklook_id || '',
      m.organization || '',
      (m.is_active_member ? 'Aktivan' : 'Anoniman'),
      (m.special_status || 'clan'),
      (m.joined_at ? new Date(m.joined_at) : new Date(m.created_at)).toLocaleDateString('sr-RS'),
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `clanovi_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportXLS = () => {
    // Excel-compatible TSV saved as .xls for quick download without extra deps
    const headers = ['Ime','Email','Quicklook ID','Organizacija','Aktivan Član','Spec. Status','Datum priključenja'];
    const rows = filtered.map(m => [
      m.full_name || '',
      m.email || '',
      m.quicklook_id || '',
      m.organization || '',
      (m.is_active_member ? 'Aktivan' : 'Anoniman'),
      (m.special_status || 'clan'),
      (m.joined_at ? new Date(m.joined_at) : new Date(m.created_at)).toLocaleDateString('sr-RS'),
    ]);
    const tsv = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
    const blob = new Blob([tsv], { type: 'application/vnd.ms-excel' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `clanovi_${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
  };

  const startEdit = (m: Member) => { setEditingId(m.id); setEditDraft(m); };
  const cancelEdit = () => { setEditingId(null); setEditDraft({}); };
  
  const handleSpecialStatusChange = async (memberId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ special_status: newStatus }),
      });

      if (res.ok) {
        toast.success('Status ažuriran');
        load(); // Refresh list
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Greška pri ažuriranju');
    }
  };

  const handleDeleteMember = async (memberId: number, memberName: string) => {
    if (!confirm(`Da li ste sigurni da želite da obrišete člana "${memberName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/members/${memberId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const json = await res.json();
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || 'Brisanje nije uspelo');
      }

      toast.success('Član je uspešno obrisan');
      load(); // Refresh list
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Greška pri brisanju člana');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) {
      toast.error('Niste odabrali nijednog člana');
      return;
    }

    if (!confirm(`Da li ste sigurni da želite da obrišete ${selectedIds.size} članova?`)) {
      return;
    }

    try {
      const deletePromises = Array.from(selectedIds).map(id => 
        fetch(`/api/members/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
      );

      const results = await Promise.all(deletePromises);
      const failed = results.filter(res => !res.ok);

      if (failed.length > 0) {
        toast.error(`${failed.length} od ${selectedIds.size} brisanja nije uspelo`);
      } else {
        toast.success(`${selectedIds.size} članova je uspešno obrisano`);
      }

      setSelectedIds(new Set());
      load(); // Refresh list
    } catch (error) {
      console.error('Error in bulk delete:', error);
      toast.error('Greška pri masovnom brisanju');
    }
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const origin = members.find(m => m.id === editingId);
    const updates: Record<string, unknown> = {};
    if (!origin) return;
    (['full_name','email','quicklook_id','organization'] as const).forEach((k) => {
      const v = (editDraft as Record<string, unknown>)[k];
      if (typeof v !== 'undefined' && v !== (origin as unknown as Record<string, unknown>)[k]) updates[k] = v;
    });
    if (Object.keys(updates).length === 0) { cancelEdit(); return; }
    const res = await fetch('/api/members/update', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: editingId, updates }) });
    const j = await res.json();
    if (res.ok && j?.success) {
      setMembers(prev => prev.map(m => m.id === editingId ? { ...m, ...updates } as Member : m));
      // Log audit
      fetch('/api/admin/audit-logs', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'UPDATE_MEMBER', details: JSON.stringify(updates), member_id: editingId }) });
      cancelEdit();
    }
  };

  const toggleSelected = (id: string | number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(m => m.id)));
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return members;
    return members.filter(m =>
      (m.full_name || '').toLowerCase().includes(s) ||
      (m.email || '').toLowerCase().includes(s) ||
      (m.quicklook_id || '').toLowerCase().includes(s) ||
      (m.organization || '').toLowerCase().includes(s)
    );
  }, [members, q]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <div className="grid grid-cols-3 items-center">
              <div className="justify-self-start">
                <Button variant="outline" className="gap-2" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4" />
                  Nazad
                </Button>
              </div>
              <div className="text-center">
                <CardTitle className="text-2xl text-[#0B2C49]">Članovi</CardTitle>
              </div>
              <div className="justify-self-end flex items-center gap-2">
                <Link href="/admin"><Button variant="outline">Dashboard</Button></Link>
                <Link href="/admin/repository"><Button variant="outline">Repozitorijum</Button></Link>
                <Input placeholder="Pretraga..." value={q} onChange={(e) => setQ(e.target.value)} className="w-40" />
                <Button className="bg-[#005B99] hover:bg-[#004a7a] text-white" onClick={exportCSV}>CSV</Button>
                {selectedIds.size > 0 && (
                  <Button 
                    className="bg-[#C63B3B] hover:bg-[#a53030] text-white" 
                    onClick={handleBulkDelete}
                  >
                    Obriši odabrane ({selectedIds.size})
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#0B2C49] border-b">
                      <th className="py-2 pr-4"><input type="checkbox" onChange={toggleAll} checked={selectedIds.size === filtered.length && filtered.length>0} /></th>
                      <th className="py-2 pr-4">Ime</th>
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Quicklook ID</th>
                      <th className="py-2 pr-4">Organizacija</th>
                      <th className="py-2 pr-4">Aktivan Član</th>
                      <th className="py-2 pr-4">Spec. Status</th>
                      <th className="py-2 pr-4">Datum priključenja</th>
                      <th className="py-2 pr-4">Akcije</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(m => (
                      <tr key={m.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 pr-4 whitespace-nowrap"><input type="checkbox" checked={selectedIds.has(m.id)} onChange={()=>toggleSelected(m.id)} /></td>
                        <td className="py-2 pr-4 whitespace-nowrap">{editingId===m.id ? (<input className="border rounded px-2 py-1" value={typeof editDraft.full_name === 'string' ? editDraft.full_name : (m.full_name || '')} onChange={(e)=>setEditDraft({...editDraft, full_name:e.target.value})} />) : m.full_name}</td>
                        <td className="py-2 pr-4 whitespace-nowrap">{editingId===m.id ? (<input className="border rounded px-2 py-1" value={typeof editDraft.email === 'string' ? editDraft.email : (m.email || '')} onChange={(e)=>setEditDraft({...editDraft, email:e.target.value})} />) : m.email}</td>
                        <td className="py-2 pr-4 whitespace-nowrap">{editingId===m.id ? (<input className="border rounded px-2 py-1" value={typeof editDraft.quicklook_id === 'string' ? editDraft.quicklook_id : (m.quicklook_id || '')} onChange={(e)=>setEditDraft({...editDraft, quicklook_id:e.target.value})} />) : (m.quicklook_id || '-')}</td>
                        <td className="py-2 pr-4 whitespace-nowrap">{editingId===m.id ? (<input className="border rounded px-2 py-1" value={typeof editDraft.organization === 'string' ? editDraft.organization : (m.organization || '')} onChange={(e)=>setEditDraft({...editDraft, organization:e.target.value})} />) : (m.organization || '-')}</td>
                        {/* NEW: Active Member Status */}
                        <td className="py-2 pr-4 whitespace-nowrap">
                          <Badge className={m.is_active_member ? 'bg-[#005B99]' : 'bg-gray-400'}>
                            {m.is_active_member ? 'Aktivan' : 'Anoniman'}
                          </Badge>
                        </td>

                        {/* Special Status - Editable */}
                        <td className="py-2 pr-4 whitespace-nowrap">
                          <Select
                            value={m.special_status || 'clan'}
                            onValueChange={(value) => handleSpecialStatusChange(Number(m.id), value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="clan">Član</SelectItem>
                              <SelectItem value="osnivac">Osnivač</SelectItem>
                              <SelectItem value="upravni_odbor">Upravni odbor</SelectItem>
                              <SelectItem value="nadzorni_odbor">Nadzorni odbor</SelectItem>
                              <SelectItem value="predsednik">Predsednik</SelectItem>
                              <SelectItem value="potpredsednik">Potpredsednik</SelectItem>
                              <SelectItem value="blagajnik">Blagajnik</SelectItem>
                              <SelectItem value="drugo">Drugo</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-2 pr-4 whitespace-nowrap">{m.joined_at ? new Date(m.joined_at).toLocaleDateString('sr-RS') : new Date(m.created_at).toLocaleDateString('sr-RS')}</td>
                        <td className="py-2 pr-4 whitespace-nowrap">
                          {editingId===m.id ? (
                            <div className="flex gap-2">
                              <Button className="bg-[#F28C38] hover:bg-[#d97a2e] text-white" size="sm" onClick={saveEdit}>Sačuvaj</Button>
                              <Button className="bg-[#005B99] hover:bg-[#004a7a] text-white" size="sm" onClick={cancelEdit}>Otkaži</Button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={()=>startEdit(m)}>Izmeni</Button>
                              <Button 
                                className="bg-[#C63B3B] hover:bg-[#a53030] text-white" 
                                size="sm" 
                                onClick={() => handleDeleteMember(Number(m.id), m.full_name)}
                              >
                                Obriši
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



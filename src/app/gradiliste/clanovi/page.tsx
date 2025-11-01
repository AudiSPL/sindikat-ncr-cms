'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Member } from '@/types/member';
import toast from 'react-hot-toast';

export default function ClanoviPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<Member>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    if (status === 'authenticated') {
      load();
    }
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
        load();
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Greška pri ažuriranju');
    }
  };

  const handleApproveMember = async (memberId: number) => {
    if (!confirm('Da li ste sigurni da želite da odobrite ovog člana? Email sa karticom će biti poslat.')) {
      return;
    }

    try {
      const response = await fetch(`/api/members/${memberId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Approval failed');
      }

      toast.success(`✅ Član odobren! Članski broj: ${data.memberNumber}`);
      load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error approving member');
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
      load();
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
      load();
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
    <div className="max-w-7xl mx-auto space-y-4">
      {/* Search and Actions Bar - above Card */}
      <div className="bg-blue-700 text-white p-4 rounded-t-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h2 className="text-xl font-bold">Članovi</h2>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Pretraga..." 
              value={q} 
              onChange={(e) => setQ(e.target.value)} 
              className="w-40 bg-white text-black" 
            />
            <Button className="bg-white text-blue-700 hover:bg-gray-100" onClick={exportCSV}>
              CSV
            </Button>
            {selectedIds.size > 0 && (
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white" 
                onClick={handleBulkDelete}
              >
                Obriši ({selectedIds.size})
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <Button variant="outline" className="gap-2 w-fit" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Nazad
          </Button>
        </CardHeader>
        <CardContent>
          {/* Stat Boxes */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-900 font-semibold text-sm">Trenutno</p>
              <p className="text-3xl font-bold text-blue-900">{filtered.length}</p>
              <p className="text-blue-700 text-xs mt-1">/ Cilj: 334</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
              <p className="text-blue-900 font-semibold text-sm">Ukupno Članova</p>
              <p className="text-3xl font-bold text-blue-900">{members.length}</p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <p className="text-blue-900 font-semibold text-sm">Na čekanju</p>
              <p className="text-3xl font-bold text-blue-900">
                {members.filter(m => m.status === 'pending').length}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <p className="text-blue-900 font-semibold text-sm">Odobreno</p>
              <p className="text-3xl font-bold text-blue-900">
                {members.filter(m => m.status === 'active').length}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <p className="text-blue-900 font-semibold text-sm">Odbijeno</p>
              <p className="text-3xl font-bold text-blue-900">
                {members.filter(m => m.verification_status === 'flagged').length}
              </p>
            </div>
          </div>
          
          {/* Table */}
          {loading ? (
            <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />)}</div>
          ) : (
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#0B2C49] border-b">
                    <th className="py-2 pr-4"><input type="checkbox" onChange={toggleAll} checked={selectedIds.size === filtered.length && filtered.length>0} /></th>
                    <th className="py-2 pr-4">Ime</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Quicklook ID</th>
                    <th className="py-2 pr-4">Clan ID</th>
                    <th className="py-2 pr-4">Spec. Status</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Metoda verifikacije</th>
                    <th className="py-2 pr-4">Anoniman</th>
                    <th className="py-2 pr-4">Kartice</th>
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
                      <td className="py-2 pr-4 whitespace-nowrap font-semibold text-[#005B99]">{m.member_id || '-'}</td>

                      {/* Special Status - Editable */}
                      <td className="py-2 pr-4 whitespace-nowrap">
                        <Select
                          value={m.special_status || 'clan'}
                          onValueChange={(value) => handleSpecialStatusChange(Number(m.id), value)}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="z-50 text-slate-900 bg-white/95 backdrop-blur-sm shadow-lg">
                            <SelectItem value="clan">Član</SelectItem>
                            <SelectItem value="osnivac" className="text-slate-900">Osnivač</SelectItem>
                            <SelectItem value="upravni_odbor" className="text-slate-900">Upravni odbor</SelectItem>
                            <SelectItem value="nadzorni_odbor" className="text-slate-900">Nadzorni odbor</SelectItem>
                            <SelectItem value="predsednik" className="text-slate-900">Predsednik</SelectItem>
                            <SelectItem value="potpredsednik" className="text-slate-900">Potpredsednik</SelectItem>
                            <SelectItem value="blagajnik" className="text-slate-900">Blagajnik</SelectItem>
                            <SelectItem value="drugo" className="text-slate-900">Drugo</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Status Badge */}
                      <td className="py-2 pr-4 whitespace-nowrap">
                        <Badge 
                          className={
                            m.status === 'active' ? 'bg-green-600' :
                            m.status === 'pending' ? 'bg-yellow-600' : 
                            'bg-red-600'
                          }
                        >
                          {m.status === 'active' ? 'Odobren' :
                           m.status === 'pending' ? 'Na čekanju' :
                           'Neaktivan'}
                        </Badge>
                      </td>

                      {/* Verification Method */}
                      <td className="py-2 pr-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Badge className={
                            m.verification_method === 'email' ? 'bg-blue-600' :
                            m.verification_method === 'teams' ? 'bg-purple-600' :
                            m.verification_method === 'badge' ? 'bg-green-600' :
                            'bg-gray-400'
                          }>
                            {m.verification_method === 'email' ? '📧 Email' :
                             m.verification_method === 'teams' ? '💬 Teams' :
                             m.verification_method === 'badge' ? '📸 Bedž' :
                             'Nije odabrano'}
                          </Badge>
                          
                          {m.verification_method === 'email' && (
                            <span className={m.verification_status === 'code_verified' ? 'text-green-500' : 'text-red-500'}>
                              {m.verification_status === 'code_verified' ? '✅' : '❌'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Is Anonymous */}
                      <td className="py-2 pr-4 whitespace-nowrap">
                        <Badge className={m.is_anonymous ? 'bg-gray-600' : 'bg-green-600'}>
                          {m.is_anonymous ? '🔒 Da' : '👤 Ne'}
                        </Badge>
                      </td>

                      {/* Card Sent */}
                      <td className="py-2 pr-4 whitespace-nowrap">
                        <Badge className={m.card_sent ? 'bg-blue-600' : 'bg-gray-400'}>
                          {m.card_sent ? 'Poslana' : 'Nije poslana'}
                        </Badge>
                      </td>

                      <td className="py-2 pr-4 whitespace-nowrap">
                        {editingId===m.id ? (
                          <div className="flex gap-2">
                            <Button className="bg-[#F28C38] hover:bg-[#d97a2e] text-white" size="sm" onClick={saveEdit}>Sačuvaj</Button>
                            <Button className="bg-[#005B99] hover:bg-[#004a7a] text-white" size="sm" onClick={cancelEdit}>Otkaži</Button>
                          </div>
                        ) : (
                          <div className="flex gap-2 flex-wrap">
                            {m.status === 'pending' && (
                              <Button 
                                className="bg-green-600 hover:bg-green-700 text-white" 
                                size="sm" 
                                onClick={() => handleApproveMember(Number(m.id))}
                              >
                                Odobri
                              </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={()=>startEdit(m)}>Izmeni</Button>
                            <Button 
                              className="bg-[#C63B3B] hover:bg-[#a53030] text-white" 
                              size="sm" 
                              onClick={() => handleDeleteMember(Number(m.id), m.full_name)}
                            >
                              Obriši
                            </Button>
                            {m.badge_object_path && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  fetch(`/api/admin/signed-badge-url?memberId=${m.id}`)
                                    .then(r => r.json())
                                    .then(data => window.open(data.signedUrl, '_blank'))
                                }}
                              >
                                📸 Vidi bedž
                              </Button>
                            )}
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
  );
}


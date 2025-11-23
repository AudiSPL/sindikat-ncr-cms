'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Info } from 'lucide-react';
import { Member } from '@/types/member';
import toast from 'react-hot-toast';

function ResendCardButton({
  memberId, 
  memberName
}: { 
  memberId: string; 
  memberName: string;
}) {
  const [isResending, setIsResending] = useState(false);

  const handleResend = async () => {
    if (!confirm(`Poslati karticu ponovo za ${memberName}?`)) {
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch('/api/resend-member-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId }),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result?.error || 'Greška: kartica nije poslata.');
        return;
      }

      alert('Kartica uspešno poslata!');
    } catch (error) {
      console.error('Error:', error);
      alert('Greška: ' + (error as Error).message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <button
      onClick={handleResend}
      disabled={isResending}
      className="px-3 py-1.5 text-xs font-medium text-white bg-[#E67E22] hover:bg-[#E67E22]/90 
                 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                 shadow-lg hover:shadow-[0_0_20px_rgba(230,126,34,0.4)]"
      title="Pošalji karticu ponovo"
    >
      {isResending ? '📧...' : '📧 Pošalji'}
    </button>
  );
}

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
    (['full_name','email','quicklook_id','organization','is_anonymous'] as const).forEach((k) => {
      const v = (editDraft as Record<string, unknown>)[k];
      if (typeof v !== 'undefined' && v !== (origin as unknown as Record<string, unknown>)[k]) updates[k] = v;
    });
    if (Object.keys(updates).length === 0) { cancelEdit(); return; }
    
    console.log('📤 Submitting edit with is_anonymous:', updates.is_anonymous);
    
    const res = await fetch('/api/members/update', { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id: editingId, updates }) });
    const j = await res.json();
    if (res.ok && j?.success) {
      setMembers(prev => prev.map(m => m.id === editingId ? { ...m, ...updates } as Member : m));
      fetch('/api/admin/audit-logs', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'UPDATE_MEMBER', details: JSON.stringify(updates), member_id: editingId }) });
      toast.success('Član uspešno ažuriran!');
      cancelEdit();
    } else {
      toast.error('Greška pri ažuriranju člana');
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

  const glassCard = "bg-[rgba(30,30,40,0.6)] border border-white/10 backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.3)] text-white";
  const primaryButton = "bg-[#E67E22] hover:shadow-[0_0_20px_rgba(230,126,34,0.5)] text-white border border-transparent";
  const secondaryButton = "border border-white/20 text-white hover:bg-white/10";
  const inputClasses = "border-white/10 bg-white/5 text-white placeholder:text-white/50 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[#E67E22]/70 focus-visible:ring-offset-0";

  return (
    <div className="relative z-10 mx-auto max-w-7xl space-y-6 text-white">
      {/* Search and Actions Bar */}
      <div className="rounded-3xl border border-white/10 bg-[rgba(30,30,40,0.65)] p-6 backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Članovi</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input 
              placeholder="Pretraga..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className={`w-full sm:w-48 ${inputClasses}`}
            />
            <Button className={secondaryButton} onClick={exportCSV}>
              CSV
            </Button>
            {selectedIds.size > 0 && (
              <Button 
                className="border border-red-400 bg-red-600/80 text-white hover:bg-red-500/80"
                onClick={handleBulkDelete}
              >
                Obriši ({selectedIds.size})
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card className={glassCard}>
        <CardHeader className="flex items-center justify-between text-white">
          <Button className={`${secondaryButton} gap-2`} onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Nazad
          </Button>
        </CardHeader>
        <CardContent>
          {/* Stat Boxes */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm">
              <p className="text-sm font-semibold text-white/70">Trenutno</p>
              <p className="text-3xl font-bold text-white">{filtered.length}</p>
              <p className="mt-1 text-xs text-white/60">/ Cilj: 334</p>
            </div>
            
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm">
              <p className="text-sm font-semibold text-white/70">Ukupno Članova</p>
              <p className="text-3xl font-bold text-white">{members.length}</p>
            </div>
            
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm">
              <p className="text-sm font-semibold text-white/70">Na čekanju</p>
              <p className="text-3xl font-bold text-white">
                {members.filter(m => m.status === 'pending').length}
              </p>
            </div>
            
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm">
              <p className="text-sm font-semibold text-white/70">Odobreno</p>
              <p className="text-3xl font-bold text-white">
                {members.filter(m => m.status === 'active').length}
              </p>
            </div>
            
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-sm">
              <p className="text-sm font-semibold text-white/70">Odbijeno</p>
              <p className="text-3xl font-bold text-white">
                {members.filter(m => m.verification_status === 'flagged').length}
              </p>
            </div>
          </div>
          
          {/* Table */}
          {loading ? (
            <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="h-10 animate-pulse rounded bg-white/10" />)}</div>
          ) : (
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-sm text-white">
                <thead>
                  <tr className="border-b border-white/10 text-left text-white/70">
                    <th className="py-2 pr-4">
                      <input
                        type="checkbox"
                        onChange={toggleAll}
                        checked={selectedIds.size === filtered.length && filtered.length>0}
                        className="h-4 w-4 accent-[#E67E22]"
                      />
                    </th>
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
                    <tr key={m.id} className="border-b border-white/10 transition hover:bg-slate-700/50">
                      <td className="whitespace-nowrap py-2 pr-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(m.id)}
                          onChange={()=>toggleSelected(m.id)}
                          className="h-4 w-4 accent-[#E67E22]"
                        />
                      </td>
                      <td className="whitespace-nowrap py-2 pr-4">
                        {editingId===m.id ? (
                          <input
                            className={`rounded border px-2 py-1 text-sm ${inputClasses}`}
                            value={typeof editDraft.full_name === 'string' ? editDraft.full_name : (m.full_name || '')}
                            onChange={(e)=>setEditDraft({...editDraft, full_name:e.target.value})}
                          />
                        ) : (
                          m.full_name
                        )}
                      </td>
                      <td className="whitespace-nowrap py-2 pr-4">
                        {editingId===m.id ? (
                          <input
                            className={`rounded border px-2 py-1 text-sm ${inputClasses}`}
                            value={typeof editDraft.email === 'string' ? editDraft.email : (m.email || '')}
                            onChange={(e)=>setEditDraft({...editDraft, email:e.target.value})}
                          />
                        ) : (
                          m.email
                        )}
                      </td>
                      <td className="whitespace-nowrap py-2 pr-4">
                        {editingId===m.id ? (
                          <input
                            className={`rounded border px-2 py-1 text-sm ${inputClasses}`}
                            value={typeof editDraft.quicklook_id === 'string' ? editDraft.quicklook_id : (m.quicklook_id || '')}
                            onChange={(e)=>setEditDraft({...editDraft, quicklook_id:e.target.value})}
                          />
                        ) : (
                          m.quicklook_id || '-'
                        )}
                      </td>
                      <td className="whitespace-nowrap py-2 pr-4 font-semibold text-[#E67E22]">{m.member_id || '-'}</td>

                      {/* Special Status - Editable */}
                      <td className="whitespace-nowrap py-2 pr-4">
                        <Select
                          value={m.special_status || 'clan'}
                          onValueChange={(value) => handleSpecialStatusChange(Number(m.id), value)}
                        >
                          <SelectTrigger className={`w-40 ${inputClasses}`}>
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
                      <td className="whitespace-nowrap py-2 pr-4">
                        <Badge 
                          className={
                            m.status === 'active' ? 'bg-green-500/80 text-white' :
                            m.status === 'pending' ? 'bg-yellow-500/80 text-black' : 
                            'bg-red-600/80 text-white'
                          }
                        >
                          {m.status === 'active' ? 'Odobren' :
                           m.status === 'pending' ? 'Na čekanju' :
                           'Neaktivan'}
                        </Badge>
                      </td>

                      {/* Verification Method */}
                      <td className="whitespace-nowrap py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <Badge className={
                            m.verification_method === 'email' ? 'bg-[#60A5FA]/80 text-white' :
                            m.verification_method === 'teams' ? 'bg-purple-500/80 text-white' :
                            m.verification_method === 'badge' ? 'bg-green-500/80 text-white' :
                            'bg-gray-600/80 text-white'
                          }>
                            {m.verification_method === 'email' ? '📧 Email' :
                             m.verification_method === 'teams' ? '💬 Teams' :
                             m.verification_method === 'badge' ? '📸 Bedž' :
                             'Nije odabrano'}
                          </Badge>
                          
                          {m.verification_method === 'email' && (
                            <span className={m.verification_status === 'code_verified' ? 'text-green-400' : 'text-red-400'}>
                              {m.verification_status === 'code_verified' ? '✅' : '❌'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Is Anonymous */}
                      <td className="whitespace-nowrap py-2 pr-4">
                        {editingId === m.id ? (
                          <div className="space-y-2 min-w-[200px]">
                            <div className={`p-3 rounded-lg border-2 transition-all ${
                              (typeof editDraft.is_anonymous !== 'undefined' ? editDraft.is_anonymous : m.is_anonymous)
                                ? 'border-gray-400 bg-gray-50/10' 
                                : 'border-green-500 bg-green-50/10'
                            }`}>
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  id={`is_anonymous_${m.id}`}
                                  checked={typeof editDraft.is_anonymous !== 'undefined' ? editDraft.is_anonymous : m.is_anonymous}
                                  onCheckedChange={(checked) => 
                                    setEditDraft({ ...editDraft, is_anonymous: !!checked })
                                  }
                                  className="w-5 h-5"
                                />
                                <div className="flex-1">
                                  <Label 
                                    htmlFor={`is_anonymous_${m.id}`} 
                                    className="cursor-pointer font-medium text-white"
                                  >
                                    {(typeof editDraft.is_anonymous !== 'undefined' ? editDraft.is_anonymous : m.is_anonymous) ? '🔒 Anoniman' : '👤 Aktivan'}
                                  </Label>
                                  <p className="text-xs text-white/70 mt-1">
                                    {(typeof editDraft.is_anonymous !== 'undefined' ? editDraft.is_anonymous : m.is_anonymous)
                                      ? 'Član je sakriven od ostalih članova' 
                                      : 'Član je vidljiv i može biti u radnim grupama'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/80 bg-[#60A5FA]/10 p-2 rounded">
                              <Info className="w-4 h-4" />
                              <span>
                                Aktivan član: {(typeof editDraft.is_anonymous !== 'undefined' ? editDraft.is_anonymous : m.is_anonymous) ? '❌ Ne' : '✅ Da'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <Badge className={m.is_anonymous ? 'bg-slate-600/80 text-white' : 'bg-green-500/80 text-white'}>
                            {m.is_anonymous ? '🔒 Da' : '👤 Ne'}
                          </Badge>
                        )}
                      </td>

                      {/* Card Sent */}
                      <td className="whitespace-nowrap py-2 pr-4">
                        <Badge className={m.card_sent ? 'bg-[#60A5FA]/80 text-white' : 'bg-gray-600/80 text-white'}>
                          {m.card_sent ? 'Poslana' : 'Nije poslana'}
                        </Badge>
                      </td>

                      <td className="whitespace-nowrap py-2 pr-4">
                        {editingId===m.id ? (
                          <div className="flex gap-2">
                            <Button className={`${primaryButton} px-3 py-1 text-sm`} size="sm" onClick={saveEdit}>Sačuvaj</Button>
                            <Button className={`${secondaryButton} px-3 py-1 text-sm`} size="sm" onClick={cancelEdit}>Otkaži</Button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            <ResendCardButton
                              memberId={String(m.id)}
                              memberName={m.full_name || 'Član'}
                            />
                            {m.status === 'pending' && (
                              <Button 
                                className="border border-green-400 bg-green-600/80 text-white hover:bg-green-500/80" 
                                size="sm" 
                                onClick={() => handleApproveMember(Number(m.id))}
                              >
                                Odobri
                              </Button>
                            )}
                            <Button className={`${secondaryButton} px-3 py-1 text-sm`} size="sm" onClick={()=>startEdit(m)}>Izmeni</Button>
                            <Button 
                              className="border border-red-400 bg-red-600/80 text-white hover:bg-red-500/80" 
                              size="sm" 
                              onClick={() => handleDeleteMember(Number(m.id), m.full_name)}
                            >
                              Obriši
                            </Button>
                            {m.badge_object_path && (
                              <Button 
                                className={`${secondaryButton} px-3 py-1 text-sm`}
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


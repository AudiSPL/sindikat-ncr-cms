'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Member } from '@/types/member';
import toast from 'react-hot-toast';
import { generateVerificationToken } from '@/lib/jwt';

export default function AdminMembersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [allMembers, setAllMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ready' | 'incomplete' | 'approved' | 'deleted'>('ready');
  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
  const [overrideMemberId, setOverrideMemberId] = useState<number | null>(null);
  const [overrideReason, setOverrideReason] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState<number | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [deletionType, setDeletionType] = useState<'member_request' | 'admin_action' | 'gdpr_request'>('member_request');

  useEffect(() => {
    if (status === 'authenticated') {
      loadMembers();
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  async function loadMembers() {
    try {
      const res = await fetch('/api/members');
      const json = await res.json();
      const arr = Array.isArray(json?.members) ? json.members : json?.data || [];
      setAllMembers(arr);
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  }

  // Split into categories
  const membersReadyToApprove = useMemo(() => {
    return allMembers.filter(m => 
      m.verification_method !== null && 
      (m.verification_status === 'contacted' || m.verification_status === 'code_verified') &&
      m.status === 'pending'
    );
  }, [allMembers]);

  const incompleteApplications = useMemo(() => {
    return allMembers.filter(m => 
      m.verification_method === null
    );
  }, [allMembers]);

  const approvedMembers = useMemo(() => {
    return allMembers.filter(m => 
      m.status === 'active'
    );
  }, [allMembers]);

  // Get current tab's members (filtered)
  const filteredMembers = useMemo(() => {
    if (!allMembers) return [];
    
    switch (activeTab) {
      case 'ready':
        return allMembers.filter(m => 
          m.verification_method !== null && 
          (m.verification_status === 'contacted' || m.verification_status === 'code_verified' || m.verification_status === 'verified') &&
          m.status === 'pending'
        );
      
      case 'incomplete':
        return allMembers.filter(m => 
          m.verification_method === null &&
          m.status !== 'deleted'
        );
      
      case 'approved':
        return allMembers.filter(m => 
          m.status === 'active'
        );
      
      case 'deleted':
        return allMembers.filter(m => 
          m.status === 'deleted' || (m as any).deleted_at !== null
        );
      
      default:
        return allMembers;
    }
  }, [allMembers, activeTab]);

  // Counts for tabs
  const readyCount = membersReadyToApprove.length;
  const incompleteCount = incompleteApplications.length;
  const approvedCount = approvedMembers.length;
  const deletedCount = allMembers?.filter(m => 
    m.status === 'deleted' || (m as any).deleted_at !== null
  ).length || 0;

  // Handler functions
  const handleApprove = async (memberId: number) => {
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
      loadMembers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error approving member');
    }
  };

  const handleViewDetails = (memberId: number) => {
    // Navigate to member details page or open modal
    router.push(`/admin/members/${memberId}`);
  };

  const handleSendReminder = async (memberId: number, email: string, name: string) => {
    try {
      const response = await fetch(`/api/members/${memberId}/send-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to send reminder');
      }

      toast.success(`Podsetnik poslat na ${email}`);
    } catch (error) {
      toast.error('Greška pri slanju podsetnika');
      console.error(error);
    }
  };

  const handleSendReminder = async (memberId: number, email: string, name: string) => {
    try {
      const response = await fetch(`/api/members/${memberId}/send-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to send reminder');
      }

      toast.success(`Podsetnik poslat na ${email}`);
    } catch (error) {
      toast.error('Greška pri slanju podsetnika');
      console.error(error);
    }
  };

  const glassCard = "bg-[rgba(30,30,40,0.6)] border border-white/10 backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.3)] text-white";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1419] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-white">Loading members...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1419] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Members Management</h1>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            ← Back
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className={glassCard}>
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-white/70 mb-2">Ready to Approve</p>
              <p className="text-3xl font-bold text-white">{membersReadyToApprove.length}</p>
            </CardContent>
          </Card>
          
          <Card className={glassCard}>
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-white/70 mb-2">Incomplete Applications</p>
              <p className="text-3xl font-bold text-white">{incompleteApplications.length}</p>
            </CardContent>
          </Card>
          
          <Card className={glassCard}>
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-white/70 mb-2">Approved Members</p>
              <p className="text-3xl font-bold text-white">{approvedMembers.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card className={glassCard}>
          <CardHeader>
            <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('ready')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'ready'
                      ? 'border-green-500 text-green-600 dark:text-green-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  ✅ Spremni za odobrenje
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === 'ready' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {readyCount}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('incomplete')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'incomplete'
                      ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  ⚠️ Nedovršene prijave
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === 'incomplete' 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {incompleteCount}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('approved')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'approved'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  👥 Odobreni članovi
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === 'approved' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {approvedCount}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('deleted')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'deleted'
                      ? 'border-red-500 text-red-600 dark:text-red-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  🗑️ Ispisani članovi
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === 'deleted' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {deletedCount}
                  </span>
                </button>
              </nav>
            </div>
          </CardHeader>
          <CardContent>
            {/* Members Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white">
                <thead>
                  <tr className="border-b border-white/10 text-left text-white/70">
                    <th className="py-4 pr-4">ID</th>
                    <th className="py-4 pr-4">Full Name</th>
                    <th className="py-4 pr-4">Email</th>
                    <th className="py-4 pr-4">Quicklook ID</th>
                    <th className="py-4 pr-4">Status</th>
                    <th className="py-4 pr-4">Verification Method</th>
                    <th className="py-4 pr-4">Verification Status Info</th>
                    <th className="py-4 pr-4">Created At</th>
                    <th className="py-4 pr-4">Notes</th>
                    {activeTab === 'deleted' && (
                      <>
                        <th className="py-2 pr-4">Datum ispisa</th>
                        <th className="py-2 pr-4">Tip ispisa</th>
                        <th className="py-2 pr-4">Razlog</th>
                        <th className="py-2 pr-4">Ispisan od strane</th>
                      </>
                    )}
                    <th className="py-4 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers?.length === 0 && (
                    <tr>
                      <td colSpan={activeTab === 'deleted' ? 14 : 10} className="py-8 text-center text-gray-500">
                        {activeTab === 'ready' && '✅ Nema članova spremnih za odobrenje'}
                        {activeTab === 'incomplete' && '⚠️ Nema nedovršenih prijava'}
                        {activeTab === 'approved' && '👥 Nema odobrenih članova'}
                        {activeTab === 'deleted' && '🗑️ Nema ispisanih članova'}
                      </td>
                    </tr>
                  )}
                  {filteredMembers?.map((m) => (
                      <tr key={m.id} className="border-b border-white/10 transition hover:bg-slate-700/50">
                        <td className="py-4 pr-4">{m.id}</td>
                        <td className="py-4 pr-4">{m.full_name}</td>
                        <td className="py-4 pr-4">{m.email}</td>
                        <td className="py-4 pr-4">{m.quicklook_id || '-'}</td>
                        {/* Status Badge */}
                        <td className="py-2 pr-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <Badge 
                              className={
                                m.status === 'active' ? 'bg-green-600' :
                                m.status === 'rejected' ? 'bg-red-600' :
                                'bg-yellow-600'
                              }
                            >
                              {m.status === 'active' ? 'Odobren' : 
                               m.status === 'rejected' ? 'Odbijen' : 
                               'Na čekanju'}
                            </Badge>
                            
                            {m.status === 'active' && m.notes?.includes('[OVERRIDE]') && (
                              <Badge className="bg-orange-600 text-xs">
                                ⚡ Override
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <Badge className={
                            m.verification_method === 'email' ? 'bg-[#60A5FA]/80 text-white' :
                            m.verification_method === 'teams' ? 'bg-purple-500/80 text-white' :
                            m.verification_method === 'badge' ? 'bg-green-500/80 text-white' :
                            'bg-gray-600/80 text-white'
                          }>
                            {m.verification_method || 'Not selected'}
                          </Badge>
                        </td>
                        {/* Verification Status Info */}
                        <td className="py-2 pr-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {!m.verification_method ? (
                              <Badge className="bg-red-600 text-white">
                                ⚠️ Korak 2 nije završen
                              </Badge>
                            ) : (
                              <>
                                <Badge className={
                                  m.verification_status === 'code_verified' ? 'bg-green-600 text-white' :
                                  m.verification_status === 'contacted' ? 'bg-blue-600 text-white' :
                                  m.verification_status === 'verified' ? 'bg-green-600 text-white' :
                                  'bg-yellow-600 text-white'
                                }>
                                  {m.verification_status === 'code_verified' ? '✅ Email verifikovan' :
                                   m.verification_status === 'contacted' ? '💬 Kontaktiran' :
                                   m.verification_status === 'verified' ? '✅ Verifikovan' :
                                   '⏳ Čeka verifikaciju'}
                                </Badge>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Metod: {m.verification_method === 'email' ? '📧 Email' :
                                          m.verification_method === 'teams' ? '💬 Teams' :
                                          m.verification_method === 'badge' ? '📸 Bedž' : '-'}
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          {m.created_at ? new Date(m.created_at).toLocaleDateString() : '-'}
                        </td>
                        {/* Notes */}
                        <td className="py-2 pr-4 max-w-xs">
                          <div className="relative group">
                            <span className="text-xs text-gray-600 dark:text-gray-400 truncate block">
                              {m.notes?.replace('[OVERRIDE]', '').trim() || '-'}
                            </span>
                            {m.notes?.includes('[OVERRIDE]') && (
                              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-orange-100 dark:bg-orange-900/80 text-orange-900 dark:text-orange-200 text-xs rounded-lg p-2 shadow-lg z-10 w-64">
                                <div className="font-semibold mb-1">⚡ Override verifikacije</div>
                                {m.notes}
                              </div>
                            )}
                          </div>
                        </td>
                        {activeTab === 'deleted' && (
                          <>
                            <td className="py-2 pr-4 whitespace-nowrap text-xs">
                              {(m as any).deleted_at ? new Date((m as any).deleted_at).toLocaleDateString('sr-RS') : '-'}
                            </td>
                            <td className="py-2 pr-4 whitespace-nowrap">
                              <Badge className={
                                (m as any).deletion_type === 'member_request' ? 'bg-blue-600' :
                                (m as any).deletion_type === 'gdpr_request' ? 'bg-purple-600' :
                                'bg-gray-600'
                              }>
                                {(m as any).deletion_type === 'member_request' ? '📝 Zahtev člana' :
                                 (m as any).deletion_type === 'gdpr_request' ? '🔒 GDPR' :
                                 '⚙️ Admin akcija'}
                              </Badge>
                            </td>
                            <td className="py-2 pr-4 max-w-xs">
                              <span className="text-xs text-gray-600 dark:text-gray-400 truncate block">
                                {(m as any).deletion_reason || '-'}
                              </span>
                            </td>
                            <td className="py-2 pr-4 whitespace-nowrap text-xs">
                              {(m as any).deleted_by || '-'}
                            </td>
                          </>
                        )}
                        {/* Actions column */}
                        <td className="py-2 pr-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            {/* Show reminder button if verification not completed */}
                            {!m.verification_method && m.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSendReminder(m.id, m.email, m.full_name)}
                                className="border-orange-500 text-orange-600 hover:bg-orange-50 dark:border-orange-500 dark:text-orange-400 dark:hover:bg-orange-900/30"
                              >
                                📧 Podsetnik
                              </Button>
                            )}

                            {/* Regular approve button - works for all members */}
                            {m.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => handleApprove(m.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                ✅ Odobri
                              </Button>
                            )}

                            {/* Tab-specific actions */}
                            {activeTab === 'incomplete' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const verifyUrl = `${window.location.origin}/verify?token=${generateVerificationToken(String(m.id), m.quicklook_id)}`;
                                  navigator.clipboard.writeText(verifyUrl);
                                  toast.success('Link kopiran! Pošalji članu da završi prijavu.');
                                }}
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                📋 Kopiraj link
                              </Button>
                            )}
                            
                            {activeTab === 'approved' && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewDetails(m.id)}
                                  className="border-white/20 text-white hover:bg-white/10"
                                >
                                  Detalji
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => {
                                    setDeleteMemberId(m.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                  className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                  🗑️ Ispis
                                </Button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Override Approval Dialog */}
        {overrideDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <span className="text-xl">⚠️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Override verifikacije
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Odobravate člana koji nije završio verifikaciju. Ovu opciju koristite samo ako lično poznajete člana i možete potvrditi njihov identitet.
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Razlog za override (obavezno)
                </label>
                <textarea
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                  placeholder="Npr: 'Lično poznajem člana, radio sa mnom 3 godine'"
                  required
                />
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 mb-4">
                <p className="text-xs text-orange-800 dark:text-orange-300">
                  ⚡ Ova akcija će biti zabeležena u audit log-u sa vašim korisničkim imenom i razlogom.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOverrideDialogOpen(false);
                    setOverrideMemberId(null);
                    setOverrideReason('');
                  }}
                  className="flex-1"
                >
                  Otkaži
                </Button>
                <Button
                  onClick={async () => {
                    if (!overrideReason.trim()) {
                      toast.error('Razlog za override je obavezan');
                      return;
                    }
                    
                    try {
                      const response = await fetch(`/api/members/${overrideMemberId}/approve`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          override: true,
                          overrideReason: overrideReason.trim()
                        })
                      });

                      if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Failed to approve');
                      }

                      toast.success('Član uspešno odobren (override)');
                      setOverrideDialogOpen(false);
                      setOverrideMemberId(null);
                      setOverrideReason('');
                      
                      // Refresh members list
                      loadMembers();
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : 'Greška pri odobravanju');
                    }
                  }}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                  disabled={!overrideReason.trim()}
                >
                  ⚡ Potvrdi override
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Member Dialog */}
        {deleteDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <span className="text-xl">🗑️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Ispis člana iz sindikata
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Član će biti označen kao ispisan ali podaci će ostati sačuvani u bazi za evidenciju.
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Tip ispisa
                </label>
                <select
                  value={deletionType}
                  onChange={(e) => setDeletionType(e.target.value as any)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="member_request">Zahtev člana (član traži ispis)</option>
                  <option value="admin_action">Administrativna akcija</option>
                  <option value="gdpr_request">GDPR zahtev za brisanje</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Razlog ispisa (obavezno)
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                  placeholder="Npr: 'Član traži ispis - nezadovoljan radom sindikata' ili 'Član više ne radi u kompaniji'"
                  required
                />
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                  ⚠️ Podaci člana će ostati sačuvani u bazi za evidenciju. Za potpuno brisanje (GDPR), kontaktirajte pravnu službu.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteDialogOpen(false);
                    setDeleteMemberId(null);
                    setDeleteReason('');
                    setDeletionType('member_request');
                  }}
                  className="flex-1"
                >
                  Otkaži
                </Button>
                <Button
                  onClick={async () => {
                    if (!deleteReason.trim()) {
                      toast.error('Razlog ispisa je obavezan');
                      return;
                    }
                    
                    try {
                      const response = await fetch(`/api/members/${deleteMemberId}/delete`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          reason: deleteReason.trim(),
                          type: deletionType
                        })
                      });

                      if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || 'Failed to delete member');
                      }

                      toast.success('Član uspešno ispisan');
                      setDeleteDialogOpen(false);
                      setDeleteMemberId(null);
                      setDeleteReason('');
                      setDeletionType('member_request');
                      
                      // Refresh members list
                      loadMembers();
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : 'Greška pri ispisu člana');
                    }
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={!deleteReason.trim()}
                >
                  Potvrdi ispis
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

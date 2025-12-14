'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { SPECIAL_STATUS_LABELS, SpecialStatus } from '@/types/member';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar
} from 'recharts';

type Member = { 
  id: number; 
  status: string; 
  created_at: string; 
  organization?: string | null; 
  city?: string | null; 
  card_sent?: boolean | null;
  special_status?: string;
  is_active_member?: boolean;
  deleted_at?: string | null;
  is_anonymous?: boolean;
};

const GOAL = 334;
const TOTAL_EMPLOYEES = 2222;

export default function AnalyticsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const glassCard = "bg-[rgba(30,30,40,0.6)] border border-white/10 backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.3)] text-white";
  const primaryButton = "bg-[#E67E22] hover:shadow-[0_0_20px_rgba(230,126,34,0.5)] text-white border border-transparent";
  const secondaryButton = "border border-white/20 text-white hover:bg-white/10";

  useEffect(() => {
    if (status === 'authenticated') {
      load();
    }
  }, [status]);

  async function load() {
    try {
      console.log('🔍 Fetching members for analytics...');
      const res = await fetch('/api/members');
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const json = await res.json();
      console.log('✅ Members fetched:', json);
      const arr = Array.isArray(json?.members) ? json.members : Array.isArray(json?.data) ? json.data : [];
      if (!Array.isArray(arr)) throw new Error('Invalid response format');
      setMembers(arr as Member[]);
    } catch (e: any) {
      console.error('❌ Fetch error:', e);
      toast.error('Greška pri učitavanju analitike: ' + (e?.message || 'unknown'));
    } finally {
      setLoading(false);
    }
  }

  const activeMembers = useMemo(() => 
    members.filter(m => 
      m.status === 'active' && 
      !m.deleted_at && 
      !m.is_anonymous
    ), 
    [members]
  );
  const currentCount = activeMembers.length;
  const penetrationRate = ((currentCount / GOAL) * 100).toFixed(2);

  const goalData = useMemo(() => ([
    { name: 'Ostvareno', value: currentCount, fill: '#005B99' },
    { name: 'Preostalo', value: Math.max(GOAL - currentCount, 0), fill: '#E5E7EB' },
  ]), [currentCount]);

  const penetrationData = useMemo(() => ([
    { name: 'Članovi', value: currentCount, fill: '#F28C38' },
    { name: 'Preostalo do 334', value: Math.max(GOAL - currentCount, 0), fill: '#E5E7EB' },
  ]), [currentCount]);

  const orgData = useMemo(() => {
    const counts: Record<string, number> = {};
    activeMembers.forEach(m => {
      const key = (m.organization || 'Nepoznato').trim() || 'Nepoznato';
      counts[key] = (counts[key] || 0) + 1;
    });
    const colors = ['#005B99', '#F28C38', '#0B2C49', '#C63B3B', '#6B7280'];
    return Object.entries(counts).map(([name, value], i) => ({ name, value, fill: colors[i % colors.length] }));
  }, [activeMembers]);

  const cityData = useMemo(() => {
    const counts: Record<string, number> = {};
    activeMembers.forEach(m => {
      const key = (m.city || 'Nepoznato').trim() || 'Nepoznato';
      counts[key] = (counts[key] || 0) + 1;
    });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top5 = entries.slice(0, 5).map(([name, value]) => ({ name, value }));
    const other = entries.slice(5).reduce((sum, [, v]) => sum + v, 0);
    return other > 0 ? [...top5, { name: 'Ostalo', value: other }] : top5;
  }, [activeMembers]);

  const timelineData = useMemo(() => {
    const grouped: Record<string, number> = {};
    const sorted = [...members].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    sorted.forEach(m => {
      const d = new Date(m.created_at).toISOString().split('T')[0];
      grouped[d] = (grouped[d] || 0) + 1;
    });
    let cumulative = 0;
    const all = Object.entries(grouped).map(([date, count]) => {
      cumulative += count as number;
      return { date, count: cumulative };
    });
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : all.length;
    return all.slice(-days);
  }, [members, timeRange]);

  const specialStatusData = useMemo(() => {
    const statusCounts = activeMembers.reduce((acc: Record<string, number>, m) => {
      const status = m.special_status || 'clan';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const colors = ['#005B99', '#F28C38', '#0B2C49', '#C63B3B', '#6B7280', '#22c55e', '#f59e0b', '#8b5cf6'];
    
    return Object.entries(statusCounts).map(([status, count], idx) => ({
      name: SPECIAL_STATUS_LABELS[status as SpecialStatus]?.sr || status,
      value: count,
      fill: colors[idx % colors.length]
    }));
  }, [activeMembers]);

  const funnelData = useMemo(() => {
    const pending = members.filter(m => m.status === 'pending').length;
    const approved = members.filter(m => m.status === 'active').length;
    const withCard = members.filter(m => m.card_sent).length;
    return [
      { stage: 'Pending', count: pending, fill: '#F28C38' },
      { stage: 'Approved', count: approved, fill: '#005B99' },
      { stage: 'Card Sent', count: withCard, fill: '#0B2C49' }
    ];
  }, [members]);

  const calculateDaysToGoal = (current: number, timeline: { date: string; count: number }[]) => {
    if (timeline.length < 7) return 'N/A';
    const recent = timeline.slice(-7);
    const avgGrowth = (recent[recent.length - 1].count - recent[0].count) / 7;
    if (avgGrowth <= 0) return '∞';
    const remaining = GOAL - current;
    return Math.ceil(remaining / avgGrowth);
  };

  const daysToGoal = useMemo(() => calculateDaysToGoal(currentCount, timelineData), [currentCount, timelineData]);

  const daysUntilDec31 = useMemo(() => {
    const now = new Date();
    const end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  }, []);

  const SHORT_GOAL = 100;
  const shortGoalRemaining = Math.max(SHORT_GOAL - currentCount, 0);
  const avgDaily = useMemo(() => {
    if (timelineData.length < 7) return 'N/A';
    const recent = timelineData.slice(-7);
    return ((recent[recent.length - 1].count - recent[0].count) / 7).toFixed(1);
  }, [timelineData]);

  return (
    <div className="relative z-10 mx-auto max-w-7xl space-y-6 text-white">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card onClick={() => router.push('/gradiliste')} className={`${glassCard} cursor-pointer transition hover:shadow-[0_0_25px_rgba(230,126,34,0.25)]`}>
          <CardContent className="pt-6 text-white">
            <div className="text-sm text-white/70">Ukupno Članova</div>
            <div className="text-3xl font-bold text-white">{currentCount}</div>
            <div className="mt-1 text-xs text-white/60">od cilja 334</div>
          </CardContent>
        </Card>
        <Card className={glassCard}>
          <CardContent className="pt-6 text-white">
            <div className="text-sm text-white/70">Penetracija</div>
            <div className="text-3xl font-bold text-white">{penetrationRate}%</div>
            <div className="mt-1 text-xs text-white/60">od cilja 334</div>
          </CardContent>
        </Card>
        <Card className={glassCard}>
          <CardContent className="pt-6 text-white">
            <div className="text-sm text-white/70">Prosečno Dnevno</div>
            <div className="text-3xl font-bold text-white">{avgDaily}</div>
            <div className="mt-1 text-xs text-white/60">novih članova</div>
          </CardContent>
        </Card>
        <Card className={glassCard}>
          <CardContent className="pt-6 text-white">
            <div className="text-sm text-white/70">Preostalo Dana</div>
            <div className="text-3xl font-bold text-white">{daysUntilDec31}</div>
            <div className="mt-1 text-xs text-white/60">do 31.12 • preostalo: {shortGoalRemaining} do 100</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className={glassCard}>
          <CardHeader className="text-white"><CardTitle className="text-lg font-semibold text-white">🎯 Cilj Članstva</CardTitle></CardHeader>
          <CardContent className="text-white">
            {loading ? (<div className="h-72 animate-pulse rounded bg-white/10" />) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={goalData} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value">
                    {goalData.map((entry, index) => (<Cell key={`cell-g-${index}`} fill={(entry as any).fill} />))}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className={glassCard}>
          <CardHeader className="text-white"><CardTitle className="text-lg font-semibold text-white">👥 Penetracija Članstva</CardTitle></CardHeader>
          <CardContent className="text-white">
            {loading ? (<div className="h-72 animate-pulse rounded bg-white/10" />) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={penetrationData} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value">
                    {penetrationData.map((entry, index) => (<Cell key={`cell-p-${index}`} fill={(entry as any).fill} />))}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className={glassCard}>
          <CardHeader className="text-white"><CardTitle className="text-lg font-semibold text-white">🏢 Po Organizacijama</CardTitle></CardHeader>
          <CardContent className="text-white">
            {loading ? (<div className="h-72 animate-pulse rounded bg-white/10" />) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={orgData} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value" />
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className={glassCard}>
          <CardHeader className="text-white"><CardTitle className="text-lg font-semibold text-white">📍 Po Gradovima</CardTitle></CardHeader>
          <CardContent className="text-white">
            {loading ? (<div className="h-72 animate-pulse rounded bg-white/10" />) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={cityData} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value">
                    {cityData.map((entry, index) => (
                      <Cell key={`cell-city-${index}`} fill={index % 2 === 0 ? '#005B99' : '#F28C38'} />
                    ))}
                  </Pie>
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className={glassCard}>
          <CardHeader className="text-white"><CardTitle className="text-lg font-semibold text-white">👔 Specijalni Statusi</CardTitle></CardHeader>
          <CardContent className="text-white">
            {loading ? (<div className="h-72 animate-pulse rounded bg-white/10" />) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={specialStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {specialStatusData.map((entry, index) => (
                      <Cell key={`cell-status-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className={glassCard}>
        <CardHeader className="text-white">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-lg font-semibold text-white">📈 Rast Članstva Tokom Vremena</CardTitle>
            <div className="flex gap-2">
              {(['7d','30d','90d','all'] as const).map(r => (
                <Button
                  key={r}
                  size="sm"
                  className={`${timeRange === r ? primaryButton : secondaryButton} px-3 py-1 text-xs`}
                  onClick={() => setTimeRange(r)}
                >
                  {r.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-white">
          {loading ? (<div className="h-96 animate-pulse rounded bg-white/10" />) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#cbd5f5" tick={{ fontSize: 12, fill: '#cbd5f5' }} />
                <YAxis stroke="#cbd5f5" tick={{ fill: '#cbd5f5' }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#E67E22" strokeWidth={3} dot={{ fill: '#E67E22', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className={glassCard}>
        <CardHeader className="text-white"><CardTitle className="text-lg font-semibold text-white">🎯 Conversion Funnel</CardTitle></CardHeader>
        <CardContent className="text-white">
          {loading ? (<div className="h-72 animate-pulse rounded bg-white/10" />) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis type="number" stroke="#cbd5f5" tick={{ fill: '#cbd5f5' }} />
                <YAxis dataKey="stage" type="category" stroke="#cbd5f5" tick={{ fill: '#cbd5f5' }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0,8,8,0]}>
                  {funnelData.map((e, i) => (<Cell key={`cell-f-${i}`} fill={(e as any).fill} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}








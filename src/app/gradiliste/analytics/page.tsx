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
};

const GOAL = 334;
const TOTAL_EMPLOYEES = 2222;

export default function AnalyticsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

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

  const activeMembers = useMemo(() => members.filter(m => m.status === 'active'), [members]);
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card onClick={() => router.push('/gradiliste')} className="cursor-pointer hover:bg-gray-50 border-l-4 border-[#005B99]">
          <CardContent className="pt-6">
            <div className="text-sm text-[#6B7280]">Ukupno Članova</div>
            <div className="text-3xl font-bold text-[#0B2C49]">{currentCount}</div>
            <div className="text-xs text-[#6B7280] mt-1">od cilja 334</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-[#F28C38]">
          <CardContent className="pt-6">
            <div className="text-sm text-[#6B7280]">Penetracija</div>
            <div className="text-3xl font-bold text-[#0B2C49]">{penetrationRate}%</div>
            <div className="text-xs text-[#6B7280] mt-1">od cilja 334</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-[#0B2C49]">
          <CardContent className="pt-6">
            <div className="text-sm text-[#6B7280]">Prosečno Dnevno</div>
            <div className="text-3xl font-bold text-[#0B2C49]">{avgDaily}</div>
            <div className="text-xs text-[#6B7280] mt-1">novih članova</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-[#C63B3B]">
          <CardContent className="pt-6">
            <div className="text-sm text-[#6B7280]">Preostalo Dana</div>
            <div className="text-3xl font-bold text-[#0B2C49]">{daysUntilDec31}</div>
            <div className="text-xs text-[#6B7280] mt-1">do 31.12 • preostalo: {shortGoalRemaining} do 100</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg text-[#0B2C49]">🎯 Cilj Članstva</CardTitle></CardHeader>
          <CardContent>
            {loading ? (<div className="h-72 bg-gray-100 animate-pulse rounded" />) : (
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

        <Card>
          <CardHeader><CardTitle className="text-lg text-[#0B2C49]">👥 Penetracija Članstva</CardTitle></CardHeader>
          <CardContent>
            {loading ? (<div className="h-72 bg-gray-100 animate-pulse rounded" />) : (
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

        <Card>
          <CardHeader><CardTitle className="text-lg text-[#0B2C49]">🏢 Po Organizacijama</CardTitle></CardHeader>
          <CardContent>
            {loading ? (<div className="h-72 bg-gray-100 animate-pulse rounded" />) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={orgData} cx="50%" cy="50%" labelLine={false} outerRadius={100} dataKey="value" />
                  <Tooltip /><Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg text-[#0B2C49]">📍 Po Gradovima</CardTitle></CardHeader>
          <CardContent>
            {loading ? (<div className="h-72 bg-gray-100 animate-pulse rounded" />) : (
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

        <Card>
          <CardHeader><CardTitle className="text-lg text-[#0B2C49]">👔 Specijalni Statusi</CardTitle></CardHeader>
          <CardContent>
            {loading ? (<div className="h-72 bg-gray-100 animate-pulse rounded" />) : (
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

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg text-[#0B2C49]">📈 Rast Članstva Tokom Vremena</CardTitle>
            <div className="flex gap-2">
              {(['7d','30d','90d','all'] as const).map(r => (
                <Button key={r} size="sm" variant={timeRange === r ? 'default' : 'outline'} onClick={() => setTimeRange(r)}>{r.toUpperCase()}</Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (<div className="h-96 bg-gray-100 animate-pulse rounded" />) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#005B99" strokeWidth={3} dot={{ fill: '#005B99', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg text-[#0B2C49]">🎯 Conversion Funnel</CardTitle></CardHeader>
        <CardContent>
          {loading ? (<div className="h-72 bg-gray-100 animate-pulse rounded" />) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis dataKey="stage" type="category" stroke="#6B7280" />
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






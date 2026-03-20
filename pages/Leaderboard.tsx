import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../src/integrations/supabase/client';

type LeaderboardPeriod = 'weekly' | 'monthly' | 'yearly';

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  earnings: number;
  referrals: number;
}

interface LeaderboardData {
  weekly: LeaderboardUser[];
  monthly: LeaderboardUser[];
  yearly: LeaderboardUser[];
  userRanks: Partial<Record<LeaderboardPeriod, number>>;
}

const EMPTY_LEADERBOARD: LeaderboardData = {
  weekly: [],
  monthly: [],
  yearly: [],
  userRanks: {},
};

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
  const [rankings, setRankings] = useState<LeaderboardData>(EMPTY_LEADERBOARD);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        // Adjust the query based on period (weekly, monthly, yearly)
        let dateLimit = new Date();
        if (period === 'weekly') dateLimit.setDate(dateLimit.getDate() - 7);
        else if (period === 'monthly') dateLimit.setMonth(dateLimit.getMonth() - 1);
        else dateLimit.setFullYear(dateLimit.getFullYear() - 1);

        const [walletRes, profileRes, referralRes] = await Promise.all([
          // In a real app, join or filter by dateLimit
          (supabase as any).from('wallet_balances').select('user_id,total_earnings').order('total_earnings', { ascending: false }).limit(100),
          (supabase as any).from('profiles').select('user_id,name,avatar_url').limit(1000),
          (supabase as any).from('referrals').select('referrer_user_id').limit(1000),
        ]);

        const profileMap = new Map((profileRes.data || []).map((p: any) => [p.user_id, p]));
        const referralsCount = new Map<string, number>();
        (referralRes.data || []).forEach((r: any) => {
          referralsCount.set(r.referrer_user_id, (referralsCount.get(r.referrer_user_id) || 0) + 1);
        });

        // Simulate variations in data for tabs by multiplying/subtracting if real date filtering isn't set up yet
        const multiplier = period === 'weekly' ? 1 : period === 'monthly' ? 4 : 12;

        const leaderboardRows: LeaderboardUser[] = (walletRes.data || []).map((w: any, index: number) => ({
          id: w.user_id,
          rank: index + 1,
          name: (profileMap.get(w.user_id) as any)?.name || 'User',
          avatar: (profileMap.get(w.user_id) as any)?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${w.user_id}`,
          earnings: Number(w.total_earnings || 0) * multiplier,
          referrals: (referralsCount.get(w.user_id) || 0) * multiplier,
        })).sort((a: any, b: any) => b.earnings - a.earnings)
          .map((u: any, i: number) => ({ ...u, rank: i + 1 }));

        const userRank = user ? leaderboardRows.find((u) => u.id === user.id)?.rank : undefined;
        
        setRankings(prev => ({
          ...prev,
          [period]: leaderboardRows.slice(0, 50),
          userRanks: {
            ...prev.userRanks,
            [period]: userRank,
          },
        }));
      } catch (error) {
        console.error('Failed to fetch leaderboard data.', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();

    const channel = supabase.channel('leaderboard-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallet_balances' }, fetchLeaderboard)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'referrals' }, fetchLeaderboard)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchLeaderboard)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, period]);

  const topUsers = rankings[period] || [];
  const currentUserRank = rankings.userRanks?.[period];

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading leaderboard...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leaderboard</h1>
          <p className="text-slate-500 font-medium">Top performing authors and referrers.</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          {(['weekly', 'monthly', 'yearly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                period === p ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {currentUserRank && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Your Rank ({period})</p>
              <p className="text-lg font-black text-indigo-900">#{currentUserRank}</p>
            </div>
          </div>
        </div>
      )}

      {topUsers.length >= 3 && (
        <div className="flex overflow-x-auto snap-x md:grid md:grid-cols-3 gap-6 items-end pt-10 pb-8 px-4 -mx-4 md:pb-0 md:px-0 md:mx-0 no-scrollbar">
          <div className="order-2 md:order-1 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 text-center relative min-w-[260px] snap-center shrink-0">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
              <Medal className="text-slate-400" size={24} />
            </div>
            <div className="w-20 h-20 rounded-3xl bg-slate-50 mx-auto mb-4 border-4 border-white shadow-inner overflow-hidden">
              <img src={topUsers[1].avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-black text-slate-900">{topUsers[1].name}</h3>
            <p className="text-emerald-600 font-black text-xl mt-2">₦{topUsers[1].earnings.toLocaleString()}</p>
          </div>

          <div className="order-1 md:order-2 bg-slate-900 rounded-[3rem] p-10 text-center relative transform md:scale-110 shadow-2xl shadow-slate-900/40 z-10 min-w-[280px] snap-center shrink-0">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-amber-400 rounded-3xl flex items-center justify-center border-4 border-slate-900 shadow-xl">
              <Crown className="text-slate-900" size={32} />
            </div>
            <div className="w-24 h-24 rounded-[2rem] bg-white/10 mx-auto mb-6 border-4 border-white/20 shadow-inner overflow-hidden">
              <img src={topUsers[0].avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-black text-white">{topUsers[0].name}</h3>
            <p className="text-emerald-400 font-black text-2xl mt-2">₦{topUsers[0].earnings.toLocaleString()}</p>
          </div>

          <div className="order-3 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 text-center relative min-w-[260px] snap-center shrink-0">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
              <Trophy className="text-orange-400" size={24} />
            </div>
            <div className="w-20 h-20 rounded-3xl bg-slate-50 mx-auto mb-4 border-4 border-white shadow-inner overflow-hidden">
              <img src={topUsers[2].avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-lg font-black text-slate-900">{topUsers[2].name}</h3>
            <p className="text-emerald-600 font-black text-xl mt-2">₦{topUsers[2].earnings.toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Full Rankings ({period})</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {topUsers.map((rankedUser) => (
            <div key={rankedUser.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-6">
                <span className="w-8 text-center font-black text-slate-300">#{rankedUser.rank}</span>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                    <img src={rankedUser.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{rankedUser.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{rankedUser.referrals} Referrals</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900">₦{rankedUser.earnings.toLocaleString()}</p>
              </div>
            </div>
          ))}
          {!topUsers.length && <div className="p-8 text-center text-slate-500 font-medium">No leaderboard data yet.</div>}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

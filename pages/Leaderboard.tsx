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
        let dateLimit = new Date();
        if (period === 'weekly') dateLimit.setDate(dateLimit.getDate() - 7);
        else if (period === 'monthly') dateLimit.setMonth(dateLimit.getMonth() - 1);
        else dateLimit.setFullYear(dateLimit.getFullYear() - 1);

        const [walletRes, profileRes, referralRes] = await Promise.all([
          (supabase as any).from('wallet_balances').select('user_id,total_earnings').order('total_earnings', { ascending: false }).limit(100),
          (supabase as any).from('profiles').select('user_id,name,avatar_url').limit(1000),
          (supabase as any).from('referrals').select('referrer_user_id').limit(1000),
        ]);

        const profileMap = new Map((profileRes.data || []).map((p: any) => [p.user_id, p]));
        const referralsCount = new Map<string, number>();
        (referralRes.data || []).forEach((r: any) => {
           referralsCount.set(r.referrer_user_id, (referralsCount.get(r.referrer_user_id) || 0) + 1);
        });

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

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Synchronizing Leaderboard Data...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">Global Rankings</h1>
          <p className="text-slate-400 mt-2 font-medium">Top performing nodes on the JobbaWorks ledger.</p>
        </div>
        <div className="flex items-center gap-2 p-1.5 bg-[#141A29]/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-inner">
          {(['weekly', 'monthly', 'yearly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                period === p ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {currentUserRank && (
        <div className="bg-[#0A0D14]/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1A2234] border border-slate-700 text-indigo-400 rounded-xl flex items-center justify-center shadow-inner">
               <User size={22} className="drop-shadow-[0_0_5px_rgba(99,102,241,0.3)]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">Your Local Rank ({period})</p>
              <p className="text-2xl font-black text-white">#{currentUserRank}</p>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
        </div>
      )}

      {topUsers.length >= 3 && (
        <div className="flex justify-center items-end gap-3 md:gap-8 pt-12 pb-10 px-2 md:px-0 w-full overflow-hidden">
          {/* Rank 2 */}
          <div className="relative w-1/3 bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] text-center flex flex-col items-center justify-end group">
            <div className="absolute top-0 w-full h-full bg-slate-400/5 rounded-[2rem] md:rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="absolute -top-5 md:-top-8 w-10 h-10 md:w-16 md:h-16 bg-[#1A2234] rounded-xl md:rounded-2xl flex items-center justify-center border-2 md:border-4 border-slate-800 shadow-xl z-10">
              <Medal className="text-slate-300 w-5 h-5 md:w-8 md:h-8 drop-shadow-[0_0_8px_rgba(203,213,225,0.4)]" />
            </div>
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#1A2234] mb-3 md:mb-5 border-2 md:border-4 border-slate-700 shadow-inner overflow-hidden relative z-10">
              <img src={topUsers[1].avatar} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <h3 className="text-[11px] md:text-sm font-black text-white line-clamp-1 break-all tracking-wider uppercase">{topUsers[1].name}</h3>
            <p className="text-emerald-400 font-black text-xs md:text-lg md:mt-2 drop-shadow-sm">₦{topUsers[1].earnings.toLocaleString()}</p>
          </div>

          {/* Rank 1 */}
          <div className="relative w-[38%] bg-gradient-to-t from-[#0D121F] to-[#0A0D14] rounded-[2rem] md:rounded-[3.5rem] p-5 md:p-12 text-center shadow-[0_0_50px_rgba(251,191,36,0.1)] z-20 md:scale-110 flex flex-col items-center justify-end -translate-y-6 border border-amber-500/20 group">
             <div className="absolute top-0 w-full h-full bg-amber-500/5 rounded-[2rem] md:rounded-[3.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
             <div className="absolute -top-6 md:-top-10 w-12 h-12 md:w-20 md:h-20 bg-[#1A2234] rounded-xl md:rounded-3xl flex items-center justify-center border-2 md:border-4 border-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.2)] z-10">
              <Crown className="text-amber-400 w-6 h-6 md:w-10 md:h-10 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            </div>
            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-[#1A2234] mb-4 md:mb-6 border-[3px] md:border-[5px] border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.15)] overflow-hidden relative z-10">
              <img src={topUsers[0].avatar} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <h3 className="text-sm md:text-xl font-black text-white line-clamp-1 break-all tracking-wider uppercase">{topUsers[0].name}</h3>
            <p className="text-transparent bg-clip-text bg-gradient-to-br from-amber-200 to-amber-500 font-black text-sm md:text-3xl md:mt-2 drop-shadow-lg">₦{topUsers[0].earnings.toLocaleString()}</p>
          </div>

          {/* Rank 3 */}
          <div className="relative w-1/3 bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] text-center flex flex-col items-center justify-end group">
             <div className="absolute top-0 w-full h-full bg-orange-500/5 rounded-[2rem] md:rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="absolute -top-5 md:-top-8 w-10 h-10 md:w-16 md:h-16 bg-[#1A2234] rounded-xl md:rounded-2xl flex items-center justify-center border-2 md:border-4 border-slate-800 shadow-xl z-10">
              <Trophy className="text-orange-900 w-5 h-5 md:w-8 md:h-8 drop-shadow-[0_0_6px_rgba(194,65,12,0.6)]" />
            </div>
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#1A2234] mb-3 md:mb-5 border-2 md:border-4 border-slate-700 shadow-inner overflow-hidden relative z-10">
              <img src={topUsers[2].avatar} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <h3 className="text-[11px] md:text-sm font-black text-white line-clamp-1 break-all tracking-wider uppercase">{topUsers[2].name}</h3>
             <p className="text-emerald-400 font-black text-xs md:text-lg md:mt-2 drop-shadow-sm">₦{topUsers[2].earnings.toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden mt-8">
        <div className="p-8 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-xl font-black text-white tracking-tight">Full Network Registry ({period})</h2>
        </div>
        <div className="divide-y divide-slate-800/50">
          {topUsers.map((rankedUser, i) => (
             <div key={rankedUser.id} className={`p-6 md:px-10 flex items-center justify-between transition-colors hover:bg-[#141A29]/50 ${i % 2 === 0 ? 'bg-[#141A29]/10' : ''}`}>
               <div className="flex items-center gap-6 md:gap-8">
                <span className="w-8 text-center font-black text-slate-500 text-lg">#{rankedUser.rank}</span>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[1.25rem] bg-[#1A2234] overflow-hidden border border-slate-700 shadow-inner">
                    <img src={rankedUser.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm tracking-wider uppercase">{rankedUser.name}</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1"><span className="text-blue-400">{rankedUser.referrals}</span> Connections</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                 <p className="font-black text-emerald-400 text-lg drop-shadow-[0_0_8px_rgba(52,211,153,0.1)]">₦{rankedUser.earnings.toLocaleString()}</p>
              </div>
            </div>
          ))}
          {!topUsers.length && <div className="p-16 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">No node data registered on the ledger.</div>}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

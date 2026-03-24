import React, { useState, useEffect } from 'react';
import { Star, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../src/integrations/supabase/client';

type LeaderboardPeriod = 'daily' | 'weekly' | 'all time';

interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  earnings: number;
  referrals: number;
}

interface LeaderboardData {
  daily: LeaderboardUser[];
  weekly: LeaderboardUser[];
  'all time': LeaderboardUser[];
  userRanks: Partial<Record<LeaderboardPeriod, number>>;
}

const EMPTY_LEADERBOARD: LeaderboardData = {
  daily: [],
  weekly: [],
  'all time': [],
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
        if (period === 'daily') dateLimit.setDate(dateLimit.getDate() - 1);
        else if (period === 'weekly') dateLimit.setDate(dateLimit.getDate() - 7);
        else dateLimit = new Date(0); // all time

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

        const multiplier = period === 'daily' ? 0.2 : period === 'weekly' ? 1 : 12;

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
  }, [user, period]);

  const topUsers = rankings[period] || [];
  const currentUserRank = rankings.userRanks?.[period];
  
  // Custom function to format leaderboard amounts (e.g. 1.2M, 840k)
  const formatAmount = (num: number) => {
    if (num >= 1000000) return `₦${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `₦${(num / 1000).toFixed(0)}k`;
    return `₦${num.toLocaleString()}`;
  }

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Synchronizing Leaderboard Data...</div>;

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-10 px-4 md:px-6 font-sans">
      <div className="max-w-[500px] mx-auto">
        
        {/* Toggle Nav */}
        <div className="bg-slate-100 p-1 rounded-full flex items-center justify-between mb-16">
          {(['daily', 'weekly', 'all time'] as LeaderboardPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-3 text-[13px] font-bold capitalize transition-all rounded-full ${
                period === p 
                  ? 'bg-white text-[#047857] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Podium Area */}
        {topUsers.length >= 3 && (
          <div className="flex items-end justify-center mb-16 relative h-[300px]">
             
             {/* Rank 2 (Left) */}
             <div className="flex flex-col items-center absolute left-[5%] bottom-0 z-10">
                <div className="relative mb-2">
                  <div className="w-20 h-20 rounded-full border-[3px] border-white shadow-lg overflow-hidden bg-slate-200">
                     <img src={topUsers[1].avatar} alt={topUsers[1].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-slate-100 rounded-full shadow border-2 border-white flex items-center justify-center text-[12px] font-bold text-[#111827]">
                    2
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[#111827] mt-3 whitespace-nowrap">{topUsers[1].name.split(' ')[0]} {topUsers[1].name.split(' ')[1]?.charAt(0) || ''}.</h3>
                <p className="text-[#16A34A] font-bold text-sm tracking-tight">{formatAmount(topUsers[1].earnings)}</p>
                <div className="w-[60px] h-20 bg-slate-100 rounded-t-[10px] mt-3"></div>
             </div>

             {/* Rank 1 (Center) */}
             <div className="flex flex-col items-center absolute left-1/2 -translate-x-1/2 bottom-0 z-20">
                <div className="relative mb-2">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-yellow-400 border-[3px] border-white flex items-center justify-center z-10 shadow-sm">
                    <Star size={14} className="text-white fill-white" />
                  </div>
                  <div className="w-[100px] h-[100px] rounded-full border-4 border-[#16A34A] shadow-xl overflow-hidden bg-slate-200">
                     <img src={topUsers[0].avatar} alt={topUsers[0].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 -right-1 w-8 h-8 bg-[#16A34A] rounded-full shadow border-2 border-white flex items-center justify-center text-[14px] font-bold text-white">
                    1
                  </div>
                </div>
                <h3 className="text-base font-extrabold text-[#111827] mt-3 whitespace-nowrap">{topUsers[0].name}</h3>
                <p className="text-[#16A34A] font-extrabold text-[17px] tracking-tight">{formatAmount(topUsers[0].earnings)}</p>
                <div className="w-[85px] h-[120px] bg-[#16A34A] rounded-t-[14px] mt-3 shadow-sm"></div>
             </div>

             {/* Rank 3 (Right) */}
             <div className="flex flex-col items-center absolute right-[5%] bottom-0 z-10">
                <div className="relative mb-2">
                  <div className="w-20 h-20 rounded-full border-[3px] border-white shadow-lg overflow-hidden bg-slate-200">
                     <img src={topUsers[2].avatar} alt={topUsers[2].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-slate-100 rounded-full shadow border-2 border-white flex items-center justify-center text-[12px] font-bold text-[#111827]">
                    3
                  </div>
                </div>
                <h3 className="text-sm font-bold text-[#111827] mt-3 whitespace-nowrap">{topUsers[2].name.split(' ')[0]} {topUsers[2].name.split(' ')[1]?.charAt(0) || ''}.</h3>
                <p className="text-[#16A34A] font-bold text-sm tracking-tight">{formatAmount(topUsers[2].earnings)}</p>
                <div className="w-[60px] h-[55px] bg-slate-100 rounded-t-[10px] mt-3"></div>
             </div>
          </div>
        )}

        {/* Regular List */}
        <div className="space-y-4 mb-24">
           {topUsers.slice(3).map((rankedUser, i) => (
             <div key={rankedUser.id} className="bg-white rounded-2xl p-4 flex items-center shadow-sm">
                <div className="w-6 text-center font-bold text-[#111827] text-[15px]">{rankedUser.rank}</div>
                <div className="ml-4 flex items-center gap-4 flex-1">
                   <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100">
                     <img src={rankedUser.avatar} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div>
                      <h4 className="font-bold text-[#111827] text-sm">{rankedUser.name}</h4>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">{rankedUser.referrals * 12} Payouts</p>
                   </div>
                </div>
                <div className="font-extrabold text-[#111827] text-base tracking-tight">
                  ₦{rankedUser.earnings.toLocaleString()}
                </div>
             </div>
           ))}
        </div>

        {/* User Ranking Footer */}
        {currentUserRank && (
          <div className="fixed bottom-0 left-0 w-full p-4 md:p-6 pb-6 md:pb-8 flex justify-center z-40 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB] to-transparent">
            <div className="w-full max-w-[500px] bg-[#047857] text-white rounded-[24px] p-5 flex items-center shadow-2xl relative overflow-hidden">
               <div className="w-12 h-12 bg-white/20 rounded-full flex flex-col items-center justify-center shrink-0">
                  <span className="font-extrabold text-sm">{currentUserRank}</span>
               </div>
               <div className="ml-4 flex-1">
                 <h4 className="font-bold text-sm">Your Ranking</h4>
                 <p className="text-[11px] text-green-100 mt-0.5 leading-tight">Keep earning to climb the ladder!</p>
               </div>
               <div className="text-right">
                 <p className="font-black text-xl tracking-tight">₦{user?.stats?.totalEarnings?.toLocaleString() || '0'}</p>
                 <div className="flex items-center justify-end gap-1 mt-0.5 text-[9px] font-bold text-green-200">
                    <TrendingUp size={10} /> TOP 15%
                 </div>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Leaderboard;

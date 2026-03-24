import React, { useMemo } from 'react';
// Fix: Added missing Link import from react-router-dom
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  ArrowUpRight, 
  Calendar,
  Zap,
  BookOpen,
  MessageSquare,
  Users,
  Target
} from 'lucide-react';

const Earnings: React.FC = () => {
  const { user, stats, systemPlans } = useAuth();
  const plan = user ? systemPlans[user.planId] : systemPlans.free;

  // Calculate some derived metrics
  const totalReadEarnings = useMemo(() => {
    return stats.transactions
      .filter(tx => tx.type === 'reading_reward')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [stats.transactions]);

  const totalCommentEarnings = useMemo(() => {
    return stats.transactions
      .filter(tx => tx.type === 'comment_reward')
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [stats.transactions]);

  const readProgress = (stats.postsReadToday / plan.readLimit) * 100;
  const commentProgress = (stats.commentsMadeToday / plan.commentLimit) * 100;
  const efficiencyRaw = 100 - (((stats.postsReadToday + stats.commentsMadeToday) / (plan.readLimit + plan.commentLimit)) * 100 || 0);
  const earningEfficiency = Math.max(0, Math.min(100, efficiencyRaw)).toFixed(1) + '%';

  // Simulated daily earnings for the last 7 days
  const weeklyData = [
    { day: 'Mon', amount: 4.50 },
    { day: 'Tue', amount: 6.20 },
    { day: 'Wed', amount: 3.80 },
    { day: 'Thu', amount: 7.40 },
    { day: 'Fri', amount: 5.10 },
    { day: 'Sat', amount: 8.90 },
    { day: 'Sun', amount: stats.pendingRewards },
  ];

  const maxWeekly = Math.max(...weeklyData.map(d => d.amount));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight drop-shadow-md">Earnings Analytics</h2>
          <p className="text-slate-400 mt-2 font-medium">Analyze your growth and maximize your content rewards.</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-3 bg-[#0A0D14]/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-sm">
          <Calendar size={16} className="text-emerald-400" />
          <span className="text-xs font-black text-white uppercase tracking-widest">Last 30 Days</span>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-gradient-to-br from-[#0D121F] to-[#0A0D14] rounded-[2.5rem] p-8 text-white relative overflow-hidden lg:col-span-2 shadow-2xl border border-slate-800 group">
          <div className="relative z-10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
               Total Platform Revenue
            </p>
            <h3 className="text-5xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 drop-shadow-sm">
              ₦{stats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                <ArrowUpRight size={14} /> +24% Growth
              </div>
              <div className="h-6 w-px bg-slate-800"></div>
              <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Est. Monthly: <span className="text-white">₦145.00</span></div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-24 -mt-24 blur-[60px] group-hover:bg-emerald-500/15 transition-colors duration-700 pointer-events-none"></div>
        </div>

        <div className="bg-[#0A0D14]/80 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors pointer-events-none"></div>
          <div className="relative z-10 w-12 h-12 bg-[#141A29] border border-slate-700 text-amber-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
            <Target size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Earning Efficiency</p>
            <h4 className="text-3xl font-black text-white tracking-tight">{earningEfficiency}</h4>
          </div>
        </div>

        <div className="bg-[#0A0D14]/80 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none"></div>
          <div className="relative z-10 w-12 h-12 bg-[#141A29] border border-slate-700 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]">
            <Zap size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Tier Advantage</p>
            <h4 className="text-3xl font-black text-white tracking-tight">{plan.name}</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Weekly Trend Chart */}
        <div className="lg:col-span-2 bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-[#141A29] rounded-xl border border-slate-700">
                <BarChart3 className="text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]" size={20} />
              </div>
              <h3 className="text-xl font-black text-white">Reward Velocity</h3>
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-[#141A29] px-3 py-1.5 rounded-lg border border-slate-800">7-Day Period</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-6 relative z-10">
            {weeklyData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full max-w-[40px] relative mt-8">
                  <div 
                    className={`w-full rounded-t-xl transition-all duration-700 ease-out group-hover:opacity-100 opacity-80 ${i === weeklyData.length - 1 ? 'bg-gradient-to-t from-emerald-900 to-emerald-400 shadow-[0_-5px_15px_rgba(52,211,153,0.3)]' : 'bg-[#141A29] border-t border-x border-slate-700'}`}
                    style={{ height: `${(data.amount / maxWeekly) * 100}%` }}
                  ></div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1A2234] border border-slate-700 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20 whitespace-nowrap">
                    ₦{data.amount.toFixed(2)}
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${i === weeklyData.length - 1 ? 'text-emerald-400 drop-shadow-sm' : 'text-slate-500 group-hover:text-slate-300'}`}>{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-purple-500/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-purple-500/10 transition-colors"></div>
          
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="p-2.5 bg-[#141A29] rounded-xl border border-slate-700">
               <PieChart className="text-purple-400 drop-shadow-[0_0_6px_rgba(192,132,252,0.4)]" size={20} />
            </div>
            <h3 className="text-xl font-black text-white">Income Split</h3>
          </div>

          <div className="space-y-8 relative z-10">
            <div className="flex items-center gap-5 group/item">
              <div className="w-12 h-12 bg-[#141A29] border border-slate-700 text-indigo-400 rounded-xl flex items-center justify-center shadow-inner group-hover/item:border-slate-500 transition-colors">
                <BookOpen size={20} className="drop-shadow-[0_0_5px_rgba(99,102,241,0.3)]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                  <span className="text-slate-400">Authorship Bonus</span>
                  <span className="text-white">₦{stats.postEarnings.toFixed(2)}</span>
                </div>
                <div className="w-full bg-[#1A2234] h-2 rounded-full overflow-hidden shadow-inner border border-slate-800">
                  <div className="bg-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-5 group/item">
              <div className="w-12 h-12 bg-[#141A29] border border-slate-700 text-emerald-400 rounded-xl flex items-center justify-center shadow-inner group-hover/item:border-slate-500 transition-colors">
                <BookOpen size={20} className="drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                  <span className="text-slate-400">Reading</span>
                  <span className="text-white">₦{totalReadEarnings.toFixed(2)}</span>
                </div>
                <div className="w-full bg-[#1A2234] h-2 rounded-full overflow-hidden shadow-inner border border-slate-800">
                  <div className="bg-emerald-400 h-full rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5 group/item">
              <div className="w-12 h-12 bg-[#141A29] border border-slate-700 text-purple-400 rounded-xl flex items-center justify-center shadow-inner group-hover/item:border-slate-500 transition-colors">
                <MessageSquare size={20} className="drop-shadow-[0_0_5px_rgba(192,132,252,0.3)]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                  <span className="text-slate-400">Commenting</span>
                  <span className="text-white">₦{totalCommentEarnings.toFixed(2)}</span>
                </div>
                <div className="w-full bg-[#1A2234] h-2 rounded-full overflow-hidden shadow-inner border border-slate-800">
                  <div className="bg-purple-400 h-full rounded-full shadow-[0_0_10px_rgba(192,132,252,0.8)]" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5 group/item">
              <div className="w-12 h-12 bg-[#141A29] border border-slate-700 text-blue-400 rounded-xl flex items-center justify-center shadow-inner group-hover/item:border-slate-500 transition-colors">
                <Users size={20} className="drop-shadow-[0_0_5px_rgba(96,165,250,0.3)]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                  <span className="text-slate-400">Referrals</span>
                  <span className="text-white">₦{stats.referralEarnings.toFixed(2)}</span>
                </div>
                <div className="w-full bg-[#1A2234] h-2 rounded-full overflow-hidden shadow-inner border border-slate-800">
                  <div className="bg-blue-400 h-full rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-800/80 relative z-10">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider leading-relaxed">
              * Income split is based on confirmed transactions. Pending rewards are not included in this breakdown.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Quotas */}
        <div className="bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-amber-500/10 transition-colors"></div>
          
          <h3 className="text-xl font-black text-white mb-8 flex items-center gap-4 relative z-10">
            <div className="p-2.5 bg-[#141A29] rounded-xl border border-slate-700">
               <Zap className="text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]" size={20} /> 
            </div>
            Daily Quota Status
          </h3>
          
          <div className="space-y-10 relative z-10">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-black text-white">Reading Tasks</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                  {stats.postsReadToday} / {plan.readLimit} COMPLETE
                </span>
              </div>
              <div className="w-full bg-[#1A2234] h-4 rounded-full overflow-hidden p-1 border border-slate-800 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(52,211,153,0.6)]"
                  style={{ width: `${readProgress}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-black text-white">Engagement Tasks</span>
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20 shadow-[0_0_10px_rgba(192,132,252,0.1)]">
                  {stats.commentsMadeToday} / {plan.commentLimit} COMPLETE
                </span>
              </div>
              <div className="w-full bg-[#1A2234] h-4 rounded-full overflow-hidden p-1 border border-slate-800 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-purple-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(192,132,252,0.6)]"
                  style={{ width: `${commentProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 relative z-10 shadow-[inset_0_0_20px_rgba(52,211,153,0.05)]">
             <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em] mb-2">Earning Optimization</p>
             <p className="text-xs text-emerald-300/80 leading-relaxed font-medium">
               Earning rate fixed at <span className="text-emerald-400 font-black">₦{plan.readReward.toFixed(2)}</span> per engagement. Maximize daily limits to accrue an additional <span className="text-emerald-400 font-black">₦{( (plan.readLimit - stats.postsReadToday) * plan.readReward ).toFixed(2)}</span> in pending lifecycle blocks.
             </p>
          </div>
        </div>

        {/* Rate Table */}
        <div className="bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-slate-700/20 transition-colors"></div>
          
          <h3 className="text-xl font-black text-white mb-8 relative z-10 flex items-center gap-4">
             <div className="p-2.5 bg-[#141A29] rounded-xl border border-slate-700">
               <span className="text-slate-300 drop-shadow-md">₦</span>
             </div>
             Yield Rates
          </h3>
          
          <div className="divide-y divide-slate-800/80 relative z-10">
            <div className="py-5 flex items-center justify-between group/row">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#141A29] border border-slate-700 shadow-inner flex items-center justify-center group-hover/row:border-slate-500 transition-colors">
                  <BookOpen size={18} className="text-emerald-400" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-300">Per Story Chapter</span>
              </div>
              <span className="text-sm font-black text-emerald-400 tracking-tight">₦{plan.readReward.toFixed(2)}</span>
            </div>
            <div className="py-5 flex items-center justify-between group/row">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#141A29] border border-slate-700 shadow-inner flex items-center justify-center group-hover/row:border-slate-500 transition-colors">
                  <MessageSquare size={18} className="text-purple-400" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-300">Per Quality Comment</span>
              </div>
              <span className="text-sm font-black text-purple-400 tracking-tight">₦{plan.commentReward.toFixed(2)}</span>
            </div>
            <div className="py-5 flex items-center justify-between group/row">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#141A29] border border-slate-700 shadow-inner flex items-center justify-center group-hover/row:border-slate-500 transition-colors">
                  <Users size={18} className="text-blue-400" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-300">Referral Network</span>
              </div>
              <span className="text-sm font-black text-blue-400 tracking-tight">25% Commission</span>
            </div>
            <div className="py-5 flex items-center justify-between group/row">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#141A29] border border-slate-700 shadow-inner flex items-center justify-center group-hover/row:border-amber-900/50 transition-colors opacity-60">
                  <TrendingUp size={18} className="text-amber-500" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Active Node Status</span>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-[#141A29] px-3 py-1.5 rounded-lg border border-slate-800">Locked</span>
            </div>
          </div>
          
          <div className="mt-8 relative z-10">
            <Link to="/plans" className="block w-full py-4 relative bg-slate-800/50 border border-slate-700 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] text-center hover:bg-slate-800 hover:border-slate-600 transition-all shadow-md hover:shadow-lg active:scale-[0.98]">
              <span className="relative z-10">Upgrade Yield Plan</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;

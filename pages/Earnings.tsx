
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Earnings Performance</h2>
          <p className="text-slate-500">Analyze your growth and maximize your content rewards.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <Calendar size={16} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-600">Last 30 Days</span>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden lg:col-span-2">
          <div className="relative z-10">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total Platform Revenue</p>
            <h3 className="text-5xl font-black mb-4 tracking-tight">
              ₦{stats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                <ArrowUpRight size={14} /> +24% Growth
              </div>
              <div className="h-4 w-px bg-white/10"></div>
              <div className="text-slate-400 text-xs">Estimated Monthly: ₦145.00</div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
            <Target size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Earning Efficiency</p>
            <h4 className="text-2xl font-black text-slate-900">{earningEfficiency}</h4>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Tier Advantage</p>
            <h4 className="text-2xl font-black text-slate-900">{plan.name}</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Weekly Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-slate-400" size={20} />
              <h3 className="font-bold text-slate-900">Reward Velocity</h3>
            </div>
            <span className="text-xs font-bold text-slate-400">7-Day Period</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-4">
            {weeklyData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="w-full relative">
                  <div 
                    className={`w-full rounded-t-xl transition-all duration-700 ease-out group-hover:opacity-80 ${i === weeklyData.length - 1 ? 'bg-emerald-600' : 'bg-slate-100'}`}
                    style={{ height: `${(data.amount / maxWeekly) * 100}%` }}
                  ></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    ₦{data.amount.toFixed(2)}
                  </div>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <PieChart className="text-slate-400" size={20} />
            <h3 className="font-bold text-slate-900">Income Split</h3>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                  <span className="text-slate-400">Authorship Bonus</span>
                  <span className="text-slate-900">₦{stats.postEarnings.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                  <span className="text-slate-400">Reading</span>
                  <span className="text-slate-900">₦{totalReadEarnings.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                  <span className="text-slate-400">Commenting</span>
                  <span className="text-slate-900">₦{totalCommentEarnings.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Users size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                  <span className="text-slate-400">Referrals</span>
                  <span className="text-slate-900">₦{stats.referralEarnings.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-50">
            <p className="text-[10px] text-slate-400 italic leading-relaxed">
              * Income split is based on confirmed transactions. Pending rewards are not included in this breakdown.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Quotas */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
            <Zap className="text-amber-500" size={20} /> Daily Quota Status
          </h3>
          
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-slate-700">Reading Tasks</span>
                <span className="text-xs font-black text-slate-400 uppercase">{stats.postsReadToday} / {plan.readLimit} COMPLETE</span>
              </div>
              <div className="w-full bg-slate-50 h-4 rounded-full overflow-hidden p-1 border border-slate-100">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${readProgress}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold text-slate-700">Engagement Tasks</span>
                <span className="text-xs font-black text-slate-400 uppercase">{stats.commentsMadeToday} / {plan.commentLimit} COMPLETE</span>
              </div>
              <div className="w-full bg-slate-50 h-4 rounded-full overflow-hidden p-1 border border-slate-100">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${commentProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
             <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider mb-1">Earning Tip</p>
             <p className="text-xs text-emerald-700 leading-relaxed">
               You are earning ₦{plan.readReward.toFixed(2)} per chapter. Completing your full reading quota today will add another ₦{( (plan.readLimit - stats.postsReadToday) * plan.readReward ).toFixed(2)} to your pending balance.
             </p>
          </div>
        </div>

        {/* Rate Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-8">Earning Rates</h3>
          <div className="divide-y divide-slate-50">
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <BookOpen size={16} className="text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-slate-600">Per Story Chapter</span>
              </div>
              <span className="text-sm font-black text-slate-900">₦{plan.readReward.toFixed(2)}</span>
            </div>
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <MessageSquare size={16} className="text-purple-600" />
                </div>
                <span className="text-sm font-medium text-slate-600">Per Quality Comment</span>
              </div>
              <span className="text-sm font-black text-slate-900">₦{plan.commentReward.toFixed(2)}</span>
            </div>
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users size={16} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-600">Referral Upgrade Bonus</span>
              </div>
              <span className="text-sm font-black text-slate-900">25% Commission</span>
            </div>
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <TrendingUp size={16} className="text-amber-600" />
                </div>
                <span className="text-sm font-medium text-slate-600">Active Node (Unavailable)</span>
              </div>
              <span className="text-sm font-black text-slate-400">Locked</span>
            </div>
          </div>
          
          <div className="mt-8">
            {/* Fix: Added missing Link usage from react-router-dom */}
            <Link to="/plans" className="block w-full py-4 text-center bg-slate-50 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
              Boost My Rates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;

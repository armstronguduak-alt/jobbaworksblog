import React, { useMemo } from 'react';
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
  Target,
  Eye
} from 'lucide-react';

const Earnings: React.FC = () => {
  const { user, stats, systemPlans, posts } = useAuth();
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

  // Derived metrics for views
  const userPosts = posts.filter(p => p.authorId === user?.id);
  const totalViews = userPosts.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalViewEarnings = useMemo(() => {
    return stats.transactions
      .filter(tx => tx.type === 'view_reward' || tx.description?.toLowerCase().includes('view'))
      .reduce((sum, tx) => sum + tx.amount, 0);
  }, [stats.transactions]);

  const readProgress = Math.min((stats.postsReadToday / plan.readLimit) * 100, 100);
  const commentProgress = Math.min((stats.commentsMadeToday / plan.commentLimit) * 100, 100);
  const efficiencyRaw = (((stats.postsReadToday + stats.commentsMadeToday) / (plan.readLimit + plan.commentLimit)) * 100 || 0);
  const earningEfficiency = Math.max(0, Math.min(100, efficiencyRaw)).toFixed(1) + '%';

  // Simulated daily earnings for the last 7 days
  const weeklyData = [
    { day: 'Mon', amount: 4.50 },
    { day: 'Tue', amount: 6.20 },
    { day: 'Wed', amount: 3.80 },
    { day: 'Thu', amount: 7.40 },
    { day: 'Fri', amount: 5.10 },
    { day: 'Sat', amount: 8.90 },
    { day: 'Sun', amount: stats.pendingRewards || 12.40 },
  ];

  const maxWeekly = Math.max(...weeklyData.map(d => d.amount));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-1">Earnings Analytics</h2>
          <p className="text-[#6B7280] font-medium text-sm">Analyze your growth and maximize your content rewards.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Calendar size={16} className="text-[#16A34A]" />
          <span className="text-xs font-bold text-[#111827] uppercase tracking-wider">Last 30 Days</span>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#16A34A] rounded-3xl p-8 text-white relative overflow-hidden lg:col-span-2 shadow-sm border border-transparent">
          <div className="relative z-10">
            <p className="text-green-100 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
               Total Platform Revenue
            </p>
            <h3 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white drop-shadow-sm font-mono leading-none">
              ₦{stats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-[#16A34A] text-[10px] font-bold uppercase tracking-widest bg-white px-3 py-1.5 rounded-lg shadow-sm">
                <ArrowUpRight size={14} /> +24% Growth
              </div>
              <div className="h-6 w-px bg-green-500/50"></div>
              <div className="text-green-50 text-[10px] font-bold uppercase tracking-widest">Est. Monthly: <span className="text-white">₦145.00</span></div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-24 -mt-24 blur-[60px] pointer-events-none"></div>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
            <Target size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-[#6B7280] text-[10px] font-bold uppercase tracking-widest mb-1">Earning Efficiency</p>
            <h4 className="text-3xl font-extrabold text-[#111827] tracking-tight font-mono">{earningEfficiency}</h4>
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 w-12 h-12 bg-[#DCFCE7] text-[#16A34A] rounded-2xl flex items-center justify-center mb-6">
            <Zap size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-[#6B7280] text-[10px] font-bold uppercase tracking-widest mb-1">Tier Advantage</p>
            <h4 className="text-3xl font-extrabold text-[#111827] tracking-tight">{plan.name}</h4>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Weekly Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <BarChart3 className="text-[#16A34A]" size={20} />
              </div>
              <h3 className="text-xl font-bold text-[#111827]">Reward Velocity</h3>
            </div>
            <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">7-Day Period</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-4 relative z-10">
            {weeklyData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="w-full max-w-[40px] relative mt-8 flex-1 flex items-end justify-center">
                  <div 
                    className={`w-full rounded-t-xl transition-all duration-700 ease-out ${i === weeklyData.length - 1 ? 'bg-gradient-to-t from-[#16A34A] to-[#22C55E]' : 'bg-slate-100 group-hover:bg-slate-200'}`}
                    style={{ height: `${(data.amount / maxWeekly) * 100}%` }}
                  ></div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#111827] text-white text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap hidden md:block">
                    ₦{data.amount.toFixed(2)}
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${i === weeklyData.length - 1 ? 'text-[#16A34A]' : 'text-[#6B7280]'}`}>{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100">
               <PieChart className="text-purple-600" size={20} />
            </div>
            <h3 className="text-xl font-bold text-[#111827]">Income Split</h3>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Eye size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span className="text-[#6B7280]">Article Views</span>
                  <span className="text-[#111827] font-black">₦{totalViewEarnings.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#DCFCE7] text-[#16A34A] rounded-xl flex items-center justify-center">
                <BookOpen size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span className="text-[#6B7280]">Reading</span>
                  <span className="text-[#111827] font-black">₦{totalReadEarnings.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#16A34A] h-full rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <MessageSquare size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span className="text-[#6B7280]">Commenting</span>
                  <span className="text-[#111827] font-black">₦{totalCommentEarnings.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Users size={18} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                  <span className="text-[#6B7280]">Referrals</span>
                  <span className="text-[#111827] font-black">₦{stats.referralEarnings.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '20%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Daily Quotas */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm relative overflow-hidden group">
          <h3 className="text-xl font-bold text-[#111827] mb-8 flex items-center gap-4 relative z-10">
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
               <Zap className="text-amber-500" size={20} /> 
            </div>
            Daily Quota Status
          </h3>
          
          <div className="space-y-8 relative z-10">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] font-bold text-[#111827]">Reading Tasks</span>
                <span className="text-[10px] font-bold text-[#16A34A] uppercase tracking-widest bg-[#DCFCE7] px-3 py-1.5 rounded-lg border border-green-200">
                  {stats.postsReadToday} / {plan.readLimit} COMPLETE
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="bg-[#16A34A] h-full rounded-full transition-all duration-1000"
                  style={{ width: `${readProgress}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] font-bold text-[#111827]">Engagement Tasks</span>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
                  {stats.commentsMadeToday} / {plan.commentLimit} COMPLETE
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="bg-purple-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${commentProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200 relative z-10">
             <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest mb-1.5">Earning Optimization</p>
             <p className="text-xs text-[#111827] leading-relaxed font-medium">
               Earning rate fixed at <span className="text-[#16A34A] font-bold">₦{plan.readReward.toFixed(2)}</span> per engagement. Maximize daily limits to accrue an additional <span className="text-[#16A34A] font-bold">₦{( (plan.readLimit - stats.postsReadToday) * plan.readReward ).toFixed(2)}</span> in pending lifecycle blocks.
             </p>
          </div>
        </div>

        {/* Rate Table */}
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm relative overflow-hidden group">
          <h3 className="text-xl font-bold text-[#111827] mb-6 relative z-10 flex items-center gap-4">
             <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center">
               <span className="text-[#111827] font-black leading-none">₦</span>
             </div>
             Yield Rates
          </h3>
          
          <div className="divide-y divide-slate-100 relative z-10">
            <div className="py-4 flex items-center justify-between group/row">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <Eye size={16} className="text-indigo-600" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Per 1K Views</span>
              </div>
              <span className="text-sm font-black text-[#111827] font-mono tracking-tight">₦100.00</span>
            </div>
            <div className="py-4 flex items-center justify-between group/row">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <BookOpen size={16} className="text-[#16A34A]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Per Article Read</span>
              </div>
              <span className="text-sm font-black text-[#111827] font-mono tracking-tight">₦{plan.readReward.toFixed(2)}</span>
            </div>
            <div className="py-4 flex items-center justify-between group/row">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <MessageSquare size={16} className="text-purple-600" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Per Quality Comment</span>
              </div>
              <span className="text-sm font-black text-[#111827] font-mono tracking-tight">₦{plan.commentReward.toFixed(2)}</span>
            </div>
            <div className="py-4 flex items-center justify-between group/row">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <Users size={16} className="text-blue-600" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Referral Network</span>
              </div>
              <span className="text-sm font-black text-[#111827] font-mono tracking-tight">25% Comm.</span>
            </div>
          </div>
          
          <div className="mt-8 relative z-10">
            <Link to="/plans" className="block w-full py-4 relative bg-[#111827] text-white rounded-xl font-bold text-xs uppercase tracking-widest text-center hover:bg-black transition-colors shadow-sm focus:ring-4 focus:ring-slate-200 outline-none">
              <span className="relative z-10">Upgrade Yield Plan</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;

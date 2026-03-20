
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  ArrowUpRight, 
  Wallet,
  Clock,
  Copy,
  MessageSquare,
  Sparkles,
  Target,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';


const DashboardHome: React.FC = () => {
  const { user, stats, systemPlans } = useAuth();
  const plan = user ? systemPlans[user.planId] : null;
  const progressPercent = plan ? (stats.postsReadToday / plan.readLimit) * 100 : 0;
  const isLimitReached = plan ? stats.postsReadToday >= plan.readLimit : false;

  const daysActive = user?.planStartedAt ? Math.max(0, Math.floor((new Date().getTime() - new Date(user.planStartedAt).getTime()) / (1000 * 3600 * 24))) : 0;
  const breakEvenReached = plan ? daysActive >= plan.breakEvenDay : false;
  const planEarnings = user?.planEarnings || 0;
  const capPercent = plan && plan.monthlyReturnCap > 0 ? Math.min((planEarnings / plan.monthlyReturnCap) * 100, 100) : 0;
  const withdrawalEligible = plan && stats.referrals >= plan.minReferrals && stats.totalEarnings > 0 && (stats.postsReadToday > 0 || stats.commentsMadeToday > 0);

  const copyRefCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      alert('Referral code copied!');
    }
  };

  if (!plan) return null;

  return (
    <div className="animate-fade-in space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div>
           <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
             Welcome back, <span className="text-emerald-600">{user?.name.split(' ')[0]}</span>.
           </h2>
           <p className="text-slate-500 serif-text text-lg">Your intellectual assets are performing at peak efficiency.</p>
         </div>
         
         <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-2">
             <Sparkles className="text-indigo-600" size={16} />
             <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">Current Plan: {plan.name}</span>
           </div>
           <div className="flex -space-x-3">
             {[1,2,3].map(i => (
               <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                 <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="" />
               </div>
             ))}
             <div className="w-10 h-10 rounded-full border-4 border-white bg-emerald-600 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
               +12
             </div>
           </div>
           <span className="text-xs font-bold text-slate-400">Active Network</span>
         </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Treasury Widget */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-[3rem] bg-slate-900 p-10 text-white shadow-2xl shadow-slate-200 group">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                    <Wallet size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Treasury Balance</p>
                    <p className="text-xs font-bold text-emerald-400">Verified Assets</p>
                  </div>
                </div>
                <Link to="/dashboard/wallet" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold transition-all border border-white/10">
                  Withdraw
                </Link>
              </div>
              
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-6xl font-black tracking-tighter">₦{stats.balance.toLocaleString()}</span>
                <span className="text-xl font-bold text-white/40">.00</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/5">
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Lifetime Earnings</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black">₦{stats.totalEarnings.toLocaleString()}</span>
                  <ArrowUpRight size={16} className="text-emerald-400" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Plan Earnings vs Cap</p>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-1 mt-2">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${capPercent}%` }}></div>
                </div>
                <span className="text-[10px] font-black text-emerald-400">₦{planEarnings.toLocaleString()} / ₦{plan.monthlyReturnCap.toLocaleString()}</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Active Days</p>
                <span className="text-xl font-black text-amber-400">{daysActive} <span className="text-xs text-white/40">/ {plan.breakEvenDay} to Break-even</span></span>
                {breakEvenReached && <p className="text-[10px] font-bold text-emerald-400 mt-1">✓ Profit Phase Reached</p>}
              </div>
              <div>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">Withdrawal Status</p>
                {withdrawalEligible ? (
                  <span className="inline-block px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-black uppercase">Eligible</span>
                ) : (
                  <span className="inline-block px-2 py-1 bg-rose-500/20 text-rose-300 rounded text-[10px] font-black uppercase">Requirements Pending</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-[100px] group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full -ml-32 -mb-32 blur-[80px]"></div>
        </div>

        {/* Quota Widget */}
        <div className="rounded-[3rem] bg-white border border-slate-100 p-10 shadow-sm flex flex-col items-center justify-center text-center group hover:border-emerald-100 transition-all duration-500">
          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-50" />
              <circle 
                cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" 
                strokeDasharray={552.9} 
                strokeDashoffset={552.9 - (552.9 * Math.min(progressPercent, 100)) / 100} 
                strokeLinecap="round" 
                className={`${isLimitReached ? 'text-amber-500' : 'text-emerald-500'} transition-all duration-1000 ease-out`} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">{Math.round(progressPercent)}%</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Quota</span>
            </div>
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-2">Reading Assignment</h4>
          <p className="text-xs text-slate-400 serif-text leading-relaxed max-w-[200px]">
            {isLimitReached ? "Daily reward capacity reached." : `${plan.readLimit - stats.postsReadToday} high-value articles remaining for today.`}
          </p>
          
          <Link to="/" className="mt-8 flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest group-hover:gap-4 transition-all">
            Continue Reading <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Referral Progress', value: `${stats.referrals} / ${plan.minReferrals}`, icon: Users, color: 'blue', sub: 'Required' },
          { label: 'Engagement', value: stats.commentsMadeToday, icon: MessageSquare, color: 'purple', sub: `Target: ${plan.commentLimit}` },
          { label: 'Total Reads', value: stats.postsReadToday, icon: BookOpen, color: 'emerald', sub: `Target: ${plan.readLimit}` },
          { label: 'Pending Rewards', value: `₦${stats.pendingRewards.toFixed(0)}`, icon: Clock, color: 'amber', sub: 'In clearance' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group">
            <div className={`w-12 h-12 bg-${item.color}-50 text-${item.color}-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <item.icon size={20} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
            <h5 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{item.value}</h5>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Referral & Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-xl font-black text-slate-900 mb-4">Referral Protocol</h4>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-md serif-text">
              Expand the <span className="text-emerald-600 font-bold">JobbaWorks</span> ecosystem by inviting high-performance creators. Every successful node activation yields a <span className="text-emerald-600 font-bold">₦2.00</span> bounty.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl text-slate-900 font-mono font-black text-center tracking-[0.3em] text-lg break-all">
                {user?.referralCode}
              </div>
              <button 
                onClick={copyRefCode} 
                className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                <Copy size={20} />
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-slate-50 rounded-full -z-0"></div>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-10 rounded-[3rem] text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                <Sparkles size={24} />
              </div>
              <h4 className="text-2xl font-black mb-4 tracking-tight">Accelerate Your Growth</h4>
              <p className="text-emerald-50 mb-8 serif-text leading-relaxed">
                Upgrade to a premium tier to unlock high-RPM assignments and increase your daily reward capacity.
              </p>
            </div>
             <Link to="/dashboard/plans" className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-900/20">
               Explore Plans <ArrowRight size={16} />
             </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

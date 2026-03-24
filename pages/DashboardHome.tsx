
import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Bell,
  HelpCircle,
  ChevronDown,
  Crown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../src/integrations/supabase/client';

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

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (user) {
      // @ts-ignore
      supabase.from('notifications' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)
        .then(({ data }) => {
          if (data) setNotifications(data);
        });
    }
  }, [user]);

  const markNotificationRead = async (id: string, isRead: boolean) => {
    if (isRead) return;
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    await (supabase.from('notifications' as any) as any).update({ is_read: true }).eq('id', id);
  };

  const copyRefCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      alert('Referral code copied!');
    }
  };

  if (!plan) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-1">
              Welcome back, <span className="text-[#16A34A]">{user?.name.split(' ')[0]}</span>
            </h2>
            <p className="text-[#6B7280] text-sm">Track your portfolio and active performance.</p>
          </div>
         
         <div className="flex items-center gap-3 relative">
           <div className="px-3 py-1.5 bg-[#DCFCE7] border border-green-200 rounded-full flex items-center gap-2">
             <Sparkles className="text-[#16A34A]" size={14} />
             <span className="text-xs font-semibold text-[#16A34A] uppercase tracking-wide">Plan: {plan.name}</span>
           </div>
           
           <button 
             onClick={() => setShowNotifications(!showNotifications)} 
             className="relative p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm"
           >
             <Bell size={20} className="text-[#6B7280] hover:text-[#111827]" />
             {unreadCount > 0 && (
               <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                 {unreadCount > 9 ? '9+' : unreadCount}
               </span>
             )}
           </button>

           {showNotifications && (
             <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50">
               <h4 className="text-sm font-bold text-[#111827] mb-3 pb-2 border-b border-slate-100">Notifications</h4>
               <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                 {notifications.length === 0 ? (
                   <p className="text-xs text-[#6B7280] text-center py-4">No notifications.</p>
                 ) : (
                   notifications.map((notif) => (
                     <div 
                       key={notif.id} 
                       onClick={() => markNotificationRead(notif.id, notif.is_read)}
                       className={`p-3 rounded-xl border transition-colors cursor-pointer ${notif.is_read ? 'bg-slate-50 border-transparent' : 'bg-[#DCFCE7]/50 border-green-100 text-green-900'}`}
                     >
                       <p className={`text-xs font-semibold mb-1 ${notif.is_read ? 'text-[#6B7280]' : 'text-[#111827]'}`}>{notif.message}</p>
                       <p className="text-[10px] text-[#9CA3AF] font-medium">Click to mark read</p>
                     </div>
                   ))
                 )}
               </div>
             </div>
           )}
         </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Treasury Widget */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#DCFCE7] rounded-xl flex items-center justify-center">
                <Wallet size={24} className="text-[#16A34A]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-1">Treasury Balance</p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#16A34A] rounded-full animate-pulse"></div>
                  <p className="text-xs font-semibold text-[#16A34A]">Verified Assets</p>
                </div>
              </div>
            </div>
            <Link to="/dashboard/wallet" className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-semibold transition-colors text-[#111827]">
              Withdraw Funds
            </Link>
          </div>
          
          <div className="flex items-baseline gap-1 mb-8 relative z-10">
            <span className="text-5xl lg:text-6xl font-black tracking-tight text-[#111827]">₦{stats.balance.toLocaleString()}</span>
            <span className="text-xl font-bold text-[#9CA3AF]">.00</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-slate-100 relative z-10">
            <div>
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Lifetime Return</p>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-[#111827]">₦{stats.totalEarnings.toLocaleString()}</span>
                <ArrowUpRight size={14} className="text-[#16A34A]" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Plan Yield vs Cap</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-1.5 mt-1">
                <div className="bg-[#16A34A] h-full rounded-full transition-all" style={{ width: `${capPercent}%` }}></div>
              </div>
              <span className="text-[10px] font-semibold text-[#16A34A]">₦{planEarnings.toLocaleString()} / ₦{plan.monthlyReturnCap.toLocaleString()}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Active Cycle</p>
              <span className="text-lg font-bold text-[#111827]">{daysActive} <span className="text-xs text-[#9CA3AF] font-medium">/ {plan.breakEvenDay} to BEP</span></span>
              {breakEvenReached && <p className="text-[10px] font-semibold text-[#16A34A] mt-0.5 flex items-center gap-1"><Sparkles size={10}/> Profit Phase</p>}
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Withdrawal Status</p>
              {withdrawalEligible ? (
                <span className="inline-block px-2 py-1 bg-[#DCFCE7] text-[#16A34A] rounded text-[10px] font-bold uppercase tracking-wide">Eligible</span>
              ) : (
                <span className="inline-block px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold uppercase tracking-wide">Locked</span>
              )}
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
        </div>

        {/* Quota Widget */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 flex flex-col items-center justify-center text-center">
          <div className="relative w-40 h-40 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
              <circle 
                cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" 
                strokeDasharray={452.4} 
                strokeDashoffset={452.4 - (452.4 * Math.min(progressPercent, 100)) / 100} 
                strokeLinecap="round" 
                className={`${isLimitReached ? 'text-amber-400' : 'text-[#16A34A]'} transition-all duration-1000 ease-out`} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[#111827]">{Math.round(progressPercent)}%</span>
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mt-1">Daily Cap</span>
            </div>
          </div>
          <h4 className="text-base font-bold text-[#111827] mb-1">Engagement Matrix</h4>
          <p className="text-xs text-[#6B7280] font-medium mb-6">
            {isLimitReached ? "Daily reward capacity reached." : `${plan.readLimit - stats.postsReadToday} assignments remaining.`}
          </p>
          
          <Link to="/" className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-[#111827] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors">
            Continue Tasks <ArrowRight size={14} />
          </Link>
        </div>
      </div>


      {/* Referral & Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 bg-[#DCFCE7] rounded-xl flex items-center justify-center">
                  <Users size={18} className="text-[#16A34A]" />
               </div>
               <h4 className="text-lg font-bold text-[#111827]">Network Protocol</h4>
            </div>
            <p className="text-[#6B7280] text-sm mb-6 max-w-sm">
              Expand your network by inviting active users. Gain a liquid <span className="text-[#16A34A] font-bold">25%</span> yield directly into your treasury on their activation.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-auto">
            <div className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-[#111827] font-mono font-bold text-center tracking-wider text-base">
              {user?.referralCode}
            </div>
            <button 
              onClick={copyRefCode} 
              className="p-3 bg-[#16A34A] hover:bg-green-700 text-white rounded-xl transition-colors"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        <div className="bg-[#16A34A] p-8 rounded-2xl text-white shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Crown size={20} className="text-white" />
            </div>
            <h4 className="text-xl font-bold mb-2">Accelerate Matrix</h4>
            <p className="text-emerald-50 text-sm mb-6 max-w-sm leading-relaxed">
              Scale your node to a premium tier to unlock high-RPM yields and increase your maximum daily execution capacity.
            </p>
          </div>
           <Link to="/dashboard/plans" className="relative z-10 inline-flex items-center justify-center gap-2 bg-white text-[#16A34A] px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors w-max">
             Explore Tiers <ArrowRight size={16} />
           </Link>
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 pointer-events-none"></div>
        </div>
      </div>


      <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-[#111827] mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
            <HelpCircle size={16} className="text-indigo-600" />
          </div>
          Knowledge Base (FAQ)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { q: "How do I earn reading rewards?", a: "To earn, stay active on an article page until the timer finishes. Make sure you select articles properly tracking the reading cycle." },
            { q: "How does the referral system work?", a: "For every direct invite that upgrades their account, you automatically earn a 25% direct commission straight to your total withdrawable balance." },
            { q: "When can I withdraw my earnings?", a: "Withdrawals are open manually when you hit the minimum requirements of your active plan, such as total reads and mandatory active referrals." },
            { q: "What's the difference between Articles & Stories?", a: "Articles yield ₦500 upon approval. Stories are properly structured into multi-page Chapters yielding a higher ₦1,000 bonus on publish." },
            { q: "Why did my plan fee appear in my balance?", a: "Upgrades are actively mapped backwards into your internal ledger balance, but they are logically non-withdrawable to strictly buffer your account activity limits. It is the earnings you make on top of it that will be eligible for withdrawal." },
            { q: "Can I earn twice from commenting on the same post?", a: "No. You can only claim a reading or commenting reward on a specific post once in a lifetime." },
            { q: "Can I earn when admin edits and republishes my approved post?", a: "No, a post yields its ₦500 or ₦1,000 approval bonus only once per lifetime." }
          ].map((faq, i) => (
             <details key={i} className="group border border-slate-100 rounded-xl p-4 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
               <summary className="text-sm font-semibold text-[#111827] focus:outline-none flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                 {faq.q}
                 <ChevronDown size={16} className="text-[#6B7280] group-open:rotate-180 transition-transform" />
               </summary>
               <p className="text-sm text-[#6B7280] mt-3 pl-3 border-l-2 border-indigo-200 leading-relaxed font-medium">
                 {faq.a}
               </p>
             </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

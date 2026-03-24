
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

  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  
  const unreadCount = notifications.filter(n => !n.is_read).length;

  React.useEffect(() => {
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
    <div className="animate-fade-in space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2 drop-shadow-md">
              Welcome back, <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">{user?.name.split(' ')[0]}</span>.
            </h2>
            <p className="text-slate-400 text-sm">Track your portfolio and assets directly.</p>
          </div>
         
         <div className="flex items-center gap-3 relative">
           <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2 shadow-[inset_0_0_15px_rgba(52,211,153,0.05)]">
             <Sparkles className="text-emerald-400" size={16} />
             <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Plan: {plan.name}</span>
           </div>
           
           <button 
             onClick={() => setShowNotifications(!showNotifications)} 
             className="relative p-2.5 bg-white dark:bg-[#0A0D14]/80 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:bg-slate-800 transition-all shadow-lg"
           >
             <Bell size={20} className="text-slate-400 hover:text-slate-900 dark:text-white" />
             {unreadCount > 0 && (
               <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-slate-900 dark:text-white shadow-[0_0_10px_rgba(244,63,94,0.6)] ring-2 ring-[#0A0D14]">
                 {unreadCount > 9 ? '9+' : unreadCount}
               </span>
             )}
           </button>

           {showNotifications && (
             <div className="absolute top-14 right-0 w-[320px] bg-[#0A0D14]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 z-50 animate-fade-in">
               <h4 className="text-sm font-black text-slate-900 dark:text-white mb-4 pb-3 border-b border-slate-200 dark:border-slate-800/80">Notifications</h4>
               <div className="space-y-3 max-h-80 overflow-y-auto pr-2 no-scrollbar">
                 {notifications.length === 0 ? (
                   <p className="text-xs text-slate-500 text-center py-6">No notifications.</p>
                 ) : (
                   notifications.map((notif) => (
                     <div 
                       key={notif.id} 
                       onClick={() => markNotificationRead(notif.id, notif.is_read)}
                       className={`p-3 rounded-xl border transition-all cursor-pointer ${notif.is_read ? 'bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-70' : 'bg-emerald-500/10 border-emerald-500/20 shadow-[inset_0_0_10px_rgba(52,211,153,0.05)] text-emerald-50'}`}
                     >
                       <p className={`text-xs font-bold leading-relaxed mb-1 ${notif.is_read ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>{notif.message}</p>
                       <p className="text-[10px] text-slate-500 font-medium">Click to mark read</p>
                     </div>
                   ))
                 )}
               </div>
             </div>
           )}
         </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Treasury Widget */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0D121F] to-[#0A0D14] p-10 text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-800/80 group">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#141A29] rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-inner group-hover:border-emerald-500/30 transition-colors">
                    <Wallet size={26} className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Treasury Balance</p>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                      <p className="text-xs font-bold text-emerald-400">Verified Assets</p>
                    </div>
                  </div>
                </div>
                <Link to="/dashboard/wallet" className="px-6 py-3 bg-[#141A29] hover:bg-slate-100 dark:bg-slate-800 hover:border-emerald-500/30 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-800 shadow-lg text-slate-900 dark:text-white">
                  Withdraw Funds
                </Link>
              </div>
              
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 drop-shadow-md">₦{stats.balance.toLocaleString()}</span>
                <span className="text-2xl font-bold text-slate-500">.00</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800/80">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Lifetime Return</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-900 dark:text-white">₦{stats.totalEarnings.toLocaleString()}</span>
                  <ArrowUpRight size={16} className="text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Plan Yield vs Cap</p>
                <div className="w-full bg-[#141A29] h-2 rounded-full overflow-hidden mb-2 mt-2 shadow-inner border border-slate-200 dark:border-slate-800">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full relative" style={{ width: `${capPercent}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
                <span className="text-[10px] font-black text-emerald-400 drop-shadow-[0_0_3px_rgba(52,211,153,0.3)]">₦{planEarnings.toLocaleString()} / ₦{plan.monthlyReturnCap.toLocaleString()}</span>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Cycle</p>
                <span className="text-xl font-black text-slate-900 dark:text-white drop-shadow-sm">{daysActive} <span className="text-xs text-slate-500">/ {plan.breakEvenDay} to BEP</span></span>
                {breakEvenReached && <p className="text-[10px] font-bold text-emerald-400 mt-1 flex items-center gap-1"><Sparkles size={10}/> Profit Phase</p>}
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Withdrawal Status</p>
                {withdrawalEligible ? (
                  <span className="inline-block px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-[0_0_10px_rgba(52,211,153,0.1)]">Eligible</span>
                ) : (
                  <span className="inline-block px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-[10px] font-black uppercase tracking-wider">Locked</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full -mr-48 -mt-48 blur-[100px] group-hover:bg-emerald-500/10 transition-colors duration-1000 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full -ml-40 -mb-40 blur-[80px] pointer-events-none"></div>
        </div>

        {/* Quota Widget */}
        <div className="rounded-[2.5rem] bg-white dark:bg-[#0A0D14]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center group hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden p-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#141A29]/50 to-transparent opacity-50"></div>
          <div className="relative z-10 w-48 h-48 mb-8">
            <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-800" />
              <circle 
                cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="16" fill="transparent" 
                strokeDasharray={552.9} 
                strokeDashoffset={552.9 - (552.9 * Math.min(progressPercent, 100)) / 100} 
                strokeLinecap="round" 
                className={`${isLimitReached ? 'text-amber-400' : 'text-emerald-400'} transition-all duration-1000 ease-out filter drop-shadow-[0_0_8px_currentColor]`} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter drop-shadow-md">{Math.round(progressPercent)}%</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Daily Cap</span>
            </div>
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative z-10">Engagement Matrix</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-[200px] relative z-10 font-medium">
            {isLimitReached ? "Daily reward capacity reached." : `${plan.readLimit - stats.postsReadToday} assignments remaining.`}
          </p>
          
          <Link to="/" className="mt-8 relative z-10 flex items-center justify-center w-full py-3.5 bg-[#141A29] border border-slate-200 dark:border-slate-700 rounded-xl gap-2 text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all shadow-lg">
            Continue <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Referral Net', value: `${stats.referrals} / ${plan.minReferrals}`, icon: Users, color: 'blue', sub: 'Nodes Active' },
          { label: 'Engagement', value: stats.commentsMadeToday, icon: MessageSquare, color: 'purple', sub: `Target: ${plan.commentLimit}` },
          { label: 'Read Output', value: stats.postsReadToday, icon: BookOpen, color: 'emerald', sub: `Target: ${plan.readLimit}` },
          { label: 'Pending Yield', value: `₦${stats.pendingRewards.toFixed(0)}`, icon: Clock, color: 'amber', sub: 'In clearance' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-[#0A0D14]/80 backdrop-blur-md p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl hover:border-slate-200 dark:border-slate-700 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-slate-100 dark:bg-slate-800/30 rounded-full blur-2xl group-hover:bg-slate-700/30 transition-colors"></div>
            <div className={`relative z-10 w-12 h-12 bg-[#141A29] border border-slate-200 dark:border-slate-700 text-${item.color}-400 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-translate-y-1 transition-all shadow-md`}>
              <item.icon size={20} className={`drop-shadow-[0_0_8px_rgba(currentColor,0.5)]`} />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 relative z-10">{item.label}</p>
            <h5 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1 relative z-10">{item.value}</h5>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest relative z-10">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Referral & Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#0A0D14]/80 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 left-0"></div>
          <div className="relative z-10 flex-1">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-[#141A29] rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <Users size={18} className="text-emerald-400" />
               </div>
               <h4 className="text-xl font-black text-slate-900 dark:text-white">Network Protocol</h4>
            </div>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-md font-medium">
              Expand your network by inviting high-performance active nodes. Gain a liquid <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">25%</span> yield directly into your treasury on their activation.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3 mt-auto">
            <div className="flex-1 bg-[#141A29] border border-slate-700 px-6 py-4 rounded-xl text-emerald-400 font-mono font-black text-center tracking-[0.2em] text-lg break-all shadow-inner">
              {user?.referralCode}
            </div>
            <button 
              onClick={copyRefCode} 
              className="p-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl transition-all shadow-[0_0_15px_rgba(52,211,153,0.1)] group"
            >
              <Copy size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-slate-800/10 rounded-full -mb-20 -mr-20 pointer-events-none"></div>
        </div>

        <div className="bg-gradient-to-br from-[#0B1512] to-[#0A1A22] p-10 rounded-[2.5rem] text-white shadow-2xl border border-emerald-500/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                <Crown size={24} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              </div>
              <h4 className="text-2xl font-black mb-4 tracking-tight drop-shadow-md">Accelerate Matrix</h4>
              <p className="text-emerald-100/70 mb-8 font-medium leading-relaxed max-w-sm">
                Scale your node to a premium tier to unlock high-RPM yields and increase your maximum daily execution capacity.
              </p>
            </div>
             <Link to="/dashboard/plans" className="inline-flex items-center justify-center gap-2 bg-emerald-400 text-emerald-950 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-300 transition-all shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)]">
               Explore Tiers <ArrowRight size={16} />
             </Link>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-125 transition-transform duration-1000 pointer-events-none"></div>
        </div>
      </div>

      {/* Financial Ledger & Earnings Breakdown */}
      <div className="bg-white dark:bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-2xl mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-[#141A29] rounded-xl flex items-center justify-center border border-slate-700 shadow-inner">
              <TrendingUp size={20} className="text-emerald-400" />
            </div>
            Ledger & Yield Breakdown
          </h3>
          <Link to="/dashboard/wallet" className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors">View All Activity →</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity List */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 ml-2">Recent Transactions</h4>
            <div className="space-y-3">
              {(stats.transactions || []).slice(0, 5).map((tx) => (
                <div key={tx.id} className="bg-slate-50 dark:bg-[#141A29]/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-[#141A29] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      tx.type === 'reading_reward' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                      tx.type === 'referral_bonus' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500' :
                      tx.type === 'withdrawal' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                      tx.type === 'subscription_fee' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                      'bg-slate-500/10 border-slate-500/20 text-slate-500'
                    }`}>
                      {tx.type === 'reading_reward' || tx.type.includes('reward') ? <BookOpen size={16} /> : 
                       tx.type === 'withdrawal' ? <Wallet size={16} /> : 
                       <Sparkles size={16} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">{tx.description}</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black tracking-tight ${tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                      {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <span className={`text-[9px] uppercase font-bold tracking-widest ${
                      tx.status === 'completed' ? 'text-emerald-500' : 
                      tx.status === 'pending' ? 'text-amber-500' : 'text-rose-500'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
              {(stats.transactions || []).length === 0 && (
                <div className="text-center py-10 bg-slate-50 dark:bg-[#141A29]/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-sm font-medium text-slate-500">No recent transactions found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="bg-slate-50 dark:bg-[#141A29]/50 border border-slate-100 dark:border-slate-800 rounded-3xl p-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Aggregate Yield</h4>
            <div className="space-y-6">
              <div>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Reading & Engagement</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">₦{stats.postEarnings.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${Math.min((stats.postEarnings / (stats.totalEarnings || 1)) * 100, 100)}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Network Commissions</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">₦{stats.referralEarnings.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${Math.min((stats.referralEarnings / (stats.totalEarnings || 1)) * 100, 100)}%` }}></div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80">
                <div className="flex items-end justify-between mb-1">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Validated Yield</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">₦{stats.totalEarnings.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl mt-8">
        <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#141A29] rounded-xl flex items-center justify-center border border-slate-700">
            <HelpCircle size={20} className="text-indigo-400" />
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
             <details key={i} className="group border border-slate-800/80 rounded-xl p-5 cursor-pointer bg-slate-50 dark:bg-[#141A29]/50 hover:bg-[#141A29] transition-colors shadow-inner">
               <summary className="text-sm font-bold text-slate-200 focus:outline-none flex justify-between items-center list-none [&::-webkit-details-marker]:hidden">
                 {faq.q}
                 <ChevronDown size={16} className="text-slate-500 group-open:rotate-180 transition-transform" />
               </summary>
               <p className="text-sm text-slate-400 mt-4 pl-3 border-l-2 border-indigo-500/30 leading-relaxed font-medium">
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

import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  Copy,
  Share2,
  TrendingUp,
  CheckCircle2,
  Clock,
  Gift,
  UserPlus,
  Zap,
} from 'lucide-react';

const Referrals: React.FC = () => {
  const { user, stats } = useAuth();
  const [copied, setCopied] = useState(false);

  const shareLink = `${window.location.origin}/#/register?ref=${user?.referralCode}`;

  const referralInsights = useMemo(() => {
    const active = stats.referralList.filter((ref) => ref.status === 'active').length;
    const expected = stats.referralList.reduce((sum, ref) => sum + Number(ref.expectedCommission || 0), 0);
    return { active, expected };
  }, [stats.referralList]);

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.referralCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Shareable link copied to clipboard!');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-x-hidden">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">Referral Program</h2>
        <p className="text-slate-400 mt-2 font-medium">Earn 25% of each referred node's active subscription in real time.</p>
      </div>

      <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-[#0A0D14] rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 text-white shadow-[0_0_50px_rgba(52,211,153,0.15)] mb-10 relative overflow-hidden border border-emerald-500/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-[80px]" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 bg-[#1A2234] border border-slate-700 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-6 text-emerald-400 shadow-inner">
              <Zap size={14} className="text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]" /> Real-time 25% commission tracking
            </div>
            <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight drop-shadow-sm">Your network scales, you earn 25%.</h3>
            <p className="text-emerald-200/80 text-sm md:text-base mb-8 leading-relaxed max-w-xl">
              Every active referral node updates automatically from the ledger. Your dashboard reflects the referred node's current plan and expected yield.
            </p>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-[#0A0D14]/50 backdrop-blur-md border border-emerald-500/20 rounded-2xl p-5 min-w-0 shadow-inner">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Your Node Identifier</p>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xl md:text-2xl font-black font-mono break-all text-white tracking-widest">{user?.referralCode || '—'}</span>
                  <button
                    onClick={handleCopy}
                    className={`shrink-0 p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(52,211,153,0.5)]' : 'bg-[#1A2234] text-emerald-400 hover:bg-slate-800 border border-slate-700 shadow-sm'}`}
                  >
                    {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleCopyLink}
                className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-5 py-4 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:bg-emerald-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 drop-shadow-sm"
              >
                <Share2 size={18} /> Broadcast Link
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 bg-emerald-500/10 rounded-full animate-pulse flex items-center justify-center border border-emerald-500/20 shadow-[inset_0_0_30px_rgba(52,211,153,0.1)]">
                <Gift size={120} className="text-emerald-500/50 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
              </div>
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.5)] -mr-6 -mt-6 rotate-12 border-4 border-[#0A0D14]">
                <span className="text-[#0A0D14] font-black text-[15px] uppercase tracking-wider text-center px-2 leading-tight">25%<br />yield</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#0A0D14]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800 shadow-2xl group hover:bg-[#141A29] transition-colors relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Nodes</p>
            <div className="w-12 h-12 bg-[#1A2234] border border-slate-700 text-blue-400 rounded-xl flex items-center justify-center shadow-inner group-hover:border-blue-500/30 transition-colors">
              <Users size={22} className="drop-shadow-[0_0_5px_rgba(96,165,250,0.3)]" />
            </div>
          </div>
          <h4 className="text-4xl font-black text-white relative z-10">{stats.referrals}</h4>
        </div>

        <div className="bg-[#0A0D14]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800 shadow-2xl group hover:bg-[#141A29] transition-colors relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Yield Accrued</p>
            <div className="w-12 h-12 bg-[#1A2234] border border-slate-700 text-emerald-400 rounded-xl flex items-center justify-center shadow-inner group-hover:border-emerald-500/30 transition-colors">
              <TrendingUp size={22} className="drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]" />
            </div>
          </div>
          <h4 className="text-4xl font-black text-white relative z-10">₦{stats.referralEarnings.toFixed(2)}</h4>
        </div>

        <div className="bg-[#0A0D14]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800 shadow-2xl group hover:bg-[#141A29] transition-colors relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Expected 25%</p>
            <div className="w-12 h-12 bg-[#1A2234] border border-slate-700 text-purple-400 rounded-xl flex items-center justify-center shadow-inner group-hover:border-purple-500/30 transition-colors">
              <Gift size={22} className="drop-shadow-[0_0_5px_rgba(192,132,252,0.3)]" />
            </div>
          </div>
          <h4 className="text-4xl font-black text-white relative z-10 mb-2">₦{referralInsights.expected.toFixed(2)}</h4>
          <p className="text-xs text-slate-500 font-bold relative z-10"><span className="text-purple-400">{referralInsights.active}</span> active paid nodes</p>
        </div>
      </div>

      <div className="bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden mb-10">
        <div className="p-6 md:p-8 border-b border-slate-800/80">
          <h4 className="text-xl font-black text-white tracking-tight">Node Registry</h4>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-2 font-black">Live network data synced from ledger</p>
        </div>

        <div className="md:hidden divide-y divide-slate-800/50 p-4">
          {stats.referralList.map((ref) => (
            <div key={ref.id} className="py-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-wider">{ref.name} {ref.username && <span className="text-slate-500 font-bold text-[10px] lowercase tracking-normal ml-1">@{ref.username}</span>}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1"><span className="text-indigo-400">{ref.planId || 'free'}</span> tier</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                  ref.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {ref.status === 'active' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {ref.status}
                </span>
              </div>
              <div className="flex justify-between items-center bg-[#141A29]/50 p-4 rounded-xl border border-slate-800 shadow-inner">
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Maint.</p>
                  <p className="text-xs font-black text-slate-300">₦{Number(ref.planPrice || 0).toFixed(0)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Projected</p>
                  <p className="text-xs font-black text-emerald-400">₦{Number(ref.expectedCommission || 0).toFixed(0)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Claimed</p>
                  <p className="text-xs font-black text-emerald-400">₦{(Number(ref.rewardEarned) || 0).toFixed(0)}</p>
                </div>
              </div>
            </div>
          ))}
          {stats.referralList.length === 0 && (
            <div className="py-16 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
              No registered nodes in network.
            </div>
          )}
        </div>

        <div className="hidden md:block w-full overflow-x-auto no-scrollbar pb-2">
          <table className="w-full text-left min-w-[700px]">
             <thead className="bg-[#141A29]/30 border-b border-slate-800">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">Identifier</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center whitespace-nowrap">Node Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center whitespace-nowrap">Maint. Cost</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center whitespace-nowrap">Projected Yield</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center whitespace-nowrap">Init Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right whitespace-nowrap">Yield Claimed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {stats.referralList.map((ref, i) => (
                <tr key={ref.id} className={`hover:bg-[#141A29]/50 transition-colors ${i % 2 === 0 ? 'bg-[#141A29]/20' : ''}`}>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-wider">{ref.name} {ref.username && <span className="text-slate-500 font-bold text-[10px] lowercase tracking-normal ml-2">@{ref.username}</span>}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5"><span className="text-indigo-400">{ref.planId || 'free'}</span> tier</p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                      ref.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {ref.status === 'active' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center text-sm font-black text-slate-300">₦{Number(ref.planPrice || 0).toFixed(2)}</td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-sm font-black text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.2)]">₦{Number(ref.expectedCommission || 0).toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-6 text-center text-[11px] text-slate-500 font-bold uppercase tracking-wider">{ref.date}</td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-sm font-black text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.2)]">₦{(Number(ref.rewardEarned) || 0).toFixed(2)}</span>
                  </td>
                </tr>
              ))}
              {stats.referralList.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
                     No registered nodes in network. Broadcast your link to establish an edge.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0A0D14]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800 shadow-xl group hover:border-emerald-500/30 transition-colors">
          <div className="w-14 h-14 bg-[#1A2234] border border-slate-700 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-emerald-500/10 transition-colors">
            <UserPlus size={24} className="drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]" />
          </div>
          <h5 className="font-black text-white mb-3 text-lg">1. Broadcast Link</h5>
          <p className="text-xs text-slate-400 leading-relaxed font-bold">Transmit your unique node identifier or URL to new participants.</p>
        </div>
        <div className="bg-[#0A0D14]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800 shadow-xl group hover:border-blue-500/30 transition-colors">
          <div className="w-14 h-14 bg-[#1A2234] border border-slate-700 text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-blue-500/10 transition-colors">
            <CheckCircle2 size={24} className="drop-shadow-[0_0_5px_rgba(96,165,250,0.3)]" />
          </div>
          <h5 className="font-black text-white mb-3 text-lg">2. Node Calibration</h5>
          <p className="text-xs text-slate-400 leading-relaxed font-bold">Upon paid plan selection, projected yield parameters synchronize instantly.</p>
        </div>
        <div className="bg-[#0A0D14]/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800 shadow-xl group hover:border-purple-500/30 transition-colors">
          <div className="w-14 h-14 bg-[#1A2234] border border-slate-700 text-purple-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:bg-purple-500/10 transition-colors">
            <Zap size={24} className="drop-shadow-[0_0_5px_rgba(192,132,252,0.3)]" />
          </div>
          <h5 className="font-black text-white mb-3 text-lg">3. Auto Allocation</h5>
          <p className="text-xs text-slate-400 leading-relaxed font-bold">Earned cycle rewards automate directly onto ledger transaction history.</p>
        </div>
      </div>
    </div>
  );
};

export default Referrals;

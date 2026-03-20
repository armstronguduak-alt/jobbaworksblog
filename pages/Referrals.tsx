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
        <h2 className="text-2xl font-extrabold text-slate-900">Referral Program</h2>
        <p className="text-slate-500">Earn 25% of each referred user’s current paid plan in real time.</p>
      </div>

      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-10 text-white shadow-2xl shadow-emerald-200 mb-8 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest mb-5">
              <Zap size={14} className="text-amber-300" /> Real-time 25% commission tracking
            </div>
            <h3 className="text-2xl md:text-4xl font-black mb-4 leading-tight">Your friends subscribe, you earn 25%.</h3>
            <p className="text-emerald-100 text-sm md:text-base mb-6 leading-relaxed max-w-xl">
              Every active referral updates automatically from Supabase. Your dashboard reflects the referred user’s current plan and expected commission.
            </p>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-1">Your Code</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg md:text-xl font-black font-mono break-all">{user?.referralCode || '—'}</span>
                  <button
                    onClick={handleCopy}
                    className={`shrink-0 p-2.5 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                  >
                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleCopyLink}
                className="bg-white text-emerald-700 px-5 py-3 rounded-2xl font-black text-xs md:text-sm shadow-xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
              >
                <Share2 size={16} /> Copy Share Link
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="w-56 h-56 bg-white/10 rounded-full animate-pulse flex items-center justify-center">
                <Gift size={100} className="text-white/40" />
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-300 rounded-full flex items-center justify-center shadow-lg -mr-4 -mt-4 rotate-12">
                <span className="text-slate-900 font-black text-sm text-center px-2">25%<br />commission</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-[1.75rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Referrals</p>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <h4 className="text-3xl font-black text-slate-900">{stats.referrals}</h4>
        </div>

        <div className="bg-white p-6 rounded-[1.75rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Referral Earnings</p>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <h4 className="text-3xl font-black text-slate-900">₦{stats.referralEarnings.toFixed(2)}</h4>
        </div>

        <div className="bg-white p-6 rounded-[1.75rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Expected 25%</p>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Gift size={20} />
            </div>
          </div>
          <h4 className="text-3xl font-black text-slate-900">₦{referralInsights.expected.toFixed(2)}</h4>
          <p className="text-xs text-slate-500 mt-2">{referralInsights.active} active paid referrals</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 md:p-8 border-b border-slate-100">
          <h4 className="text-xl font-black text-slate-900">Referral Network</h4>
          <p className="text-xs text-slate-500 mt-1">Live referral and commission data from Supabase</p>
        </div>

        <div className="md:hidden divide-y divide-slate-100 p-4">
          {stats.referralList.map((ref) => (
            <div key={ref.id} className="py-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-900">{ref.name} {ref.username && <span className="text-slate-400 font-normal text-xs">@{ref.username}</span>}</p>
                  <p className="text-[10px] text-slate-400 uppercase">{ref.planId || 'free'} plan</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  ref.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {ref.status === 'active' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                  {ref.status}
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan</p>
                  <p className="text-sm font-semibold text-slate-600">₦{Number(ref.planPrice || 0).toFixed(0)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expected</p>
                  <p className="text-sm font-black text-emerald-600">₦{Number(ref.expectedCommission || 0).toFixed(0)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Earned</p>
                  <p className="text-sm font-black text-emerald-600">₦{(Number(ref.rewardEarned) || 0).toFixed(0)}</p>
                </div>
              </div>
            </div>
          ))}
          {stats.referralList.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-sm italic">
              You haven't referred anyone yet. Start sharing to earn.
            </div>
          )}
        </div>

        <div className="hidden md:block w-full overflow-x-auto no-scrollbar pb-2">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Friend</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Plan Price</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Expected 25%</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Date Joined</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.referralList.map((ref) => (
                <tr key={ref.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{ref.name} {ref.username && <span className="text-slate-400 font-normal text-xs">@{ref.username}</span>}</p>
                      <p className="text-[10px] text-slate-400 uppercase">{ref.planId || 'free'} plan</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      ref.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {ref.status === 'active' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center text-sm font-semibold text-slate-600">₦{Number(ref.planPrice || 0).toFixed(2)}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-black text-emerald-600">₦{Number(ref.expectedCommission || 0).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-5 text-center text-xs text-slate-500 font-medium">{ref.date}</td>
                  <td className="px-6 py-5 text-right">
                    <span className="text-sm font-black text-emerald-600">₦{(Number(ref.rewardEarned) || 0).toFixed(2)}</span>
                  </td>
                </tr>
              ))}
              {stats.referralList.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-slate-400 text-sm italic">
                    You haven't referred anyone yet. Start sharing to earn.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-slate-50 p-6 rounded-[1.75rem] border border-slate-100">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
            <UserPlus size={24} />
          </div>
          <h5 className="font-bold text-slate-900 mb-2">1. Invite</h5>
          <p className="text-sm text-slate-500 leading-relaxed">Share your code or link with friends.</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-[1.75rem] border border-slate-100">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <CheckCircle2 size={24} />
          </div>
          <h5 className="font-bold text-slate-900 mb-2">2. They Subscribe</h5>
          <p className="text-sm text-slate-500 leading-relaxed">When they pick a paid plan, your 25% expected commission appears instantly.</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-[1.75rem] border border-slate-100">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Zap size={24} />
          </div>
          <h5 className="font-bold text-slate-900 mb-2">3. Earn Automatically</h5>
          <p className="text-sm text-slate-500 leading-relaxed">Referral earnings are posted to your wallet transaction feed.</p>
        </div>
      </div>
    </div>
  );
};

export default Referrals;

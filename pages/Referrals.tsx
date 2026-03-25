import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  Copy,
  Share2,
  TrendingUp,
  CheckCircle2,
  UserPlus,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

const Referrals: React.FC = () => {
  const { user, stats } = useAuth();
  const [copied, setCopied] = useState(false);

  // Fallback to dummy data if user not available
  const shareLink = `${window.location.origin}/#/register?ref=${user?.referralCode || 'ESTATE-2941-X'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.referralCode || 'ESTATE-2941-X');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Shareable link copied to clipboard!');
  };

  return (
    <div className="animate-in fade-in duration-500 w-full overflow-x-hidden max-w-5xl mx-auto space-y-6">
      
      {/* Top Green Banner */}
      <div className="bg-[#16A34A] rounded-[32px] p-8 md:p-10 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-sm">
        <div className="md:w-2/3 relative z-10 w-full min-w-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight break-words">Grow the Estate Community.</h2>
          <p className="text-green-50/90 mb-8 text-[15px] leading-relaxed max-w-lg break-words">
            Earn 25% from your referrals' earnings. Every successful connection builds wealth for everyone.
          </p>
          <button
            onClick={handleCopyLink}
            className="bg-white text-[#16A34A] px-6 py-4 rounded-xl font-bold text-sm hover:bg-green-50 transition-colors flex items-center gap-2 shadow-sm w-full md:w-fit justify-center"
          >
            <Share2 size={16} /> Share Now
          </button>
        </div>
        <div className="hidden md:flex justify-end relative z-10 opacity-40">
           <UserPlus size={160} className="text-white" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Total Earnings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Total Earnings</p>
            <h3 className="text-[28px] font-extrabold text-[#16A34A] tracking-tight mb-2 font-mono">
              ₦{stats.referralEarnings.toFixed(2)}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#16A34A] mt-4">
            <TrendingUp size={14} />
            <span>+12.5% this month</span>
          </div>
        </div>

        {/* Total Referrals */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Total Referrals</p>
            <h3 className="text-[28px] font-extrabold text-[#111827] tracking-tight mb-4">
              {stats.referrals}
            </h3>
          </div>
          <div className="flex items-center -space-x-2 mt-auto">
            {stats.referralList.slice(0, 3).map((ref, idx) => (
               <div key={idx} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold z-[${10-idx}] ${
                  idx === 0 ? 'bg-orange-100 text-orange-700' :
                  idx === 1 ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-blue-100 text-blue-700'
               }`}>
                  {ref.name.substring(0, 2).toUpperCase()}
               </div>
            ))}
            {stats.referrals > 3 && (
              <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500 z-0">
                +{stats.referrals - 3}
              </div>
            )}
            {stats.referrals === 0 && (
              <div className="text-xs font-semibold text-slate-400 pl-2">No invites yet</div>
            )}
          </div>
        </div>

        {/* Your Referral Code */}
        <div className="bg-[#DCFCE7] rounded-2xl p-6 border border-green-100 shadow-sm flex flex-col justify-center">
          <p className="text-[11px] font-bold text-[#16A34A] uppercase tracking-widest mb-3">Your Referral Code</p>
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-green-200 mb-3 shadow-sm">
            <span className="text-[14px] font-bold text-[#111827]">{user?.referralCode || 'ESTATE-2941-X'}</span>
            <button
              onClick={handleCopy}
              className="text-[#16A34A] hover:text-green-700 transition-colors"
              title="Copy Code"
            >
              {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <p className="text-[10px] text-[#16A34A]/80 font-medium italic">
            Tap to copy and share with your network.
          </p>
        </div>

      </div>

      {/* Your Personal Referral Link */}
      <div className="bg-slate-50/80 rounded-3xl p-6 md:p-8 border border-slate-100 mt-8 mb-8">
        <h4 className="text-[15px] font-bold text-[#111827] mb-4">Your Personal Referral Link</h4>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 min-w-0 w-full bg-white px-5 py-3.5 rounded-2xl border border-slate-200 text-[13px] text-slate-500 font-medium truncate shadow-sm">
            {shareLink}
          </div>
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto w-full sm:w-auto justify-start sm:justify-end">
             <button className="w-12 h-12 shrink-0 bg-[#22C55E] text-white rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors shadow-sm">
               <MessageSquare size={18} fill="currentColor" className="text-white" />
             </button>
             <button className="w-12 h-12 shrink-0 bg-[#0EA5E9] text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm">
               <Share2 size={18} fill="none" strokeWidth={2.5} />
             </button>
             <button 
               onClick={handleCopyLink}
               className="flex-1 sm:flex-none px-6 h-12 bg-[#047857] text-white text-[13px] font-bold rounded-xl hover:bg-emerald-800 transition-colors shadow-sm"
             >
               Copy Link
             </button>
          </div>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-6">
           <div>
             <h4 className="text-[20px] font-bold text-[#111827]">Recent Referrals</h4>
             <p className="text-[13px] font-medium text-slate-500 mt-1">Keep track of your latest successful invites.</p>
           </div>
           <button className="text-[13px] font-bold text-[#047857] hover:text-green-800 transition-colors flex items-center gap-1 group">
             View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>        <div className="space-y-4">
          {stats.referralList.length > 0 ? stats.referralList.map((ref, idx) => (
             <div key={ref.id || idx} className="bg-white border border-slate-100 rounded-[24px] p-6 flex flex-col md:flex-row md:items-center justify-between shadow-sm transition-all hover:shadow-md gap-4">
               <div className="flex items-center gap-5">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-[15px] font-black ${
                    ref.planId === 'free' ? 'bg-slate-50 text-slate-500 border border-slate-200' :
                    ref.planId === 'starter' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                    ref.planId === 'pro' ? 'bg-[#DCFCE7] text-[#16A34A] border border-green-100' :
                    'bg-purple-50 text-purple-600 border border-purple-100'
                 }`}>
                   {ref.name.substring(0, 2).toUpperCase()}
                 </div>
                 <div>
                   <p className="text-lg font-bold text-[#111827] tracking-tight mb-1">{ref.name}</p>
                   <div className="flex items-center gap-2">
                     <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        ref.planId === 'free' ? 'bg-slate-100 text-slate-600' :
                        'bg-[#16A34A] text-white shadow-sm'
                     }`}>
                       {ref.planId} Plan
                     </span>
                     <span className="text-[12px] font-medium text-[#6B7280]">Joined {ref.date || 'recently'}</span>
                   </div>
                 </div>
               </div>
               <div className="text-left md:text-right pt-4 md:pt-0 border-t border-slate-100 md:border-0 md:pl-6">
                 <p className="text-xl font-black text-[#16A34A] tracking-tight mb-1">
                   ₦{Number(ref.expectedCommission || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                 </p>
                 <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Expected Yield</p>
               </div>
             </div>
          )) : (
            <div className="bg-slate-50 border border-slate-200 border-dashed rounded-[32px] p-12 text-center flex flex-col items-center justify-center min-h-[250px]">
               <UserPlus size={48} className="text-slate-300 mb-4" />
               <h4 className="text-lg font-bold text-[#111827] mb-2">No Referrals Yet</h4>
               <p className="text-sm font-medium text-[#6B7280] max-w-sm">Share your link to invite new members to the community. You'll see their subscription and growth here.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Referrals;

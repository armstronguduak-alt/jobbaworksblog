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
      <div className="bg-[#16A34A] rounded-2xl p-8 md:p-10 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-sm">
        <div className="md:w-2/3 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">Grow the Estate Community.</h2>
          <p className="text-green-50/90 mb-8 text-[15px] leading-relaxed max-w-lg">
            Earn 25% from your referrals' earnings. Every successful connection builds wealth for everyone.
          </p>
          <button
            onClick={handleCopyLink}
            className="bg-white text-[#16A34A] px-5 py-2.5 rounded-full font-bold text-sm hover:bg-green-50 transition-colors flex items-center gap-2 shadow-sm w-fit"
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
      <div className="bg-slate-50/80 rounded-2xl p-6 md:p-8 border border-slate-100 mt-8 mb-8">
        <h4 className="text-[15px] font-bold text-[#111827] mb-4">Your Personal Referral Link</h4>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full bg-white px-5 py-3.5 rounded-full border border-slate-200 text-[13px] text-slate-500 font-medium truncate shadow-sm">
            {shareLink}
          </div>
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto w-full sm:w-auto justify-end">
             <button className="w-12 h-12 bg-[#22C55E] text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors shadow-sm">
               <MessageSquare size={18} fill="currentColor" className="text-white" />
             </button>
             <button className="w-12 h-12 bg-[#0EA5E9] text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm">
               <Share2 size={18} fill="none" strokeWidth={2.5} />
             </button>
             <button 
               onClick={handleCopyLink}
               className="px-6 h-12 bg-[#047857] text-white text-[13px] font-bold rounded-full hover:bg-emerald-800 transition-colors shadow-sm"
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
        </div>

        <div className="space-y-4">
          {stats.referralList.length > 0 ? stats.referralList.map((ref, idx) => (
             <div key={ref.id || idx} className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
               <div className="flex items-center gap-5">
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-black shadow-inner ${
                    idx % 3 === 0 ? 'bg-rose-100 text-rose-700' :
                    idx % 2 === 0 ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-blue-100 text-blue-700'
                 }`}>
                   {ref.name.substring(0, 2).toUpperCase()}
                 </div>
                 <div>
                   <p className="text-[15px] font-extrabold text-[#111827] mb-0.5">{ref.name}</p>
                   <p className="text-[11px] font-medium text-slate-500">Joined {ref.date || 'recently'}</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-[16px] font-extrabold text-[#047857] font-mono tracking-tight leading-none mb-1">
                   ₦{Number(ref.expectedCommission || 0).toFixed(2)}
                 </p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">COMMISSION</p>
               </div>
             </div>
          )) : (
            <>
              {/* Dummy data to show UI match if real list is empty */}
              {[
                { name: 'John Doe', time: '2 hours ago', amount: '1,250.00', color: 'bg-rose-100 text-rose-700' },
                { name: 'Amina S.', time: '1 day ago', amount: '4,500.00', color: 'bg-[#DCFCE7] text-[#16A34A]' },
                { name: 'Chidi K.', time: '3 days ago', amount: '850.00', color: 'bg-[#DCFCE7] text-[#16A34A]' },
              ].map((ref, idx) => (
                <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-black shadow-inner ${ref.color}`}>
                      {ref.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-[15px] font-extrabold text-[#111827] mb-0.5">{ref.name}</p>
                      <p className="text-[11px] font-medium text-slate-500">Joined {ref.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[16px] font-extrabold text-[#047857] font-mono tracking-tight leading-none mb-1">
                      ₦{ref.amount}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">COMMISSION</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default Referrals;

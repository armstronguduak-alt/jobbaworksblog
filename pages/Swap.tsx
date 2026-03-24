import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RefreshCw, ArrowDown, Info, ShieldCheck, Zap } from 'lucide-react';

const Swap: React.FC = () => {
  const { stats } = useAuth();
  const [nairaAmount, setNairaAmount] = useState('');
  const [usdtAmount, setUsdtAmount] = useState('');
  
  // Mock exchange rate: 1 USDT = 1500 Naira
  const RATE = 1500;

  const handleNairaChange = (val: string) => {
    setNairaAmount(val);
    if (val && !isNaN(Number(val))) {
      setUsdtAmount((Number(val) / RATE).toFixed(2));
    } else {
      setUsdtAmount('');
    }
  };

  const handleSwap = () => {
    if (!nairaAmount || Number(nairaAmount) < 1000) {
      alert('Minimum swap amount is ₦1,000');
      return;
    }
    if (Number(nairaAmount) > stats.balance) {
      alert('Insufficient balance');
      return;
    }
    alert(`Successfully swapped ₦${nairaAmount} for ${usdtAmount} USDT!`);
    // In a real app, this would call a backend service
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-x-hidden">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">Currency Swap</h1>
        <p className="text-slate-400 mt-2 font-medium">Exchange your Naira earnings for USDT TRC20 instantly.</p>
      </div>

      <div className="bg-[#0A0D14]/80 backdrop-blur-xl rounded-[3rem] border border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 md:p-12 relative overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-[50px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full -ml-16 -mb-16 blur-[50px] pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>

        <div className="relative z-10 space-y-8">
          {/* From Field */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                From (Naira)
              </label>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance: <span className="text-white">₦{stats.balance.toLocaleString()}</span></span>
            </div>
            <div className="relative group/input">
              <input
                type="number"
                value={nairaAmount}
                onChange={(e) => handleNairaChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-[#141A29] border-2 border-slate-800 rounded-[2rem] px-8 py-6 text-2xl md:text-3xl font-black text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner placeholder-slate-600"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-[#0A0D14] px-4 py-3 rounded-2xl shadow-sm border border-slate-700">
                <div className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-[10px] font-black border border-emerald-500/30">₦</div>
                <span className="text-sm font-black text-white">NGN</span>
              </div>
            </div>
          </div>

          {/* Swap Icon */}
          <div className="flex justify-center -my-3 relative z-20">
            <div className="w-14 h-14 bg-[#1A2234] rounded-2xl flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)] border-4 border-[#0A0D14] hover:bg-slate-800 transition-colors cursor-pointer group/icon">
              <RefreshCw size={22} className="group-hover/icon:rotate-180 transition-transform duration-500 ease-in-out" />
            </div>
          </div>

          {/* To Field */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">To (USDT)</label>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] bg-emerald-500/10 px-3 py-1 bg-opacity-50 rounded-lg border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]">Rate: 1 USDT = ₦{RATE}</span>
            </div>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={usdtAmount}
                placeholder="0.00"
                className="w-full bg-[#141A29]/50 border-2 border-slate-800/80 rounded-[2rem] px-8 py-6 text-2xl md:text-3xl font-black text-white focus:outline-none opacity-80"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-[#0A0D14] px-4 py-3 rounded-2xl shadow-sm border border-slate-700">
                <div className="w-6 h-6 bg-emerald-500 text-slate-900 rounded-full flex items-center justify-center text-[10px] font-black shadow-[0_0_10px_rgba(52,211,153,0.8)]">₮</div>
                <span className="text-sm font-black text-white">USDT</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-slate-800/30 rounded-2xl p-5 flex gap-4 border border-slate-800/80 shadow-inner">
            <Info className="text-slate-500 shrink-0" size={20} />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Swaps execute via high-liquidity pools instantly. Verify balance adequacy. Converted USDT routes directly to internal secure custody.
            </p>
          </div>

          <button
            onClick={handleSwap}
            className="w-full py-6 mt-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(52,211,153,0.15)] flex items-center justify-center gap-4 group/btn active:scale-95"
          >
            <Zap size={20} className="text-emerald-400 group-hover/btn:animate-pulse drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span className="drop-shadow-sm">Execute Order</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        <div className="bg-[#0A0D14]/80 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 flex items-center gap-4 shadow-xl hover:bg-[#141A29] transition-colors">
          <div className="w-12 h-12 bg-[#1A2234] border border-slate-700 rounded-2xl flex items-center justify-center text-emerald-400 shadow-inner">
            <ShieldCheck size={20} className="drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]" />
          </div>
          <div>
            <h4 className="font-black text-white text-sm">Secure Exchange</h4>
            <p className="text-xs text-slate-500 font-medium">Bank-grade encryption for all swaps.</p>
          </div>
        </div>
        <div className="bg-[#0A0D14]/80 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-800 flex items-center gap-4 shadow-xl hover:bg-[#141A29] transition-colors">
          <div className="w-12 h-12 bg-[#1A2234] border border-slate-700 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner">
            <Zap size={20} className="drop-shadow-[0_0_5px_rgba(99,102,241,0.3)]" />
          </div>
          <div>
            <h4 className="font-black text-white text-sm">Instant Credit</h4>
            <p className="text-xs text-slate-500 font-medium">No waiting time for currency conversion.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;

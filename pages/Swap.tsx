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
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Currency Swap</h1>
        <p className="text-slate-500 font-medium">Exchange your Naira earnings for USDT TRC20 instantly.</p>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 md:p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-50 rounded-full -ml-16 -mb-16 blur-3xl opacity-50"></div>

        <div className="relative space-y-6">
          {/* From Field */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">From (Naira)</label>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance: ₦{stats.balance.toLocaleString()}</span>
            </div>
            <div className="relative group">
              <input
                type="number"
                value={nairaAmount}
                onChange={(e) => handleNairaChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] px-8 py-6 text-2xl font-black text-slate-900 focus:outline-none focus:border-emerald-500/30 focus:bg-white transition-all"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-[10px] text-white font-black">₦</div>
                <span className="text-sm font-black text-slate-900">NGN</span>
              </div>
            </div>
          </div>

          {/* Swap Icon */}
          <div className="flex justify-center -my-3 relative z-10">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20 border-4 border-white">
              <RefreshCw size={20} />
            </div>
          </div>

          {/* To Field */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">To (USDT)</label>
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Rate: 1 USDT = ₦{RATE}</span>
            </div>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={usdtAmount}
                placeholder="0.00"
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-[2rem] px-8 py-6 text-2xl font-black text-slate-900 focus:outline-none"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white font-black">₮</div>
                <span className="text-sm font-black text-slate-900">USDT</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-slate-50 rounded-2xl p-4 flex gap-3 border border-slate-100">
            <Info className="text-slate-400 shrink-0" size={18} />
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Swapping is instant and irreversible. Ensure you have enough balance to cover the transaction. USDT will be credited to your internal USDT wallet for withdrawal.
            </p>
          </div>

          <button
            onClick={handleSwap}
            className="w-full py-6 bg-slate-900 hover:bg-slate-800 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3 group"
          >
            <Zap size={20} className="text-emerald-400 fill-emerald-400" />
            Complete Swap
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm">Secure Exchange</h4>
            <p className="text-xs text-slate-500 font-medium">Bank-grade encryption for all swaps.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Zap size={24} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm">Instant Credit</h4>
            <p className="text-xs text-slate-500 font-medium">No waiting time for currency conversion.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;

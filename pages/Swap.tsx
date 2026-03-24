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
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans pb-20">
      <div className="text-center pt-6">
        <h1 className="text-3xl md:text-4xl font-black text-[#111827] tracking-tight">Currency Swap</h1>
        <p className="text-[#6B7280] mt-2 font-medium text-sm">Exchange your Naira earnings for USDT TRC20 instantly.</p>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-6 md:p-10 relative overflow-hidden group">
        <div className="relative z-10 space-y-6">
          
          {/* From Field */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                Pay (Naira)
              </label>
              <span className="text-[11px] font-bold text-[#6B7280]">
                Balance: <span className="text-[#111827]">₦{stats.balance.toLocaleString()}</span>
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                value={nairaAmount}
                onChange={(e) => handleNairaChange(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent border-none p-0 text-3xl font-black text-[#111827] focus:outline-none focus:ring-0 placeholder-slate-300"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
                <div className="w-5 h-5 bg-[#DCFCE7] text-[#16A34A] rounded-full flex items-center justify-center text-[10px] font-bold">₦</div>
                <span className="text-xs font-bold text-[#111827]">NGN</span>
              </div>
            </div>
          </div>

          {/* Swap Icon */}
          <div className="flex justify-center -my-8 relative z-20">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#16A34A] shadow-md border-[4px] border-[#F9FAFB] cursor-pointer hover:bg-slate-50 transition-colors">
              <RefreshCw size={20} className="hover:rotate-180 transition-transform duration-500" />
            </div>
          </div>

          {/* To Field */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <div className="flex justify-between items-center px-1">
              <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Receive (USDT)</label>
              <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-md border border-green-200">Rate: 1 USDT = ₦{RATE}</span>
            </div>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={usdtAmount}
                placeholder="0.00"
                className="w-full bg-transparent border-none p-0 text-3xl font-black text-[#111827] focus:outline-none focus:ring-0 opacity-70"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
                <div className="w-5 h-5 bg-[#C0E7CF] text-[#16A34A] rounded-full flex items-center justify-center text-[10px] font-bold">₮</div>
                <span className="text-xs font-bold text-[#111827]">USDT</span>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-[#F9FAFB] rounded-2xl p-4 flex gap-3 border border-slate-200">
            <Info className="text-[#6B7280] shrink-0 mt-0.5" size={16} />
            <p className="text-[11px] text-[#6B7280] font-medium leading-relaxed">
              Swaps execute instantly. Verify balance adequacy. Converted USDT is routed directly to your secure balance.
            </p>
          </div>

          <button
            onClick={handleSwap}
            className="w-full py-4 mt-2 bg-[#16A34A] hover:bg-green-700 text-white rounded-2xl font-bold uppercase tracking-wider text-sm transition-all shadow-md active:scale-[0.98] flex justify-center items-center gap-2"
          >
            <Zap size={18} />
            Execute Swap
          </button>
        </div>
      </div>

    </div>
  );
};

export default Swap;

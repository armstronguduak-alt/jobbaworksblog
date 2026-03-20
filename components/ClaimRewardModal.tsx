
import React from 'react';
import { Gift, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface ClaimRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  type: 'reading' | 'comment';
  onClaim: () => void;
}

const ClaimRewardModal: React.FC<ClaimRewardModalProps> = ({ isOpen, onClose, amount, type, onClaim }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full relative z-10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 text-center">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-all"
        >
          <X size={20} />
        </button>

        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <Gift size={40} />
          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full animate-bounce">
            <Sparkles size={16} />
          </div>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-2">Reward Unlocked!</h3>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          {type === 'reading' 
            ? "Fantastic! You've successfully read this article. Your insights are growing."
            : "Great comment! You're contributing to a better community discussion."}
        </p>

        <div className="bg-emerald-600 rounded-2xl p-6 text-white mb-8 relative overflow-hidden group">
          <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-1">Estimated Reward</p>
          <div className="text-4xl font-black">₦{amount.toFixed(2)}</div>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
             <Gift size={64} />
          </div>
        </div>

        <button 
          onClick={() => {
            onClaim();
            onClose();
          }}
          className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={20} />
          Claim to Wallet
        </button>
        
        <p className="mt-4 text-[10px] text-slate-400 font-medium">
          Reward will be added to your Pending Balance immediately.
        </p>
      </div>
    </div>
  );
};

export default ClaimRewardModal;

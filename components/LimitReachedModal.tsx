
import React from 'react';
import { X, AlertCircle, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

const LimitReachedModal: React.FC<LimitReachedModalProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="bg-white rounded-[2.5rem] p-8 max-sm w-full relative z-10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 text-center">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-all"
        >
          <X size={20} />
        </button>

        <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={40} />
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-2">Daily Limit Reached</h3>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          {message || "You have reached your earning limit for today on your current plan. You can still read posts, but you won't earn rewards until reset."}
        </p>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8">
          <p className="text-slate-700 text-sm font-bold mb-4">Want to earn more?</p>
          <Link 
            to="/plans"
            onClick={onClose}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <Rocket size={18} />
            Upgrade My Plan
          </Link>
        </div>

        <button 
          onClick={onClose}
          className="text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors"
        >
          Continue Reading (No Rewards)
        </button>
      </div>
    </div>
  );
};

export default LimitReachedModal;

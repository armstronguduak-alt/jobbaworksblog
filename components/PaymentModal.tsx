import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Loader2 } from 'lucide-react';
import { SubscriptionPlan } from '../types';
import { supabase } from '../src/integrations/supabase/client';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, plan }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      const { data, error: invokeError } = await supabase.functions.invoke('korapay-initialize-payment', {
        body: { planId: plan.id },
      });

      if (invokeError) {
        throw new Error(invokeError.message || 'Unable to initialize payment');
      }

      if (!data?.checkoutUrl) {
        throw new Error('Checkout URL was not returned by payment provider');
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment initialization failed';
      setError(message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 text-[#6B7280] hover:text-[#111827] rounded-full hover:bg-slate-50 transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-4">Secure Subscription Checkout</p>
          <h3 className="text-2xl font-bold text-[#111827] mb-2 tracking-tight">Upgrade to {plan.name}</h3>
          <p className="text-sm text-[#6B7280] font-medium mb-8">You will be redirected to Korapay to complete your payment securely.</p>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[#6B7280] font-medium">Plan</span>
              <span className="font-bold text-[#111827]">{plan.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[#6B7280] font-medium">Billing</span>
              <span className="font-bold text-[#111827]">One-time Lifetime</span>
            </div>
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="font-bold text-[#111827]">Total</span>
              <span className="text-2xl font-black text-[#16A34A] tracking-tight">₦{plan.price.toLocaleString()}</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">{error}</div>
          )}

          <button
            type="button"
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full py-4 bg-[#16A34A] text-white rounded-2xl font-bold hover:bg-green-700 transition-colors active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100 shadow-sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Redirecting...
              </>
            ) : (
              <>Pay with Korapay</>
            )}
          </button>

          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] font-semibold text-[#6B7280]">
            <Lock size={14} /> Payments are verified server-side before plan activation
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-semibold text-[#16A34A]">
            <ShieldCheck size={14} /> Fraud-protected upgrade flow
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
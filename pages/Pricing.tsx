import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Check, Zap, Shield, Crown, Sparkles, Star, Rocket, ShieldCheck } from 'lucide-react';
import { SubscriptionPlan } from '../types';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';
import { supabase } from '../src/integrations/supabase/client';

const Pricing: React.FC = () => {
  const { user, systemPlans } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentStatusMessage, setPaymentStatusMessage] = useState<string | null>(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyReturnedPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const payment = params.get('payment');
      const reference = params.get('reference');

      if (payment !== 'success' || !reference) return;

      try {
        setIsVerifyingPayment(true);
        const { data, error } = await supabase.functions.invoke('korapay-verify-payment', {
          body: { reference },
        });

        if (error) throw new Error(error.message || 'Payment verification failed');

        if (data?.success) {
          setPaymentStatusMessage('Payment verified successfully — your plan has been upgraded.');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          setPaymentStatusMessage(data?.message || 'Payment was not successful or is still pending verification.');
        }
      } catch (err) {
        setPaymentStatusMessage(err instanceof Error ? err.message : 'Unable to verify payment status.');
      } finally {
        setIsVerifyingPayment(false);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    verifyReturnedPayment();
  }, []);

  const handlePlanClick = (plan: SubscriptionPlan) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.planId === plan.id) return;
    setSelectedPlan(plan);
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen py-20 px-4 font-sans text-[#111827]">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#DCFCE7] border border-green-200 text-[#16A34A] rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          Sustainable Rewards Matrix
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-4 tracking-tight">Access Your Tier</h1>
        <p className="text-base md:text-lg text-[#6B7280] max-w-2xl mx-auto font-medium">
          Unlock your earning potential with a single lifetime upgrade. No monthly fees, just pure verified yield.
        </p>
      </div>

      {(paymentStatusMessage || isVerifyingPayment) && (
        <div className="max-w-3xl mx-auto mb-10">
          <div className="rounded-2xl border border-green-200 bg-[#DCFCE7] px-6 py-5 text-sm font-bold text-[#16A34A] text-center shadow-sm">
            {isVerifyingPayment ? 'Authenticating payment block...' : paymentStatusMessage}
          </div>
        </div>
      )}

      {/* Grid Layout optimized for Native App Look */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-24 px-2 md:px-0">
        {(Object.values(systemPlans) as SubscriptionPlan[])
          .filter((plan) => plan.isActive !== false && plan.id !== 'elite')
          .map((plan) => {
            const planHierarchy = ['free', 'starter', 'pro', 'vip', 'executive', 'platinum'];
            const userPlanIndex = user ? planHierarchy.indexOf(user.planId) : -1;
            const thisPlanIndex = planHierarchy.indexOf(plan.id);
            const isCurrent = user?.planId === plan.id;
            const isLowerTier = Boolean(user && thisPlanIndex < userPlanIndex);
            const isLowerOrEqual = Boolean(isCurrent || isLowerTier);

            const isPro = plan.id === 'pro';

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-3xl p-6 md:p-8 flex flex-col transition-all duration-300 transform shadow-sm ${
                  isLowerOrEqual 
                   ? 'border border-slate-200 opacity-60' 
                   : 'border border-slate-200 hover:border-[#16A34A] hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {/* Popular Tags */}
                {isPro && !isLowerOrEqual && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#16A34A] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm">
                    <Sparkles size={12} /> Popular 
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isLowerOrEqual ? 'border-slate-200 bg-slate-50 text-slate-400' : 'border-green-200 bg-[#DCFCE7] text-[#16A34A]'}`}>
                    {plan.id === 'free' && <Shield size={20} />}
                    {plan.id === 'starter' && <Rocket size={20} />}
                    {plan.id === 'pro' && <Zap size={20} />}
                    {plan.id === 'vip' && <Crown size={20} />}
                    {plan.id === 'executive' && <ShieldCheck size={20} />}
                    {plan.id === 'platinum' && <Sparkles size={20} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#111827] leading-tight">{plan.name}</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isLowerOrEqual ? 'text-slate-400' : 'text-[#16A34A]'}`}>Lifetime Entry</p>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[#111827] tracking-tight">₦{plan.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  {/* Ledger Metrics */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-3">System Thresholds</p>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs font-semibold text-[#6B7280]">Yield Cap</span>
                       <span className="text-xs font-bold text-[#111827]">₦{(plan.monthlyReturnCap || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-semibold text-[#6B7280]">BEP Target</span>
                       <span className="text-xs font-bold text-[#111827]">{plan.breakEvenDay || 0} days</span>
                    </div>
                  </div>

                  {/* Operational Yield */}
                  <div className="grid grid-cols-2 gap-3">
                     <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col justify-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">Articles</span>
                        <span className="text-lg font-bold text-[#111827]">₦{plan.readReward}</span>
                        <span className="text-[9px] font-semibold text-[#9CA3AF]">CAP: {plan.readLimit}/d</span>
                     </div>
                     <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex flex-col justify-center">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">Engagement</span>
                        <span className="text-lg font-bold text-[#111827]">₦{plan.commentReward}</span>
                        <span className="text-[9px] font-semibold text-[#9CA3AF]">CAP: {plan.commentLimit}/d</span>
                     </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 pt-4 border-t border-slate-100">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs text-[#6B7280] font-medium">
                        <div className={`mt-0.5 shrink-0 rounded-full p-0.5 ${isLowerOrEqual ? 'bg-slate-100 text-slate-400' : 'bg-[#DCFCE7] text-[#16A34A]'}`}>
                          <Check size={10} strokeWidth={4} />
                        </div>
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={isLowerOrEqual}
                  onClick={() => handlePlanClick(plan)}
                  className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                    isLowerOrEqual
                      ? 'bg-slate-100 text-[#9CA3AF] cursor-not-allowed'
                      : 'bg-[#16A34A] text-white hover:bg-green-700'
                  }`}
                >
                  {isCurrent ? 'Active Tier' : isLowerTier ? 'Unlocked' : plan.id === 'free' ? 'Default Access' : 'Authorize Upgrade'}
                </button>
              </div>
            );
          })}
      </div>

      <div className="max-w-4xl mx-auto mt-12 mb-20">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-bold text-[#111827] mb-3">Institutional Security</h4>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6 font-medium">
              All transactions are encrypted and processed verified via our core partners. No hidden deductions, seamless direct bank settlements.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-[#6B7280] flex items-center gap-2">
                <Shield size={14} className="text-[#16A34A]" /> AES-256
              </div>
              <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-[#6B7280] flex items-center gap-2">
                <Check size={14} className="text-[#16A34A]" /> PCI-DSS
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
             {['Korapay', 'Visa', 'Mastercard', 'Bank Transfer'].map(p => (
                <div key={p} className="h-12 w-full md:w-32 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">
                  {p}
                </div>
             ))}
          </div>
        </div>
      </div>

      <PaymentModal isOpen={!!selectedPlan} onClose={() => setSelectedPlan(null)} plan={selectedPlan!} />
    </div>
  );
};

export default Pricing;

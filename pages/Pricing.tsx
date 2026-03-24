import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle2, Shield, Check } from 'lucide-react';
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
    <div className="bg-[#F9FAFB] min-h-screen py-16 px-4 md:px-0 font-sans text-[#111827]">
      <div className="max-w-[400px] md:max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-stretch flex-wrap">
        
        {(paymentStatusMessage || isVerifyingPayment) && (
          <div className="w-full mb-6 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-green-200 bg-[#DCFCE7] px-6 py-5 text-sm font-bold text-[#16A34A] text-center shadow-sm">
              {isVerifyingPayment ? 'Authenticating payment block...' : paymentStatusMessage}
            </div>
          </div>
        )}

        {(Object.values(systemPlans) as SubscriptionPlan[])
          .filter((plan) => plan.isActive !== false && plan.id !== 'elite' && plan.id !== 'executive')
          .map((plan) => {
            const planHierarchy = ['free', 'starter', 'pro', 'vip', 'executive', 'platinum'];
            const userPlanIndex = user ? planHierarchy.indexOf(user.planId) : 0;
            const thisPlanIndex = planHierarchy.indexOf(plan.id);
            const isCurrent = user?.planId === plan.id;
            const isLowerTier = Boolean(user && thisPlanIndex < userPlanIndex);
            
            // Map plan details to look like user image mapping
            const tagMap: Record<string, string> = {
              'free': 'STARTER',
              'starter': 'ESSENTIAL',
              'pro': 'GROWTH',
              'vip': 'ELITE',
              'executive': 'EXECUTIVE',
              'platinum': 'PLATINUM'
            };

            const isPopular = plan.id === 'pro';

            return (
              <div 
                 key={plan.id}
                 className={`w-full md:w-[300px] bg-white rounded-[24px] p-8 flex flex-col relative ${isPopular ? 'border-[3px] border-[#047857] shadow-xl md:scale-105 z-10' : 'border border-slate-200 shadow-sm'} ${isLowerTier ? 'opacity-60' : ''} h-full min-h-[480px]`}
              >
                 {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#047857] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm whitespace-nowrap">
                       MOST POPULAR
                    </div>
                 )}
                 
                 <div className="mb-6 flex-grow">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#6B7280] mb-2">{tagMap[plan.id] || plan.id}</p>
                    <h3 className="text-[26px] font-bold text-[#111827] mb-4">{plan.name}</h3>
                    <div className="flex items-end gap-1 mb-10">
                       <span className="text-4xl font-extrabold text-[#111827] tracking-tight">₦{plan.price.toLocaleString()}</span>
                       <span className="text-[11px] text-[#6B7280] font-bold mb-1.5 leading-none">/lifetime</span>
                    </div>

                    <div className="space-y-5">
                       <div className="flex gap-3 items-start">
                          <CheckCircle2 size={16} className="text-[#047857] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[13px] font-bold text-[#111827]">₦{plan.readReward.toFixed(2)} per article</p>
                            <p className="text-[11px] font-medium text-[#6B7280] leading-tight">Standard earning rate</p>
                          </div>
                       </div>
                       <div className="flex gap-3 items-start">
                          <CheckCircle2 size={16} className="text-[#047857] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[13px] font-bold text-[#111827]">{plan.readLimit === Infinity ? 'Unlimited' : plan.readLimit} articles daily</p>
                            <p className="text-[11px] font-medium text-[#6B7280] leading-tight">Reading limit</p>
                          </div>
                       </div>
                       {plan.monthlyReturnCap > 0 && (
                       <div className="flex gap-3 items-start">
                          <CheckCircle2 size={16} className="text-[#047857] shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[13px] font-bold text-[#111827]">₦{plan.monthlyReturnCap.toLocaleString()} Limit</p>
                            <p className="text-[11px] font-medium text-[#6B7280] leading-tight">Monthly earnings cap</p>
                          </div>
                       </div>
                       )}
                    </div>
                 </div>

                 <div className="mt-auto pt-8">
                    <button
                       onClick={() => handlePlanClick(plan)}
                       disabled={isCurrent || isLowerTier}
                       className={`w-full py-3.5 rounded-full text-[13px] font-bold transition-all flex items-center justify-center
                          ${isCurrent ? 'bg-white border-2 border-slate-200 text-[#111827]' : 
                            isLowerTier ? 'bg-slate-100 text-slate-400' :
                            isPopular ? 'bg-[#047857] hover:bg-[#065f46] text-white shadow-md' :
                            'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#111827]'
                          }
                       `}
                    >
                       {isCurrent ? 'Current Plan' : isLowerTier ? 'Plan Downgrade Locked' : 'Upgrade Now'}
                    </button>
                 </div>
              </div>
            );
          })}
      </div>
      
      {selectedPlan && (
        <PaymentModal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          plan={selectedPlan}
        />
      )}
    </div>
  );
};

export default Pricing;

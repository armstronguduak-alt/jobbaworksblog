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
    <div className="bg-slate-50 min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          Sustainable Rewards Program
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">Choose Your Plan</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Buy once, keep your current tier, and upgrade anytime. <span className="text-emerald-600">Jobba</span><span className="text-black">Works</span> plans are one-time upgrades, not monthly subscriptions.
        </p>
      </div>

      {(paymentStatusMessage || isVerifyingPayment) && (
        <div className="max-w-4xl mx-auto mb-8">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-700 shadow-sm">
            {isVerifyingPayment ? 'Verifying payment status...' : paymentStatusMessage}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-20">
        {(Object.values(systemPlans) as SubscriptionPlan[])
          .filter((plan) => plan.isActive !== false)
          .map((plan) => {
            const isCurrent = user?.planId === plan.id;
            const isStarter = plan.id === 'starter';
            const isPro = plan.id === 'pro';
            const isElite = plan.id === 'elite';
            const isVip = plan.id === 'vip';
            const isExecutive = plan.id === 'executive';
            const isPlatinum = plan.id === 'platinum';

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-[2.5rem] p-8 shadow-xl transition-all hover:translate-y-[-4px] flex flex-col ${
                  isPro
                    ? 'ring-4 ring-emerald-500 shadow-emerald-100'
                    : isPlatinum
                    ? 'ring-4 ring-indigo-500 shadow-indigo-100'
                    : isExecutive
                    ? 'ring-4 ring-rose-500 shadow-rose-100'
                    : 'border border-slate-100'
                }`}
              >
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <Sparkles size={14} /> Popular
                  </div>
                )}
                {isExecutive && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <Star size={14} /> Ultimate
                  </div>
                )}
                {isPlatinum && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <Crown size={14} /> Prestige
                  </div>
                )}

                <div className="mb-8">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                      isStarter
                        ? 'bg-blue-100 text-blue-600'
                        : isPro
                        ? 'bg-emerald-100 text-emerald-600'
                        : isElite
                        ? 'bg-purple-100 text-purple-600'
                        : isVip
                        ? 'bg-amber-100 text-amber-600'
                        : isExecutive
                        ? 'bg-rose-100 text-rose-600'
                        : isPlatinum
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {plan.id === 'free' && <Shield size={24} />}
                    {plan.id === 'starter' && <Rocket size={24} />}
                    {plan.id === 'pro' && <Zap size={24} />}
                    {plan.id === 'elite' && <Star size={24} />}
                    {plan.id === 'vip' && <Crown size={24} />}
                    {plan.id === 'executive' && <ShieldCheck size={24} />}
                    {plan.id === 'platinum' && <Sparkles size={24} />}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">₦{plan.price}</span>
                    <span className="text-slate-500 font-bold">one-time</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Performance Metrics</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-600">Monthly Return Cap</span>
                      <span className="text-sm font-black text-emerald-600">₦{(plan.monthlyReturnCap || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-600">Break-even Point</span>
                      <span className="text-sm font-bold text-slate-900">{plan.breakEvenDay || 0} Days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600">Required Referrals</span>
                      <span className="text-sm font-bold text-slate-900">{plan.minReferrals || 0}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Read Tasks</p>
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-emerald-700">₦{plan.readReward.toFixed(2)}</span>
                        <span className="text-[10px] font-bold text-emerald-600/70 uppercase">Daily limit: {plan.readLimit}</span>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-purple-600 mb-2">Comment Tasks</p>
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-purple-700">₦{plan.commentReward.toFixed(2)}</span>
                        <span className="text-[10px] font-bold text-purple-600/70 uppercase">Daily limit: {plan.commentLimit}</span>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-3 pt-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                        <div className="shrink-0 w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mt-0.5">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={isCurrent}
                  onClick={() => handlePlanClick(plan)}
                  className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : isPlatinum
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95'
                      : isExecutive
                      ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-100 active:scale-95'
                      : isPro
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 active:scale-95'
                      : 'bg-slate-900 text-white hover:bg-black active:scale-95'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : plan.id === 'free' ? 'Basic Access' : 'Upgrade Now'}
                </button>
              </div>
            );
          })}
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-lg border border-slate-100 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h4 className="text-2xl font-black text-slate-900 mb-4">Ad-Supported Ecosystem</h4>
            <p className="text-slate-500 leading-relaxed mb-6">
              To maintain the highest quality of rewards, <span className="text-emerald-600">Jobba</span>
              <span className="text-black">Works</span> integrates targeted sponsored content across all tiers. This ensures the platform remains sustainable while delivering value to every user.
            </p>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2">
                <Shield size={14} /> Secure Encryption
              </div>
              <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2">
                <Check size={14} /> PCI Compliant
              </div>
            </div>
          </div>
          <div className="w-full md:w-64 grid grid-cols-2 gap-4">
            {['Korapay', 'Visa', 'Bank', 'Card'].map((p) => (
              <div key={p} className="h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[10px] font-black uppercase text-slate-300">
                {p}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-slate-400 text-xs">
          <p>Plans are one-time purchases. You can upgrade to a higher plan at any time. Rewards are accrued in real-time and subject to verification.</p>
        </div>
      </div>

      <PaymentModal isOpen={!!selectedPlan} onClose={() => setSelectedPlan(null)} plan={selectedPlan!} />
    </div>
  );
};

export default Pricing;

import React, { useMemo, useState, useEffect } from 'react';
import { AlertCircle, X, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../src/integrations/supabase/client';

type CurrencyMode = 'naira' | 'usdt';
type PayoutMethodKey = 'opay' | 'usdt_trc20' | 'minipay';

export interface WithdrawalPayload {
  amount: number;
  currency: CurrencyMode;
  method: PayoutMethodKey;
  details: {
    accountName?: string;
    accountNumber?: string;
    walletAddress?: string;
    miniPayDetails?: string;
  };
}

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  balanceNaira: number;
  balanceUsdt: number;
  onSubmit: (payload: WithdrawalPayload) => Promise<void>;
  isSubmitting: boolean;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  balanceNaira,
  balanceUsdt,
  onSubmit,
  isSubmitting,
}) => {
  const [currency, setCurrency] = useState<CurrencyMode>('naira');
  const [method, setMethod] = useState<PayoutMethodKey>('opay');
  const [amount, setAmount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [miniPayDetails, setMiniPayDetails] = useState('');
  const [payoutPin, setPayoutPin] = useState('');
  const [validPin, setValidPin] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      const fetchSavedDetails = async () => {
        const [{ data: payoutData }, { data: profile }] = await Promise.all([
           supabase.from('payout_methods').select('*').eq('user_id', user.id),
           supabase.from('profiles' as any).select('payout_pin').eq('user_id', user.id).single()
        ]);
        
        if ((profile as any)?.payout_pin) setValidPin((profile as any).payout_pin);

        if (payoutData) {
          const opay = payoutData.find((p: any) => p.method === 'opay');
          if (opay) {
             if (opay.account_name) setAccountName(opay.account_name);
             if (opay.account_number) setAccountNumber(opay.account_number);
          }
          const usdt = payoutData.find((p: any) => p.method === 'usdt_trc20');
          if (usdt && usdt.wallet_address) setWalletAddress(usdt.wallet_address);
          const mini = payoutData.find((p: any) => p.method === 'minipay');
          if (mini && mini.minipay_uid) setMiniPayDetails(mini.minipay_uid);
        }
      };
      fetchSavedDetails();
    }
  }, [isOpen, user]);

  const minAmount = currency === 'naira' ? 1000 : 10;
  const maxAmount = currency === 'naira' ? balanceNaira : balanceUsdt;

  const methodOptions = useMemo(() => {
    if (currency === 'naira') return [{ key: 'opay' as const, label: 'Bank Transfer (OPAY)' }];
    return [
      { key: 'usdt_trc20' as const, label: 'USDT (TRC20)' },
      { key: 'minipay' as const, label: 'MiniPay' },
    ];
  }, [currency]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validPin && payoutPin !== validPin) {
      alert("Incorrect Payout PIN.");
      return;
    }

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount < minAmount || parsedAmount > maxAmount) return;

    await onSubmit({
      amount: parsedAmount,
      currency,
      method,
      details: {
        accountName: accountName.trim() || undefined,
        accountNumber: accountNumber.trim() || undefined,
        walletAddress: walletAddress.trim() || undefined,
        miniPayDetails: miniPayDetails.trim() || undefined,
      },
    });
  };

  const handleCurrency = (next: CurrencyMode) => {
    setCurrency(next);
    setMethod(next === 'naira' ? 'opay' : 'usdt_trc20');
    setAmount('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
        <button type="button" onClick={onClose} className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900">
          <X size={18} />
        </button>

        <h3 className="text-2xl font-black text-slate-900">Withdraw Funds</h3>
        <p className="mt-1 text-sm text-slate-500">Switch between Naira and USDT payout options.</p>

        <form onSubmit={submit} className="mt-6 space-y-5">
          <div className="rounded-2xl bg-slate-100 p-1">
            <div className="grid grid-cols-2 gap-1">
              <button type="button" onClick={() => handleCurrency('naira')} className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${currency === 'naira' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                Naira
              </button>
              <button type="button" onClick={() => handleCurrency('usdt')} className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition-all ${currency === 'usdt' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                USDT
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Withdrawal Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PayoutMethodKey)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {methodOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
            {currency === 'naira' && <p className="mt-2 text-xs font-semibold text-slate-500">Other banks coming soon</p>}
          </div>

          {currency === 'naira' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Account Name</label>
                <input value={accountName} onChange={(e) => setAccountName(e.target.value)} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600" />
              </div>
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Account Number</label>
                <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600" />
              </div>
            </div>
          )}

          {currency === 'usdt' && method === 'usdt_trc20' && (
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Wallet Address</label>
              <input value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600" />
            </div>
          )}

          {currency === 'usdt' && method === 'minipay' && (
            <div>
              <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">MiniPay UID / Account Details</label>
              <input value={miniPayDetails} onChange={(e) => setMiniPayDetails(e.target.value)} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600" />
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Amount ({currency === 'naira' ? '₦' : 'USDT'})</label>
            <input type="number" min={minAmount} max={maxAmount} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-600" />
            <p className="mt-2 text-xs text-slate-500">Available: {currency === 'naira' ? `₦${balanceNaira.toFixed(2)}` : `${balanceUsdt.toFixed(2)} USDT`}</p>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600">
              <Lock size={14} /> Payout PIN (4-Digit)
            </label>
            <input 
              type="password" 
              maxLength={4}
              value={payoutPin} 
              onChange={(e) => setPayoutPin(e.target.value.replace(/\D/g, ''))} 
              required 
              placeholder="Enter your PIN"
              className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-mono text-xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-emerald-600" 
            />
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs text-emerald-800">
            <div className="flex items-start gap-2">
              <AlertCircle size={14} className="mt-0.5" />
              <p>Withdrawal requests are submitted instantly and processed by admin review.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button disabled={isSubmitting} type="submit" className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-60">
              {isSubmitting ? 'Submitting...' : 'Submit Withdrawal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawalModal;

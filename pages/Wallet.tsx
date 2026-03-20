import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Wallet as WalletIcon,
  TrendingUp,
  Clock,
  Download,
  AlertCircle,
  Coins,
  MessageSquare,
  UserPlus,
  Banknote,
} from 'lucide-react';
import { TransactionType } from '../types';

const Wallet: React.FC = () => {
  const { stats, requestWithdrawal } = useAuth();
  const [filter, setFilter] = useState<TransactionType | 'all'>('all');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  const [withdrawCurrency, setWithdrawCurrency] = useState<'naira' | 'usdt'>('naira');
  const [withdrawMethod, setWithdrawMethod] = useState('OPAY');
  
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [miniPayDetails, setMiniPayDetails] = useState('');

  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return stats.transactions;
    return stats.transactions.filter((tx) => tx.type === filter);
  }, [filter, stats.transactions]);

  const earningsBreakdown = useMemo(() => {
    const reading = stats.transactions
      .filter((tx) => tx.type === 'reading_reward' && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const comments = stats.transactions
      .filter((tx) => tx.type === 'comment_reward' && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const referrals = stats.transactions
      .filter((tx) => tx.type === 'referral_bonus' && tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0);

    return [
      { label: 'Reading Rewards', value: reading, color: 'bg-emerald-500' },
      { label: 'Comment Rewards', value: comments, color: 'bg-purple-500' },
      { label: 'Referral Bonuses', value: referrals, color: 'bg-blue-500' },
    ];
  }, [stats.transactions]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) return;

    const isCrypto = withdrawCurrency === 'usdt';
    const minAmount = isCrypto ? 10 : 10000;
    const currencySymbol = isCrypto ? '$' : '₦';

    if (amount < minAmount) {
      alert(`Minimum withdrawal is ${currencySymbol}${minAmount.toLocaleString()}`);
      return;
    }
    
    // Details payload for the backend
    const details: Record<string, string> = {};
    if (withdrawCurrency === 'naira' && withdrawMethod === 'OPAY') {
      if (!accountName || !accountNumber) return alert('Please fill in Opay details');
      details.accountName = accountName;
      details.accountNumber = accountNumber;
    } else if (withdrawCurrency === 'usdt' && withdrawMethod === 'USDT (TRC20)') {
       if (!walletAddress) return alert('Please provide your TRC20 wallet address');
       details.walletAddress = walletAddress;
    } else if (withdrawCurrency === 'usdt' && withdrawMethod === 'MiniPay') {
       if (!miniPayDetails) return alert('Please provide MiniPay UID or account details');
       details.miniPayDetails = miniPayDetails;
    }

    const res = await requestWithdrawal(amount, withdrawMethod, withdrawCurrency, details);
    if (res.success) {
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setAccountName('');
      setAccountNumber('');
      setWalletAddress('');
      setMiniPayDetails('');
      alert(res.message);
    } else {
      alert(res.message);
    }
  };

  const switchCurrency = (cur: 'naira' | 'usdt') => {
    setWithdrawCurrency(cur);
    setWithdrawMethod(cur === 'naira' ? 'OPAY' : 'USDT (TRC20)');
  };

  const getIcon = (type: TransactionType) => {
    switch (type) {
      case 'reading_reward':
        return <Coins className="text-emerald-500" size={18} />;
      case 'comment_reward':
        return <MessageSquare className="text-purple-500" size={18} />;
      case 'referral_bonus':
        return <UserPlus className="text-blue-500" size={18} />;
      case 'withdrawal':
        return <Banknote className="text-red-500" size={18} />;
      default:
        return <WalletIcon size={18} className="text-slate-500" />;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-x-hidden">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900">My Wallet</h2>
        <p className="text-slate-500">Live wallet balances, rewards, and withdrawals synced from Supabase.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="md:col-span-2 bg-emerald-600 rounded-[1.75rem] md:rounded-[2rem] p-5 md:p-8 text-white shadow-xl shadow-emerald-100 flex flex-col justify-between min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="min-w-0">
              <p className="text-emerald-100 text-[11px] font-bold uppercase tracking-widest mb-1">Available Balance (NGN)</p>
              <h3 className="text-3xl md:text-4xl font-black break-words">₦{stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="min-w-0">
              <p className="text-emerald-100 text-[11px] font-bold uppercase tracking-widest mb-1">Crypto (USDT)</p>
              <h3 className="text-2xl md:text-3xl font-black break-words">${stats.usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="w-full mt-5 py-3 bg-white text-emerald-700 rounded-2xl font-bold hover:bg-emerald-50 transition-colors shadow-lg active:scale-95"
          >
            Withdraw Funds
          </button>
        </div>

        <div className="bg-white rounded-[1.75rem] p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Pending Rewards</p>
              <Clock size={16} className="text-amber-500" />
            </div>
            <h3 className="text-3xl font-black text-slate-900">₦{stats.pendingRewards.toFixed(2)}</h3>
          </div>
          <div className="mt-4 flex items-start gap-2 text-[10px] text-slate-400 font-medium">
            <AlertCircle size={12} className="mt-0.5" />
            Rewards clear to balance within 2–3 business days.
          </div>
        </div>

        <div className="bg-white rounded-[1.75rem] p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Lifetime Earnings</p>
              <TrendingUp size={16} className="text-blue-500" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 break-words">₦{stats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Live data</span>
            <button className="text-slate-400 hover:text-slate-900">
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[1.75rem] border border-slate-100 p-5 md:p-8 shadow-sm mb-8">
        <h4 className="text-lg font-bold text-slate-900 mb-6">Earnings Breakdown</h4>
        <div className="space-y-5">
          {earningsBreakdown.map((item) => {
            const width = stats.totalEarnings > 0 ? Math.min(100, (item.value / stats.totalEarnings) * 100) : 0;
            return (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-2 gap-4">
                  <span className="text-sm font-medium text-slate-600">{item.label}</span>
                  <span className="text-sm font-bold text-slate-900">₦{item.value.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full transition-all duration-700`} style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-[1.75rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 md:p-8 border-b border-slate-100 flex flex-col gap-4">
          <h4 className="text-lg font-bold text-slate-900">Transaction History</h4>
          <div className="flex flex-wrap items-center gap-2 pb-1">
            {(['all', 'reading_reward', 'comment_reward', 'referral_bonus', 'withdrawal'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  filter === type ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'
                }`}
              >
                {type.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">{getIcon(tx.type)}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 capitalize">{tx.type.replace('_', ' ')}</p>
                    <p className="text-xs text-slate-500 truncate">{tx.description}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold ${tx.type === 'withdrawal' ? 'text-red-500' : 'text-emerald-600'}`}>
                  {tx.type === 'withdrawal' ? '-' : '+'} ₦{tx.amount.toFixed(2)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">{tx.date}</span>
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                    tx.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-600'
                      : tx.status === 'pending'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && <div className="p-10 text-center text-slate-400 text-sm italic">No transactions found.</div>}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">{getIcon(tx.type)}</div>
                      <span className="text-xs font-bold text-slate-900 capitalize">{tx.type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-sm truncate">{tx.description}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{tx.date}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${tx.type === 'withdrawal' ? 'text-red-500' : 'text-emerald-600'}`}>
                      {tx.type === 'withdrawal' ? '-' : '+'} ₦{tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                        tx.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-600'
                          : tx.status === 'pending'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-slate-400 text-sm italic">
                    No transactions found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showWithdrawModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowWithdrawModal(false)} />
          <div className="bg-white rounded-[2rem] p-6 md:p-8 max-w-md w-full relative z-10 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Withdraw Funds</h3>
            <p className="text-slate-500 text-sm mb-6">Select your preferred method and amount to withdraw.</p>

            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="flex bg-slate-50 p-1 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => switchCurrency('naira')}
                  className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${withdrawCurrency === 'naira' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Naira (NGN)
                </button>
                <button
                  type="button"
                  onClick={() => switchCurrency('usdt')}
                  className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${withdrawCurrency === 'usdt' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Crypto (USDT)
                </button>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  {withdrawMethod === 'OPAY' && <img src="/payment-logos/opay.svg" alt="OPAY" className="w-5 h-5 rounded hover:scale-105 transition-transform" />}
                  {withdrawMethod === 'USDT (TRC20)' && <img src="/payment-logos/usdt.svg" alt="USDT" className="w-5 h-5 rounded hover:scale-105 transition-transform" />}
                  {withdrawMethod === 'MiniPay' && <img src="/payment-logos/minipay.svg" alt="MiniPay" className="w-5 h-5 rounded hover:scale-105 transition-transform" />}
                  Payment Method
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-600 outline-none font-medium text-slate-700"
                >
                  {withdrawCurrency === 'naira' ? (
                    <option value="OPAY">OPAY Bank Transfer</option>
                  ) : (
                    <>
                      <option value="USDT (TRC20)">USDT (TRC20)</option>
                      <option value="MiniPay">MiniPay</option>
                    </>
                  )}
                </select>
                {withdrawCurrency === 'naira' && (
                   <p className="text-[10px] text-amber-500 font-bold mt-2 uppercase tracking-widest">* Other banks coming soon</p>
                )}
              </div>
              
              <div className="space-y-4">
                {withdrawMethod === 'OPAY' && (
                  <>
                    <input 
                      type="text" 
                      required 
                      placeholder="Account Name (e.g. John Doe)"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-600 outline-none" 
                    />
                    <input 
                      type="number" 
                      required 
                      placeholder="Opay Account Number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-600 outline-none" 
                    />
                  </>
                )}
                {withdrawMethod === 'USDT (TRC20)' && (
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter TRC20 Wallet Address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-600 outline-none font-mono" 
                  />
                )}
                {withdrawMethod === 'MiniPay' && (
                  <input 
                    type="text" 
                    required 
                    placeholder="Enter MiniPay UID or Account details"
                    value={miniPayDetails}
                    onChange={(e) => setMiniPayDetails(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-600 outline-none" 
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Withdrawal Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">{withdrawCurrency === 'usdt' ? '$' : '₦'}</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min={withdrawCurrency === 'usdt' ? '10' : '10000'}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder={`Min ${withdrawCurrency === 'usdt' ? '10' : '10,000'}`}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-emerald-600 outline-none font-bold"
                  />
                </div>
                <div className="mt-2 flex justify-between items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Available: ₦{stats.balance.toFixed(2)} | ${stats.usdtBalance.toFixed(2)} USDT</span>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(withdrawCurrency === 'usdt' ? stats.usdtBalance.toString() : stats.balance.toString())}
                    className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700"
                  >
                    Max
                  </button>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl flex gap-3">
                <AlertCircle className="text-emerald-600 shrink-0" size={18} />
                <p className="text-[10px] text-emerald-800 leading-relaxed font-bold uppercase tracking-wider">
                  Withdrawals are typically processed within 24-72 hours. Verification may apply.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95">
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;

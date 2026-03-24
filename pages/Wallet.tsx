
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
      { label: 'Comment Rewards', value: comments, color: 'bg-indigo-500' },
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
        return <MessageSquare className="text-indigo-500" size={18} />;
      case 'referral_bonus':
        return <UserPlus className="text-blue-500" size={18} />;
      case 'withdrawal':
        return <Banknote className="text-red-500" size={18} />;
      default:
        return <WalletIcon size={18} className="text-slate-500" />;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-x-hidden font-sans pb-20">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-[#111827] tracking-tight">My Portfolio</h2>
        <p className="text-[#6B7280] mt-2 font-medium text-sm">Live asset tracking, rewards, and withdrawals verified.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        {/* Main Balance Card */}
        <div className="md:col-span-2 relative overflow-hidden bg-white border border-slate-200 rounded-[32px] p-8 md:p-10 shadow-sm flex flex-col justify-between min-w-0 group">
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="min-w-0">
              <p className="text-[#6B7280] text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                 <div className="w-2 h-2 bg-[#16A34A] rounded-full animate-pulse shadow-sm"></div>
                 Liquid Assets (NGN)
              </p>
              <h3 className="text-4xl md:text-5xl font-black break-words text-[#111827] tracking-tight">
                ₦{stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="min-w-0">
              <p className="text-[#6B7280] text-[11px] font-bold uppercase tracking-wider mb-2">Crypto Equiv (USDT)</p>
              <h3 className="text-3xl md:text-4xl font-black break-words text-[#111827] opacity-80">
                ${stats.usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="w-full mt-10 py-4 bg-[#DCFCE7] border border-green-200 text-[#16A34A] rounded-2xl font-bold uppercase tracking-wider text-[13px] hover:bg-green-100 transition-colors shadow-sm active:scale-[0.98]"
          >
            Initiate Withdrawal
          </button>
        </div>

        {/* Pending Card */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-[#6B7280] text-[11px] font-bold uppercase tracking-wider">Pending Yield</p>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                <Clock size={18} className="text-amber-500" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-[#111827] tracking-tight">₦{stats.pendingRewards.toFixed(2)}</h3>
          </div>
          <div className="mt-8 flex items-start gap-2 text-[10px] text-[#6B7280] font-bold uppercase tracking-wide bg-slate-50 p-3 rounded-xl border border-slate-100">
            <AlertCircle size={14} className="mt-0.5 text-amber-500 shrink-0" />
            <span className="leading-relaxed">Rewards clear to balance within 2-3 business days.</span>
          </div>
        </div>

        {/* ROI Card */}
        <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-[#6B7280] text-[11px] font-bold uppercase tracking-wider">Total ROI</p>
              <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                <TrendingUp size={18} className="text-blue-500" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-[#111827] tracking-tight break-words">₦{stats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#16A34A] bg-[#DCFCE7] px-3 py-1.5 rounded-lg border border-green-200">On-Chain</span>
            <button className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[#6B7280] hover:text-[#111827] transition-colors">
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 p-8 md:p-10 shadow-sm mb-8">
        <h4 className="text-xl font-bold text-[#111827] mb-8">Yield Distribution</h4>
        <div className="space-y-6">
          {earningsBreakdown.map((item) => {
            const width = stats.totalEarnings > 0 ? Math.min(100, (item.value / stats.totalEarnings) * 100) : 0;
            return (
              <div key={item.label} className="group">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280]">{item.label}</span>
                  <span className="text-sm font-black text-[#111827]">₦{item.value.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h4 className="text-xl font-bold text-[#111827]">Ledger History</h4>
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'reading_reward', 'comment_reward', 'referral_bonus', 'withdrawal'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border ${
                  filter === type 
                    ? 'bg-[#16A34A] text-white border-green-600 shadow-sm' 
                    : 'bg-slate-50 text-[#6B7280] border-slate-200 hover:bg-slate-100'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shrink-0">{getIcon(tx.type)}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-[#111827] uppercase tracking-wider mb-1">{tx.type.replace('_', ' ')}</p>
                    <p className="text-[11px] text-[#6B7280] truncate font-medium">{tx.description}</p>
                  </div>
                </div>
                <span className={`text-sm font-black tracking-tight ${tx.type === 'withdrawal' ? 'text-red-500' : 'text-[#16A34A]'}`}>
                  {tx.type === 'withdrawal' ? '-' : '+'} ₦{tx.amount.toFixed(2)}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{tx.date}</span>
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                    tx.status === 'completed'      ? 'bg-[#DCFCE7] text-[#16A34A] border-green-200'
                    : tx.status === 'pending'      ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-red-50 text-red-600 border-red-200'
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && <div className="p-12 text-center text-[#6B7280] text-sm font-bold">No entries found.</div>}
        </div>

        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-5 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Transaction</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Detail</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Timestamp</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Value</th>
                <th className="px-8 py-5 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">{getIcon(tx.type)}</div>
                      <span className="text-xs font-bold text-[#111827] uppercase tracking-wider">{tx.type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-[13px] text-[#6B7280] max-w-sm truncate font-medium">{tx.description}</td>
                  <td className="px-8 py-5 text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">{tx.date}</td>
                  <td className="px-8 py-5">
                    <span className={`text-sm font-black tracking-tight ${tx.type === 'withdrawal' ? 'text-red-500' : 'text-[#16A34A]'}`}>
                      {tx.type === 'withdrawal' ? '-' : '+'} ₦{tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border inline-flex ${
                        tx.status === 'completed'      ? 'bg-[#DCFCE7] text-[#16A34A] border-green-200'
                        : tx.status === 'pending'      ? 'bg-amber-50 text-amber-600 border-amber-200'
                        : 'bg-red-50 text-red-600 border-red-200'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-[#6B7280] text-sm font-medium">
                    No entries found in this ledger array.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showWithdrawModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowWithdrawModal(false)} />
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 md:p-10 max-w-md w-full relative z-10 shadow-2xl animate-in zoom-in-95 font-sans">
            <h3 className="text-2xl font-black text-[#111827] mb-2 tracking-tight">Withdraw Funds</h3>
            <p className="text-[#6B7280] text-xs font-bold uppercase tracking-wide mb-8">Execute Outbound Transfer</p>

            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-6 border border-slate-200">
                <button
                  type="button"
                  onClick={() => switchCurrency('naira')}
                  className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all ${withdrawCurrency === 'naira' ? 'bg-[#16A34A] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}`}
                >
                  Naira (NGN)
                </button>
                <button
                  type="button"
                  onClick={() => switchCurrency('usdt')}
                  className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all ${withdrawCurrency === 'usdt' ? 'bg-[#16A34A] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}`}
                >
                  Crypto (USDT)
                </button>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-3">
                  Routing Method
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-green-500/50 outline-none font-bold text-[#111827] appearance-none"
                >
                  {withdrawCurrency === 'naira' ? (
                    <option value="OPAY">OPAY Bank Transfer</option>
                  ) : (
                    <>
                      <option value="USDT (TRC20)">USDT (TRC20)</option>
                      <option value="MiniPay">MiniPay Network</option>
                    </>
                  )}
                </select>
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
                      className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-4 text-sm focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none font-bold text-[#111827] placeholder-slate-400" 
                    />
                    <input 
                      type="number" 
                      required 
                      placeholder="Opay Account Number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-4 text-sm focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none font-bold text-[#111827] placeholder-slate-400" 
                    />
                  </>
                )}
                {withdrawMethod === 'USDT (TRC20)' && (
                  <input 
                    type="text" 
                    required 
                    placeholder="TRC20 Wallet Address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-4 text-sm focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none font-mono text-[#111827] placeholder-slate-400" 
                  />
                )}
                {withdrawMethod === 'MiniPay' && (
                  <input 
                    type="text" 
                    required 
                    placeholder="MiniPay UID / Account details"
                    value={miniPayDetails}
                    onChange={(e) => setMiniPayDetails(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-4 text-sm focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none font-mono text-[#111827] placeholder-slate-400" 
                  />
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6B7280] mb-3">Transfer Volume</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">{withdrawCurrency === 'usdt' ? '$' : '₦'}</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min={withdrawCurrency === 'usdt' ? '10' : '10000'}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder={`Min. ${withdrawCurrency === 'usdt' ? '10' : '10,000'}`}
                    className="w-full bg-white border border-slate-300 rounded-2xl pl-10 pr-5 py-4 text-lg focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 outline-none font-black text-[#111827] placeholder-slate-300 tracking-tight"
                  />
                </div>
                <div className="mt-3 flex justify-between items-center px-1">
                  <span className="text-[10px] text-[#6B7280] font-bold uppercase tracking-wider">Available: <span className="text-[#111827]">₦{stats.balance.toFixed(2)}</span></span>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(withdrawCurrency === 'usdt' ? stats.usdtBalance.toString() : stats.balance.toString())}
                    className="text-[10px] px-3 py-1.5 bg-[#DCFCE7] border border-green-200 rounded-lg font-bold uppercase tracking-wider text-[#16A34A] hover:bg-green-100 transition-colors"
                  >
                    Set Max
                  </button>
                </div>
              </div>

              <div className="bg-[#F9FAFB] border border-slate-200 p-4 rounded-xl flex gap-3">
                <AlertCircle className="text-[#6B7280] shrink-0" size={16} />
                <p className="text-[10px] text-[#6B7280] leading-relaxed font-bold uppercase tracking-wider">
                  Transfers execute within T+1 to T+3 business cycles. Verifications mandate strict compliance.
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-4 bg-slate-50 text-[#6B7280] font-bold uppercase tracking-wider text-[11px] border border-slate-200 hover:bg-slate-100 hover:text-[#111827] rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-4 bg-[#16A34A] text-white font-bold uppercase tracking-wider text-[11px] hover:bg-green-700 rounded-2xl transition-all shadow-sm active:scale-95">
                  Execute Setup
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


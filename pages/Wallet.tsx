
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
      { label: 'Reading Rewards', value: reading, color: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' },
      { label: 'Comment Rewards', value: comments, color: 'bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)]' },
      { label: 'Referral Bonuses', value: referrals, color: 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]' },
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
        return <Coins className="text-emerald-400" size={18} />;
      case 'comment_reward':
        return <MessageSquare className="text-purple-400" size={18} />;
      case 'referral_bonus':
        return <UserPlus className="text-blue-400" size={18} />;
      case 'withdrawal':
        return <Banknote className="text-rose-400" size={18} />;
      default:
        return <WalletIcon size={18} className="text-slate-400" />;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full overflow-x-hidden">
      <div className="mb-8">
        <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">My Portfolio</h2>
        <p className="text-slate-400 mt-2 font-medium">Live asset tracking, rewards, and withdrawals verified on ledger.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#0D121F] to-[#0A0D14] rounded-[2.5rem] p-8 text-white shadow-2xl border border-slate-800 group flex flex-col justify-between min-w-0">
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="min-w-0">
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                 Liquid Assets (NGN)
              </p>
              <h3 className="text-4xl md:text-5xl font-black break-words text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 drop-shadow-sm">₦{stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-2">Crypto Equiv (USDT)</p>
              <h3 className="text-3xl md:text-4xl font-black break-words text-white drop-shadow-md">${stats.usdtBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="w-full mt-8 py-4 relative z-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all shadow-lg shadow-emerald-900/10 active:scale-[0.98]"
          >
            Initiate Withdrawal
          </button>
          
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:bg-emerald-500/10 transition-colors duration-1000 pointer-events-none"></div>
        </div>

        <div className="bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-colors"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Pending Yield</p>
              <div className="p-2 bg-[#141A29] rounded-lg border border-slate-700">
                <Clock size={16} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight">₦{stats.pendingRewards.toFixed(2)}</h3>
          </div>
          <div className="mt-6 flex items-start gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider relative z-10 p-3 bg-[#141A29] rounded-xl border border-slate-800/80">
            <AlertCircle size={14} className="mt-0.5 text-amber-500 shrink-0" />
            <span className="leading-relaxed">Rewards clear to balance within 2-3 business days.</span>
          </div>
        </div>

        <div className="bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Total ROI</p>
              <div className="p-2 bg-[#141A29] rounded-lg border border-slate-700">
                <TrendingUp size={16} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight break-words">₦{stats.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
          </div>
          <div className="mt-6 flex items-center justify-between relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg shadow-[inset_0_0_10px_rgba(52,211,153,0.05)]">On-Chain</span>
            <button className="p-2 bg-[#141A29] rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 p-8 shadow-2xl mb-8">
        <h4 className="text-xl font-black text-white mb-8">Yield Distribution</h4>
        <div className="space-y-6">
          {earningsBreakdown.map((item) => {
            const width = stats.totalEarnings > 0 ? Math.min(100, (item.value / stats.totalEarnings) * 100) : 0;
            return (
              <div key={item.label} className="group">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{item.label}</span>
                  <span className="text-sm font-black text-white tracking-tight">₦{item.value.toFixed(2)}</span>
                </div>
                <div className="w-full bg-[#141A29] h-2 rounded-full overflow-hidden shadow-inner border border-slate-800">
                  <div className={`${item.color} h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-80`} style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#0A0D14]/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h4 className="text-xl font-black text-white">Ledger History</h4>
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'reading_reward', 'comment_reward', 'referral_bonus', 'withdrawal'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  filter === type 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[inset_0_0_10px_rgba(52,211,153,0.1)]' 
                    : 'bg-[#141A29] text-slate-500 border-slate-800 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="md:hidden divide-y divide-slate-800/80">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-[#141A29] border border-slate-700 shadow-inner rounded-xl flex items-center justify-center shrink-0">{getIcon(tx.type)}</div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white uppercase tracking-wider mb-1">{tx.type.replace('_', ' ')}</p>
                    <p className="text-[10px] text-slate-400 truncate font-medium">{tx.description}</p>
                  </div>
                </div>
                <span className={`text-sm font-black tracking-tight ${tx.type === 'withdrawal' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {tx.type === 'withdrawal' ? '-' : '+'} ₦{tx.amount.toFixed(2)}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between px-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{tx.date}</span>
                <span
                  className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg border ${
                    tx.status === 'completed'      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : tx.status === 'pending'      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
          {filteredTransactions.length === 0 && <div className="p-12 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">No entries found.</div>}
        </div>

        <div className="hidden md:block w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#141A29]/50 border-b border-slate-800">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Transaction</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Detail</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Timestamp</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Value</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#141A29]/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#141A29] border border-slate-700 shadow-inner rounded-xl flex items-center justify-center group-hover:border-slate-500 transition-colors">{getIcon(tx.type)}</div>
                      <span className="text-xs font-black text-white uppercase tracking-wider">{tx.type.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-400 max-w-sm truncate font-medium">{tx.description}</td>
                  <td className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{tx.date}</td>
                  <td className="px-8 py-5">
                    <span className={`text-sm font-black tracking-tight ${tx.type === 'withdrawal' ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {tx.type === 'withdrawal' ? '-' : '+'} ₦{tx.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span
                      className={`text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg border inline-flex ${
                        tx.status === 'completed'      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]'
                        : tx.status === 'pending'      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
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
          <div className="fixed inset-0 bg-[#06090F]/90 backdrop-blur-md transition-opacity" onClick={() => setShowWithdrawModal(false)} />
          <div className="bg-[#0A0D14] border border-slate-800 rounded-[2.5rem] p-8 max-w-md w-full relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Withdraw Funds</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Execute Outbound Transfer</p>

            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="flex bg-[#141A29] p-1.5 rounded-2xl mb-6 border border-slate-800 shadow-inner">
                <button
                  type="button"
                  onClick={() => switchCurrency('naira')}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${withdrawCurrency === 'naira' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Naira (NGN)
                </button>
                <button
                  type="button"
                  onClick={() => switchCurrency('usdt')}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${withdrawCurrency === 'usdt' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Crypto (USDT)
                </button>
              </div>

              <div>
                <label className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  {withdrawMethod === 'OPAY' && <img src="/payment-logos/opay.svg" alt="OPAY" className="w-5 h-5 rounded filter brightness-90" />}
                  {withdrawMethod === 'USDT (TRC20)' && <img src="/payment-logos/usdt.svg" alt="USDT" className="w-5 h-5 rounded filter brightness-90" />}
                  {withdrawMethod === 'MiniPay' && <img src="/payment-logos/minipay.svg" alt="MiniPay" className="w-5 h-5 rounded filter brightness-90" />}
                  Routing Method
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full bg-[#141A29] border border-slate-700 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none font-bold text-white shadow-inner appearance-none custom-select"
                >
                  {withdrawCurrency === 'naira' ? (
                    <option value="OPAY" className="bg-[#0A0D14]">OPAY Bank Transfer</option>
                  ) : (
                    <>
                      <option value="USDT (TRC20)" className="bg-[#0A0D14]">USDT (TRC20)</option>
                      <option value="MiniPay" className="bg-[#0A0D14]">MiniPay Network</option>
                    </>
                  )}
                </select>
                {withdrawCurrency === 'naira' && (
                   <p className="text-[9px] text-amber-500/80 font-black mt-3 uppercase tracking-[0.2em] flex items-center gap-1"><AlertCircle size={10}/> Other routes offline</p>
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
                      className="w-full bg-[#141A29] border border-slate-700 rounded-2xl px-5 py-4 text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none font-bold text-white placeholder-slate-600 shadow-inner" 
                    />
                    <input 
                      type="number" 
                      required 
                      placeholder="Opay Account Number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-[#141A29] border border-slate-700 rounded-2xl px-5 py-4 text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none font-bold text-white placeholder-slate-600 shadow-inner" 
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
                    className="w-full bg-[#141A29] border border-slate-700 rounded-2xl px-5 py-4 text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none font-mono text-emerald-400 placeholder-slate-600 shadow-inner" 
                  />
                )}
                {withdrawMethod === 'MiniPay' && (
                  <input 
                    type="text" 
                    required 
                    placeholder="MiniPay UID / Account details"
                    value={miniPayDetails}
                    onChange={(e) => setMiniPayDetails(e.target.value)}
                    className="w-full bg-[#141A29] border border-slate-700 rounded-2xl px-5 py-4 text-sm focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none font-mono text-emerald-400 placeholder-slate-600 shadow-inner" 
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Transfer Volume</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-500 text-lg">{withdrawCurrency === 'usdt' ? '$' : '₦'}</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min={withdrawCurrency === 'usdt' ? '10' : '10000'}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder={`Min. ${withdrawCurrency === 'usdt' ? '10' : '10,000'}`}
                    className="w-full bg-[#141A29] border border-slate-700 rounded-2xl pl-10 pr-5 py-4 text-lg focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none font-black text-white placeholder-slate-600 shadow-inner tracking-tight"
                  />
                </div>
                <div className="mt-3 flex justify-between items-center gap-2 px-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Available: <span className="text-white">₦{stats.balance.toFixed(2)} / ${stats.usdtBalance.toFixed(2)}</span></span>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(withdrawCurrency === 'usdt' ? stats.usdtBalance.toString() : stats.balance.toString())}
                    className="text-[9px] px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded font-black uppercase tracking-[0.2em] text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    Set Max
                  </button>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex gap-3 shadow-[inset_0_0_15px_rgba(52,211,153,0.05)]">
                <AlertCircle className="text-emerald-400 shrink-0" size={16} />
                <p className="text-[9px] text-emerald-400/80 leading-relaxed font-black uppercase tracking-widest">
                  Transfers execute within T+1 to T+3 business cycles. Audit verifications mandate strict compliance.
                </p>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-4 bg-[#141A29] text-slate-400 font-black uppercase tracking-widest text-xs border border-slate-700 hover:bg-slate-800 hover:text-white rounded-xl transition-all"
                >
                  Abort
                </button>
                <button type="submit" className="flex-1 py-4 bg-emerald-500/10 text-emerald-400 font-black uppercase tracking-widest text-xs border border-emerald-500/30 hover:bg-emerald-500/20 hover:border-emerald-500/50 rounded-xl transition-all shadow-[0_0_15px_rgba(52,211,153,0.2)] active:scale-95">
                  Execute Setup
                </button>
              </div>
            </form>
          </div>
          <style>{`
             .custom-select {
                background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394A3B8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
                background-repeat: no-repeat;
                background-position: right 1rem top 50%;
                background-size: 0.65rem auto;
             }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Wallet;


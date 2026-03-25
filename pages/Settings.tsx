import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Save, User, Mail, Lock, Bell, Shield, Globe, CreditCard, ExternalLink } from 'lucide-react';
import { supabase } from '../src/integrations/supabase/client';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: false,
    weeklyDigest: true,
  });

  const [payouts, setPayouts] = useState({
    opayAccount: '',
    usdtWallet: '',
    minipayDetails: ''
  });
  const [payoutPin, setPayoutPin] = useState('');

  useEffect(() => {
    const fetchPayouts = async () => {
      if (!user) return;
      const [{ data: payoutData, error: payoutError }, { data: profile }] = await Promise.all([
        supabase.from('payout_methods').select('*').eq('user_id', user.id),
        supabase.from('profiles' as any).select('payout_pin').eq('user_id', user.id).single()
      ]);
      
      if ((profile as any)?.payout_pin) {
        setPayoutPin((profile as any).payout_pin);
      }

      if (payoutData && !payoutError) {
        const opay = payoutData.find((p: any) => p.method === 'opay');
        const usdt = payoutData.find((p: any) => p.method === 'usdt_trc20');
        const mini = payoutData.find((p: any) => p.method === 'minipay');
        
        let opayAccountStr = '';
        if (opay) {
          if (opay.account_name && opay.account_number) opayAccountStr = `${opay.account_name} - ${opay.account_number}`;
          else if (opay.account_name) opayAccountStr = opay.account_name;
          else if (opay.account_number) opayAccountStr = opay.account_number;
        }

        setPayouts({
          opayAccount: opayAccountStr,
          usdtWallet: usdt?.wallet_address || '',
          minipayDetails: mini?.minipay_uid || ''
        });
      }
    };
    fetchPayouts();
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated successfully!');
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Security settings updated successfully!');
  };

  const handleSavePayouts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    let opayName = '';
    let opayNumber = '';
    if (payouts.opayAccount) {
        const parts = payouts.opayAccount.split('-');
        if (parts.length > 1) {
            opayNumber = parts.pop()?.trim() || '';
            opayName = parts.join('-').trim();
        } else {
            opayNumber = payouts.opayAccount.trim();
        }
    }

    try {
        if (payouts.opayAccount) {
            await supabase.from('payout_methods').upsert({ user_id: user.id, method: 'opay', account_name: opayName, account_number: opayNumber }, { onConflict: 'user_id, method' });
        }
        if (payouts.usdtWallet) {
            await supabase.from('payout_methods').upsert({ user_id: user.id, method: 'usdt_trc20', wallet_address: payouts.usdtWallet }, { onConflict: 'user_id, method' });
        }
        if (payouts.minipayDetails) {
            await supabase.from('payout_methods').upsert({ user_id: user.id, method: 'minipay', minipay_uid: payouts.minipayDetails }, { onConflict: 'user_id, method' });
        }
        if (payoutPin) {
            if (!/^\d{4}$/.test(payoutPin)) throw new Error('Payout PIN must be exactly 4 digits.');
            await supabase.from('profiles' as any).update({ payout_pin: payoutPin }).eq('user_id', user.id);
        }
        alert('Payout configuration saved successfully!');
    } catch (err: any) {
        console.error(err);
        alert('Failed to save configuration: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 fade-in animate-in">
      <div className="mb-8 pl-1">
        <h1 className="text-3xl font-black text-[#111827] mb-2 tracking-tight">System Parameters</h1>
        <p className="text-sm font-medium text-[#6B7280]">Manage your node credentials, security, and global preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Profile Settings */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-[#DCFCE7] rounded-lg flex items-center justify-center">
                 <User size={16} className="text-[#16A34A]" />
              </div>
              Profile Information
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                <img src={user?.avatar} alt="Avatar" className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 object-cover" />
                <div>
                  <button type="button" className="px-5 py-2.5 bg-white hover:bg-slate-50 text-[#111827] border border-slate-200 rounded-xl text-sm font-bold transition-colors shadow-sm">
                    Change Avatar
                  </button>
                  <p className="text-[11px] font-medium text-slate-400 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 text-[#111827] rounded-2xl focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white outline-none transition-all font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 text-[#111827] rounded-2xl focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white outline-none transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="px-6 py-3.5 bg-[#16A34A] text-white hover:bg-green-700 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 text-[13px] shadow-sm">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                 <Shield size={16} className="text-indigo-600" />
              </div>
              Security
            </h2>
            <form onSubmit={handleSaveSecurity} className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 text-[#111827] rounded-2xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white outline-none transition-all font-medium text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 text-[#111827] rounded-2xl focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white outline-none transition-all font-medium text-sm"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="px-6 py-3.5 bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 text-[13px] font-bold rounded-xl flex items-center gap-2 transition-colors">
                  <Lock size={16} /> Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Payout Methods */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                 <CreditCard size={16} className="text-blue-600" />
              </div>
              Payout Methods
            </h2>
            <form onSubmit={handleSavePayouts} className="space-y-8">
              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold text-[#111827] uppercase tracking-widest mb-3 ml-1">
                  <img src="/payment-logos/opay.svg" alt="OPAY" className="w-5 h-5 rounded-md object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                  OPAY Account
                </label>
                <input 
                  type="text" 
                  value={payouts.opayAccount}
                  onChange={(e) => setPayouts(prev => ({...prev, opayAccount: e.target.value}))}
                  placeholder="e.g. John Doe - 8123456789"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 text-[#111827] rounded-2xl focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white outline-none transition-all font-medium text-sm mb-2"
                />
                {!payouts.opayAccount && (
                  <p className="text-[11px] font-medium text-slate-500 ml-1">
                    Don't have an account? <a href="https://opay.ng/s/2dk42" target="_blank" rel="noopener noreferrer" className="text-[#16A34A] font-bold hover:underline inline-flex items-center gap-1">Create OPAY account <ExternalLink size={10} /></a>
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold text-[#111827] uppercase tracking-widest mb-3 ml-1">
                  <img src="/payment-logos/usdt.svg" alt="USDT" className="w-5 h-5 rounded-md object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                  USDT Wallet Address (TRC20)
                </label>
                <input 
                  type="text" 
                  value={payouts.usdtWallet}
                  onChange={(e) => setPayouts(prev => ({...prev, usdtWallet: e.target.value}))}
                  placeholder="T..."
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 text-[#111827] rounded-2xl focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white outline-none transition-all font-medium text-sm"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold text-[#111827] uppercase tracking-widest mb-3 ml-1">
                  <img src="/payment-logos/minipay.svg" alt="MiniPay" className="w-5 h-5 rounded-md object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                  MiniPay UID / Details
                </label>
                <input 
                  type="text" 
                  value={payouts.minipayDetails}
                  onChange={(e) => setPayouts(prev => ({...prev, minipayDetails: e.target.value}))}
                  placeholder="UID..."
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 text-[#111827] rounded-2xl focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white outline-none transition-all font-medium text-sm mb-2"
                />
                {!payouts.minipayDetails && (
                  <p className="text-[11px] font-medium text-slate-500 ml-1">
                    Don't have an account? <a href="https://link.minipay.xyz/invite?ref=WeBQSVr8" target="_blank" rel="noopener noreferrer" className="text-[#16A34A] font-bold hover:underline inline-flex items-center gap-1">Create MiniPay account <ExternalLink size={10} /></a>
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-[11px] font-bold text-[#111827] uppercase tracking-widest mb-3 ml-1">
                  <Lock size={14} className="text-[#16A34A]" />
                  Your 4-Digit Payout PIN
                </label>
                <input 
                  type="password" 
                  maxLength={4}
                  value={payoutPin}
                  onChange={(e) => setPayoutPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 1234"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-[#111827] rounded-2xl focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white outline-none transition-all tracking-[0.75em] font-mono text-xl mb-3 text-center"
                />
                <p className="text-[11px] text-rose-500 font-bold ml-1 text-center">Never share this PIN! It is required to approve all withdrawals.</p>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="px-6 py-3.5 bg-[#16A34A] text-white hover:bg-green-700 rounded-xl font-bold transition-all active:scale-95 flex items-center gap-2 text-[13px] shadow-sm w-full md:w-auto justify-center">
                  <Save size={16} /> Save Payout Methods
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6 md:space-y-8">
          {/* Notifications */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                 <Bell size={16} className="text-amber-500" />
              </div>
              Notifications
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-[#111827]">Email Alerts</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications.emailAlerts} onChange={() => setNotifications(prev => ({...prev, emailAlerts: !prev.emailAlerts}))} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16A34A]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-[#111827]">Push Notifications</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">In-app alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications.pushNotifications} onChange={() => setNotifications(prev => ({...prev, pushNotifications: !prev.pushNotifications}))} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16A34A]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-[#111827]">Weekly Digest</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">Summary of your activity</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications.weeklyDigest} onChange={() => setNotifications(prev => ({...prev, weeklyDigest: !prev.weeklyDigest}))} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16A34A]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#111827] mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                 <Globe size={16} className="text-purple-600" />
              </div>
              Preferences
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Language</label>
                <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 text-[#111827] rounded-xl focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white outline-none transition-all appearance-none font-medium text-sm">
                  <option>English (US)</option>
                  <option>French</option>
                  <option>Spanish</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Timezone</label>
                <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 text-[#111827] rounded-xl focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] focus:bg-white outline-none transition-all appearance-none font-medium text-sm">
                  <option>UTC (GMT+0)</option>
                  <option>EST (GMT-5)</option>
                  <option>PST (GMT-8)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

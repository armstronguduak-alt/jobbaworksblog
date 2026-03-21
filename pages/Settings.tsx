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
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Account Settings</h1>
        <p className="text-slate-500">Manage your profile, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Settings */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-emerald-600" /> Profile Information
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <img src={user?.avatar} alt="Avatar" className="w-20 h-20 rounded-2xl bg-slate-100" />
                <div>
                  <button type="button" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors">
                    Change Avatar
                  </button>
                  <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2">
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Shield size={20} className="text-emerald-600" /> Security
            </h2>
            <form onSubmit={handleSaveSecurity} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold transition-colors flex items-center gap-2">
                  <Lock size={18} /> Update Password
                </button>
              </div>
            </form>
          </div>

          {/* Payout Methods */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-emerald-600" /> Payout Methods
            </h2>
            <form onSubmit={handleSavePayouts} className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <img src="/payment-logos/opay.svg" alt="OPAY" className="w-5 h-5 rounded-md" />
                  OPAY Account
                </label>
                <input 
                  type="text" 
                  value={payouts.opayAccount}
                  onChange={(e) => setPayouts(prev => ({...prev, opayAccount: e.target.value}))}
                  placeholder="e.g. John Doe - 8123456789"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all mb-2"
                />
                {!payouts.opayAccount && (
                  <p className="text-xs text-slate-500">
                    Don't have an account? <a href="https://opay.ng/s/2dk42" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1">Create OPAY account <ExternalLink size={10} /></a>
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <img src="/payment-logos/usdt.svg" alt="USDT" className="w-5 h-5 rounded-md" />
                  USDT Wallet Address (TRC20)
                </label>
                <input 
                  type="text" 
                  value={payouts.usdtWallet}
                  onChange={(e) => setPayouts(prev => ({...prev, usdtWallet: e.target.value}))}
                  placeholder="T..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <img src="/payment-logos/minipay.svg" alt="MiniPay" className="w-5 h-5 rounded-md" />
                  MiniPay UID / Details
                </label>
                <input 
                  type="text" 
                  value={payouts.minipayDetails}
                  onChange={(e) => setPayouts(prev => ({...prev, minipayDetails: e.target.value}))}
                  placeholder="UID..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all mb-2"
                />
                {!payouts.minipayDetails && (
                  <p className="text-xs text-slate-500">
                    Don't have an account? <a href="https://link.minipay.xyz/invite?ref=WeBQSVr8" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1">Create MiniPay account <ExternalLink size={10} /></a>
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <Lock size={16} className="text-emerald-600" />
                  Your 4-Digit Payout PIN
                </label>
                <input 
                  type="password" 
                  maxLength={4}
                  value={payoutPin}
                  onChange={(e) => setPayoutPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 1234"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all tracking-[0.5em] font-mono text-xl mb-2"
                />
                <p className="text-xs text-rose-500 font-bold">Never share this PIN! It is required to approve all withdrawals.</p>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2">
                  <Save size={18} /> Save Payout Methods
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          {/* Notifications */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Bell size={20} className="text-emerald-600" /> Notifications
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Email Alerts</p>
                  <p className="text-xs text-slate-500">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications.emailAlerts} onChange={() => setNotifications(prev => ({...prev, emailAlerts: !prev.emailAlerts}))} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Push Notifications</p>
                  <p className="text-xs text-slate-500">In-app alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications.pushNotifications} onChange={() => setNotifications(prev => ({...prev, pushNotifications: !prev.pushNotifications}))} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">Weekly Digest</p>
                  <p className="text-xs text-slate-500">Summary of your activity</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifications.weeklyDigest} onChange={() => setNotifications(prev => ({...prev, weeklyDigest: !prev.weeklyDigest}))} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Globe size={20} className="text-emerald-600" /> Preferences
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Language</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all appearance-none">
                  <option>English (US)</option>
                  <option>French</option>
                  <option>Spanish</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Timezone</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 outline-none transition-all appearance-none">
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

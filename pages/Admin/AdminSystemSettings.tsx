
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Save, 
  RefreshCw, 
  Coins, 
  AlertTriangle,
  Zap,
  ShieldAlert,
  SlidersHorizontal,
  ToggleLeft
} from 'lucide-react';
import { PlanId } from '../../types';

const AdminSystemSettings: React.FC = () => {
  const { systemPlans, updateSystemPlan, pageToggles, updatePageToggles } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('free');
  const [localToggles, setLocalToggles] = useState(pageToggles);

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates = {
      price: parseFloat(formData.get('price') as string),
      readReward: parseFloat(formData.get('readReward') as string),
      commentReward: parseFloat(formData.get('commentReward') as string),
      readLimit: parseInt(formData.get('readLimit') as string),
      commentLimit: parseInt(formData.get('commentLimit') as string),
      isActive: formData.get('isActive') === 'on'
    };
    updateSystemPlan(selectedPlan, updates);
    alert(`${selectedPlan.toUpperCase()} plan system settings updated!`);
  };

  const currentPlan = systemPlans[selectedPlan];

  const handleToggleChange = (key: string) => {
    setLocalToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveToggles = async () => {
    await updatePageToggles(localToggles);
    alert('Page visibility settings updated!');
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-10">
        <h2 className="text-2xl font-black text-slate-900">Global Economy & System Configuration</h2>
        <p className="text-slate-500">Calibrate platform reward systems and membership boundaries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Select Tier to Adjust</h3>
          {(Object.keys(systemPlans) as PlanId[]).map(id => (
            <button
              key={id}
              onClick={() => setSelectedPlan(id)}
              className={`w-full p-6 rounded-[2rem] border text-left transition-all mb-4 ${
                selectedPlan === id 
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-xl shadow-indigo-100' 
                  : 'bg-white text-slate-900 border-slate-100 hover:border-indigo-200'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black uppercase tracking-widest opacity-60">Plan ID: {id}</span>
                {selectedPlan === id && <Zap size={18} className="text-amber-300" />}
              </div>
              <h4 className="text-xl font-black">{systemPlans[id].name}</h4>
              <p className={`text-xs mt-2 ${selectedPlan === id ? 'text-indigo-100' : 'text-slate-400'}`}>
                ₦{systemPlans[id].readReward.toFixed(2)} per read • {systemPlans[id].readLimit} limit
              </p>
            </button>
          ))}

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] mt-10">
            <div className="flex items-center gap-3 text-amber-600 font-bold mb-3">
               <AlertTriangle size={18} />
               <h5 className="text-sm">Caution Area</h5>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Changes to reward rates affect platform liquidity immediately. Ensure the treasury can support new rates before confirming.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <SlidersHorizontal size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Fine-tune {currentPlan.name} Settings</h3>
            </div>

            <form key={selectedPlan} onSubmit={handleUpdate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Plan Price (₦)</label>
                  <div className="relative">
                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="number"
                      name="price"
                      step="0.01"
                      defaultValue={currentPlan.price}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold"
                    />
                  </div>
                </div>
                <div className="flex items-center mt-8">
                  <input 
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    defaultChecked={currentPlan.isActive !== false}
                    className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <label htmlFor="isActive" className="ml-3 text-sm font-bold text-slate-700">Plan is Active (Available to Users)</label>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Read Reward Amount (₦)</label>
                  <div className="relative">
                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="number"
                      name="readReward"
                      step="0.01"
                      defaultValue={currentPlan.readReward}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Comment Reward Amount (₦)</label>
                  <div className="relative">
                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="number"
                      name="commentReward"
                      step="0.01"
                      defaultValue={currentPlan.commentReward}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Daily Reading Limit (Posts)</label>
                  <input 
                    type="number"
                    name="readLimit"
                    defaultValue={currentPlan.readLimit}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Daily Comment Limit (Actions)</label>
                  <input 
                    type="number"
                    name="commentLimit"
                    defaultValue={currentPlan.commentLimit}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="pt-6 flex items-center justify-between border-t border-slate-50">
                 <div className="flex items-center gap-2 text-indigo-600">
                    <RefreshCw size={16} className="animate-spin" />
                    <span className="text-[10px] font-black uppercase">Live Synchronization Active</span>
                 </div>
                 <button 
                  type="submit"
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95 flex items-center gap-2"
                 >
                   <Save size={18} /> Apply Changes
                 </button>
              </div>
            </form>
          </div>

          <div className="mt-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <ToggleLeft size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Page Visibility Toggles</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(localToggles).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-700 capitalize">{key.replace('Enabled', '')} Page</span>
                  <button 
                    onClick={() => handleToggleChange(key)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${value ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                onClick={saveToggles}
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Save Toggles
              </button>
            </div>
          </div>

          <div className="mt-8 bg-rose-50 rounded-[2.5rem] p-10 border border-rose-100 relative overflow-hidden">
             <div className="relative z-10">
                <h4 className="text-xl font-black mb-2 flex items-center gap-2 text-rose-700">
                  <ShieldAlert size={20} className="text-rose-600" />
                  System Lockdown Mode
                </h4>
                <p className="text-rose-800/80 text-sm mb-6 leading-relaxed max-w-lg">
                  Emergency feature to suspend all platform rewards instantly. Use this only in the event of an economic attack or critical bug.
                </p>
                <button className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl transition-all">
                  ACTIVATE REWARD LOCKDOWN
                </button>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-rose-200/30 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemSettings;

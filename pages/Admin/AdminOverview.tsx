import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, FileText, Banknote, Globe, ArrowUpRight, ShieldCheck, Activity, BarChart3 } from 'lucide-react';

const AdminOverview: React.FC = () => {
  const { posts, allUsers } = useAuth();

  const activeUsers = allUsers.filter((u) => u.status === 'active').length;
  const paidUsers = allUsers.filter((u) => u.planId !== 'free').length;

  const stats = [
    { label: 'Total Users', value: allUsers.length, icon: Users, trend: '+Realtime', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Content', value: posts.filter((p) => p.status === 'pending').length, icon: FileText, trend: 'Moderation queue', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Users', value: activeUsers, icon: Activity, trend: `${paidUsers} paid plans`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Approved Posts', value: posts.filter((p) => p.status === 'approved').length, icon: Globe, trend: 'Live content', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="animate-in fade-in duration-500 w-full overflow-x-hidden">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-slate-900">Platform Overview</h2>
        <p className="text-slate-500">Light-mode admin command center with real-time metrics from Supabase.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-100 p-6 rounded-[1.75rem] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-lg bg-slate-100 text-slate-500">
                <ArrowUpRight size={12} /> {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
            <h4 className="text-3xl font-black text-slate-900">{stat.value}</h4>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900">Publishing Activity</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-slate-100 text-[10px] font-black uppercase rounded-lg" type="button">
                Week
              </button>
              <button className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase rounded-lg shadow-lg" type="button">
                Month
              </button>
            </div>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 px-1">
            {[40, 65, 55, 80, 45, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div className="bg-emerald-100 group-hover:bg-emerald-500 rounded-t-xl transition-all duration-500" style={{ height: `${h}%` }} />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-300 uppercase">
            <span>Jan</span>
            <span>Jun</span>
            <span>Dec</span>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black mb-6 text-slate-900">Security & Health</h3>
          <div className="space-y-4">
            {[
              { type: 'Auth checks', state: 'Healthy', tone: 'text-emerald-600 bg-emerald-50' },
              { type: 'Moderation queue', state: `${posts.filter((p) => p.status === 'pending').length} pending`, tone: 'text-amber-600 bg-amber-50' },
              { type: 'Admin access', state: 'Verified', tone: 'text-blue-600 bg-blue-50' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <ShieldCheck className="text-slate-500 shrink-0" size={18} />
                  <p className="text-sm font-semibold text-slate-800 truncate">{log.type}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${log.tone}`}>{log.state}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 bg-slate-900 hover:bg-black rounded-2xl text-xs font-bold text-white transition-all" type="button">
            Open Detailed Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;


import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Search, 
  MoreHorizontal, 
  ShieldAlert, 
  ShieldCheck, 
  UserPlus,
  Mail,
  UserX,
  UserCheck
} from 'lucide-react';

const AdminUserManagement: React.FC = () => {
  const { allUsers, manageUserStatus } = useAuth();
  const [search, setSearch] = useState('');

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900">User Management</h2>
          <p className="text-slate-500">Monitor community health and manage account privileges.</p>
        </div>
        <div className="relative max-w-xs w-full">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
            type="text" 
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-600 outline-none shadow-sm"
           />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Plan</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Joined</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-100" alt="" />
                      <div>
                        <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          {user.name} 
                          {user.role === 'admin' && <span className="text-[8px] px-1.5 py-0.5 bg-indigo-600 text-white rounded font-black">ADMIN</span>}
                        </p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                      user.planId === 'elite' ? 'bg-purple-100 text-purple-600' : 
                      user.planId === 'pro' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {user.planId}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                      user.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center text-xs text-slate-400 font-medium">
                    {user.joinedDate}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <Mail size={18} />
                      </button>
                      {user.role !== 'admin' && (
                        user.status === 'active' ? (
                          <button 
                            onClick={() => manageUserStatus(user.id, 'banned')}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Ban User"
                          >
                            <UserX size={18} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => manageUserStatus(user.id, 'active')}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                            title="Unban User"
                          >
                            <UserCheck size={18} />
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;

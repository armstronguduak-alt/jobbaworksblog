import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  ShieldCheck,
  ClipboardCheck,
  Users2,
  Sliders,
  LogOut,
  Bell,
  Megaphone,
  Target,
  Tags,
  LayoutDashboard
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const adminNavItems = [
    { name: 'System Overview', mobileName: 'Overview', icon: ShieldCheck, path: '/admin' },
    { name: 'Post Moderation', mobileName: 'Posts', icon: ClipboardCheck, path: '/admin/moderation' },
    { name: 'User Management', mobileName: 'Users', icon: Users2, path: '/admin/users' },
    { name: 'Categories', mobileName: 'Categories', icon: Tags, path: '/admin/categories' },
    { name: 'Tasks & Bounties', mobileName: 'Tasks', icon: Target, path: '/admin/tasks' },
    { name: 'Promotions', mobileName: 'Promotions', icon: Megaphone, path: '/admin/promotions' },
    { name: 'Global Settings', mobileName: 'Settings', icon: Sliders, path: '/admin/settings' },
  ];

  React.useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-700">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 fixed h-full z-30">
        <div className="p-6">
          <Link to="/admin" className="text-xl font-extrabold text-emerald-600 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-emerald-600" size={18} />
            </div>
            JW Admin
          </Link>
        </div>

        <div className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar pb-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-4">Command Center</p>
          {adminNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
              `}
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}

          <div className="h-px bg-slate-200 my-6 mx-4" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-4">Quick Links</p>
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all">
            <LayoutDashboard size={18} />
            User Dashboard
          </Link>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative overflow-hidden mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 overflow-hidden shrink-0">
                <img src={user?.avatar} alt="Admin Profile" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">System Admin</p>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 text-sm font-medium hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
            <LogOut size={18} />
            Secure Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 pb-20 md:pb-8 min-h-screen">
        <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-20 px-4 py-3 md:px-8 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900 md:text-xl">Admin Portal</h1>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative" type="button">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
        </header>

        <div className="p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 grid grid-cols-6 gap-1 z-50">
        {adminNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => `flex flex-col items-center justify-center gap-1 py-1 rounded-lg transition-all ${
              isActive ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500'
            }`}
          >
            <item.icon size={18} />
            <span className="text-[9px] font-semibold leading-none">{item.mobileName}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminLayout;

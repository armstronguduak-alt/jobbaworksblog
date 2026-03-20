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
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  
  const closeMenu = () => setIsMobileMenuOpen(false);

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
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/50 z-40 backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-50 bg-white border-r border-slate-200 w-64 flex flex-col transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <Link to="/admin" onClick={closeMenu} className="text-xl font-extrabold text-emerald-600 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-emerald-600" size={18} />
            </div>
            JW Admin
          </Link>
          <button className="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-full" onClick={closeMenu}>
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar pb-10">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-4">Command Center</p>
          {adminNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/admin'}
              onClick={closeMenu}
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

      <main className="flex-1 w-full flex flex-col min-h-screen">
        <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-20 px-4 py-3 md:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold text-slate-900 md:text-xl truncate">Admin Portal</h1>
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative shrink-0" type="button">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
        </header>

        <div className="p-4 md:p-8 overflow-x-hidden flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

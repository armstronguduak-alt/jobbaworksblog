
import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Crown,
  ShieldCheck,
  ClipboardCheck,
  Users2,
  Sliders,
  Trophy,
  MessageSquare,
  RefreshCw,
  CreditCard,
  Menu,
  X,
  Target
} from 'lucide-react';
import CommunityModal, { CommunityChannel } from './CommunityModal';

const DashboardLayout: React.FC = () => {
  const { user, logout, systemPlans, pageToggles } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);

  const communityChannels: CommunityChannel[] = [
    { id: '1', channel_key: 'telegram', label: 'Telegram', url: 'https://t.me/placeholder' },
    { id: '2', channel_key: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/placeholder' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userNavItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard', show: true },
    { name: 'Earnings', icon: TrendingUp, path: '/dashboard/earnings', show: pageToggles.earningsEnabled !== false },
    { name: 'Wallet', icon: Wallet, path: '/dashboard/wallet', show: pageToggles.walletEnabled !== false },
    { name: 'Swap', icon: RefreshCw, path: '/dashboard/swap', show: pageToggles.swapEnabled !== false },
    { name: 'Leaderboard', icon: Trophy, path: '/dashboard/leaderboard', show: pageToggles.leaderboardEnabled !== false },
    { name: 'My Articles', icon: FileText, path: '/dashboard/posts', show: true },
    { name: 'Tasks', icon: Target, path: '/dashboard/tasks', show: true },
    { name: 'Plans', icon: CreditCard, path: '/dashboard/plans', show: true },
    { name: 'Referrals', icon: Users, path: '/dashboard/referrals', show: pageToggles.referralsEnabled !== false },
  ].filter(item => item.show);

  const plan = user ? systemPlans[user.planId] : null;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const SidebarContent = () => (
    <>
      <div className="p-8 pb-4">
        <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-6 h-6 object-contain brightness-0 invert"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter leading-none">
              <span className="text-emerald-600">Jobba</span><span className="text-slate-900">Works</span>
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Author Portal</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-6 space-y-1.5 overflow-y-auto no-scrollbar pb-10">
        <div className="py-4">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 px-2">Main Menu</p>
          {userNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={closeMobileMenu}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300
                ${isActive 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="py-4">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 px-2">Community</p>
          <button
            onClick={() => {
              closeMobileMenu();
              setIsCommunityModalOpen(true);
            }}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all duration-300"
          >
            <MessageSquare size={20} />
            Join Community
          </button>
        </div>

        {user?.role === 'admin' && (
          <div className="py-4 border-t border-slate-100">
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-4 px-2">Administration</p>
            <Link
              to="/admin"
              onClick={closeMobileMenu}
              className={`
                flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300
                ${location.pathname.startsWith('/admin')
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' 
                  : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-700'}
              `}
            >
              <ShieldCheck size={20} strokeWidth={location.pathname.startsWith('/admin') ? 2.5 : 2} />
              Admin Console
            </Link>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 bg-slate-50/50">
        {plan && (
          <div className={`relative overflow-hidden rounded-3xl p-5 text-white mb-6 group ${
            user?.planId === 'elite' ? 'bg-gradient-to-br from-purple-600 to-indigo-700' : 
            user?.planId === 'pro' ? 'bg-gradient-to-br from-emerald-500 to-teal-700' : 'bg-slate-900'
          }`}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Active Plan</span>
                {user?.planId !== 'free' && <Crown size={14} className="text-amber-300" />}
              </div>
              <p className="text-lg font-black leading-none mb-1">{plan.name}</p>
              <p className="text-[10px] text-white/70 font-medium">Next Billing: Apr 14</p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        )}
        
        <div className="flex items-center justify-between px-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 text-xs font-bold hover:text-red-500 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
          <Link to="/dashboard/settings" onClick={closeMobileMenu} className="text-slate-400 hover:text-slate-900 transition-colors">
            <Settings size={18} />
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      {/* Premium Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 fixed h-full z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {SidebarContent()}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 w-[80%] max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="absolute top-6 right-6 z-50">
          <button onClick={closeMobileMenu} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900">
            <X size={20} />
          </button>
        </div>
        {SidebarContent()}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 pb-12 min-h-screen">
        <header className="sticky top-0 bg-white/70 backdrop-blur-xl border-b border-slate-100 z-20 px-6 py-4 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
             >
               <Menu size={24} />
             </button>
             <div className="md:hidden w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-6 h-6 object-contain brightness-0 invert"
                />
             </div>
             <h1 className="text-xl font-black text-slate-900 tracking-tight hidden sm:block">
               {userNavItems.find(item => location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path)))?.name || 
                (location.pathname.startsWith('/admin') ? 'Admin Console' : 'Dashboard')}
             </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Online</span>
            </div>
            
            <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-2xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
               <Link to="/dashboard/settings" className="hidden lg:flex flex-col items-end hover:opacity-80 transition-opacity">
                 <span className="text-xs font-black text-slate-900">{user?.name}</span>
                 <span className="text-[10px] font-medium text-slate-400">Author ID: #{user?.id.slice(0, 5)}</span>
               </Link>
               <Link to="/dashboard/settings" className="w-10 h-10 rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden hover:ring-2 hover:ring-emerald-200 transition-all">
                 <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover" />
               </Link>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-10 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      <CommunityModal 
        isOpen={isCommunityModalOpen} 
        onClose={() => setIsCommunityModalOpen(false)} 
        channels={communityChannels}
      />
    </div>
  );
};

export default DashboardLayout;

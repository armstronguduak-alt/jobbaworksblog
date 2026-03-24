
import React, { useState, useEffect } from 'react';
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
  Sun,
  Moon,
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
  Target,
  Home
} from 'lucide-react';
import CommunityModal, { CommunityChannel } from './CommunityModal';

const DashboardLayout: React.FC = () => {
  const { user, logout, systemPlans, pageToggles } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    // Default to light mode (false) if not saved
    return saved ? saved === 'dark' : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

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
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)] group-hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] transition-all duration-500">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-6 h-6 object-contain brightness-0 invert"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter leading-none text-white">
              Jobba<span className="text-emerald-400">Works</span>
            </span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Author Portal</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar pb-10 mt-4">
        <div className="py-2">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-4">Main Menu</p>
          {userNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={closeMobileMenu}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 relative overflow-hidden group mb-1
                ${isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(52,211,153,0.05)]' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-r-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>}
                  <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800/50 text-slate-500 group-hover:bg-slate-700'}`}>
                     <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="py-2 mt-4">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 px-4">Community</p>
          <button
            onClick={() => {
              closeMobileMenu();
              setIsCommunityModalOpen(true);
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent transition-all duration-300 group"
          >
            <div className="p-2 rounded-xl bg-slate-800/50 text-slate-500 group-hover:bg-slate-700 transition-all">
               <MessageSquare size={18} />
            </div>
            Join Community
          </button>
        </div>

        {user?.role === 'admin' && (
          <div className="py-2 mt-4 border-t border-slate-800/50 pt-6">
            <p className="text-[10px] font-black text-indigo-500/70 uppercase tracking-[0.2em] mb-4 px-4">Administration</p>
            <Link
              to="/admin"
              onClick={closeMobileMenu}
              className={`
                flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 relative mb-1
                ${location.pathname.startsWith('/admin')
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[inset_0_0_20px_rgba(99,102,241,0.05)]' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'}
              `}
            >
              <div className={`p-2 rounded-xl transition-all ${location.pathname.startsWith('/admin') ? 'bg-indigo-500/20' : 'bg-slate-800/50'}`}>
                <ShieldCheck size={18} strokeWidth={location.pathname.startsWith('/admin') ? 2.5 : 2} />
              </div>
              Admin Console
            </Link>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-slate-800/50 bg-[#0B0F19]/80 backdrop-blur-xl">
        {plan && (
          <div className={`relative overflow-hidden rounded-[1.5rem] p-5 text-white mb-5 group border ${
            user?.planId === 'elite' ? 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border-purple-500/30' : 
            user?.planId === 'pro' ? 'bg-gradient-to-br from-emerald-900/50 to-teal-900/50 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700'
          }`}>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3 border border-white/20 backdrop-blur-sm shadow-xl">
                 {user?.planId !== 'free' ? <Crown size={20} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" /> : <ShieldCheck size={20} className="text-slate-300" />}
              </div>
              <p className="text-lg font-black tracking-tight mb-1 drop-shadow-md">{plan.name}</p>
              <p className="text-[10px] text-white/50 font-medium uppercase tracking-widest">Active Plan</p>
            </div>
            
            {/* Fintech Plan Card Glows */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-1000 ${
               user?.planId === 'elite' ? 'bg-purple-500/20' : 
               user?.planId === 'pro' ? 'bg-emerald-500/20' : 'bg-slate-500/10'
            }`}></div>
             <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/80 to-transparent pointer-events-none"></div>
          </div>
        )}
        
        <div className="flex items-center justify-between px-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 text-xs font-bold hover:text-rose-400 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
          <Link to="/dashboard/settings" onClick={closeMobileMenu} className="p-2 bg-slate-800/50 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all border border-slate-700/50">
            <Settings size={16} />
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#06090F] transition-colors duration-300 font-sans selection:bg-emerald-500/30 text-slate-900 dark:text-slate-200">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

      {/* Premium Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-[280px] bg-white/90 dark:bg-[#0A0D14]/80 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/80 fixed h-full z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] transition-colors duration-300">
        {SidebarContent()}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 dark:bg-[#06090F]/80 backdrop-blur-md z-40 md:hidden transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white dark:bg-[#0A0D14] border-r border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 md:hidden flex flex-col shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="absolute top-6 right-6 z-50">
          <button onClick={closeMobileMenu} className="p-2 bg-slate-100 dark:bg-slate-800/80 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 backdrop-blur-md transition-colors">
            <X size={20} />
          </button>
        </div>
        {SidebarContent()}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[280px] pb-12 min-h-screen relative z-10">
        <header className="sticky top-0 bg-white/70 dark:bg-[#0A0D14]/70 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800/80 z-20 px-6 py-4 md:px-10 flex items-center justify-between shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden p-2.5 -ml-2 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all border border-slate-200 dark:border-slate-700/50"
             >
               <Menu size={20} />
             </button>
             <div className="md:hidden w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-5 h-5 object-contain brightness-0 invert"
                />
             </div>
             <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight hidden sm:block drop-shadow-sm">
               {userNavItems.find(item => location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path)))?.name || 
                (location.pathname.startsWith('/admin') ? 'Admin Console' : 'Dashboard')}
             </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme} 
              className="p-2.5 text-slate-500 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:bg-slate-800/50 dark:hover:bg-slate-700 dark:hover:text-white rounded-xl transition-all border border-slate-200 dark:border-slate-700/50"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 rounded-full shadow-inner dark:shadow-[inset_0_0_10px_rgba(52,211,153,0.05)]">
               <div className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
               <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Mainnet Live</span>
            </div>
            
            <Link to="/" className="md:hidden p-2.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-xl transition-all border border-emerald-200 dark:border-emerald-500/20" title="Go Home">
              <Home size={18} />
            </Link>
            
            <button className="p-2.5 text-slate-500 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:bg-slate-800/50 dark:hover:bg-slate-700 dark:hover:text-white rounded-xl transition-all relative border border-slate-200 dark:border-slate-700/50">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
               <Link to="/dashboard/settings" className="hidden lg:flex flex-col items-end hover:opacity-80 transition-opacity">
                 <span className="text-sm font-black text-slate-900 dark:text-white">{user?.name}</span>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ID: #{user?.id.slice(0, 5)}</span>
               </Link>
               <Link to="/dashboard/settings" className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden hover:ring-2 hover:ring-emerald-400/50 hover:border-emerald-400/50 transition-all">
                 <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover" />
               </Link>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
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

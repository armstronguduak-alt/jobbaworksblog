
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

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const SidebarContent = () => (
    <>
      <div className="p-6 md:p-8 pb-4">
        <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#16A34A] rounded flex items-center justify-center shadow-sm">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-5 h-5 object-contain brightness-0 invert"
            />
          </div>
          <span className="text-[22px] font-bold text-[#111827] tracking-tight">
            Jobba<span className="text-[#16A34A]">Works</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto no-scrollbar pb-10">
        <p className="text-[11px] font-semibold text-[#6B7280] mb-3 px-4 uppercase tracking-wider">Menu</p>
        {userNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/dashboard'}
            onClick={closeMobileMenu}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] transition-colors duration-200
              ${isActive 
                ? 'bg-[#DCFCE7] text-[#16A34A] font-semibold' 
                : 'text-[#111827] font-medium hover:bg-slate-50'}
            `}
          >
            {({ isActive }) => (
              <>
                 <item.icon size={22} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-[#16A34A]' : 'text-[#6B7280]'} />
                 {item.name}
              </>
            )}
          </NavLink>
        ))}

        <div className="mt-8">
          <p className="text-[11px] font-semibold text-[#6B7280] mb-3 px-4 uppercase tracking-wider">Community</p>
          <button
            onClick={() => {
              closeMobileMenu();
              setIsCommunityModalOpen(true);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-[#111827] hover:bg-slate-50 transition-colors duration-200"
          >
            <MessageSquare size={22} strokeWidth={1.5} className="text-[#6B7280]" />
            Community Chat
          </button>
        </div>

        {user?.role === 'admin' && (
          <div className="mt-8 border-t border-slate-100 pt-6">
            <p className="text-[11px] font-semibold text-[#6B7280] mb-3 px-4 uppercase tracking-wider">Administration</p>
            <Link
              to="/admin"
              onClick={closeMobileMenu}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-colors duration-200
                ${location.pathname.startsWith('/admin')
                  ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                  : 'text-[#111827] hover:bg-slate-50'}
              `}
            >
              <ShieldCheck size={22} className={location.pathname.startsWith('/admin') ? 'text-indigo-600' : 'text-[#6B7280]'} strokeWidth={location.pathname.startsWith('/admin') ? 2 : 1.5} />
              Admin Console
            </Link>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex items-center justify-between px-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-rose-500 text-sm font-semibold hover:text-rose-600 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
          <Link to="/dashboard/settings" onClick={closeMobileMenu} className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-slate-50 rounded-lg transition-colors">
            <Settings size={20} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] font-sans text-[#111827]">
      {/* Premium Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-[260px] bg-[#FFFFFF] border-r border-[#E5E7EB] fixed h-full z-30 transition-colors duration-300">
        {SidebarContent()}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#FFFFFF] border-r border-[#E5E7EB] z-50 transform transition-transform duration-300 md:hidden flex flex-col shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="absolute top-6 right-6 z-50">
          <button onClick={closeMobileMenu} className="p-2 bg-slate-50 rounded-full text-[#6B7280] hover:text-[#111827] border border-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        {SidebarContent()}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[260px] pb-12 min-h-screen relative z-10">
        <header className="sticky top-0 bg-[#FFFFFF] border-b border-[#E5E7EB] z-20 px-6 py-4 md:px-10 flex items-center justify-between shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden p-2.5 -ml-2 text-[#6B7280] bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200"
             >
               <Menu size={20} />
             </button>
             <div className="md:hidden w-10 h-10 bg-[#16A34A] rounded-xl flex items-center justify-center shadow-sm">
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-5 h-5 object-contain brightness-0 invert"
                />
             </div>
             <h1 className="text-xl font-bold text-[#111827] tracking-tight hidden sm:block">
               {userNavItems.find(item => location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path)))?.name || 
                (location.pathname.startsWith('/admin') ? 'Admin Console' : 'Dashboard')}
             </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to="/" className="md:hidden p-2.5 text-[#16A34A] bg-[#DCFCE7] hover:bg-green-100 rounded-xl transition-all border border-green-200" title="Go Home">
              <Home size={18} />
            </Link>
            
            <button className="p-2.5 text-[#6B7280] bg-slate-50 hover:bg-slate-100 rounded-xl transition-all relative border border-slate-200">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full shadow-sm"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
               <Link to="/dashboard/settings" className="hidden lg:flex flex-col items-end hover:opacity-80 transition-opacity">
                 <span className="text-sm font-bold text-[#111827]">{user?.name}</span>
                 <span className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wider">ID: #{user?.id.slice(0, 5)}</span>
               </Link>
               <Link to="/dashboard/settings" className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 shadow-sm overflow-hidden hover:ring-2 hover:ring-[#16A34A]/50 transition-all">
                 <img src={user?.avatar} alt="Profile" className="w-full h-full object-cover" />
               </Link>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
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

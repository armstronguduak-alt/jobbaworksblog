import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
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
  X,
  Home
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const adminNavItems = [
    { name: 'System Overview', icon: ShieldCheck, path: '/admin' },
    { name: 'Post Moderation', icon: ClipboardCheck, path: '/admin/moderation' },
    { name: 'User Management', icon: Users2, path: '/admin/users' },
    { name: 'Categories', icon: Tags, path: '/admin/categories' },
    { name: 'Tasks & Bounties', icon: Target, path: '/admin/tasks' },
    { name: 'Promotions', icon: Megaphone, path: '/admin/promotions' },
    { name: 'Global Settings', icon: Sliders, path: '/admin/settings' },
  ];

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const SidebarContent = () => (
    <>
      <div className="p-6 md:p-8 pb-4">
        <Link to="/admin" onClick={closeMenu} className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#DCFCE7] rounded flex items-center justify-center shadow-sm">
            <ShieldCheck size={20} className="text-[#16A34A]" />
          </div>
          <span className="text-[22px] font-bold text-[#111827] tracking-tight">
            JW <span className="text-[#16A34A]">Admin</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto no-scrollbar pb-10">
        <p className="text-[11px] font-semibold text-[#6B7280] mb-3 px-4 uppercase tracking-wider">Command Center</p>
        {adminNavItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            onClick={closeMenu}
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
          <p className="text-[11px] font-semibold text-[#6B7280] mb-3 px-4 uppercase tracking-wider">Quick Links</p>
          <Link
            to="/dashboard"
            onClick={closeMenu}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-[#111827] hover:bg-slate-50 transition-colors duration-200"
          >
            <LayoutDashboard size={22} strokeWidth={1.5} className="text-[#6B7280]" />
            User Dashboard
          </Link>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex items-center justify-between px-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-rose-500 text-sm font-semibold hover:text-rose-600 transition-colors"
          >
            <LogOut size={20} />
            Secure Logout
          </button>
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
          onClick={closeMenu}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#FFFFFF] border-r border-[#E5E7EB] z-50 transform transition-transform duration-300 md:hidden flex flex-col shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="absolute top-6 right-6 z-50">
          <button onClick={closeMenu} className="p-2 bg-slate-50 rounded-full text-[#6B7280] hover:text-[#111827] border border-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        {SidebarContent()}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[260px] pb-12 min-h-screen relative z-10 flex flex-col">
        <header className="sticky top-0 bg-[#FFFFFF] border-b border-[#E5E7EB] z-20 px-6 py-4 md:px-10 flex items-center justify-between shadow-sm transition-colors duration-300 w-full shrink-0">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden p-2.5 -ml-2 text-[#6B7280] bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200"
             >
               <Menu size={20} />
             </button>
             <h1 className="text-xl font-bold text-[#111827] tracking-tight truncate hidden sm:block">
               {adminNavItems.find(item => location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path)))?.name || 'Admin Console'}
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
               <div className="hidden lg:flex flex-col items-end">
                 <span className="text-sm font-bold text-[#111827]">{user?.name}</span>
                 <span className="text-[10px] font-medium text-[#16A34A] uppercase tracking-wider">System Admin</span>
               </div>
               <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 shadow-sm overflow-hidden">
                 <img src={user?.avatar} alt="Admin Profile" className="w-full h-full object-cover" />
               </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1 min-h-[calc(100vh-80px)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;


import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, LogOut, User as UserIcon, CreditCard, Menu, X } from 'lucide-react';
import CommunityModal, { CommunityChannel } from './CommunityModal';

const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simulated fetch from community_links table logic
  const communityChannels: CommunityChannel[] = [
    { id: '1', channel_key: 'telegram', label: 'Telegram', url: 'https://t.me/placeholder' },
    { id: '2', channel_key: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/placeholder' }
  ];
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, categories } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  if (
    location.pathname.startsWith('/dashboard') || 
    location.pathname.startsWith('/admin') ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password'
  ) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-green-50 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-green-600 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="JobbaWorks Logo" 
              className="w-8 h-8 rounded object-cover"
            />
            <span className="hidden sm:inline"><span className="text-green-600">Jobba</span><span className="text-black">Works</span></span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
          <Link to="/plans" className="hover:text-green-600 transition-colors">Plans</Link>
          <button onClick={() => setIsCommunityModalOpen(true)} className="hover:text-green-600 transition-colors font-bold text-green-600">Community</button>
          {categories.slice(0, 3).map(category => (
            <Link key={category} to={`/category/${category}`} className="hover:text-green-600 transition-colors">{category}</Link>
          ))}
          {categories.length > 3 && (
            <div className="relative group" onMouseLeave={() => setIsCategoriesOpen(false)}>
              <button
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="hover:text-green-600 transition-colors flex items-center gap-1 focus:outline-none"
              >
                More
              </button>
              {isCategoriesOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {categories.slice(3).map(category => (
                    <Link
                      key={category}
                      to={`/category/${category}`}
                      onClick={() => setIsCategoriesOpen(false)}
                      className="block px-4 py-2 text-sm font-medium text-slate-600 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative">
            <Search size={16} className="absolute left-3 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 text-sm w-48 xl:w-64 transition-all"
            />
          </form>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full border-2 border-green-100 p-0.5 overflow-hidden active:scale-95 transition-transform"
              >
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full" />
              </button>
              
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 p-2 z-20 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">{user.planId} plan</p>
                    </div>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors"
                    >
                      <UserIcon size={16} /> Dashboard
                    </Link>
                    <Link 
                      to="/plans" 
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-green-50 hover:text-green-700 rounded-xl transition-colors"
                    >
                      <CreditCard size={16} /> Plans
                    </Link>
                    <button 
                      onClick={() => { logout(); setIsProfileOpen(false); navigate('/'); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-green-600">Log In</Link>
              <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-bold hover:bg-green-700 transition-all shadow-md shadow-green-200">
                Get Started
              </Link>
            </>
          )}


        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-green-50 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top duration-300 shadow-xl z-40">
          <div className="flex flex-col p-4 space-y-2">
            <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="relative mb-2">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 text-sm"
              />
            </form>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 font-bold text-slate-700 hover:bg-green-50 hover:text-green-600 rounded-xl">Home</Link>
            <Link to="/plans" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 font-bold text-slate-700 hover:bg-green-50 hover:text-green-600 rounded-xl">Plans</Link>
            <button onClick={() => { setIsCommunityModalOpen(true); setIsMobileMenuOpen(false); }} className="text-left px-4 py-3 font-bold text-green-600 hover:bg-green-50 rounded-xl">Community Updates</button>
            <div className="w-full h-px bg-slate-100 my-2"></div>
            <p className="px-4 py-2 text-xs font-black text-slate-400 uppercase tracking-widest">Categories</p>
            {categories.map(category => (
              <Link 
                key={category} 
                to={`/category/${category}`} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="px-4 py-3 font-bold text-slate-600 hover:bg-green-50 hover:text-green-600 rounded-xl"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      )}


      <CommunityModal 
        isOpen={isCommunityModalOpen} 
        channels={communityChannels} 
        onClose={() => setIsCommunityModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;

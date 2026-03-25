
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import CategoryPage from './pages/CategoryPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Wallet from './pages/Wallet';
import Swap from './pages/Swap';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Pricing from './pages/Pricing';
import Promotional from './pages/Promotional';
import Referrals from './pages/Referrals';
import MyPosts from './pages/MyPosts';
import CreatePost from './pages/CreatePost';
import Earnings from './pages/Earnings';
import Settings from './pages/Settings';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
// Admin Imports
import AdminOverview from './pages/Admin/AdminOverview';
import AdminModeration from './pages/Admin/AdminModeration';
import AdminUserManagement from './pages/Admin/AdminUserManagement';
import AdminSystemSettings from './pages/Admin/AdminSystemSettings';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminLogin from './pages/AdminLogin';
import AdminPromotions from './pages/Admin/AdminPromotions';
import AdminLayout from './components/AdminLayout';
import Tasks from './pages/Tasks';
import AdminTasks from './pages/Admin/AdminTasks';

import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
const Footer: React.FC = () => (
  <footer className="bg-[#f0fdf4] border-t border-emerald-100 py-10 mt-20 font-sans">
    <div className="max-w-7xl mx-auto px-4 md:px-6">
      <div className="grid grid-cols-4 md:grid-cols-4 gap-x-2 gap-y-0 mb-8 items-start">
        <div className="col-span-1 pr-2">
          <Link to="/" className="text-[13px] md:text-xl font-extrabold tracking-tight mb-3 flex items-center gap-1.5 md:gap-2">
            <img 
              src="/logo.png" 
              alt="JobbaWorks Logo" 
              className="w-5 h-5 md:w-7 md:h-7 rounded object-cover"
            />
            <span><span className="text-[#16A34A]">Jobba</span><span className="text-black hidden sm:inline">Works</span></span>
          </Link>
          <p className="text-slate-500 text-[9px] md:text-xs leading-relaxed hidden sm:block">
            A high-performance blog and earnings platform for deep thinkers, creators, and professionals.
          </p>
        </div>
        <div className="text-center sm:text-left">
          <h4 className="font-bold text-slate-900 mb-3 md:mb-5 text-[11px] md:text-sm">Explore</h4>
          <ul className="space-y-2 md:space-y-3 text-[10px] md:text-sm text-slate-500">
            <li><Link to="/category/Technology" className="hover:text-[#16A34A] transition-colors">Technology</Link></li>
            <li><Link to="/plans" className="hover:text-[#16A34A] transition-colors">Plans</Link></li>
            <li><Link to="/promotional" className="hover:text-[#16A34A] transition-colors">Promotional</Link></li>
          </ul>
        </div>
        <div className="text-center sm:text-left">
          <h4 className="font-bold text-slate-900 mb-3 md:mb-5 text-[11px] md:text-sm">Dashboard</h4>
          <ul className="space-y-2 md:space-y-3 text-[10px] md:text-sm text-slate-500">
            <li><Link to="/dashboard" className="hover:text-[#16A34A] transition-colors">Overview</Link></li>
            <li><Link to="/dashboard/wallet" className="hover:text-[#16A34A] transition-colors">Wallet</Link></li>
            <li><Link to="/dashboard/referrals" className="hover:text-[#16A34A] transition-colors">Referrals</Link></li>
          </ul>
        </div>
        <div className="text-center sm:text-left">
          <h4 className="font-bold text-slate-900 mb-3 md:mb-5 text-[11px] md:text-sm">Network</h4>
          <ul className="space-y-2 md:space-y-3 text-[10px] md:text-sm text-slate-500">
            <li><Link to="/privacy" className="hover:text-[#16A34A] transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-[#16A34A] transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-6 border-t border-emerald-200">
        <p className="text-[10px] md:text-sm text-slate-400">© 2024 <span className="text-[#16A34A]">Jobba</span><span className="text-black">Works</span> Inc. Professional Results.</p>
      </div>
    </div>
  </footer>
);

const Placeholder = ({ title }: { title: string }) => (
  <div className="py-20 text-center animate-in fade-in duration-500">
    <h3 className="text-3xl font-black text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-500 mb-8 max-w-md mx-auto">This section is coming soon! We are working hard to bring you the best {title.toLowerCase()} experience.</p>
    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
       <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Routes>
         <Route path="/dashboard/*" element={null} />
         <Route path="/admin/*" element={null} />
         <Route path="/login" element={null} />
         <Route path="/register" element={null} />
         <Route path="/forgot-password" element={null} />
         <Route path="*" element={<Footer />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <LayoutWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<PostDetail />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/plans" element={<Pricing />} />
            <Route path="/promotional" element={<Promotional />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="earnings" element={<Earnings />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="swap" element={<Swap />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="posts" element={<MyPosts />} />
              <Route path="posts/create" element={<CreatePost />} />
              <Route path="posts/edit/:id" element={<CreatePost />} />
              <Route path="referrals" element={<Referrals />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="settings" element={<Settings />} />
              <Route path="plans" element={<Pricing />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }>
              <Route index element={<AdminOverview />} />
              <Route path="moderation" element={<AdminModeration />} />
              <Route path="users" element={<AdminUserManagement />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="tasks" element={<AdminTasks />} />
              <Route path="settings" element={<AdminSystemSettings />} />
              <Route path="promotions" element={<AdminPromotions />} />
            </Route>
          </Routes>
        </LayoutWrapper>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

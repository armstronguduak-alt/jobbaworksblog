
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';
  const message = location.state?.message;

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await login(email.trim().toLowerCase(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Panel - Dark Fintech Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 border-r border-slate-800 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Decorative Gradients/Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src="/logo.png" alt="JobbaWorks Logo" className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/20" />
            <span className="text-2xl font-black tracking-tight text-white">
              <span className="text-emerald-500">Jobba</span>Works
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
             <Lock size={12} /> Secure Access
          </div>
          <h1 className="text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            Your earnings, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">securely</span> managed.
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed">
            Log in to your authenticated dashboard. Monitor real-time rewards, authorize fast payouts, and manage your financial writing portfolio with bank-level encryption.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1"><Lock size={14} /> PCI-DSS Compliant</span>
          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
          <span>Protected Infrastructure</span>
        </div>
      </div>

      {/* Right Panel - Form Layout */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo Only */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/logo.png" alt="JobbaWorks" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-xl font-black tracking-tight">
                <span className="text-emerald-600">Jobba</span><span className="text-slate-900">Works</span>
              </span>
            </Link>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 font-medium mt-2">Enter your credentials to access your secure vault.</p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-emerald-50/50 text-emerald-700 border border-emerald-100/50 rounded-2xl text-sm font-bold flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Lock size={16} /></div>
              {message}
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-rose-50/50 text-rose-700 border border-rose-100/50 rounded-2xl text-sm font-bold flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Lock size={16} /></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 font-medium text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 font-medium text-sm tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full py-4 mt-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
            >
              {loading ? 'Authenticating...' : 'Secure Authorization'}
              {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-8">
            <p className="text-[13px] font-medium text-slate-500">
              New to JobbaWorks? <Link to="/register" className="text-slate-900 font-black hover:text-emerald-600 transition-colors">Create your account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

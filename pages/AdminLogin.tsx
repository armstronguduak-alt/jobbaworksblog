import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../src/integrations/supabase/client';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      await login(email.trim().toLowerCase(), password);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('Could not validate admin account. Please try again.');

      const { data: roleRows, error: roleError } = await (supabase as any)
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin');

      if (roleError || !roleRows?.length) {
        await supabase.auth.signOut();
        throw new Error('This account does not have admin access.');
      }

      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        
        <div className="flex justify-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/logo.png" alt="JobbaWorks Logo" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-2xl font-bold tracking-tight text-[#111827]">
              JobbaWorks
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#DCFCE7] rounded-xl flex items-center justify-center mx-auto mb-4 border border-green-100">
              <Shield className="text-[#16A34A]" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">System Access</h2>
            <p className="text-sm text-[#6B7280] mt-2">JobbaWorks Administration Portal.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Lock size={16} /></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jobbaworks.com"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all text-[#111827] text-sm disabled:opacity-70 disabled:bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all text-[#111827] text-sm disabled:opacity-70 disabled:bg-slate-50 tracking-widest"
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full py-3 mt-4 bg-[#16A34A] hover:bg-green-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Authorize Access'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link to="/" className="text-sm font-semibold text-[#6B7280] hover:text-[#16A34A] transition-colors inline-flex items-center gap-2">
              <ArrowRight size={16} className="rotate-180" /> Return to Public Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

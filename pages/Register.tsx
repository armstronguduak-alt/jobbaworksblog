import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Gift, ArrowRight, Eye, EyeOff, Phone } from 'lucide-react';
import { supabase } from '../src/integrations/supabase/client';

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState((searchParams.get('ref') || '').toUpperCase());
  const [referrerName, setReferrerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReferrer = async () => {
      if (!referralCode) {
        setReferrerName('');
        return;
      }

      const { data } = await (supabase as any)
        .from('profiles')
        .select('name')
        .eq('referral_code', referralCode.trim().toUpperCase())
        .maybeSingle();

      setReferrerName(data?.name || '');
    };

    fetchReferrer();
  }, [referralCode]);

  useEffect(() => {
    if (username.trim().length < 3) {
      setUsernameAvailable(null);
      return;
    }
    const checkUsername = async () => {
      setCheckingUsername(true);
      const cleanUsername = username.trim().toLowerCase();
      const { data } = await (supabase as any)
        .from('profiles')
        .select('username')
        .eq('username', cleanUsername)
        .maybeSingle();

      setCheckingUsername(false);
      setUsernameAvailable(!data);
    };
    
    const timeoutId = setTimeout(checkUsername, 600);
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (usernameAvailable === false) {
        throw new Error('Please choose a different username, this one is already taken.');
      }
      if (!gender) {
        throw new Error('Please select your gender.');
      }
      const fullPhone = `+234${phone}`;
      await register(name, username, gender, email, password, fullPhone, referralCode);
      navigate('/login', { state: { message: 'Registration successful! Please confirm your email address to login.' } });
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 font-sans py-12">
      <div className="w-full max-w-lg">
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
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Create Account</h2>
            <p className="text-sm text-[#6B7280] mt-2">Join the next-gen platform.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Lock size={16} /></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all text-[#111827] text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">Username</label>
                <div className="relative flex flex-col">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="johndoe"
                      className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all text-[#111827] text-sm ${
                        usernameAvailable === false ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-slate-200 focus:ring-[#16A34A]/20 focus:border-[#16A34A]'
                      }`}
                    />
                  </div>
                  {username.trim().length >= 3 && (
                    <p className={`text-[11px] mt-1.5 font-semibold px-1 ${
                      checkingUsername ? 'text-[#6B7280]' : usernameAvailable ? 'text-[#16A34A]' : 'text-red-600'
                    }`}>
                      {checkingUsername ? 'Checking...' : usernameAvailable ? 'Available' : 'Taken'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">Gender</label>
                <select
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all text-[#111827] text-sm appearance-none"
                >
                  <option value="" disabled>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all text-[#111827] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">Phone Number</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center gap-2 text-[#6B7280] font-semibold text-sm">
                  <span>+234</span>
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="801 234 5678"
                  className="w-full pl-[4.5rem] pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all text-[#111827] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all text-[#111827] text-sm tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-2">Referral Code (Optional)</label>
              <div className="relative">
                <Gift className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={18} />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="CODE"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition-all text-[#111827] text-sm uppercase"
                />
              </div>
              {referrerName && <p className="mt-2 text-xs font-semibold text-[#16A34A] px-1">Referring Agent: {referrerName}</p>}
            </div>

            <p className="text-xs font-medium text-[#6B7280] text-center px-4 py-2">
              By registering, you accept our <Link to="/terms" className="text-[#16A34A] hover:underline">Terms of Service</Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-[#16A34A] hover:bg-green-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Initializing...' : 'Create Account'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <p className="text-sm font-medium text-[#6B7280]">
              Already have an account? <Link to="/login" className="text-[#16A34A] font-semibold hover:text-green-700 transition-colors">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

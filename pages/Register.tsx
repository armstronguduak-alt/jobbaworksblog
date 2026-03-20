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
      const { data, error } = await (supabase as any)
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
    <div className="min-h-[90vh] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="JobbaWorks Logo" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-2xl font-black tracking-tight"><span className="text-emerald-600">Jobba</span><span className="text-black">Works</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Join the Community</h1>
          <p className="text-slate-500 mt-2">Start earning from your reading habit today</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-100/50">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Username</label>
              <div className="relative flex flex-col">
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe123"
                    className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-2xl focus:outline-none focus:ring-2 focus:bg-white transition-all text-sm ${
                      usernameAvailable === false ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-100 focus:ring-emerald-600'
                    }`}
                  />
                </div>
                {username.trim().length >= 3 && (
                  <p className={`text-xs mt-1 ml-1 font-semibold ${
                    checkingUsername ? 'text-slate-400' : usernameAvailable ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {checkingUsername ? 'Checking availability...' : usernameAvailable ? 'Username is available!' : 'Username is already taken.'}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Gender</label>
              <select
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-sm appearance-none"
              >
                <option value="" disabled>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Phone Number</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center gap-2 text-slate-500 font-medium">
                  <Phone size={18} />
                  <span>+234</span>
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="801 234 5678"
                  className="w-full pl-[5.5rem] pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Referral Code (Optional)</label>
              <div className="relative">
                <Gift className="absolute left-4 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="GIFT2024"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-sm"
                />
              </div>
              {referrerName && <p className="mt-2 ml-1 text-xs text-emerald-600 font-medium">Referred by: {referrerName}</p>}
            </div>

            <p className="text-[10px] text-slate-400 text-center px-4 leading-relaxed">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500">
              Already have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

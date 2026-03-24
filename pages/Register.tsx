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
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Panel - Dark Fintech Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 border-r border-slate-800 flex-col justify-between p-12 relative overflow-hidden fixed top-0 left-0 bottom-0">
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
             <Gift size={12} /> Sustainable Rewards
          </div>
          <h1 className="text-5xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            Read, engaging, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400">earn crypto & flat.</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium leading-relaxed">
            Create your account to unlock daily earning quotas. Read authenticated content, comment to earn, and withdraw instantly to your local bank.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1"><Lock size={14} /> PCI-DSS Compliant</span>
          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
          <span>Regulated Operations</span>
        </div>
      </div>

      {/* Right Panel - Scrollable Form */}
      <div className="w-full lg:w-1/2 lg:ml-auto flex flex-col p-6 sm:p-12 relative bg-white min-h-screen">
        <div className="w-full max-w-[420px] mx-auto flex-1 flex flex-col justify-center">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/logo.png" alt="JobbaWorks" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-xl font-black tracking-tight">
                <span className="text-emerald-600">Jobba</span><span className="text-slate-900">Works</span>
              </span>
            </Link>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 font-medium mt-2">Join the next-gen reading ecosystem.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50/50 text-rose-700 border border-rose-100/50 rounded-2xl text-sm font-bold flex items-start gap-3">
              <div className="shrink-0 mt-0.5"><Lock size={16} /></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 font-medium text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Username</label>
                <div className="relative flex flex-col">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="johndoe"
                      className={`w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all text-slate-900 font-medium text-sm ${
                        usernameAvailable === false ? 'border-rose-300 focus:ring-rose-500' : 'focus:ring-emerald-500'
                      }`}
                    />
                  </div>
                  {username.trim().length >= 3 && (
                    <p className={`text-[10px] mt-1.5 font-bold uppercase tracking-wide px-1 ${
                      checkingUsername ? 'text-slate-400' : usernameAvailable ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {checkingUsername ? 'Checking...' : usernameAvailable ? 'Available' : 'Taken'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Gender</label>
                <select
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 font-medium text-sm appearance-none"
                >
                  <option value="" disabled>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 font-medium text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Phone Number</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center gap-2 text-slate-500 font-black text-sm">
                  <span>+234</span>
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="801 234 5678"
                  className="w-full pl-[4.5rem] pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 font-medium text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
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

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Referral Code (Optional)</label>
              <div className="relative">
                <Gift className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder="CODE"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-900 font-medium text-sm uppercase"
                />
              </div>
              {referrerName && <p className="mt-2 text-[11px] font-bold text-emerald-600 px-1">Referring Agent: {referrerName}</p>}
            </div>

            <p className="text-[10px] uppercase font-bold text-slate-400 text-center px-4 pt-2">
              By registering, you accept our <Link to="/terms" className="text-emerald-600">Terms of Service</Link>.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
            >
              {loading ? 'Initializing...' : 'Create Secure Vault'}
              {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 pt-8">
            <p className="text-[13px] font-medium text-slate-500">
              Already have an account? <Link to="/login" className="text-slate-900 font-black hover:text-emerald-600 transition-colors">Sign In here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

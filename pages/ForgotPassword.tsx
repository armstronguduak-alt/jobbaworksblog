
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img 
              src="/logo.png" 
              alt="JobbaWorks Logo" 
              className="w-10 h-10 rounded-xl object-cover"
            />
            <span className="text-2xl font-black tracking-tight"><span className="text-emerald-600">Jobba</span><span className="text-black">Works</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
          <p className="text-slate-500 mt-2">We'll send you a link to your email</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-100/50">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <button
                type="submit"
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 group"
              >
                Send Reset Link
                <Send size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Email Sent!</h3>
              <p className="text-slate-500 text-sm mb-8">
                If an account exists for {email}, you will receive a password reset link shortly.
              </p>
              <button 
                onClick={() => setSent(false)}
                className="text-emerald-600 text-sm font-bold hover:underline"
              >
                Try a different email
              </button>
            </div>
          )}

          <div className="mt-10 text-center border-t border-slate-50 pt-8">
            <Link to="/login" className="text-slate-500 text-sm font-bold hover:text-slate-900 flex items-center justify-center gap-2">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

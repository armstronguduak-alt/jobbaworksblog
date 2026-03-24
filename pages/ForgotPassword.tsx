
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
            <h2 className="text-2xl font-bold text-[#111827] tracking-tight">Reset password</h2>
            <p className="text-sm text-[#6B7280] mt-2">We'll send you a link to your email.</p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <button
                type="submit"
                className="w-full py-3 mt-4 bg-[#16A34A] hover:bg-green-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 group"
              >
                Send reset link
                <Send size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-[#DCFCE7] text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6">
                <Send size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-2">Email sent!</h3>
              <p className="text-[#6B7280] text-sm mb-8">
                If an account exists for {email}, you will receive a password reset link shortly.
              </p>
              <button 
                onClick={() => setSent(false)}
                className="text-[#16A34A] text-sm font-semibold hover:underline"
              >
                Try a different email
              </button>
            </div>
          )}

          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <Link to="/login" className="text-sm font-semibold text-[#6B7280] hover:text-[#16A34A] transition-colors inline-flex items-center gap-2">
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

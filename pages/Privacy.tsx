import React from 'react';
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* Premium Header */}
      <div className="bg-slate-900 text-white pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-8 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
            Privacy <span className="text-emerald-400 italic">Policy</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto serif-text leading-relaxed">
            We believe in transparency and the protection of your digital assets. Here is how we handle your data with the utmost care.
          </p>
          <div className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Last Updated: March 2026
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 -mt-10 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-16 border border-slate-100">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pb-16 border-b border-slate-100">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-4">
                <Lock size={24} />
              </div>
              <h3 className="font-black text-slate-900 mb-2">Secure Infrastructure</h3>
              <p className="text-sm text-slate-500 serif-text">Enterprise-grade encryption for all your personal data.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-4">
                <Eye size={24} />
              </div>
              <h3 className="font-black text-slate-900 mb-2">Zero Tracking</h3>
              <p className="text-sm text-slate-500 serif-text">We don't sell your data to third-party advertisers.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-4">
                <FileText size={24} />
              </div>
              <h3 className="font-black text-slate-900 mb-2">Full Transparency</h3>
              <p className="text-sm text-slate-500 serif-text">Clear, readable policies without the confusing legal jargon.</p>
            </div>
          </div>

          <div className="prose prose-slate prose-lg max-w-none serif-text leading-relaxed text-slate-700">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans mb-6">1. Information We Collect</h2>
            <p>
              When you interact with JobbaWorks, we collect information that you choose to share with us. This includes your name, email address, phone number, and payment details when you upgrade to a premium tier. We also collect data on how you interact with our platform to improve your experience.
            </p>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans mt-12 mb-6">2. How We Use Your Information</h2>
            <p>
              Your data is primarily used to provide, maintain, and improve our services. Specifically, we use it to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Process your transactions and manage your premium subscriptions.</li>
              <li>Send you technical notices, updates, security alerts, and support messages.</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our platform.</li>
              <li>Personalize your experience and deliver content relevant to your interests.</li>
            </ul>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans mt-12 mb-6">3. Data Sharing and Disclosure</h2>
            <p>
              We do not sell your personal data. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</li>
              <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process.</li>
              <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of JobbaWorks or others.</li>
            </ul>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans mt-12 mb-6">4. Your Data Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time. You can do this through your account settings or by contacting our support team. We retain your data only for as long as necessary to fulfill the purposes outlined in this policy.
            </p>

            <div className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
              <h3 className="text-xl font-black text-slate-900 mb-2 font-sans">Questions about your privacy?</h3>
              <p className="text-slate-500 mb-6">Our dedicated privacy team is here to help clarify any concerns.</p>
              <a href="mailto:privacy@jobbaworks.com" className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all font-sans">
                Contact Privacy Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

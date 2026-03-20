import React from 'react';
import { Scale, FileSignature, AlertCircle, CheckCircle2 } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* Premium Header */}
      <div className="bg-slate-900 text-white pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-8 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Scale size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
             Terms of <span className="text-indigo-400 italic">Service</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto serif-text leading-relaxed">
            The rules of engagement. By using our platform, you agree to these terms designed to protect our community and your assets.
          </p>
          <div className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Effective Date: March 2026
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-20 -mt-10 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 md:p-16 border border-slate-100">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pb-16 border-b border-slate-100">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-4">
                <FileSignature size={24} />
              </div>
              <h3 className="font-black text-slate-900 mb-2">Clear Agreement</h3>
              <p className="text-sm text-slate-500 serif-text">Straightforward terms outlining your rights and responsibilities.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-black text-slate-900 mb-2">Fair Usage</h3>
              <p className="text-sm text-slate-500 serif-text">Guidelines ensuring a level playing field for all creators.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 mb-4">
                <AlertCircle size={24} />
              </div>
              <h3 className="font-black text-slate-900 mb-2">Dispute Resolution</h3>
              <p className="text-sm text-slate-500 serif-text">Structured processes for handling any platform issues.</p>
            </div>
          </div>

          <div className="prose prose-slate prose-lg max-w-none serif-text leading-relaxed text-slate-700">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans mb-6">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the JobbaWorks platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you are prohibited from using or accessing this site.
            </p>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans mt-12 mb-6">2. User Responsibilities</h2>
            <p>
              As a user of JobbaWorks, you are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Maintaining the confidentiality of your account credentials.</li>
              <li>All activities that occur under your account.</li>
              <li>Ensuring that the content you publish does not violate any intellectual property rights or local laws.</li>
              <li>Not engaging in any activity that disrupts or interferes with the platform's services.</li>
            </ul>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans mt-12 mb-6">3. Content Ownership and Licensing</h2>
            <p>
              You retain ownership of the content you create and publish on JobbaWorks. However, by posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, adapt, publish, and distribute your content across our platform to provide our services.
            </p>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans mt-12 mb-6">4. Monetization and Payments</h2>
            <p>
              JobbaWorks provides mechanisms for users to earn rewards based on engagement and subscription tiers. We reserve the right to modify the reward structures, minimum withdrawal limits, and payment methods at any time. Any fraudulent activity to artificially inflate engagement metrics will result in immediate account termination and forfeiture of earnings.
            </p>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-sans mt-12 mb-6">5. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>

            <div className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
              <h3 className="text-xl font-black text-slate-900 mb-2 font-sans">Need Legal Clarification?</h3>
              <p className="text-slate-500 mb-6">Reach out to our legal team for any questions regarding these terms.</p>
              <a href="mailto:legal@jobbaworks.com" className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all font-sans">
                Contact Legal Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;

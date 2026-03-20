import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface PublishSuccessModalProps {
  isOpen: boolean;
  onViewArticle: () => void;
  onGoBack: () => void;
}

const PublishSuccessModal: React.FC<PublishSuccessModalProps> = ({ isOpen, onViewArticle, onGoBack }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-black text-slate-900">Article Published Successfully</h3>
        <p className="mt-2 text-sm text-slate-500">Your article has been submitted and is now awaiting admin review.</p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button onClick={onViewArticle} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white hover:bg-black">
            View Article
          </button>
          <button onClick={onGoBack} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishSuccessModal;

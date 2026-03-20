import React from 'react';
import { X, MessageCircle } from 'lucide-react';

export interface CommunityChannel {
  id: string;
  channel_key: string;
  label: string;
  url: string;
}

interface CommunityModalProps {
  isOpen: boolean;
  channels: CommunityChannel[];
  onClose: () => void;
}

const buttonToneByChannel: Record<string, string> = {
  telegram: 'bg-sky-600 hover:bg-sky-700 text-white',
  whatsapp: 'bg-emerald-600 hover:bg-emerald-700 text-white',
};

const CommunityModal: React.FC<CommunityModalProps> = ({ isOpen, channels, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <h3 className="text-2xl font-black text-slate-900">Join our community</h3>
          <p className="mt-1 text-sm text-slate-500">Pick a channel to stay updated with announcements and opportunities.</p>
        </div>

        <div className="space-y-3">
          {channels.map((channel) => (
            <a
              key={channel.id}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-black transition-all ${
                buttonToneByChannel[channel.channel_key.toLowerCase()] || 'bg-slate-900 hover:bg-black text-white'
              }`}
            >
              <MessageCircle size={16} />
              Join {channel.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityModal;

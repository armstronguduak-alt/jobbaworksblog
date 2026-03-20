
import React from 'react';
import { ExternalLink, Info } from 'lucide-react';

interface AdUnitProps {
  type?: 'banner' | 'rectangle' | 'in-feed';
  className?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ type = 'banner', className = '' }) => {
  const getStyles = () => {
    switch (type) {
      case 'banner': return 'w-full h-32 md:h-24';
      case 'rectangle': return 'w-full aspect-video md:w-80 h-64 mx-auto';
      case 'in-feed': return 'w-full py-8 border-y border-slate-100';
      default: return 'w-full h-24';
    }
  };

  return (
    <div className={`bg-slate-50 relative group flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-200 ${getStyles()} ${className}`}>
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
        <Info size={10} className="text-slate-400" />
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Ads by Google</span>
      </div>
      
      <div className="text-center px-4">
        <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Sponsored Content</div>
        <p className="text-xs font-bold text-slate-500 mb-2">Build your global career with Top Tier certification.</p>
        <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center gap-2 mx-auto">
          Learn More <ExternalLink size={10} />
        </button>
      </div>

      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default AdUnit;

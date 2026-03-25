import React from 'react';

const AdsterraBanner: React.FC = () => {
  return (
    <div className="flex justify-center my-4 w-full h-[50px] overflow-hidden bg-slate-50/50 rounded-xl relative z-10">
       <iframe
          title="Adsterra Banner"
          src="/adsterra-banner.html"
          width="320"
          height="50"
          frameBorder="0"
          scrolling="no"
          className="border-none bg-transparent"
        />
    </div>
  );
};

export default AdsterraBanner;

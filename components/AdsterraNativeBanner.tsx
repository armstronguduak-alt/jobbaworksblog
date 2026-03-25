import React from 'react';

const AdsterraNativeBanner: React.FC = () => {
  return (
    <div className="my-8 w-full flex justify-center overflow-hidden min-h-[300px] bg-slate-50/50 rounded-xl relative z-10 p-2">
       <iframe
          title="Adsterra Native Banner"
          src="/adsterra-native.html"
          width="100%"
          height="100%"
          style={{ minHeight: '300px' }}
          frameBorder="0"
          scrolling="yes"
          className="border-none bg-transparent"
        />
    </div>
  );
};

export default AdsterraNativeBanner;

import React, { useEffect, useRef } from 'react';

const AdsterraNativeBanner: React.FC = () => {
  const scriptRef = useRef<boolean>(false);

  useEffect(() => {
    if (!scriptRef.current) {
      const container = document.getElementById('container-b6752b00d89bb2aa369e17f94b48cb25');
      if (container) {
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = 'https://pl28975661.profitablecpmratenetwork.com/b6752b00d89bb2aa369e17f94b48cb25/invoke.js';
        container.appendChild(script);
        scriptRef.current = true;
      }
    }
  }, []);

  return (
    <div className="my-8 w-full flex justify-center overflow-hidden min-h-[250px] bg-slate-50/50 rounded-xl relative z-10 p-2">
      <div id="container-b6752b00d89bb2aa369e17f94b48cb25"></div>
    </div>
  );
};

export default AdsterraNativeBanner;

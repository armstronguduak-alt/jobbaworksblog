import { useEffect, useRef } from 'react';

const AdsterraNativeBanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || containerRef.current.hasChildNodes()) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl28975661.profitablecpmratenetwork.com/b6752b00d89bb2aa369e17f94b48cb25/invoke.js';
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="my-8 w-full flex justify-center overflow-hidden min-h-[50px] bg-slate-50/50 rounded-xl">
      <div id="container-b6752b00d89bb2aa369e17f94b48cb25" ref={containerRef}></div>
    </div>
  );
};

export default AdsterraNativeBanner;

import { useEffect, useRef } from 'react';

const AdsterraBanner = () => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current || bannerRef.current.hasChildNodes()) return;

    const conf = document.createElement('script');
    conf.type = 'text/javascript';
    conf.text = `atOptions = {
      'key': 'e1e0069c2622f88d2f0012d48fcea419',
      'format': 'iframe',
      'height': 50,
      'width': 320,
      'params': {}
    };`;
    bannerRef.current.appendChild(conf);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.highperformanceformat.com/e1e0069c2622f88d2f0012d48fcea419/invoke.js';
    bannerRef.current.appendChild(script);

  }, []);

  return <div ref={bannerRef} className="flex justify-center my-4 w-full h-[50px] overflow-hidden"></div>;
};

export default AdsterraBanner;

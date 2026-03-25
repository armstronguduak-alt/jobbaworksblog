import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AdsterraPopunder = () => {
  const location = useLocation();

  useEffect(() => {
    const isDashboardOrAdmin = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');
    
    let scriptElement: HTMLScriptElement | null = null;

    if (!isDashboardOrAdmin) {
      if (!document.querySelector('script[src*="80a217de3a01219700b1cfd0468f3c37"]')) {
        const script = document.createElement('script');
        script.src = "https://pl28975655.profitablecpmratenetwork.com/80/a2/17/80a217de3a01219700b1cfd0468f3c37.js";
        script.id = 'adsterra-popunder';
        document.body.appendChild(script);
        scriptElement = script;
      } else {
        scriptElement = document.querySelector('script[src*="80a217de3a01219700b1cfd0468f3c37"]') as HTMLScriptElement;
      }
    }

    return () => {
      // If we navigate to dashboard/admin, clean up the script if it exists
      if (document.location.pathname.startsWith('/dashboard') || document.location.pathname.startsWith('/admin')) {
        const existingScript = document.getElementById('adsterra-popunder');
        if (existingScript) {
          existingScript.remove();
        }
      }
    };
  }, [location.pathname]);

  return null;
};

export default AdsterraPopunder;

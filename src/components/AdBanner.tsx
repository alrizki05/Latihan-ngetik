import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slot = '1234567890',
  format = 'auto',
  className = '',
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const isPushedRef = useRef(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && !isPushedRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isPushedRef.current = true;
      }
    } catch {
      // Gracefully catch ad blocker or script loading delays
    }
  }, []);

  return (
    <div
      className={`w-full max-w-4xl mx-auto my-3 p-2 bg-slate-950/60 border border-slate-850 rounded-xl flex flex-col items-center justify-center overflow-hidden min-h-[90px] ${className}`}
    >
      <span className="text-[10px] text-slate-600 uppercase tracking-widest mb-1 select-none">
        Iklan Sponsor
      </span>
      <div className="w-full flex justify-center items-center overflow-hidden">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '60px' }}
          data-ad-client="ca-pub-4565564262263981"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

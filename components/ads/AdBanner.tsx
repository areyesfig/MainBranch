"use client";

import { useEffect, useRef } from "react";
import { ADS_CONFIG, type AdFormat } from "@/lib/ads/config";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

interface AdBannerProps {
  slot: string;
  format?: AdFormat;
  className?: string;
}

export default function AdBanner({
  slot,
  format = "auto",
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!ADS_CONFIG.enabled || !slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense script not loaded
    }
  }, [slot]);

  if (!ADS_CONFIG.enabled || !slot) return null;

  return (
    <div className={`ad-container overflow-hidden text-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADS_CONFIG.pubId}
        data-ad-slot={slot}
        data-ad-format={format === "auto" ? "auto" : undefined}
        data-full-width-responsive={format !== "rectangle" ? "true" : undefined}
      />
    </div>
  );
}

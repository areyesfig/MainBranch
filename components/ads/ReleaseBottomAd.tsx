"use client";

import AdBanner from "./AdBanner";
import { AD_SLOTS } from "@/lib/ads/config";

export default function ReleaseBottomAd() {
  const slot = AD_SLOTS.releaseBottom;
  if (!slot.id) return null;

  return <AdBanner slot={slot.id} format="horizontal" />;
}

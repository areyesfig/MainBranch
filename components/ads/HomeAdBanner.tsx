"use client";

import AdBanner from "./AdBanner";
import { AD_SLOTS } from "@/lib/ads/config";

export default function HomeAdBanner() {
  const slot = AD_SLOTS.homeBanner;
  if (!slot.id) return null;

  return <AdBanner slot={slot.id} format="horizontal" />;
}

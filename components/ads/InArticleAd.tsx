"use client";

import AdBanner from "./AdBanner";
import { AD_SLOTS } from "@/lib/ads/config";

export default function InArticleAd() {
  const slot = AD_SLOTS.inArticle;
  if (!slot.id) return null;

  return <AdBanner slot={slot.id} format="auto" />;
}

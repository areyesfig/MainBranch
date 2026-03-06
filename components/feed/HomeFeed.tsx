"use client";

import { useState, useMemo, useEffect } from "react";
import type { ReleaseNote } from "@/types/release";
import CategoryChipBar from "@/components/layout/CategoryChipBar";
import SignalCard from "@/components/feed/SignalCard";
import ViewToggle from "@/components/feed/ViewToggle";
import TrendingItem from "@/components/feed/TrendingItem";
import { AlertTriangle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/formatTime";

type ViewMode = "signal" | "flow";

interface HomeFeedProps {
  releases: ReleaseNote[];
  trendingReleases: ReleaseNote[];
}

export default function HomeFeed({ releases, trendingReleases }: HomeFeedProps) {
  const [category, setCategory] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("signal");
  const [visibleCount, setVisibleCount] = useState(10);

  // Restore preferences from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem("mb-view-mode");
    if (savedView === "signal" || savedView === "flow") setViewMode(savedView);
  }, []);

  // Persist view mode
  useEffect(() => {
    localStorage.setItem("mb-view-mode", viewMode);
  }, [viewMode]);

  // Category counts
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: releases.length };
    for (const r of releases) {
      if (r.category) {
        map[r.category] = (map[r.category] ?? 0) + 1;
      }
    }
    return map;
  }, [releases]);

  // Filtered releases
  const filtered = useMemo(() => {
    if (category === "all") return releases;
    return releases.filter((r) => r.category === category);
  }, [releases, category]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Breaking changes for sidebar
  const breakingReleases = useMemo(
    () => releases.filter((r) => r.breakingChange).slice(0, 4),
    [releases]
  );

  return (
    <>
      {/* Category filter bar */}
      <CategoryChipBar
        activeCategory={category}
        onCategoryChange={(c) => { setCategory(c); setVisibleCount(10); }}
        counts={counts}
      />

      {/* Feed section */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Feed</h2>
              <Link
                href="/releases"
                className="text-sm font-medium text-[var(--color-brand)] transition-colors hover:text-[var(--color-brand-hover)]"
              >
                Ver todos →
              </Link>
            </div>
            <ViewToggle mode={viewMode} onChange={setViewMode} />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            {/* Main feed */}
            <div>
              {viewMode === "signal" ? (
                <div className="divide-y divide-[var(--color-border-subtle)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] overflow-hidden">
                  {visible.map((r) => (
                    <SignalCard key={r.id} release={r} mode="signal" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {visible.map((r) => (
                    <SignalCard key={r.id} release={r} mode="flow" />
                  ))}
                </div>
              )}

              {hasMore && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setVisibleCount((c) => c + 10)}
                    className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-5 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
                  >
                    Cargar más
                  </button>
                </div>
              )}

              {visible.length === 0 && (
                <p className="py-12 text-center text-sm text-[var(--color-text-tertiary)]">
                  No hay releases en esta categoría.
                </p>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6 hidden lg:block">
              {/* Trending */}
              {trendingReleases.length > 0 && (
                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-[var(--color-high-impact)]" />
                    <span className="overline text-[var(--color-text-secondary)]">TRENDING</span>
                  </div>
                  <div className="space-y-1">
                    {trendingReleases.map((r, i) => (
                      <TrendingItem key={r.id} release={r} rank={i + 1} />
                    ))}
                  </div>
                </div>
              )}

              {/* Breaking changes */}
              {breakingReleases.length > 0 && (
                <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-[var(--color-breaking)]" />
                    <span className="overline text-[var(--color-text-secondary)]">BREAKING CHANGES</span>
                  </div>
                  <div className="space-y-2">
                    {breakingReleases.map((r) => (
                      <Link
                        key={r.id}
                        href={`/releases/${r.id}`}
                        className="block rounded-[var(--radius-md)] px-2 py-1.5 -mx-2 transition-colors hover:bg-[var(--color-bg-secondary)]"
                      >
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                          {r.technology} v{r.version}
                        </p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">
                          {formatRelativeTime(r.releaseDate)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

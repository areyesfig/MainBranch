"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ArrowUpDown } from "lucide-react";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import SignalCard from "@/components/feed/SignalCard";
import ViewToggle from "@/components/feed/ViewToggle";
import CategoryChipBar from "@/components/layout/CategoryChipBar";
import { isPlaceholderVersion } from "@/lib/utils";
import type { ReleaseNote } from "@/types/release";

type ViewMode = "signal" | "flow";

function searchInReleases(releases: ReleaseNote[], query: string): ReleaseNote[] {
  if (!query.trim()) return releases;
  const lowerQuery = query.toLowerCase().trim();
  return releases.filter((release) => {
    const searchableText = [
      release.technology,
      release.version,
      release.tldr,
      release.description,
      release.category,
      ...(release.features || []),
      ...(release.breakingChanges || []),
      ...(release.tags || []),
    ]
      .join(" ")
      .toLowerCase();
    return searchableText.includes(lowerQuery);
  });
}

interface ReleasesClientProps {
  initialReleases: ReleaseNote[];
}

export default function ReleasesClient({ initialReleases }: ReleasesClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [category, setCategory] = useState<string>(
    () => searchParams.get("category") ?? "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "impact">("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("signal");
  const [visibleCount, setVisibleCount] = useState(20);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSelected, setCompareSelected] = useState<string[]>([]);

  // Restore view mode
  useEffect(() => {
    const saved = localStorage.getItem("mb-view-mode");
    if (saved === "signal" || saved === "flow") setViewMode(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("mb-view-mode", viewMode);
  }, [viewMode]);

  // Sync URL params
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  const releases = useMemo(
    () => initialReleases.filter((r) => !isPlaceholderVersion(r.version)),
    [initialReleases]
  );

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

  const filtered = useMemo(() => {
    let result = searchInReleases(releases, searchQuery);
    if (category !== "all") {
      result = result.filter((r) => r.category === category);
    }
    if (sortBy === "impact") {
      result = [...result].sort(
        (a, b) => (b.impactScore ?? 0) - (a.impactScore ?? 0)
      );
    }
    return result;
  }, [releases, category, searchQuery, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const listRef = useRef<HTMLDivElement>(null);

  const { activeIndex } = useKeyboardNavigation({
    itemCount: visible.length,
    onSelect: (index) => {
      const release = visible[index];
      if (release) router.push(`/releases/${release.id}`);
    },
  });

  // Scroll active card into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const cards = listRef.current.children;
      const card = cards[activeIndex] as HTMLElement | undefined;
      card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeIndex]);

  const handleCompareSelect = useCallback((id: string) => {
    setCompareSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  }, []);

  const handleCompareNavigate = useCallback(() => {
    if (compareSelected.length === 2) {
      router.push(`/releases/compare?a=${compareSelected[0]}&b=${compareSelected[1]}`);
    }
  }, [compareSelected, router]);

  return (
    <div className="animate-fade-in py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Releases
          </h1>
          <p className="mt-2 text-[var(--color-text-tertiary)]">
            Explora los últimos lanzamientos y actualizaciones
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tecnología, features, breaking changes..."
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] transition-colors focus:border-[var(--color-brand)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/20"
              aria-label="Buscar releases"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Category filter */}
        <CategoryChipBar
          activeCategory={category}
          onCategoryChange={(c) => {
            setCategory(c);
            setVisibleCount(20);
          }}
          counts={counts}
        />

        {/* Toolbar */}
        <div className="mt-6 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <p className="text-sm text-[var(--color-text-tertiary)]">
              {filtered.length} release{filtered.length !== 1 ? "s" : ""}
            </p>

            {/* Sort */}
            <div className="flex items-center gap-1 rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-0.5">
              <button
                onClick={() => setSortBy("recent")}
                className={`rounded-[var(--radius-sm)] px-3 py-1 text-xs font-medium transition-colors ${
                  sortBy === "recent"
                    ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                }`}
              >
                Recientes
              </button>
              <button
                onClick={() => setSortBy("impact")}
                className={`rounded-[var(--radius-sm)] px-3 py-1 text-xs font-medium transition-colors ${
                  sortBy === "impact"
                    ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                }`}
              >
                Impact
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCompareMode((prev) => {
                  if (prev) setCompareSelected([]);
                  return !prev;
                });
              }}
              className={`rounded-[var(--radius-md)] px-3 py-1.5 text-xs font-medium transition-colors ${
                compareMode
                  ? "bg-[var(--color-brand)] text-white"
                  : "border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
              }`}
            >
              {compareMode ? "Cancelar" : "Comparar"}
            </button>
            <ViewToggle mode={viewMode} onChange={setViewMode} />
          </div>
        </div>

        {/* Release list */}
        {viewMode === "signal" ? (
          <div ref={listRef} className="divide-y divide-[var(--color-border-subtle)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] overflow-hidden">
            {visible.map((r, i) => (
              <SignalCard key={r.id} release={r} mode="signal" index={i} isActive={i === activeIndex} />
            ))}
          </div>
        ) : (
          <div ref={listRef} className="space-y-4">
            {visible.map((r, i) => (
              <SignalCard key={r.id} release={r} mode="flow" index={i} isActive={i === activeIndex} />
            ))}
          </div>
        )}

        {visible.length === 0 && (
          <p className="py-12 text-center text-sm text-[var(--color-text-tertiary)]">
            No se encontraron releases para este filtro.
          </p>
        )}

        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setVisibleCount((c) => c + 20)}
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-5 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
            >
              Cargar más
            </button>
          </div>
        )}

        {/* Compare floating bar */}
        {compareMode && compareSelected.length > 0 && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] px-6 py-3 shadow-[var(--shadow-lg)]">
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--color-text-tertiary)]">
                {compareSelected.length}/2 seleccionados
              </span>
              <button
                onClick={handleCompareNavigate}
                disabled={compareSelected.length < 2}
                className="rounded-[var(--radius-md)] bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-brand-hover)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Comparar
              </button>
              <button
                onClick={() => setCompareSelected([])}
                className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
              >
                Limpiar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

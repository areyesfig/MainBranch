"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ReleaseCard from "@/components/news/ReleaseCard";
import CategoryFilter from "@/components/news/CategoryFilter";
import StackFilter from "@/components/news/StackFilter";
import SearchBar from "@/components/news/SearchBar";
import { getUniqueStacks, getUniqueCategories } from "@/lib/mockData";
import { getCategoryLabel } from "@/lib/categories";
import { getStackLabel } from "@/lib/stackLabels";
import { isPlaceholderVersion } from "@/lib/utils";
import type { ReleaseNote } from "@/types/release";

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

export default function ReleasesClient({
  initialReleases,
}: ReleasesClientProps) {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    () => searchParams.get("category")
  );
  const [selectedStack, setSelectedStack] = useState<string | null>(
    () => searchParams.get("stack")
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "impact">("recent");
  const [releases] = useState(initialReleases);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSelected, setCompareSelected] = useState<string[]>([]);
  const router = useRouter();
  const stacks = getUniqueStacks(releases);
  const categories = getUniqueCategories(releases);

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

  const toggleCompareMode = useCallback(() => {
    setCompareMode((prev) => {
      if (prev) setCompareSelected([]);
      return !prev;
    });
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    const stack = searchParams.get("stack");
    if (category) queueMicrotask(() => setSelectedCategory(category));
    if (stack) queueMicrotask(() => setSelectedStack(stack));
  }, [searchParams]);

  const filteredReleases = useMemo(() => {
    let result = searchInReleases(releases, searchQuery);
    result = result.filter((r) => !isPlaceholderVersion(r.version));
    if (selectedCategory) {
      result = result.filter((r) => r.category === selectedCategory);
    }
    if (selectedStack) {
      result = result.filter((r) => r.stack === selectedStack);
    }
    if (sortBy === "impact") {
      result = [...result].sort(
        (a, b) => (b.impactScore ?? 0) - (a.impactScore ?? 0)
      );
    }
    return result;
  }, [releases, selectedCategory, selectedStack, searchQuery, sortBy]);

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Lanzamientos Tecnológicos
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Explora los últimos lanzamientos y actualizaciones de las tecnologías más importantes
            </p>
          </div>
          <button
            onClick={toggleCompareMode}
            className={`mt-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              compareMode
                ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                : "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            {compareMode ? "Cancelar comparación" : "Comparar releases"}
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar onSearch={setSearchQuery} placeholder="Buscar por tecnología, IA, características, breaking changes..." />
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Stack Filter */}
        <div className="mb-8">
          <StackFilter
            stacks={stacks}
            selectedStack={selectedStack}
            onStackChange={setSelectedStack}
          />
        </div>

        {/* Sort + Results Count */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {filteredReleases.length} lanzamiento{filteredReleases.length !== 1 ? "s" : ""}
            {selectedCategory && ` • categoría ${getCategoryLabel(selectedCategory)}`}
            {selectedStack && ` • ${getStackLabel(selectedStack)}`}
            {searchQuery && ` • búsqueda: "${searchQuery}"`}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Ordenar:</span>
            <button
              onClick={() => setSortBy("recent")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                sortBy === "recent"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              Más recientes
            </button>
            <button
              onClick={() => setSortBy("impact")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                sortBy === "impact"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              Mayor impacto
            </button>
          </div>
        </div>

        {/* Releases Grid */}
        {filteredReleases.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReleases.map((release) => (
              <ReleaseCard
                key={release.id}
                release={release}
                compareMode={compareMode}
                isSelected={compareSelected.includes(release.id)}
                onCompareSelect={handleCompareSelect}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No se encontraron lanzamientos para este filtro.
            </p>
          </div>
        )}

        {/* Barra flotante de comparación */}
        {compareMode && compareSelected.length > 0 && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-gray-200 bg-white px-6 py-3 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {compareSelected.length}/2 seleccionados
              </span>
              <button
                onClick={handleCompareNavigate}
                disabled={compareSelected.length < 2}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Comparar
              </button>
              <button
                onClick={() => setCompareSelected([])}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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

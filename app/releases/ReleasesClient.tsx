"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  const [releases] = useState(initialReleases);
  const stacks = getUniqueStacks(releases);
  const categories = getUniqueCategories(releases);

  useEffect(() => {
    const category = searchParams.get("category");
    const stack = searchParams.get("stack");
    if (category) setSelectedCategory(category);
    if (stack) setSelectedStack(stack);
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
    return result;
  }, [releases, selectedCategory, selectedStack, searchQuery]);

  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
            Lanzamientos Tecnológicos
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Explora los últimos lanzamientos y actualizaciones de las tecnologías más importantes
          </p>
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

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mostrando {filteredReleases.length} lanzamiento{filteredReleases.length !== 1 ? "s" : ""}
            {selectedCategory && ` • categoría ${getCategoryLabel(selectedCategory)}`}
            {selectedStack && ` • ${getStackLabel(selectedStack)}`}
            {searchQuery && ` • búsqueda: "${searchQuery}"`}
          </p>
        </div>

        {/* Releases Grid */}
        {filteredReleases.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReleases.map((release) => (
              <ReleaseCard key={release.id} release={release} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No se encontraron lanzamientos para este filtro.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

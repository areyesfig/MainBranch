"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

interface ReleaseOption {
  id: string;
  technology: string;
  version: string;
  releaseDate: string;
}

interface CompareSelectorProps {
  currentA?: string;
  currentB?: string;
}

export default function CompareSelector({ currentA, currentB }: CompareSelectorProps) {
  const router = useRouter();
  const [releases, setReleases] = useState<ReleaseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedA, setSelectedA] = useState(currentA ?? "");
  const [selectedB, setSelectedB] = useState(currentB ?? "");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchReleases() {
      try {
        const res = await fetch("/api/releases/search?limit=100");
        const data = await res.json();
        setReleases(
          data.items.map((r: ReleaseOption) => ({
            id: r.id,
            technology: r.technology,
            version: r.version,
            releaseDate: r.releaseDate,
          }))
        );
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchReleases();
  }, []);

  const grouped = useMemo(() => {
    const filtered = search
      ? releases.filter(
          (r) =>
            r.technology.toLowerCase().includes(search.toLowerCase()) ||
            r.version.toLowerCase().includes(search.toLowerCase())
        )
      : releases;

    const groups: Record<string, ReleaseOption[]> = {};
    for (const r of filtered) {
      if (!groups[r.technology]) groups[r.technology] = [];
      groups[r.technology].push(r);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [releases, search]);

  function handleCompare() {
    if (selectedA && selectedB && selectedA !== selectedB) {
      router.push(`/releases/compare?a=${selectedA}&b=${selectedB}`);
    }
  }

  const canCompare = selectedA && selectedB && selectedA !== selectedB;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
        Cambiar releases
      </h3>

      <input
        type="text"
        placeholder="Buscar tecnología o versión..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Release A
          </label>
          <select
            value={selectedA}
            onChange={(e) => setSelectedA(e.target.value)}
            disabled={loading}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Seleccionar...</option>
            {grouped.map(([tech, items]) => (
              <optgroup key={tech} label={tech}>
                {items.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.technology} v{r.version}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
            Release B
          </label>
          <select
            value={selectedB}
            onChange={(e) => setSelectedB(e.target.value)}
            disabled={loading}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Seleccionar...</option>
            {grouped.map(([tech, items]) => (
              <optgroup key={tech} label={tech}>
                {items.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.technology} v{r.version}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {selectedA === selectedB && selectedA !== "" && (
        <p className="mt-2 text-xs text-red-500">Selecciona dos releases distintos</p>
      )}

      <button
        onClick={handleCompare}
        disabled={!canCompare}
        className="mt-3 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Comparar
      </button>
    </div>
  );
}

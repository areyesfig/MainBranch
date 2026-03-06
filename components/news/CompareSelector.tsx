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
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] p-4">
      <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">
        Cambiar releases
      </h3>

      <input
        type="text"
        placeholder="Buscar tecnología o versión..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3 w-full rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--color-text-tertiary)]">
            Release A
          </label>
          <select
            value={selectedA}
            onChange={(e) => setSelectedA(e.target.value)}
            disabled={loading}
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
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
          <label className="mb-1 block text-xs font-medium text-[var(--color-text-tertiary)]">
            Release B
          </label>
          <select
            value={selectedB}
            onChange={(e) => setSelectedB(e.target.value)}
            disabled={loading}
            className="w-full rounded-[var(--radius-md)] border border-[var(--color-border-default)] bg-[var(--color-bg-primary)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
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
        className="mt-3 w-full rounded-[var(--radius-md)] bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Comparar
      </button>
    </div>
  );
}

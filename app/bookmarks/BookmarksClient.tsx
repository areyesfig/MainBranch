"use client";

import { useMemo } from "react";
import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/contexts/BookmarkContext";
import SignalCard from "@/components/feed/SignalCard";
import type { ReleaseNote } from "@/types/release";

interface BookmarksClientProps {
  allReleases: ReleaseNote[];
}

export default function BookmarksClient({ allReleases }: BookmarksClientProps) {
  const { bookmarks } = useBookmarks();

  const saved = useMemo(() => {
    const set = new Set(bookmarks);
    return allReleases.filter((r) => set.has(r.id));
  }, [allReleases, bookmarks]);

  return (
    <div className="animate-fade-in py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <Bookmark className="h-5 w-5 text-[var(--color-brand)]" />
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            Guardados
          </h1>
          {saved.length > 0 && (
            <span className="rounded-full bg-[var(--color-bg-secondary)] px-2.5 py-0.5 text-xs font-medium text-[var(--color-text-tertiary)]">
              {saved.length}
            </span>
          )}
        </div>

        {saved.length > 0 ? (
          <div className="divide-y divide-[var(--color-border-subtle)] rounded-[var(--radius-lg)] border border-[var(--color-border-default)] overflow-hidden">
            {saved.map((r) => (
              <SignalCard key={r.id} release={r} mode="signal" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bookmark className="h-10 w-10 text-[var(--color-text-tertiary)] mb-4" />
            <p className="text-lg font-medium text-[var(--color-text-secondary)]">
              No tienes releases guardados
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">
              Haz clic en el icono de bookmark en cualquier release para guardarlo aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

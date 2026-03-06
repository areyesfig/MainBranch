"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Zap, FileText, Bookmark, Home, Clock } from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  href: string;
  icon: React.ReactNode;
  group: string;
}

const STATIC_COMMANDS: CommandItem[] = [
  { id: "home", label: "Inicio", href: "/", icon: <Home className="h-4 w-4" />, group: "Navegación" },
  { id: "releases", label: "Releases", href: "/releases", icon: <Zap className="h-4 w-4" />, group: "Navegación" },
  { id: "tech", label: "Tecnologías", href: "/tech", icon: <FileText className="h-4 w-4" />, group: "Navegación" },
  { id: "noticias", label: "Noticias", href: "/noticias", icon: <FileText className="h-4 w-4" />, group: "Navegación" },
  { id: "timeline", label: "Timeline", href: "/timeline", icon: <Clock className="h-4 w-4" />, group: "Navegación" },
  { id: "bookmarks", label: "Guardados", href: "/bookmarks", icon: <Bookmark className="h-4 w-4" />, group: "Navegación" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [releases, setReleases] = useState<CommandItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Pre-fetch releases on mount
  useEffect(() => {
    fetch("/api/releases/search-index")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: { id: string; technology: string; version: string; category?: string }[]) => {
        setReleases(
          data.slice(0, 200).map((r) => ({
            id: r.id,
            label: `${r.technology} v${r.version}`,
            description: r.category?.toUpperCase(),
            href: `/releases/${r.id}`,
            icon: <Zap className="h-4 w-4" />,
            group: "Releases",
          }))
        );
      })
      .catch(() => {});
  }, []);

  // Keyboard shortcut to open
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Filter items
  const filtered = useCallback(() => {
    const q = query.toLowerCase().trim();
    const all = [...STATIC_COMMANDS, ...releases];
    if (!q) return STATIC_COMMANDS;
    return all.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        (item.description?.toLowerCase().includes(q) ?? false)
    );
  }, [query, releases])();

  // Navigate
  const handleSelect = useCallback(
    (item: CommandItem) => {
      setOpen(false);
      router.push(item.href);
    },
    [router]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter" && filtered[activeIndex]) {
        e.preventDefault();
        handleSelect(filtered[activeIndex]);
      }
    },
    [filtered, activeIndex, handleSelect]
  );

  // Reset active index on query change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Paleta de comandos">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Dialog */}
      <div className="relative mx-auto mt-[15vh] max-w-lg px-4">
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-elevated)] shadow-2xl">
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-[var(--color-border-subtle)] px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-[var(--color-text-tertiary)]" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar releases, páginas..."
              className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-tertiary)] outline-none"
              role="combobox"
              aria-expanded="true"
              aria-controls="command-palette-list"
              aria-activedescendant={filtered[activeIndex] ? `cmd-option-${filtered[activeIndex].id}` : undefined}
              aria-autocomplete="list"
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-tertiary)]">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div id="command-palette-list" role="listbox" className="max-h-[320px] overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-[var(--color-text-tertiary)]">
                Sin resultados para &ldquo;{query}&rdquo;
              </p>
            ) : (
              filtered.map((item, i) => (
                <button
                  key={item.id}
                  id={`cmd-option-${item.id}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                    i === activeIndex
                      ? "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)]"
                  }`}
                >
                  <span className="shrink-0 text-[var(--color-text-tertiary)]">
                    {item.icon}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate font-medium">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="block truncate text-xs text-[var(--color-text-tertiary)]">
                        {item.description}
                      </span>
                    )}
                  </span>
                  {i === activeIndex && (
                    <ArrowRight className="h-3 w-3 shrink-0 text-[var(--color-text-tertiary)]" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 border-t border-[var(--color-border-subtle)] px-4 py-2 text-[10px] text-[var(--color-text-tertiary)]">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-[var(--color-bg-tertiary)] px-1 py-0.5">↑↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-[var(--color-bg-tertiary)] px-1 py-0.5">↵</kbd>
              seleccionar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-[var(--color-bg-tertiary)] px-1 py-0.5">esc</kbd>
              cerrar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

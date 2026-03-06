"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Bookmark, Search } from "lucide-react";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useBookmarks } from "@/contexts/BookmarkContext";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/releases", label: "Releases" },
  { href: "/tech", label: "Tech" },
  { href: "/noticias", label: "Noticias" },
  { href: "/timeline", label: "Timeline" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useBookmarks();

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--color-border-default)] bg-[var(--color-bg-primary)]/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-bold tracking-tight text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-text-secondary)]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-text-primary)] text-xs font-bold text-[var(--color-text-inverse)]">
              MB
            </span>
            <span className="hidden sm:inline">Main Branch</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-[var(--radius-md)] px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Cmd+K trigger */}
            <button
              onClick={() => {
                window.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true })
                );
              }}
              className="hidden sm:inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-default)] px-2.5 py-1 text-xs text-[var(--color-text-tertiary)] transition-colors hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-secondary)]"
              aria-label="Buscar (⌘K)"
            >
              <Search className="h-3 w-3" />
              <span>Buscar</span>
              <kbd className="rounded bg-[var(--color-bg-tertiary)] px-1 py-0.5 text-[10px]">⌘K</kbd>
            </button>

            <Link
              href="/bookmarks"
              className="relative inline-flex items-center justify-center rounded-[var(--radius-md)] p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
              aria-label="Guardados"
            >
              <Bookmark className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-brand)] text-[9px] font-bold text-white">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
            <ThemeToggle />

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-[var(--radius-md)] p-2 text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] md:hidden"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-[var(--color-border-subtle)] pb-3 pt-2 md:hidden">
            <div className="space-y-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

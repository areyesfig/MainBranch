"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

const STORAGE_KEY = "mb-bookmarks";

interface BookmarkContextType {
  bookmarks: string[];
  toggle: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  count: number;
}

const BookmarkContext = createContext<BookmarkContextType | null>(null);

function loadBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // quota exceeded — silently ignore
  }
}

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setBookmarks(loadBookmarks());
      setMounted(true);
    });
  }, []);

  const toggle = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      saveBookmarks(next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (id: string) => {
      if (!mounted) return false;
      return bookmarks.includes(id);
    },
    [bookmarks, mounted]
  );

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks: mounted ? bookmarks : [],
        toggle,
        isBookmarked,
        count: mounted ? bookmarks.length : 0,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks debe usarse dentro de BookmarkProvider");
  }
  return context;
}

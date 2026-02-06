"use client";

import { Search } from "lucide-react";
import { useState, useCallback } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

/**
 * Componente de búsqueda avanzada por características, breaking changes, etc.
 */
export default function SearchBar({
  onSearch,
  placeholder = "Buscar por tecnología, características, breaking changes...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(query);
    },
    [query, onSearch]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
    },
    [onSearch]
  );

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-400"
          aria-label="Buscar releases"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onSearch("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            Limpiar
          </button>
        )}
      </div>
    </form>
  );
}

"use client";

import { Layers } from "lucide-react";
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/categories";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

/**
 * Componente para filtrar por categoría ampliada
 */
export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const displayCategories = categories.length
    ? categories
    : (CATEGORY_IDS as string[]);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center gap-2">
        <Layers className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filtrar por Categoría
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            selectedCategory === null
              ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Todas
        </button>
        {displayCategories.map((categoryId) => {
          const category = CATEGORIES[categoryId as CategoryId];
          const label = category?.label ?? categoryId;
          return (
            <button
              key={categoryId}
              onClick={() => onCategoryChange(categoryId)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === categoryId
                  ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

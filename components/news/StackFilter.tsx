"use client";

import { Filter } from "lucide-react";
import { getStackLabel } from "@/lib/stackLabels";

interface StackFilterProps {
  stacks: string[];
  selectedStack: string | null;
  onStackChange: (stack: string | null) => void;
}

/**
 * Componente para filtrar por stack tecnológico
 */
export default function StackFilter({
  stacks,
  selectedStack,
  onStackChange,
}: StackFilterProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filtrar por Stack
        </h3>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por stack tecnológico">
        <button
          onClick={() => onStackChange(null)}
          aria-pressed={selectedStack === null}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            selectedStack === null
              ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Todos
        </button>
        {stacks.map((stack) => (
          <button
            key={stack}
            onClick={() => onStackChange(stack)}
            aria-pressed={selectedStack === stack}
            aria-label={`Filtrar por ${getStackLabel(stack)}`}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              selectedStack === stack
                ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {getStackLabel(stack)}
          </button>
        ))}
      </div>
    </div>
  );
}

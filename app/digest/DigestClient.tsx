"use client";

import { useState } from "react";
import type { Digest } from "@/types/digest";
import { useNotificationPreferences } from "@/contexts/NotificationContext";
import DigestCard from "@/components/news/DigestCard";

interface DigestClientProps {
  digests: Digest[];
}

export default function DigestClient({ digests }: DigestClientProps) {
  const [activeTab, setActiveTab] = useState<"all" | "weekly" | "monthly">("all");
  const [myStackOnly, setMyStackOnly] = useState(false);
  const { selectedStacks } = useNotificationPreferences();

  const filtered = digests.filter((d) => {
    if (activeTab !== "all" && d.period !== activeTab) return false;
    if (myStackOnly && selectedStacks.length > 0) {
      return d.technologies.some((t) =>
        selectedStacks.some(
          (s) => t.toLowerCase().includes(s.toLowerCase())
        )
      );
    }
    return true;
  });

  return (
    <div>
      {/* Filtros */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
          {(["all", "weekly", "monthly"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              } ${tab === "all" ? "rounded-l-lg" : ""} ${tab === "monthly" ? "rounded-r-lg" : ""}`}
            >
              {tab === "all" ? "Todos" : tab === "weekly" ? "Semanal" : "Mensual"}
            </button>
          ))}
        </div>

        {selectedStacks.length > 0 && (
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={myStackOnly}
              onChange={(e) => setMyStackOnly(e.target.checked)}
              className="rounded border-gray-300"
            />
            Mi Stack ({selectedStacks.length})
          </label>
        )}
      </div>

      {/* Lista de digests */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-500 dark:text-gray-400">
            {digests.length === 0
              ? "No hay digests disponibles aún. Se generarán automáticamente cada semana."
              : "No se encontraron digests con los filtros seleccionados."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((digest) => (
            <DigestCard key={digest.id} digest={digest} />
          ))}
        </div>
      )}
    </div>
  );
}

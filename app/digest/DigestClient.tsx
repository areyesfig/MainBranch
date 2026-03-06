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
        <div className="flex rounded-[var(--radius-lg)] border border-[var(--color-border-default)]">
          {(["all", "weekly", "monthly"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-[var(--color-brand)] text-white"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
              } ${tab === "all" ? "rounded-l-[var(--radius-lg)]" : ""} ${tab === "monthly" ? "rounded-r-[var(--radius-lg)]" : ""}`}
            >
              {tab === "all" ? "Todos" : tab === "weekly" ? "Semanal" : "Mensual"}
            </button>
          ))}
        </div>

        {selectedStacks.length > 0 && (
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={myStackOnly}
              onChange={(e) => setMyStackOnly(e.target.checked)}
              className="rounded border-[var(--color-border-default)]"
            />
            Mi Stack ({selectedStacks.length})
          </label>
        )}
      </div>

      {/* Lista de digests */}
      {filtered.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] p-12 text-center">
          <p className="text-[var(--color-text-tertiary)]">
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

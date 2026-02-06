"use client";

import { Bell } from "lucide-react";
import { useNotificationPreferences } from "@/contexts/NotificationContext";
import { getUniqueStacks } from "@/lib/mockData";
import { getStackLabel } from "@/lib/stackLabels";

interface NotificationPreferencesProps {
  variant?: "inline" | "modal";
  onClose?: () => void;
}

/**
 * Componente para seleccionar stacks para notificaciones personalizadas
 */
export default function NotificationPreferences({
  variant = "inline",
  onClose,
}: NotificationPreferencesProps) {
  const { selectedStacks, toggleStack } = useNotificationPreferences();
  const availableStacks = getUniqueStacks();

  return (
    <div
      className={
        variant === "modal"
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          : ""
      }
    >
      <div
        className={`rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900 ${
          variant === "modal" ? "max-w-md w-full" : ""
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notificaciones Personalizadas
            </h3>
          </div>
          {variant === "modal" && onClose && (
            <button
              onClick={onClose}
              className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              aria-label="Cerrar"
            >
              ✕
            </button>
          )}
        </div>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Selecciona los stacks tecnológicos sobre los que quieres recibir
          notificaciones de nuevos lanzamientos.
        </p>

        <div className="flex flex-wrap gap-2">
          {availableStacks.map((stack) => {
            const isSelected = selectedStacks.includes(stack);
            return (
              <button
                key={stack}
                onClick={() => toggleStack(stack)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {getStackLabel(stack)}
              </button>
            );
          })}
        </div>

        {selectedStacks.length > 0 && (
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            {selectedStacks.length} stack{selectedStacks.length !== 1 ? "s" : ""}{" "}
            seleccionado{selectedStacks.length !== 1 ? "s" : ""}. Recibirás
            notificaciones de lanzamientos de estas tecnologías.
          </p>
        )}
      </div>
    </div>
  );
}

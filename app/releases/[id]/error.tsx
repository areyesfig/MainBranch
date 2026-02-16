"use client";

import Link from "next/link";

export default function ReleaseDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        Error al cargar el release
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        No se pudo obtener la informacion de este lanzamiento.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Reintentar
        </button>
        <Link
          href="/releases"
          className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Ver todos los lanzamientos
        </Link>
      </div>
    </div>
  );
}

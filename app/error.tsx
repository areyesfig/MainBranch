"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        Algo salio mal
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Ocurrio un error inesperado. Intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Reintentar
      </button>
    </div>
  );
}

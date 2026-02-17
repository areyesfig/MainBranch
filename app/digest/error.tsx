"use client";

export default function DigestError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
        <h2 className="mb-2 text-xl font-bold text-red-800 dark:text-red-200">
          Error al cargar digests
        </h2>
        <p className="mb-4 text-red-600 dark:text-red-300">
          Ocurrió un error al cargar los digests. Por favor intenta nuevamente.
        </p>
        <button
          onClick={reset}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    </main>
  );
}

export default function DigestLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-2 h-5 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="mb-4 flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-6 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="mb-3 flex gap-1">
              {Array.from({ length: 3 }).map((_, j) => (
                <div
                  key={j}
                  className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700"
                />
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

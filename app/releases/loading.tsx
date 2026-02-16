export default function ReleasesLoading() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="mb-3 h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="mb-2 h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

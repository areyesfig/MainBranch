export default function TimelineLoading() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mb-8">
          <div className="mb-2 h-8 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-5 w-80 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 w-4 shrink-0 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700" />
              <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-2 h-5 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

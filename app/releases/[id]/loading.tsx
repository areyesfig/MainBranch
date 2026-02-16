export default function ReleaseDetailLoading() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-8 w-20 animate-pulse rounded bg-blue-100 dark:bg-blue-900" />
          </div>
          <div className="h-5 w-56 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

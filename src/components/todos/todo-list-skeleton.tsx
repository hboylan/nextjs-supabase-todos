export default function TodoListSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading todos">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse"
        >
          <div className="flex items-center gap-4 flex-grow">
            <div className="h-5 w-5 rounded-sm bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
            <div className="space-y-2 flex-grow">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
          </div>
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0" />
        </div>
      ))}
    </div>
  );
} 
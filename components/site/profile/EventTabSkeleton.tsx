export default function EventTabSkeleton() {
  const skeletonItems = Array.from({ length: 4 });

  return (
    <div className="h-full overflow-y-auto space-y-4 pr-1 scrollbar-thumb-grey-200 scrollbar-track-transparent scrollbar-none">
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2" />
      <div className="space-y-3">
        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-border rounded-lg bg-grey-50"
          >
            <div className="flex gap-4 items-center min-w-0">
              <div className="w-24 h-16 bg-gray-200 rounded-md shrink-0 animate-pulse" />

              <div className="min-w-0 space-y-2">
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="shrink-0 self-start sm:self-auto">
              <div className="h-8 w-28 bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

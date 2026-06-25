export default function EndorsementTabSkeleton() {
  const skeletonItems = Array.from({ length: 3 });

  return (
    <div className="h-full overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-grey-200 scrollbar-track-transparent">
      {skeletonItems.map((_, index) => (
        <div key={index} className="pb-6 last:border-0 last:pb-0">
          <div className="flex justify-between items-start mb-3 gap-4">
            <div className="flex gap-3 items-center min-w-0 w-full">
              <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse shrink-0" />
              <div className="min-w-0 space-y-2">
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse shrink-0" />
          </div>
          <hr className="text-border mb-3" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="mt-3 h-2 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

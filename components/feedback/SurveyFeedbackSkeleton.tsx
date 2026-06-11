export default function SurveyFeedbackSkeleton() {
  return (
    <div className="w-full space-y-6">
      <div className="h-10 w-full rounded-xl bg-gray-100 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-4 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-5 w-16 rounded bg-gray-100 animate-pulse" />
              <div className="h-5 w-5 rounded bg-gray-100 animate-pulse" />
            </div>
            <div className="h-5 w-20 rounded-full bg-gray-100 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-100 animate-pulse" />
              <div className="h-3 w-1/2 rounded bg-gray-100 animate-pulse" />
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <div className="space-y-1">
                <div className="h-6 w-8 rounded bg-gray-100 animate-pulse" />
                <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
            <div className="h-9 w-full rounded-lg bg-gray-100 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 pt-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 w-8 rounded bg-gray-100 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

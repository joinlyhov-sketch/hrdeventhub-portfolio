export default function SurveyListSkeleton() {
  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end mb-6">
        <div className="h-10 w-36 rounded-lg bg-gray-100 animate-pulse" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6 border-l-4 border-l-blue-200 space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div
                className="h-4 rounded bg-gray-100 animate-pulse"
                style={{ width: 200 + ((i * 37) % 120) }}
              />
              <div className="h-3 w-48 rounded bg-gray-100 animate-pulse" />
            </div>
            <div className="flex gap-2 shrink-0 ml-4">
              <div className="w-8 h-8 rounded bg-gray-100 animate-pulse" />
              <div className="w-8 h-8 rounded bg-gray-100 animate-pulse" />
              <div className="w-8 h-8 rounded bg-gray-100 animate-pulse" />
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-32 rounded bg-gray-100 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

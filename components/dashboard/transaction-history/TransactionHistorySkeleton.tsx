export default function TransactionHistorySkeleton() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="h-5 w-40 rounded bg-gray-100 animate-pulse" />
          <div className="h-9 w-36 rounded-xl bg-gray-100 animate-pulse" />
        </div>
        <div className="grid grid-cols-5 px-2">
          {[120, 80, 100, 90, 60].map((w, i) => (
            <div key={i} className="py-2 px-1">
              <div
                className="h-3 rounded bg-gray-100 animate-pulse"
                style={{ width: w }}
              />
            </div>
          ))}
        </div>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 px-2 h-12 items-center border-b border-gray-50 last:border-0"
          >
            <div className="px-1">
              <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
            </div>
            <div className="px-1">
              <div
                className="h-3 rounded bg-gray-100 animate-pulse"
                style={{ width: 60 + ((i * 11) % 40) }}
              />
            </div>
            <div className="px-1">
              <div
                className="h-3 rounded bg-gray-100 animate-pulse"
                style={{ width: 70 + ((i * 7) % 30) }}
              />
            </div>
            <div className="px-1">
              <div className="h-5 w-16 rounded-full bg-gray-100 animate-pulse" />
            </div>
            <div className="px-1">
              <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="h-5 w-32 rounded bg-gray-100 animate-pulse pb-4 border-b border-gray-100" />
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-100 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div
                className="h-3 rounded bg-gray-100 animate-pulse"
                style={{ width: 100 + ((i * 13) % 50) }}
              />
              <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

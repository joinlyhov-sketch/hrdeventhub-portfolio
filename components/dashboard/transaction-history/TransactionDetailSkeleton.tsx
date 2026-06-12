export default function TransactionDetailSkeleton() {
  return (
    <div className="w-full px-6 py-2 space-y-6 flex flex-col flex-1 min-w-0 pr-8 lg:pr-12 lg:pl-12 max-w-420 m-auto">
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-lg bg-gray-100 animate-pulse" />
        <div className="h-4 w-40 rounded bg-gray-100 animate-pulse" />
      </div>
      <div className="h-64 w-full rounded-2xl bg-gray-100 animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4"
          >
            <div className="h-5 w-36 rounded bg-gray-100 animate-pulse border-b border-gray-100 pb-4" />
            {[...Array(5)].map((_, j) => (
              <div key={j} className="flex justify-between items-center">
                <div className="h-3 w-28 rounded bg-gray-100 animate-pulse" />
                <div
                  className="h-3 rounded bg-gray-100 animate-pulse"
                  style={{ width: 80 + ((j * 17) % 50) }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

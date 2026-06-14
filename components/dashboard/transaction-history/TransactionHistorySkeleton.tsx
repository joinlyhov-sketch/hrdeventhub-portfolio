const headerWidths = ["w-24", "w-28", "w-20", "w-24", "w-20", "w-16"];
const rowNameWidths = ["w-14", "w-16", "w-12", "w-16", "w-14", "w-12", "w-16", "w-14"];
const sidebarTitleWidths = ["w-3/5", "w-2/3", "w-3/4", "w-1/2", "w-3/5"];

export default function TransactionHistorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
          >
            <div className="flex flex-col items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                <div className="h-7 w-20 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="h-5 w-40 rounded bg-gray-100 animate-pulse" />
            <div className="h-9 w-36 rounded-xl bg-gray-100 animate-pulse" />
          </div>
          <div className="grid grid-cols-6 px-2">
            {headerWidths.map((w, i) => (
              <div key={i} className="py-2 px-1">
                <div className={`h-3 rounded bg-gray-100 animate-pulse ${w}`} />
              </div>
            ))}
          </div>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 px-2 h-12 items-center border-b border-gray-50 last:border-0"
            >
              <div className="px-1">
                <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
              </div>
              <div className="px-1 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-100 animate-pulse shrink-0" />
                <div className={`h-3 rounded bg-gray-100 animate-pulse ${rowNameWidths[i % rowNameWidths.length]}`} />
              </div>
              <div className="px-1">
                <div className="h-3 w-12 rounded bg-gray-100 animate-pulse" />
              </div>
              <div className="px-1">
                <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
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
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="h-5 w-24 rounded bg-gray-100 animate-pulse" />
            <div className="h-7 w-20 rounded-lg bg-gray-100 animate-pulse" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 p-3 rounded-xl border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
                <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
              </div>
              <div className={`h-4 rounded bg-gray-100 animate-pulse ${sidebarTitleWidths[i % sidebarTitleWidths.length]}`} />
              <div className="flex items-center justify-between">
                <div className="h-5 w-20 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-4 w-12 rounded bg-gray-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

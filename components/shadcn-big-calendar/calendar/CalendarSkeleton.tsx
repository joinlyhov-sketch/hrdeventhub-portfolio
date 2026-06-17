const upcomingWidths = ["w-32", "w-44", "w-28", "w-36"];

export default function CalendarSkeleton() {
  return (
    <div className="w-full space-y-6">
      <div className="w-full">
        <div className="mb-3 border border-gray-200 rounded-xl p-2.5 space-y-2 md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-xl bg-gray-100 animate-pulse border border-gray-200 shrink-0" />
            <div className="h-11 flex-1 rounded-xl bg-gray-100 animate-pulse border border-gray-200" />
            <div className="w-11 h-11 rounded-xl bg-gray-100 animate-pulse border border-gray-200 shrink-0" />
          </div>
          <div className="h-11 w-full rounded-xl bg-gray-100 animate-pulse border border-gray-200" />
        </div>

        <div className="hidden md:flex items-center justify-between py-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-100 animate-pulse border border-gray-200" />
            <div className="h-12 min-w-46 rounded-xl bg-gray-100 animate-pulse border border-gray-200" />
            <div className="w-12 h-12 rounded-xl bg-gray-100 animate-pulse border border-gray-200" />
          </div>
          <div className="h-12 w-75 rounded-xl bg-gray-100 animate-pulse border border-gray-200" />
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-200">
          <div className="grid grid-cols-7 h-12 bg-[#1a2744]">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
              <div key={d} className="flex items-center justify-center">
                <div className="h-3 w-8 rounded bg-white/15 animate-pulse" />
              </div>
            ))}
          </div>
          {[...Array(6)].map((_, row) => (
            <div key={row} className="grid grid-cols-7 border-t border-gray-100">
              {[...Array(7)].map((_, col) => (
                <div
                  key={col}
                  className="h-20 md:h-28 px-2 pt-2 border-r border-gray-100 last:border-r-0 flex flex-col gap-2"
                >
                  <div className="h-3 w-5 rounded bg-gray-100 animate-pulse self-end" />
                  {row < 4 && col % 2 === 0 && (
                    <div className="h-4 w-full rounded-lg bg-gray-100 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 w-full">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-6 h-6 rounded bg-gray-100 animate-pulse" />
          <div className="h-5 w-44 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[0, 1].map((col) => (
            <div key={col} className="min-w-0">
              <div className="h-4 w-28 rounded bg-gray-100 animate-pulse mb-3 ml-3.5" />
              <div className="flex flex-col gap-3">
                {[0, 1, 2, 3].map((row) => (
                  <div key={row} className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="sm:hidden">
                      <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-gray-100">
                        <div className="h-7 w-6 rounded bg-gray-100 animate-pulse" />
                        <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
                      </div>
                      <div className="px-3.5 py-2.5 space-y-2">
                        <div
                          className={`h-3 rounded bg-gray-100 animate-pulse ${upcomingWidths[row]}`}
                        />
                        <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
                      </div>
                      <div className="h-8 mx-3.5 mb-3 rounded-lg bg-gray-100 animate-pulse" />
                    </div>

                    <div className="hidden sm:flex items-center gap-4 min-h-20 p-2.5">
                      <div className="w-23 self-stretch shrink-0 flex flex-col items-center justify-center gap-1 border-r border-gray-100">
                        <div className="h-7 w-8 rounded bg-gray-100 animate-pulse" />
                        <div className="h-2.5 w-10 rounded bg-gray-100 animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div
                          className={`h-3 rounded bg-gray-100 animate-pulse ${upcomingWidths[row]}`}
                        />
                        <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
                      </div>
                      <div className="h-9 w-24 rounded-lg bg-gray-100 animate-pulse shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

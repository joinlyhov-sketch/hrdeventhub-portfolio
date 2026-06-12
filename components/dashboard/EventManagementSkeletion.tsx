const nameWidths = [
  "w-36",
  "w-44",
  "w-40",
  "w-52",
  "w-32",
  "w-48",
  "w-36",
  "w-44",
  "w-40",
  "w-32",
];

export default function EventManagementSkeleton() {
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
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-5 h-5 rounded bg-gray-100 animate-pulse" />
          <div className="h-5 w-28 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="flex items-center justify-end gap-2 w-full mb-3">
          <div className="flex-1 h-10 bg-gray-100 rounded-xl animate-pulse" />
          <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse" />
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-100 min-h-145 bg-white">
          <div className="bg-[#1a2744] grid grid-cols-[6%_24%_18%_15%_15%_12%_10%] h-13">
            {[
              { label: "No.", w: "w-8" },
              { label: "Event Name", w: "w-20" },
              { label: "Date", w: "w-14" },
              { label: "Category", w: "w-14" },
              { label: "Status", w: "w-12" },
              { label: "Attendee", w: "w-14" },
              { label: "Action", w: "w-12" },
            ].map(({ label, w }) => (
              <div key={label} className="flex items-center px-5 py-3">
                <div className={`h-3 rounded bg-white/15 ${w}`} />
              </div>
            ))}
          </div>
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[6%_24%_18%_15%_15%_12%_10%] border-b border-gray-100 last:border-0 items-center h-14"
            >
              <div className="px-5">
                <div className="h-3 w-5 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="px-5">
                <div
                  className={`h-3 bg-gray-100 rounded animate-pulse ${nameWidths[i % nameWidths.length]}`}
                />
              </div>
              <div className="px-5">
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="px-5">
                <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="px-5">
                <div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" />
              </div>
              <div className="px-5">
                <div className="h-3 w-8 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="px-5 flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
                <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EventManagementSkeleton() {
  return (
    <div className="w-full space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-background border border-gray-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gray-100 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
              <div className="h-5 w-10 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      <div className="w-full bg-background border border-gray-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-5 h-5 rounded bg-gray-100 animate-pulse" />
          <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-10 bg-gray-100 rounded-xl animate-pulse" />
          <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
          <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
        </div>

        <div className="rounded-xl overflow-hidden border border-gray-200">
          <div className="bg-[#1a2744] grid grid-cols-[60px_1fr_140px_120px_120px_100px_80px] px-4">
            {["No.", "Event Name", "Date", "Category", "Status", "Attendee", "Action"].map((col) => (
              <div key={col} className="py-3.5 px-2">
                <div className="h-3 rounded bg-white/15" style={{ width: col === "Event Name" ? 80 : 50 }} />
              </div>
            ))}
          </div>

          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[60px_1fr_140px_120px_120px_100px_80px] px-4 border-b border-gray-100 last:border-0 items-center"
            >
              <div className="py-4 px-2"><div className="h-3 w-5 bg-gray-100 rounded animate-pulse" /></div>
              <div className="py-4 px-2"><div className="h-3 bg-gray-100 rounded animate-pulse" style={{ width: 140 + (i * 17) % 80 }} /></div>
              <div className="py-4 px-2"><div className="h-3 w-24 bg-gray-100 rounded animate-pulse" /></div>
              <div className="py-4 px-2"><div className="h-3 w-10 bg-gray-100 rounded animate-pulse" /></div>
              <div className="py-4 px-2"><div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" /></div>
              <div className="py-4 px-2"><div className="h-3 w-5 bg-gray-100 rounded animate-pulse" /></div>
              <div className="py-4 px-2"><div className="h-4 w-1 bg-gray-100 rounded animate-pulse" /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
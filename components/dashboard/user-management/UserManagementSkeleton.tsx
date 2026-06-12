export default function UserManagementSkeleton() {
  return (
    <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
        <div className="w-6 h-6 rounded bg-gray-100 animate-pulse" />
        <div className="h-5 w-36 bg-gray-100 rounded animate-pulse" />
      </div>

      <div className="flex justify-end">
        <div className="h-10 w-72 bg-gray-100 rounded-xl animate-pulse" />
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-100">
        <div className="bg-[#1a2744] grid grid-cols-[10%_30%_37%_25%_15%_15%_15%_20%] px-4">
          {["No.", "Username", "Email", "Phone", "Gender", "Gen", "Status", "Action"].map((col) => (
            <div key={col} className="py-3.5 px-2">
              <div className="h-3 rounded bg-white/15" style={{ width: col === "Username" || col === "Email" ? 70 : 40 }} />
            </div>
          ))}
        </div>

        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[10%_30%_37%_25%_15%_15%_15%_20%] px-4 border-b border-gray-100 last:border-0 items-center h-14"
          >
            <div className="px-2"><div className="h-3 w-5 bg-gray-100 rounded animate-pulse" /></div>
            <div className="px-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse shrink-0" />
              <div className="h-3 bg-gray-100 rounded animate-pulse" style={{ width: 80 + (i * 13) % 60 }} />
            </div>
            <div className="px-2"><div className="h-3 bg-gray-100 rounded animate-pulse" style={{ width: 120 + (i * 11) % 60 }} /></div>
            <div className="px-6"><div className="h-3 w-24 bg-gray-100 rounded animate-pulse" /></div>
            <div className="px-6"><div className="h-3 w-12 bg-gray-100 rounded animate-pulse" /></div>
            <div className="px-1 flex justify-center"><div className="h-3 w-8 bg-gray-100 rounded animate-pulse" /></div>
            <div className="px-1 flex justify-center"><div className="h-6 w-16 bg-gray-100 rounded-full animate-pulse" /></div>
            <div className="px-10 flex items-center gap-4">
              <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
              <div className="w-4 h-4 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
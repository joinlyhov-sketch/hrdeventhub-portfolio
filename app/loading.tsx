export default function Loading() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-8">

        <div className="relative flex items-center justify-center w-20 h-20">
          <span className="absolute inset-0 rounded-full border-4 border-muted" />
          <span
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"
            style={{ animationDuration: "900ms" }}
          />
          <span className="w-3 h-3 rounded-full bg-primary" />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <p
            className="type-desc-semibold text-foreground"
            style={{ animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }}
          >
            Loading...
          </p>
          <p className="type-detail text-muted-foreground">
            Hang tight, we're getting things ready.
          </p>
        </div>
        <div className="w-full max-w-md space-y-3 mt-2">
          {[80, 60, 72].map((w, i) => (
            <div
              key={i}
              className="flex items-center gap-3"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <span className="w-10 h-10 rounded-full bg-muted flex-shrink-0 animate-pulse" />
              <div className="flex-1 space-y-2">
                <span
                  className="block h-3 rounded-full bg-muted animate-pulse"
                  style={{ width: `${w}%` }}
                />
                <span
                  className="block h-2 rounded-full bg-muted animate-pulse"
                  style={{ width: `${w - 20}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
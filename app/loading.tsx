export default function Loading() {
  interface Dot {
    color: string;
  }

  const dots: Dot[] = [
    { color: "bg-primary" },
    { color: "bg-action" },
    { color: "bg-accent" },
    { color: "bg-secondary" },
  ];

  return (
    <main className="fixed inset-0 bg-background flex flex-col items-center justify-center px-4 w-screen h-screen z-[9999]">
      <style>{`
        @keyframes lineBounce {
          0%, 100% { 
            transform: translateY(0) scale(1); 
            opacity: 0.7;
          }
          30% { 
            transform: translateY(-12px) scale(1.2); 
            opacity: 1;
          }
          60% {
            transform: translateY(2px) scale(0.95);
          }
        }
        .animate-dot-bounce {
          animation: lineBounce 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>

      <div className="flex flex-col items-center justify-center gap-12 w-full max-w-md m-auto">
        <div className="flex items-center justify-center gap-4 h-12">
          {dots.map((dot: Dot, i: number) => (
            <span
              key={i}
              className={`w-4 h-4 rounded-full ${dot.color} animate-dot-bounce`}
              style={{
                animationDelay: `${i * 150}ms`,
              }}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <p
            className="type-desc-semibold text-foreground font-semibold"
            style={{ animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }}
          >
            Loading...
          </p>
          <p className="type-detail text-muted-foreground">
            Hang tight, we're getting things ready.
          </p>
        </div>
      </div>
    </main>
  );
}

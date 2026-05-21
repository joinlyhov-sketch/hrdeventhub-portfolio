export default function Loading() {
  const dots = [
    { color: "text-[#2D3142]", size: "scale-50" },   
    { color: "text-[#2D3142]", size: "scale-100" },  
    { color: "text-[#FF4D6D]", size: "scale-100" },  
    
    { color: "text-[#2D3142]", size: "scale-100" },  
    { color: "text-[#FFB703]", size: "scale-100" },  
    { color: "text-[#2D3142]", size: "scale-100" },  
    
    { color: "text-[#219EBC]", size: "scale-50" },   
    { color: "text-[#2D3142]", size: "scale-100" },  
    { color: "text-[#52B788]", size: "scale-70" },   
  ];

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 w-full">
      
      <style>{`
        @keyframes matrixPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        .animate-matrix {
          animation: matrixPulse 1.6s ease-in-out infinite;
        }
      `}</style>

      <div className="flex flex-col items-center justify-center gap-8 w-full max-w-md mx-auto">
        
        <div className="grid grid-cols-3 gap-3 justify-items-center items-center w-20 h-20">
          {dots.map((dot, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const delay = (row + col) * 200; 

            return (
              <svg
                key={i}
                className={`w-4 h-4 ${dot.color} ${dot.size} animate-matrix`}
                style={{ animationDelay: `${delay}ms` }}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="12" r="10" />
              </svg>
            );
          })}
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

        <div className="w-full space-y-3 mt-2">
          {[80, 60, 72].map((w, i) => (
            <div
              key={i}
              className="flex items-center gap-3"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <span className="w-10 h-10 rounded-full bg-muted shrink-0 animate-pulse" />
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
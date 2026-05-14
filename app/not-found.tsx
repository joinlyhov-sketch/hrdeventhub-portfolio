import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">

        <div className="relative select-none">
          <span
            className="text-primary font-extrabold leading-none"
            style={{ fontSize: "clamp(6rem, 20vw, 9rem)", opacity: 0.08 }}
            aria-hidden="true"
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-muted rounded-2xl p-5">
              <svg
                className="w-12 h-12 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full">
          <Link
            href="/"
            className="flex-1 bg-primary text-primary-foreground type-detail-semibold py-3 rounded-xl text-center hover:bg-primary-hover transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="javascript:history.back()"
            className="flex-1 bg-muted text-foreground type-detail-semibold py-3 rounded-xl text-center hover:bg-grey-200 transition-colors"
          >
            Go Back
          </Link>
        </div>

      </div>
    </main>
  );
}
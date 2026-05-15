"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center max-w-md">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: "rgba(239,68,68,0.08)", transform: "scale(1.6)" }}
          />
          <div className="relative bg-red-50 border border-red-100 rounded-2xl p-5">
            <svg
              className="w-12 h-12"
              style={{ color: "var(--destructive)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="type-title text-foreground">Something went wrong</h1>
          <p className="type-desc text-muted-foreground">
            An unexpected error occurred. Our team has been notified and is
            working on a fix.
          </p>
        </div>
        {error?.message && (
          <div className="bg-grey-50 border border-border rounded-xl px-5 py-3 w-full text-left">
            <p className="type-detail-small-medium text-muted-foreground mb-0.5">
              ERROR DETAILS
            </p>
            <p className="type-detail text-foreground break-words">
              {error.message}
            </p>
            {error.digest && (
              <p className="type-detail-small-medium text-muted-foreground mt-1">
                ID: {error.digest}
              </p>
            )}
          </div>
        )}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={reset}
            className="flex-1 bg-primary text-primary-foreground type-detail-semibold py-3 rounded-xl hover:bg-primary-hover transition-colors"
          >
            Try Again
          </button>
          <Link href="/"  className="flex-1 bg-muted text-foreground type-detail-semibold py-3 rounded-xl text-center hover:bg-grey-200 transition-colors">
          Go Home
          </Link>
        </div>

      </div>
    </main>
  );
}
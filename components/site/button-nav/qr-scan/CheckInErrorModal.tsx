"use client";

import { AlertCircle } from "lucide-react";
import type { CheckInError } from "../../../../types/bottom-nav/types";

interface Props {
  error: CheckInError;
  onClose: () => void;
  onScanAgain: () => void;
}

export function CheckInErrorModal({ error, onClose, onScanAgain }: Props) {
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm mx-auto bg-white dark:bg-gray-950 rounded-t-3xl shadow-2xl px-6 pt-8 pb-10 flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40 mb-4">
          <AlertCircle size={48} className="text-red-500" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Check-in Failed</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{error.message}</p>

        <button
          onClick={onScanAgain}
          className="w-full py-3 rounded-xl bg-[#1c4d8d] text-white text-sm font-semibold mb-3 active:scale-95 transition-transform"
        >
          Try Again
        </button>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300 active:scale-95 transition-transform"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
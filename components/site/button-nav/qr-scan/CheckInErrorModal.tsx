"use client";

import { useEffect, useState } from "react";
import type { CheckInError } from "../../../../types/bottom-nav/types";

interface Props {
  error: CheckInError;
  onClose: () => void;
  onScanAgain: () => void;
}

export function CheckInErrorModal({ error, onClose, onScanAgain }: Props) {
  const [visible, setVisible] = useState(false);

  const isAlreadyCheckedIn = error.message.toLowerCase().includes("already scanned");

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center">
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`relative w-full bg-white dark:bg-gray-950 rounded-t-3xl shadow-2xl px-6 pt-7 pb-6 flex flex-col items-center text-center transition-transform duration-500 ease-out ${visible ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="relative mb-4 mt-1">
          <span className={`absolute inset-0 rounded-full ${isAlreadyCheckedIn ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-red-100 dark:bg-red-900/30"} animate-ping opacity-30`} />
          <span className="absolute inset-[-6px] rounded-full animate-pulse" />

          <div className="relative flex h-[72px] w-[72px] items-center justify-center">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${isAlreadyCheckedIn ? "bg-yellow-500" : "bg-red-500"}`}>
              {isAlreadyCheckedIn ? (
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9v2m0 4h.01" />
                  <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7"
                  fill="none"
                  stroke="white"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                >
                  <path
                    d="M6 6 L18 18"
                    style={{
                      strokeDasharray: 17,
                      strokeDashoffset: visible ? 0 : 17,
                      transition: "stroke-dashoffset 0.35s ease-out 0.3s",
                    }}
                  />
                  <path
                    d="M18 6 L6 18"
                    style={{
                      strokeDasharray: 17,
                      strokeDashoffset: visible ? 0 : 17,
                      transition: "stroke-dashoffset 0.35s ease-out 0.5s",
                    }}
                  />
                </svg>
              )}
            </div>
          </div>
        </div>

        <h2
          className={`text-[17px] font-bold text-gray-900 dark:text-white mb-1 transition-all duration-300 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        >
          {isAlreadyCheckedIn ? "Already Checked In" : "Check-in Failed"}
        </h2>
        <p
          className={`text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed transition-all duration-300 delay-[350ms] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        >
          {(() => {
            let msg = error.message;
            const dateMatch = msg.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z/);
            if (dateMatch) {
              const d = new Date(dateMatch[0]);
              const formatted = d.toLocaleString("en-US", {
                timeZone: "Asia/Phnom_Penh",
                dateStyle: "medium",
                timeStyle: "short",
              });
              msg = msg.replace(dateMatch[0], formatted);
            }
            return msg;
          })()}
        </p>

        <div
          className={`w-full flex flex-col gap-2.5 transition-all duration-300 delay-[400ms] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        >
          <button
            onClick={onScanAgain}
            className="w-full py-3.5 rounded-2xl bg-[#1c4d8d] text-white text-sm font-semibold active:scale-95 transition-transform shadow-md shadow-[#1c4d8d]/20"
          >
            Try Again
          </button>
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 active:scale-95 transition-transform"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

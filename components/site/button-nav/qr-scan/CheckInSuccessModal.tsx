"use client";

import { useEffect, useRef } from "react";
import { User, CalendarDays, Clock } from "lucide-react";
import type { CheckInResult } from "../../../../types/bottom-nav/types";

interface Props {
  result: CheckInResult;
  onClose: () => void;
  onScanAgain: () => void;
}

export function CheckInSuccessModal({ result, onClose, onScanAgain }: Props) {
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = confettiRef.current;
    if (!container) return;
    const colors = [
      "#3B6D11",
      "#639922",
      "#97C459",
      "#1c4d8d",
      "#378ADD",
      "#C0DD97",
    ];
    for (let i = 0; i < 18; i++) {
      const el = document.createElement("div");
      const size = Math.random() * 5 + 4;
      el.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
        background:${colors[Math.floor(Math.random() * colors.length)]};
        left:${Math.random() * 100}%;top:${Math.random() * 30}%;
        animation:confettiFall ${0.8 + Math.random() * 0.8}s ease-out ${0.4 + Math.random() * 0.4}s both;
        opacity:0;
      `;
      container.appendChild(el);
    }
  }, []);

  return (
    <>
      <style>{`
        @keyframes backdropIn{from{opacity:0}to{opacity:1}}
        @keyframes sheetUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes iconPop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.2)}80%{transform:scale(0.92)}100%{transform:scale(1);opacity:1}}
        @keyframes ringExpand{0%{transform:scale(0.4);opacity:0.8}100%{transform:scale(1.8);opacity:0}}
        @keyframes fadeSlideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes checkDraw{from{stroke-dashoffset:56}to{stroke-dashoffset:0}}
        @keyframes confettiFall{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(80px) rotate(360deg);opacity:0}}
      `}</style>

      <div
        className="fixed inset-0 z-[90] flex items-end justify-center"
        style={{ animation: "backdropIn 0.2s ease" }}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />

        <div
          className="relative w-full bg-white dark:bg-gray-950 rounded-t-[28px] px-6 pt-6 pb-6 flex flex-col items-center text-center overflow-hidden"
          style={{
            animation: "sheetUp 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        >
          <div
            ref={confettiRef}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          />
          <div className="relative w-[72px] h-[72px] mb-4 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-green-100 dark:bg-green-900/30 animate-ping opacity-30" />
            <span className="absolute inset-[-6px] rounded-full animate-pulse" />
            <div
              className="absolute inset-0 rounded-full bg-green-50 dark:bg-green-950/40"
              style={{
                animation:
                  "iconPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.15s both",
              }}
            />
            <div
              className="absolute inset-0 rounded-full border-2 border-green-300"
              style={{ animation: "ringExpand 0.8s ease-out 0.3s both" }}
            />
            <div
              className="absolute inset-0 rounded-full border-2 border-green-200"
              style={{ animation: "ringExpand 0.8s ease-out 0.5s both" }}
            />
            <svg
              width="36"
              height="36"
              viewBox="0 0 44 44"
              fill="none"
              className="relative z-10"
              style={{
                animation:
                  "iconPop 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
              }}
            >
              <polyline
                points="10,23 19,32 34,14"
                stroke="#3B6D11"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="56"
                strokeDashoffset="56"
                style={{ animation: "checkDraw 0.4s ease-out 0.45s forwards" }}
              />
            </svg>
          </div>

          <h2
            className="text-lg font-medium text-gray-900 dark:text-white mb-1"
            style={{ animation: "fadeSlideUp 0.4s ease 0.5s both", opacity: 0 }}
          >
            Checked in!
          </h2>
          <p
            className="text-sm text-gray-500 dark:text-gray-400 mb-4"
            style={{
              animation: "fadeSlideUp 0.4s ease 0.58s both",
              opacity: 0,
            }}
          >
            Attendee verified and marked as present
          </p>
          <div
            className="w-full bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 mb-4 overflow-hidden"
            style={{
              animation: "fadeSlideUp 0.4s ease 0.66s both",
              opacity: 0,
            }}
          >
            {[
              {
                icon: User,
                label: "Attendee",
                value: result.attendeeName,
                iconBg: "bg-green-50 dark:bg-green-950/40",
                iconColor: "text-green-700",
              },
              {
                icon: CalendarDays,
                label: "Event",
                value: result.eventName,
                iconBg: "bg-blue-50 dark:bg-blue-950/40",
                iconColor: "text-blue-700",
              },
              {
                icon: Clock,
                label: "Checked in at",
                value: result.registeredAt,
                iconBg: "bg-amber-50 dark:bg-amber-950/40",
                iconColor: "text-amber-700",
              },
            ].map((row, i, arr) => (
              <div key={row.label}>
                <div className="flex items-center gap-3 px-4 py-2.5">
                  <div
                    className={`w-8 h-8 rounded-full ${row.iconBg} flex items-center justify-center shrink-0`}
                  >
                    <row.icon
                      size={15}
                      className={row.iconColor}
                      strokeWidth={1.75}
                    />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider">
                      {row.label}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5 truncate">
                      {row.value}
                    </p>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4" />
                )}
              </div>
            ))}
          </div>
          <div
            className="w-full flex flex-col gap-2"
            style={{
              animation: "fadeSlideUp 0.4s ease 0.74s both",
              opacity: 0,
            }}
          >
            <button
              onClick={onScanAgain}
              className="w-full py-3 rounded-2xl bg-[#1c4d8d] text-white text-sm font-medium active:scale-95 transition-transform"
            >
              Scan next attendee
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 active:scale-95 transition-transform"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


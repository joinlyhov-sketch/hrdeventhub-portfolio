"use client";

import React from "react";

const Sk = ({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`bg-[var(--grey-200)] rounded-md ${className}`}
    style={style}
  />
);

export default function PrivacySettingsSkeleton() {
  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 xl:gap-8 items-start px-4 sm:px-6 lg:px-12 animate-pulse">
      <div className="xl:col-span-4">
        <div className="w-full border border-border rounded-2xl overflow-hidden bg-white dark:bg-transparent">
          <Sk className="w-full h-32 rounded-none" />

          <div className="flex flex-col items-center px-6 pb-6 -mt-10">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-background mb-3 overflow-hidden shrink-0">
              <Sk className="w-full h-full rounded-none" />
            </div>

            <Sk className="h-6 w-40 rounded-lg mb-2" />

            <Sk className="h-4 w-28 rounded-md mb-3" />

            <Sk className="h-4 w-36 rounded mb-5" />

            <hr className="border-border w-full mb-4" />

            <Sk className="h-5 w-44 rounded-md self-start mb-4" />

            <div className="w-full flex flex-col gap-3">
              {[
                { lw: "w-52" },
                { lw: "w-28" },
                { lw: "w-32" },
                { lw: "w-36" },
                { lw: "w-24" },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Sk className="w-5 h-5 rounded shrink-0" />
                  <Sk className={`h-4 ${r.lw}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-8 flex flex-col gap-6">
        <div className="w-full border border-border rounded-2xl p-6 bg-white dark:bg-transparent">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
              <Sk className="w-full h-full rounded-none" />
            </div>
            <Sk className="h-6 w-56 rounded-md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="border border-border rounded-xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Sk className="w-full h-full rounded-none" />
                  </div>
                  <div className="w-5 h-5 rounded-full overflow-hidden shrink-0">
                    <Sk className="w-full h-full rounded-none" />
                  </div>
                </div>
                {i === 0 && <Sk className="h-5 w-24 rounded-full" />}
                <Sk className="h-5 w-28 rounded-md" />
                <Sk className="h-3.5 w-full rounded" />
                <Sk className="h-3.5 w-4/5 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full border border-border rounded-2xl p-6 bg-white dark:bg-transparent">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                <Sk className="w-full h-full rounded-none" />
              </div>
              <Sk className="h-6 w-52 rounded-md" />
            </div>
            <div className="flex gap-4">
              <Sk className="h-4 w-24 rounded" />
              <Sk className="h-4 w-24 rounded" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { lw: "w-16", dw: "w-48" },
              { lw: "w-36", dw: "w-40" },
              { lw: "w-20", dw: "w-44" },
              { lw: "w-24", dw: "w-36" },
              { lw: "w-16", dw: "w-52" },
            ].map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-4 border border-border rounded-xl p-4"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Sk className="w-full h-full rounded-none" />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <Sk className={`h-4 ${r.lw}`} />
                  <Sk className={`h-3.5 ${r.dw}`} />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="h-6 w-16 rounded-full overflow-hidden">
                    <Sk className="w-full h-full rounded-none" />
                  </div>
                  <Sk className="w-4 h-4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

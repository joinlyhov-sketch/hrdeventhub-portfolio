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

export default function EditProfileSkeleton() {
  return (
    <div className="w-full flex flex-col gap-4 animate-pulse">
      <div className="w-full border border-border rounded-2xl p-6 flex flex-col gap-5 bg-white dark:bg-transparent">
        <Sk className="h-6 w-40 rounded-md" />
        <div className="flex items-end gap-5">
          <Sk className="w-20 h-20 rounded-full shrink-0" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            {[{ w: "w-20" }, { w: "w-20" }, { w: "w-24" }].map((f, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <Sk className={`h-3.5 ${f.w}`} />
                <Sk className="w-full h-10 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{ w: "w-24" }, { w: "w-28" }, { w: "w-32" }].map((f, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Sk className={`h-3.5 ${f.w}`} />
              <Sk className="w-full h-10 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[{ w: "w-28" }, { w: "w-36" }].map((f, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Sk className={`h-3.5 ${f.w}`} />
              <Sk className="w-full h-10 rounded-xl" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          <Sk className="h-3.5 w-20" />
          <Sk className="w-full h-24 rounded-xl" />
        </div>

        <hr className="border-border" />
        <Sk className="h-5 w-36 rounded-md" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { lw: "w-16" },
            { lw: "w-14" },
            { lw: "w-20" },
            { lw: "w-16" },
          ].map((n, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 h-14 border border-border rounded-xl"
            >
              <Sk className="w-9 h-9 rounded-full shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <Sk className={`h-3 ${n.lw}`} />
                <Sk className="h-3.5 w-3/4" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-1">
          <Sk className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
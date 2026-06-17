import React from "react";

const Sk = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <div 
    className={`bg-[var(--grey-200)] rounded-md ${className}`} 
    style={style} 
  />
);

export default function ProfilePageSkeleton() {
  return (
    <div 
      className="w-full bg-background animate-pulse"
      style={{ '--tw-animate-pulse-opacity': '0.35' } as React.CSSProperties}
    > 
      <div className="bg-[var(--grey-100)] px-6 py-5 mb-6">
        <Sk className="h-3 w-40 rounded-full mb-2" />
        <Sk className="h-2.5 w-72 rounded-full" />
      </div>

      <div className="px-4 sm:px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 xl:h-[680px]">

          <div className="xl:col-span-4 bg-card border border-border rounded-xl p-6 flex flex-col items-center gap-4">
            <Sk className="w-20 h-20 rounded-full" />
            <Sk className="h-4 w-32 rounded-full" />
            <Sk className="h-3 w-20 rounded-full" />

            <div className="w-full border-t border-border pt-4 flex flex-col gap-3">
              <Sk className="h-2.5 w-3/4" />
              <Sk className="h-2.5 w-2/3" />
              <Sk className="h-2.5 w-3/5" />
            </div>

            <div className="w-full border-t border-border pt-4 flex flex-col gap-3">
              <Sk className="h-2.5 w-4/5" />
              <Sk className="h-2.5 w-1/2" />
            </div>

            <div className="mt-auto w-full flex flex-col gap-2">
              <Sk className="h-10 w-full rounded-full" />
              <Sk className="h-10 w-full rounded-full" />
            </div>
          </div>

          <div className="xl:col-span-8 bg-card border border-border rounded-xl p-6 flex flex-col gap-6">
            <div className="flex bg-[var(--grey-100)] p-1.5 rounded-lg gap-2">
              <Sk className="flex-1 h-10 rounded-md" />
              <Sk className="flex-1 h-10 rounded-md opacity-50" />
              <Sk className="flex-1 h-10 rounded-md opacity-50" />
            </div>

            <div className="flex flex-col gap-5 flex-1">
              <div className="flex flex-col gap-2">
                <Sk className="h-3 w-24" />
                <Sk className="h-3 w-3/4" />
                <Sk className="h-3 w-1/2" />
              </div>
              <div className="flex flex-col gap-2">
                <Sk className="h-3 w-28" />
                <div className="flex gap-2 flex-wrap">
                  <Sk className="h-7 w-20 rounded-full" />
                  <Sk className="h-7 w-24 rounded-full" />
                  <Sk className="h-7 w-16 rounded-full" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Sk className="h-3 w-20" />
                <Sk className="h-3 w-4/5" />
                <Sk className="h-3 w-2/3" />
              </div>
              <div className="border-t border-border pt-4 flex flex-col gap-3">
                <Sk className="h-3 w-11/12" />
                <Sk className="h-3 w-4/5" />
                <Sk className="h-3 w-2/3" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
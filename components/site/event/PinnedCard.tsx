"use client";

import { Clock } from "lucide-react";
import image from "../../../public/images/PinnedCardTest.jpg";
import Image from "next/image";

const data = {
  id: "evt-9921",
  badge: "NEW EVENT",
  title: "Songkran Festival Celebration",
  schedule: "Tomorrow, 1:30 PM - 5:00 PM • HRD Center",
};


export function PinnedCard() {
  return (
    <article className="relative w-full overflow-hidden rounded-xl bg-secondary border border-border text-white shadow-sm group min-h-[240px] flex items-end p-6 md:p-8">
      <div className="absolute inset-0 z-0">
  <Image
    src={image}
    alt="Pinned Event Banner"
    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
  />   
  <div className="absolute inset-0 bg-gradient-to-r from-[#172554]/90 to-[#172554]/0" />
</div>

      <div className="relative z-10 w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col items-start gap-3">
          <span className="inline-flex bg-subtle text-secondary type-desc-small-semibold px-3 py-1 rounded-md tracking-wide">
            {data.badge}
          </span>
          <h2 className="type-subtitle-24 font-bold tracking-tight text-white md:type-title">
            {data.title}
          </h2>
          <div className="flex items-center gap-2 text-white/90 type-detail">
            <Clock size={16} strokeWidth={2.5} className="text-white/80" />
            <time dateTime="2026-05-18T13:30">{data.schedule}</time>
          </div>
        </div>

        <div className="w-full md:w-auto flex-shrink-0">
          <button
            type="button"
            className="w-full md:w-auto bg-white text-secondary hover:bg-grey-100 active:scale-[0.99] transition-all px-7 py-3.5 rounded-xl type-detail-semibold shadow-md whitespace-nowrap"
          >
            View Detail
          </button>
        </div>
      </div>
    </article>
  );
}
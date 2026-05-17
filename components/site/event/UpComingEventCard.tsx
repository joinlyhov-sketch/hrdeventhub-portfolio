"use client";

import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

const events = [
  {
    id: "1",
    month: "OCT",
    day: "24",
    title: "Stakeholder Quarterly Review",
    time: "09:00 AM - 11:30 AM",
    variant: "blue",
  },
  {
    id: "2",
    month: "OCT",
    day: "26",
    title: "UX Research Synthesis",
    time: "02:00 PM - 04:00 PM",
    variant: "green",
  },
  {
    id: "3",
    month: "OCT",
    day: "26",
    title: "UX Research Synthesis",
    time: "02:00 PM - 04:00 PM",
    variant: "green",
  },
];

export default function UpComingEventCard() {
  return (
    <div className="bg-background rounded-[12px] border border-border p-8 shadow-sm">
      <div className="flex items-center justify-between mb-10">
        <h3 className="type-subtitle font-extrabold text-primary">Upcoming Events</h3>
        <Link href="/calendar">
          <button className="type-detail-small-semibold text-primary hover:underline hover:cursor-pointer">
            View Calendar
          </button>
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 opacity-40">
          <div className="p-4 bg-grey-100 rounded-2xl mb-4">
            <Calendar size={48} className="text-grey-400" />
          </div>
          <p className="type-detail font-medium text-muted-foreground">No upcoming events.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-4">
              <div
                className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl shrink-0 ${
                  event.variant === "blue"
                    ? "bg-[#EFF6FF] text-[#1E40AF]"
                    : "bg-[#ECFDF5] text-[#047857]"
                }`}
              >
                <span className="text-[10px] font-bold tracking-wider uppercase opacity-90">
                  {event.month}
                </span>
                <span className="text-2xl font-bold leading-none mt-0.5">
                  {event.day}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-base font-bold text-grey-900 leading-snug">
                  {event.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs font-medium text-grey-400">
                  <Clock size={14} className="shrink-0" />
                  <span>{event.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React from "react";
import { Metadata } from "next";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";
import { calendarEvents, upcomingEvents } from "../../../data/calendarData";

export const metadata: Metadata = {
  title: "Calendar",
};

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const calendarDays = [
  29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
];

export default function CalendarPage() {
  const groupedEvents = upcomingEvents.reduce<
    Record<string, typeof upcomingEvents>
  >((acc, event) => {
    acc[event.month] = acc[event.month] || [];
    acc[event.month].push(event);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold text-blue-900">Calendar</h1>
      <p className="text-gray-500">Review all of the event in this page</p>

      <section className="mt-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2">
            <button className="rounded-xl border px-3 py-2 text-blue-900">
              <ChevronLeft size={18} />
            </button>

            <button className="flex items-center gap-2 rounded-xl border px-4 py-2 font-bold text-blue-900">
              <CalendarDays size={16} />
              April 2026
            </button>

            <button className="rounded-xl border px-3 py-2 text-blue-900">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border">
            {["Month", "Week", "Day"].map((item) => (
              <button
                key={item}
                className={`px-8 py-3 font-semibold ${
                  item === "Month"
                    ? "border border-blue-900 text-blue-900"
                    : "text-gray-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <div className="grid grid-cols-7 bg-blue-900 text-white">
            {days.map((day) => (
              <div key={day} className="py-3 text-center font-bold">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const events = calendarEvents.filter(
                (event) => event.day === day,
              );

              return (
                <div
                  key={index}
                  className="min-h-32 border-r border-t p-3 text-sm last:border-r-0"
                >
                  <span
                    className={index < 3 ? "text-gray-300" : "text-gray-800"}
                  >
                    {day}
                  </span>

                  <div className="mt-4 space-y-2">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className={`rounded border px-2 py-1 text-[11px] font-semibold ${
                          event.type === "green"
                            ? "border-teal-400 bg-teal-50 text-teal-700"
                            : event.type === "blue"
                              ? "border-blue-500 bg-blue-50 text-blue-900"
                              : "border-orange-400 bg-orange-50 text-orange-500"
                        }`}
                      >
                        ● {event.time} {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-8 flex items-center gap-3">
          <CalendarDays className="text-blue-900" />
          <h2 className="text-2xl font-bold text-orange-400">
            Upcoming <span className="text-blue-900">Event</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
          {Object.entries(groupedEvents).map(([month, events]) => (
            <div key={month}>
              <h3 className="mb-4 border-l-4 border-orange-400 pl-4 text-lg font-bold text-blue-900">
                {month}
              </h3>

              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center rounded-xl border p-5 shadow-sm"
                  >
                    <div className="w-24 border-r text-center">
                      <h2 className="text-4xl font-bold text-blue-900">
                        {event.day}
                      </h2>
                      <p className="text-xs font-semibold text-orange-400">
                        {event.date}
                      </p>
                    </div>

                    <div className="ml-6 flex-1">
                      <h4 className="font-bold">{event.title}</h4>

                      <div className="mt-2 flex gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {event.location}
                        </span>
                      </div>
                    </div>

                    <button className="rounded-xl bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-900">
                      View Detail ›
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

"use client";

import { useState } from "react";
import type { CalendarView } from "@/types/calendar";
import CalendarToolbar from "./CalendarToolbar";
import BigCalendarView from "./BigCalendarView";

export default function CalendarFeature() {
  const [view, setView] = useState<CalendarView>("month");
  const [date, setDate] = useState<Date>(() => new Date());

  return (
    <section className="mt-8 space-y-6">
      <CalendarToolbar
        view={view}
        date={date}
        onViewChange={setView}
        onNavigate={setDate}
      />

      <BigCalendarView view={view} date={date} onNavigate={setDate} />
    </section>
  );
}

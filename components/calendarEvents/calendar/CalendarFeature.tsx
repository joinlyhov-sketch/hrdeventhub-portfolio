"use client";

import { useState } from "react";
import type { CalendarView } from "../../../types/calendar";
import CalendarToolbar from "./CalendarToolbar";
import MonthCalendarView from "./MonthCalendarView";
import WeekCalendarView from "./WeekCalendarView";
import DayCalendarView from "./DayCalendarView";

export default function CalendarFeature() {
  const [view, setView] = useState<CalendarView>("month");

  return (
    <section className="mt-8 sticky">
      <CalendarToolbar view={view} onViewChange={setView} />
      {view === "month" && <MonthCalendarView />}
      {view === "week" && <WeekCalendarView />}
      {view === "day" && <DayCalendarView />}
    </section>
  );
}

"use client";
import { useState } from "react";
import { View, SlotInfo } from "react-big-calendar";
import FullBigCalendar from "@/components/shadcn-big-calendar/calendar/FullBigCalendar";
import TopBar from "@/components/shadcn-big-calendar/calendar/TopBar";
import UpcomingEventSection from "@/components/shadcn-big-calendar/calendar/UpcomingEventSelection";

export default function CalendarPage() {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  return (
    <main className="w-full space-y-6 p-6">
      <TopBar />
      <FullBigCalendar />
      <UpcomingEventSection />
    </main>
  );
}

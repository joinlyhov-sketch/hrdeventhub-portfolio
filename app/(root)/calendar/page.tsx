"use client";

import FullBigCalendar from "@/components/shadcn-big-calendar/calendar/FullBigCalendar";
import TopBar from "@/components/shadcn-big-calendar/calendar/TopBar";
import UpcomingEventSection from "@/components/shadcn-big-calendar/calendar/UpcomingEventSelection";

export default function CalendarPage() {
  return (
    <main className="min-h-screen w-full min-w-0 px-10 py-6">
      <TopBar />
      <div className="mx-auto w-full max-w-[1440px] m-3 space-y-6">
        <FullBigCalendar />
        <UpcomingEventSection />
      </div>
    </main>
  );
}

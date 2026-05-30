"use client";

import FullBigCalendar from "@/components/shadcn-big-calendar/calendar/FullBigCalendar";
import TopBar from "@/components/shadcn-big-calendar/calendar/TopBar";
import UpcomingEventSection from "@/components/shadcn-big-calendar/calendar/UpcomingEventSelection";

// export default function CalendarPage() {
//   return (
//     <main className="min-h-screen min-w-0 w-full space-y-6 px-4 py-6">
//       <TopBar />
//       <div className="w-full min-w-0">
//         <FullBigCalendar />
//       </div>
//       <UpcomingEventSection />
//     </main>
//   );
// }

export default function CalendarPage() {
  return (
    <main className="min-h-screen w-full min-w-0 px-4 py-6">
      <TopBar />
      <div className="mx-auto w-full max-w-[1440px] space-y-6">
        <FullBigCalendar />
        <UpcomingEventSection />
      </div>
    </main>
  );
}

import { Metadata } from "next";
import CalendarFeature from "../../../components/calendarEvents/calendar/CalendarFeature";
import UpcomingEventSection from "../../../components/calendarEvents/calendar/UpcomingEventSelection";
import TopBarCalendar from "../../../components/calendarEvents/calendar/Top-Bar";

export const metadata: Metadata = {
  title: "Calendar",
};
export default function Page() {
  return (
    <main className="w-full bg-background min-h-full flex mt-6 flex-col pr-8 lg:pr-12 lg:pl-12">
      <TopBarCalendar />
      <div className="max-w-7xl mx-auto w-full">
        <CalendarFeature />
        <UpcomingEventSection />
      </div>
    </main>
  );
}

import { Metadata } from "next";
import CalendarFeature from "../../../components/calendarEvents/calendar/CalendarFeature";
import UpcomingEventSection from "../../../components/calendarEvents/calendar/UpcomingEventSelection";
import TopBarCalendar from "../../../components/calendarEvents/calendar/Top-Bar";

export const metadata: Metadata = {
  title: "Calendar",
};
export default function Page() {
  return (
    <main className="w-full bg-background">
      <TopBarCalendar />
      <CalendarFeature />
      <UpcomingEventSection />
    </main>
  );
}

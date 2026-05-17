import CalendarFeature from "../../../components/calendarEvents/calendar/CalendarFeature";
import UpcomingEventSection from "../../../components/calendarEvents/calendar/UpcomingEventSelection";
import TopBarC from "../../../components/calendarEvents/calendar/Top-Bar";

export default function Page() {
  return (
    <main className="min-h-screen w-full bg-background">
      <TopBarC />
      <CalendarFeature />
      <UpcomingEventSection />
    </main>
  );
}

import { EventManagementClient } from "../../../components/dashboard/event-management/EventManagementClient";
import { eventManagementStats } from "../../../data/event-management";
import { eventService, EventItem } from "@/service/event.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export default async function EventManagementPage() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken || "";

  let events: EventItem[] = [];

  try {
    if (token) {
      events = await eventService.getAll(token, 1, 100);
    }
  } catch (error) {
    console.error("Failed to fetch events for management table:", error);
  }
  console.log("events: ", events);

  return (
    <main className="min-h-screen max-w-420 mx-auto">
      <EventManagementClient events={events} stats={eventManagementStats} />
    </main>
  );
}

import { EventManagementClient } from "../../../components/dashboard/event-management/EventManagementClient";
import { eventService, EventItem } from "@/service/event.service";
import { paymentService, Transaction } from "@/service/payment.service";
import { authService } from "@/service/auth.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export default async function EventManagementPage() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken || "";

  let events: EventItem[] = [];
  let transactions: Transaction[] = [];
  let attendeeCountByPostId: Record<string, number> = {};
  let isOrganizer = false;

  try {
    if (token) {
      const profileResponse = await authService.getProfileMe(token);
      const role = profileResponse?.payload?.roles;
      isOrganizer = role === "ORGANIZER";

      if (isOrganizer) {
        const [organizerData, txns] = await Promise.all([
          eventService.getOrganizerEvents(token),
          paymentService.getAllTransactions(token),
        ]);
        events = organizerData.events;
        transactions = txns;
        organizerData.participantsByPostId.forEach((participants, postId) => {
          attendeeCountByPostId[postId] = participants.length;
        });
      } else {
        [events, transactions] = await Promise.all([
          eventService.getAllPlatformEventsWithAttendees(token),
          paymentService.getAllTransactions(token),
        ]);
      }
    }
  } catch (error) {
    console.error("Failed to fetch event management data:", error);
  }

  return (
    <div className="w-full max-w-full">
      <EventManagementClient
        events={events}
        transactions={transactions}
        attendeeCountByPostId={attendeeCountByPostId}
        isOrganizer={isOrganizer}
      />
    </div>
  );
}

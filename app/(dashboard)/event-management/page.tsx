import { EventManagementClient } from "../../../components/dashboard/event-management/EventManagementClient";
import { eventService, EventItem } from "@/service/event.service";
import { paymentService, Transaction } from "@/service/payment.service";
import { authService } from "@/service/auth.service";
import { getAppSession as getServerSession } from "@/libs/server-session";
import { authOptions } from "@/libs/auth";
import { workspaceService } from "@/service/workspace.service";

export const dynamic = "force-dynamic";

export default async function EventManagementPage() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken || "";

  let events: EventItem[] = [];
  let transactions: Transaction[] = [];
  const attendeeCountByPostId: Record<string, number> = {};
  let isOrganizer = false;

  try {
    if (token) {
      const profileResponse = await authService.getProfileMe(token);
      const role = profileResponse?.payload?.roles;
      isOrganizer = role === "ORGANIZER";

      if (isOrganizer) {
        const myWorkspaces = await workspaceService.getMyWorkspaces(token);
        
        const workspaceEventsPromises = myWorkspaces.map((ws) =>
          eventService.getByWorkspace(token, ws.workspaceId),
        );
        const eventsArrays = await Promise.all(workspaceEventsPromises);

        const allEvents: EventItem[] = [];
        eventsArrays.forEach((wsEvents, index) => {
          const ws = myWorkspaces[index];
          wsEvents.forEach((event) => {
            allEvents.push({
              ...event,
              sourceWorkspaceId: ws.workspaceId,
              sourceWorkspaceName: ws.name,
            });
          });
        });

        const uniqueEventsMap = new Map<string, EventItem>();
        allEvents.forEach(e => uniqueEventsMap.set(e.postId, e));
        
        const sortedEvents = Array.from(uniqueEventsMap.values()).sort((a, b) => {
          const aTime = new Date(a.eventStart).getTime();
          const bTime = new Date(b.eventStart).getTime();
          if (Number.isNaN(aTime)) return 1;
          if (Number.isNaN(bTime)) return -1;
          return bTime - aTime;
        });

        const [participants, txns] = await Promise.all([
          eventService.getOrganizerParticipants(token),
          paymentService.getAllTransactions(token),
        ]);

        participants.forEach((p) => {
          attendeeCountByPostId[p.postId] = (attendeeCountByPostId[p.postId] || 0) + 1;
        });

        events = sortedEvents;
        const organizerEventIds = new Set(events.map((e) => e.postId));
        transactions = txns.filter((t) => organizerEventIds.has(t.postId));
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
    <div className="w-full max-w-420 mx-auto">
      <EventManagementClient
        events={events}
        transactions={transactions}
        attendeeCountByPostId={attendeeCountByPostId}
        isOrganizer={isOrganizer}
      />
    </div>
  );
}

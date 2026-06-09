import { EventManagementClient } from "../../../components/dashboard/event-management/EventManagementClient";
import { eventService, EventItem } from "@/service/event.service";
import { paymentService, Transaction } from "@/service/payment.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export default async function EventManagementPage() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken || "";

  let events: EventItem[] = [];
  let transactions: Transaction[] = [];

  try {
    if (token) {
      events = await eventService.getAllPlatformEventsWithAttendees(token);
      transactions = await paymentService.getAllTransactions(token);
    }
  } catch (error) {
    console.error("Failed to fetch event management data:", error);
  }

  return (
    <main className="min-h-screen max-w-420 mx-auto">
      <EventManagementClient
        events={events}
        transactions={transactions}
      />
    </main>
  );
}

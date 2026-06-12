import { Suspense } from "react";
import { EventManagementClient } from "../../../components/dashboard/event-management/EventManagementClient";
import { eventService, EventItem } from "@/service/event.service";
import { paymentService, Transaction } from "@/service/payment.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import EventManagementSkeleton from "@/components/dashboard/EventManagementSkeletion";

async function EventManagementData() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken || "";

  let events: EventItem[] = [];
  let transactions: Transaction[] = [];

  try {
    if (token) {
      [events, transactions] = await Promise.all([
        eventService.getAllPlatformEventsWithAttendees(token),
        paymentService.getAllTransactions(token),
      ]);
    }
  } catch (error) {
    console.error("Failed to fetch event management data:", error);
  }

  return <EventManagementClient events={events} transactions={transactions} />;
}

export default async function EventManagementPage() {
  return (
    <div className="w-full max-w-475 mx-auto">
      <Suspense fallback={<EventManagementSkeleton />}>
        <EventManagementData />
      </Suspense>
    </div>
  );
}

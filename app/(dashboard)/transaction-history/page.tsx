import Header from "../../../components/dashboard/header/Header";
import { TransactionTableSection } from "../../../components/dashboard/transaction-history/TransactionTableSection";
import { getTransactions, getEventSummaries } from "@/actions/transaction.action";
import { eventService, EventItem } from "@/service/event.service";
import { paymentService, Transaction } from "@/service/payment.service";
import { authService } from "@/service/auth.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export default async function TransactionHistoryPage() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken || "";

  let events: EventItem[] = [];
  let transactions: Transaction[] = [];
  const attendeeCountByPostId: Record<string, number> = {};
  let isOrganizer = false;

  const [profileResponse, typedTransactions, typedEvents] = await Promise.all([
    token ? authService.getProfileMe(token) : Promise.resolve(null),
    getTransactions(),
    getEventSummaries(),
  ]);

  try {
    if (token && profileResponse) {
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
    console.error("Failed to fetch transaction history data:", error);
  }

  return (
    <main className="min-h-screen z-10">
      <Header
        titlePrimary="Transaction"
        titleSecondary="History"
        description="Monitor participant responses and review insights from completed community surveys."
      />
      <div className="w-full min-w-0 max-w-475 mx-auto pr-8 lg:pr-12 lg:pl-12">
        <TransactionTableSection
          transactions={typedTransactions}
          events={typedEvents}
          rawEvents={events}
          rawTransactions={transactions}
          attendeeCountByPostId={attendeeCountByPostId}
          isOrganizer={isOrganizer}
        />
      </div>
    </main>
  );
}

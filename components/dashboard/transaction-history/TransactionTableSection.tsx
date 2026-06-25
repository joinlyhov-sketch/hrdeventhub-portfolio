"use client";

import { useState, useMemo } from "react";
import { Transaction, Event } from "../../../types/transaction";
import { TransactionTable } from "./TransactionTable";
import { EventSidebar } from "./EventSidebar";
import { StatsCardsSection } from "./StatsCardsSection";
import { EventItem } from "@/service/event.service";
import { Transaction as RawTransaction } from "@/service/payment.service";

interface TransactionTableSectionProps {
  transactions: Transaction[];
  events: Event[];
  rawEvents: EventItem[];
  rawTransactions: RawTransaction[];
  attendeeCountByPostId: Record<string, number>;
  isOrganizer: boolean;
}

export function TransactionTableSection({
  transactions,
  events,
  rawEvents,
  rawTransactions,
  attendeeCountByPostId,
  isOrganizer,
}: TransactionTableSectionProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>();

  const filteredTransactions = useMemo(() => {
    if (!selectedEventId) return transactions;
    return transactions.filter((tx) => tx.eventId === selectedEventId);
  }, [transactions, selectedEventId]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return undefined;
    return events.find((e) => e.id === selectedEventId);
  }, [events, selectedEventId]);

  return (
    <div className="space-y-6">
      <StatsCardsSection
        events={rawEvents}
        transactions={rawTransactions}
        attendeeCountByPostId={attendeeCountByPostId}
        isOrganizer={isOrganizer}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TransactionTable
            data={filteredTransactions}
            selectedEvent={selectedEvent}
          />
        </div>
        <div>
          <EventSidebar
            events={events}
            selectedEventId={selectedEventId}
            onSelectEvent={setSelectedEventId}
          />
        </div>
      </div>
    </div>
  );
}

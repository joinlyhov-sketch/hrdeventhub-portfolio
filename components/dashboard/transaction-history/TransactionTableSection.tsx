"use client";

import { useState, useMemo } from "react";
import { Transaction, Event } from "../../../types/transaction";
import { TransactionTable } from "./TransactionTable";
import { EventSidebar } from "./EventSidebar";

interface TransactionTableSectionProps {
  transactions: Transaction[];
  events: Event[];
}

export function TransactionTableSection({
  transactions,
  events,
}: TransactionTableSectionProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>();

  const filteredTransactions = useMemo(() => {
    if (!selectedEventId) {
      return transactions;
    }
    return transactions.filter((tx) => tx.eventId === selectedEventId);
  }, [transactions, selectedEventId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Transaction Table - Takes 2 columns on large screens */}
      <div className="lg:col-span-2">
        <TransactionTable data={filteredTransactions} />
      </div>

      {/* Event Sidebar */}
      <div>
        <EventSidebar
          events={events}
          selectedEventId={selectedEventId}
          onSelectEvent={setSelectedEventId}
        />
      </div>
    </div>
  );
}

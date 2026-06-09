"use client";

import { useState } from "react";

import { Calendar, CalendarDays } from "lucide-react";

import { StatsCardsSection } from "../transaction-history/StatsCardsSection";
import { EventManagementTable } from "./EventManagementTable";
import { EventItem } from "@/service/event.service";
import { Transaction } from "@/service/payment.service";
import Search from "../../site/search/Search";
import ContentTypePopover from "@/components/site/pop-up/contents/pop-over-content";
import { PopoverItem } from "@/components/site/pop-up/contents/pop-over-content";

interface EventManagementClientProps {
  events: EventItem[];
  transactions: Transaction[];
}

const contentMenuOptions: PopoverItem[] = [
  { label: "Event", icon: Calendar, href: "/event-management/creation/event " },
];

export function EventManagementClient({
  events,
  transactions,
}: EventManagementClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <StatsCardsSection
        events={events}
        transactions={transactions}
      />

      <div className="bg-background rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="type-subtitle font-bold text-secondary flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-secondary" strokeWidth={2} />
            <span>All Events</span>
          </h2>
        </div>
        <div className="flex items-center justify-end mb-3 gap-2">
          <div className="flex items-center justify-end mb-6 gap-2 w-full box-border">
            <Search
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for events..."
            />
            <ContentTypePopover items={contentMenuOptions} />
          </div>
        </div>

        <EventManagementTable
          events={events}
          searchTerm={searchTerm}
        />
      </div>
    </div>
  );
}

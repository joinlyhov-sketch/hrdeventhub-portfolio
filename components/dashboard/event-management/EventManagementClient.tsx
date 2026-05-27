"use client";

import { useState } from "react";

import { Calendar, CalendarDays, FileText, Megaphone } from "lucide-react";

import { StatsCardsSection } from "../transaction-history/StatsCardsSection";
import { EventManagementTable } from "./EventManagementTable";
import { EventManagement } from "../../../types/event-management";
import { StatCard } from "../../../types/transaction";
import Search from "../../site/search/Search";
import ContentTypePopover from "@/components/site/pop-up/contents/pop-over-content";
import { PopoverItem } from "@/components/site/pop-up/contents/pop-over-content";

interface EventManagementClientProps {
  events: EventManagement[];
  stats: StatCard[];
}
  const contentMenuOptions: PopoverItem[] = [
  { label: "Announcement", icon: Megaphone, href: "/event-management/creation/announcement" },
  { label: "Article", icon: FileText, href: "/event-management/creation/article" },
  { label: "Event", icon: Calendar, href: "/event-management/creation/event "},
];
export function EventManagementClient({
  events,
  stats,
}: EventManagementClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <StatsCardsSection stats={stats} />

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
            <ContentTypePopover items={contentMenuOptions}/>
          </div>
        </div>

        <EventManagementTable events={events} searchTerm={searchTerm} />
      </div>
    </div>
  );
}

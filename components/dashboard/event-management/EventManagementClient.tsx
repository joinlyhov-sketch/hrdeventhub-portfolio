"use client";

import { useState } from "react";

import { Plus, CalendarDays } from "lucide-react";

import { StatsCardsSection } from "../transaction-history/StatsCardsSection";

import { Button } from "../../ui/button";

import { EventManagementTable } from "./EventManagementTable";
import { EventManagement } from "../../../types/event-management";
import { StatCard } from "../../../types/transaction";
import Search from "../../site/search/Search";

interface EventManagementClientProps {
  events: EventManagement[];
  stats: StatCard[];
}

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
            <button className="bg-primary p-2 text-white rounded-full hover:bg-primary-hover transition-all cursor-pointer shadow-sm flex items-center justify-center overflow-hidden w-[40px] h-[40px] relative z-10">
              <div className="transform transition-transform duration-300 flex items-center justify-center">
                <Plus size={20} />
              </div>
            </button>
          </div>
        </div>

        <EventManagementTable events={events} searchTerm={searchTerm} />
      </div>
    </div>
  );
}

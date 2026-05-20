"use client";

import { useState } from "react";

import { Plus, Search, CalendarDays } from "lucide-react";

import { StatsCardsSection } from "../transaction-history/StatsCardsSection";

import { Input } from "../../ui/input";

import { Button } from "../../ui/button";

import { EventManagementTable } from "./EventManagementTable";
import { EventManagement } from "../../../types/event-management";
import { StatCard } from "../../../types/transaction";

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

      <div className="bg-background rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="type-subtitle font-bold text-secondary flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-secondary" strokeWidth={2} />

            <span>All Events</span>
          </h2>
        </div>

        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="relative w-full">
            <Search className="absolute left-1 h-4 top-2 text-gray-400" />
            <Input
              placeholder="Search for events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2 rounded-lg border-gray-300 w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => alert("Button Add Event")}
              className="bg-primary hover:bg-primary-hover pl-2 py-4 w-16 rounded-4xl text-white gap-2 font-semibold shadow-sm"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </Button>
          </div>
        </div>

        <EventManagementTable events={events} searchTerm={searchTerm} />
      </div>
    </div>
  );
}

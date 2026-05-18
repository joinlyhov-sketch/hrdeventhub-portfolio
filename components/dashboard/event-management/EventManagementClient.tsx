"use client";

import { useState } from "react";

import { ArrowUpDown, Plus, Search, CalendarDays } from "lucide-react";

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

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#0F2854] flex items-center gap-2">
            <CalendarDays
              className="w-5 h-5 text-secondary type-title"
              strokeWidth={2}
            />

            <span>All Events</span>
          </h2>
        </div>

        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="relative w-full">
            <Search className="absolute w-full h-4 top-2 right-[650px] text-gray-400" />
            <Input
              placeholder="Search for events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2 rounded-lg border-gray-300 w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors">
              <ArrowUpDown className="w-4 h-4 text-gray-600" />
            </button>

            <Button className="bg-secondary hover:bg-[#153973] text-white gap-2 rounded-lg font-semibold shadow-sm">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Add Event
            </Button>
          </div>
        </div>

        <EventManagementTable events={events} searchTerm={searchTerm} />
      </div>
    </div>
  );
}

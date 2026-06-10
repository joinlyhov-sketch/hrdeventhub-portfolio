"use client";

import { useState, useMemo } from "react";
import { Event } from "../../../types/transaction";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface EventSidebarProps {
  events: Event[];
  selectedEventId?: string;
  onSelectEvent: (eventId?: string) => void;
}

const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case "Published":
      return "bg-yellow-100 text-action";
    case "Active":
      return "bg-[#E6F9F1] text-accent";
    case "Cancel":
      return "bg-[#FEECEB] text-[#EA1D24]";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusBorderColor = (status: string): string => {
  switch (status) {
    case "Published":
      return "border-l-yellow-500";
    case "Active":
      return "border-l-teal-500";
    case "Cancel":
      return "border-l-red-500";
    default:
      return "border-l-gray-300";
  }
};

const getStatusIcon = (status: string): string => {
  switch (status) {
    case "Published":
    case "Active":
    case "Cancel":
    default:
      return "●";
  }
};

export function EventSidebar({
  events,
  selectedEventId,
  onSelectEvent,
}: EventSidebarProps) {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2026);

  const availableYears = useMemo(() => {
    const years = [...new Set(events.map((e) => e.year))];
    return years.sort((a, b) => b - a);
  }, [events]);

  const filteredEvents = useMemo(() => {
    const yearEvents = events.filter((e) => e.year === selectedYear);
    return showAllEvents ? yearEvents : yearEvents.slice(0, 4);
  }, [events, showAllEvents, selectedYear]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="type-subtitle-24 font-semibold text-secondary">
          All Event
        </h3>

        <Select
          value={String(selectedYear)}
          onValueChange={(val) => setSelectedYear(Number(val))}
        >
          <SelectTrigger className="w-20 h-8 text-xs text-gray-400 border border-gray-200 rounded px-2 py-1 cursor-pointer hover:border-gray-300 focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem
                key={year}
                value={String(year)}
                className="text-xs cursor-pointer text-primary focus:bg-blue-100 focus:text-blue-700 cursor-pointer"
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        className={`
          space-y-4
          overflow-x-hidden
          ${showAllEvents ? "max-h-150 overflow-y-auto" : "overflow-hidden"}
        `}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollbarGutter: "stable",
        }}
      >
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() =>
                onSelectEvent(
                  selectedEventId === event.id ? undefined : event.id,
                )
              }
              className={`
                border-b border-gray-200 border-l-4
                last:border-b-0 last:pb-0
                cursor-pointer transition-all px-3 py-3
                ${getStatusBorderColor(event.status)}
                ${
                  selectedEventId === event.id
                    ? "scale-95 ease-in-out duration-300 rounded-lg"
                    : "hover:bg-gray-50 rounded-lg"
                }
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-gray-500">{event.date}</p>
                <p className="text-xs text-gray-500">
                  Attendee: {event.attendees}
                </p>
              </div>
              <h4
                className={`type-subtitle text-secondary font-semibold mb-2 ${
                  selectedEventId === event.id ? "text-action" : "text-gray-900"
                }`}
              >
                {event.title}
              </h4>
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full type-detail font-semibold ${getStatusBadgeColor(event.status)}`}
                >
                  <span>{getStatusIcon(event.status)}</span>
                  {event.status}
                </span>
                <p className="text-subtitle font-bold text-primary">
                  ${event.amount.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-sm py-4">
            No events found
          </p>
        )}
      </div>

      <Button
        onClick={() => setShowAllEvents(!showAllEvents)}
        className="w-full mt-8 border border-primary text-primary bg-background hover:bg-blue-50 rounded-lg cursor-pointer"
      >
        {showAllEvents ? "Show Less" : "View All Event"}
      </Button>
    </div>
  );
}

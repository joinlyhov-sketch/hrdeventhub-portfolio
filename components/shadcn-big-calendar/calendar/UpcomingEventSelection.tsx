"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Loader2,
  MapPin,
} from "lucide-react";
import { useUpcomingEvents } from "@/hooks/use-upcoming-events";

type Props = {
  workspaceId?: string;
  role?: "admin" | "student" | "alumni" | "organizer";
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

export default function UpcomingEventSection({ workspaceId, role }: Props) {
  const { events, isLoading, error } = useUpcomingEvents({ workspaceId, role });
  const eventGroups = useMemo(() => {
    const groups = new Map<string, typeof events>();

    events.forEach((event) => {
      const startDate = new Date(event.eventStart);
      if (Number.isNaN(startDate.getTime())) return;

      const key = `${startDate.getFullYear()}-${startDate.getMonth()}`;
      const group = groups.get(key) ?? [];
      group.push(event);
      groups.set(key, group);
    });

    return Array.from(groups.values()).map((groupEvents) => {
      const groupDate = new Date(groupEvents[0].eventStart);

      return {
        key: `${groupDate.getFullYear()}-${groupDate.getMonth()}`,
        title: `${groupDate.toLocaleDateString("en-US", {
          month: "long",
        })} Events`,
        events: groupEvents,
      };
    });
  }, [events]);

  return (
    <section className="upcoming-events-section">
      <div className="upcoming-events-heading">
        <CalendarDays className="text-action" size={24} />
        <h2 className="type-title text-primary">
          Upcoming <span className="text-action">Event</span>
        </h2>
      </div>

      {isLoading && (
        <div className="calendar-status-indicator">
          <Loader2 size={14} className="animate-spin" />
          <span>Loading upcoming events...</span>
        </div>
      )}
      {error && !isLoading && (
        <div className="calendar-status-indicator calendar-status-error">
          <span>Failed to load events</span>
        </div>
      )}
      {!isLoading && !error && events.length === 0 && (
        <p className="text-sm text-muted-foreground">No upcoming events</p>
      )}

      <div className="upcoming-events-grid">
        {eventGroups.map((group) => (
          <div key={group.key} className="upcoming-event-group">
            <h3 className="upcoming-event-month">{group.title}</h3>

            <div className="upcoming-event-list">
              {group.events.map((event) => {
                const startDate = new Date(event.eventStart);
                const parsedEnd = new Date(event.eventEnd);
                const endDate =
                  !Number.isNaN(parsedEnd.getTime()) && parsedEnd > startDate
                    ? parsedEnd
                    : new Date(startDate.getTime() + 60 * 60 * 1000);
                const eventWorkspaceId = event.sourceWorkspaceId || workspaceId;

                return (
                  <article key={event.postId} className="upcoming-event-card">
                    <div className="upcoming-event-date">
                      <strong>
                        {startDate.getDate().toString().padStart(2, "0")}
                      </strong>
                      <span>
                        {startDate
                          .toLocaleDateString("en-US", { month: "short" })
                          .toUpperCase()}{" "}
                        {startDate.getFullYear()}
                      </span>
                    </div>

                    <div className="upcoming-event-content">
                      <h4>{event.title}</h4>
                      <div className="upcoming-event-meta">
                        <span>
                          <Clock3 size={13} />
                          <span>{formatTime(startDate)} - {formatTime(endDate)}</span>
                        </span>
                        <span>
                          <MapPin size={13} />
                          <span>{event.location?.locationName ?? "No location"}</span>
                        </span>
                      </div>
                    </div>

                    {eventWorkspaceId && (
                      <Link
                        href={`/group/${eventWorkspaceId}/event/${event.postId}`}
                        className="upcoming-event-link"
                      >
                        View Detail
                        <ChevronRight size={15} />
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

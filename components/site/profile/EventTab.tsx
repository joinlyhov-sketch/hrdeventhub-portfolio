"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { eventService, Participant } from "@/service/event.service";

interface EventTabProps {
  userId?: string; 
}

export default function EventTab({ userId }: EventTabProps) {
  const [events, setEvents] = useState<Participant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJEaXRhIiwibGFzdE5hbWUiOiJSZWN0b3IiLCJ1c2VySWQiOiJjMDcxMGE5Yy0yMzY2LTRiYTItYTY4Yi03NjMzMWUzYjU3MDEiLCJ1c2VybmFtZSI6InJlY3RvcmRpdGFAZ21haWwuY29tIiwic3ViIjoicmVjdG9yZGl0YUBnbWFpbC5jb20iLCJpYXQiOjE3ODA4NDczOTEsImV4cCI6MTc4MDkzMzc5MX0.EZNp6IcVy6JLxj4MdBHGN65iZOZtHb8yVt8xAjyH_As";
        
        const data = userId 
          ? await eventService.getParticipantsByUser(token, userId)
          : await eventService.getMyRegistrations(token);
          
        setEvents(data);
      } catch (error) {
        console.error("Error fetching event registrations:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return <div className="p-4 text-muted-foreground animate-pulse">Loading registrations...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="type-subtitle text-primary mb-2">
        {userId ? "Registered Events" : "My registrations"}
      </h3>
      <div className="space-y-3">
        {events.length > 0 ? (
          events.map((event, index) => (
            <div
              key={event.participantId || index}
              className="flex items-center justify-between p-4 border border-border rounded-lg bg-grey-50 hover:bg-grey-100 transition-colors duration-200"
            >
              <div className="flex gap-4 items-center">
                <div className="w-24 h-16 bg-muted border border-border/40 rounded-md shrink-0 overflow-hidden relative">
                  <img
                    src={event.user?.profilePicture || "/images/placeholder.png"}
                    alt={event.postId}
                    className="w-full h-full object-cover block"
                  />
                </div>

                <div>
                  <p className="type-desc-semibold text-secondary">
                    {event.postId}
                  </p>
                  <p className="type-detail-small-medium text-muted-foreground">
                    {formatDate(event.registeredAt)}
                  </p>
                </div>
              </div>

              <a 
                href={`/group/a97b2c41-e02d-4ecb-a85d-b56c499fae8f/event/${event.postId}`} 
                className="shrink-0"
              >
                <button className="flex items-center gap-1 type-detail-small-medium text-muted-foreground border border-border bg-card px-3 py-1.5 rounded-md hover:border-primary transition-all duration-200 cursor-pointer">
                  View Detail <ChevronRight size={14} />
                </button>
              </a>
            </div>
          ))
        ) : (
          <div className="p-8 text-center border border-dashed border-border rounded-lg text-muted-foreground">
            No events found.
          </div>
        )}
      </div>
    </div>
  );
}
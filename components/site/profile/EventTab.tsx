"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { eventService, Participant } from "@/service/event.service";
import { useSession } from "next-auth/react";
import { getMediaUrl } from "@/libs/media";

interface EventTabProps {
  userId?: string;
}

export default function EventTab({ userId }: EventTabProps) {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Participant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = session?.accessToken;
    if (!token) return;

    async function fetchEvents() {
      try {
        const data = userId
          ? await eventService.getParticipantsByUser(token!, userId)
          : await eventService.getMyRegistrations(token!);

        setEvents(data);
      } catch (error) {
        console.error("Error fetching event registrations:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [userId, session?.accessToken]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!session?.accessToken) {
    return (
      <div className="p-4 text-muted-foreground">
        Please sign in to view events.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-muted-foreground animate-pulse">
        Loading registrations...
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-4 pr-1 scrollbar-thumb-grey-200 scrollbar-track-transparent scrollbar-none">
      <h3 className="type-subtitle text-primary mb-2">
        {userId ? "Registered Events" : "My registrations"}
      </h3>
      <div className="space-y-3">
        {events.length > 0 ? (
          events.map((item, index) => {
            const eventDetails = item.post;
            const coverImage =
              getMediaUrl(
                eventDetails?.media?.find((m) => m.isCover)?.filePath,
              ) || "/images/placeholder.png";
            return (
              <div
                key={item.participantId || index}
                className="flex items-center justify-between p-4 border border-border rounded-lg bg-grey-50 hover:bg-grey-100 transition-colors duration-200"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-16 bg-muted border border-border/40 rounded-md shrink-0 overflow-hidden relative">
                    <Image
                      src={coverImage}
                      alt={eventDetails?.title || "Event Image"}
                      fill
                      unoptimized
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/images/placeholder.png";
                      }}
                    />
                  </div>

                  <div>
                    <p className="type-desc-semibold text-secondary">
                      {eventDetails?.title || "Untitled Event"}
                    </p>
                    <p className="type-detail-small-medium text-muted-foreground">
                      {eventDetails?.eventStart
                        ? formatDate(eventDetails.eventStart)
                        : formatDate(item.registeredAt)}
                    </p>
                  </div>
                </div>

                <a
                  href={`/group/${eventDetails?.workspaceId}/event/${item.postId}`}
                  className="shrink-0"
                >
                  <button className="flex items-center gap-1 type-detail-small-medium text-muted-foreground border border-border bg-card px-3 py-1.5 rounded-md hover:border-primary transition-all duration-200 cursor-pointer">
                    View Detail <ChevronRight size={14} />
                  </button>
                </a>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center border border-dashed border-border rounded-lg text-muted-foreground">
            No events found.
          </div>
        )}
      </div>
    </div>
  );
}

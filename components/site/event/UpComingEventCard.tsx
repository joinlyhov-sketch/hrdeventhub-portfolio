"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { useWorkspacePosts } from "@/hooks/use-workspace-posts";

interface UpComingEventCardProps {
  groupid: string;
}

function parseCustomEventDate(dateStr: string): Date | null {
  try {
    const parts = dateStr.split(", ");
    if (parts.length < 4) return null;

    const monthDayStr = parts[1];
    const yearStr = parts[2];
    const timeStr = parts[3];
    const cleanStandardString = `${monthDayStr}, ${yearStr} ${timeStr}`;
    const parsedDate = new Date(cleanStandardString);

    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  } catch (error) {
    return null;
  }
}

export default function UpComingEventCard({ groupid }: UpComingEventCardProps) {
  const { posts, isLoading } = useWorkspacePosts(groupid);

  const upcomingEvents = useMemo(() => {
    if (!posts || posts.length === 0) return [];

    const now = new Date().getTime();

    return posts
      .filter((post) => {
        if (post.category !== "event" || !post.eventStart) return false;

        const eventDateObj = parseCustomEventDate(post.eventStart);
        if (!eventDateObj) return false;
        return eventDateObj.getTime() >= now;
      })
      .sort((a, b) => {
        const dateA = parseCustomEventDate(a.eventStart!)?.getTime() ?? 0;
        const dateB = parseCustomEventDate(b.eventStart!)?.getTime() ?? 0;
        return dateA - dateB;
      })
      .map((post, index) => {
        const parts = post.eventStart!.split(", ");
        let monthStr = "EVENT";
        let dayStr = "??";

        if (parts[1]) {
          const monthAndDay = parts[1].split(" ");
          if (monthAndDay[0])
            monthStr = monthAndDay[0].substring(0, 3).toUpperCase();
          if (monthAndDay[1]) dayStr = monthAndDay[1];
        }
        const startTimeStr = parts[3] ?? "TBD";
        const displayTime = post.eventEnd
          ? `${startTimeStr} - ${post.eventEnd}`
          : startTimeStr;

        return {
          id: post.postId,
          month: monthStr,
          day: dayStr,
          title: post.title,
          time: displayTime,
          variant: index % 2 === 0 ? "blue" : "green",
        };
      }).slice(0, 3);
  }, [posts]);

  if (isLoading) {
    return (
      <div className="w-full max-w-md bg-background rounded-[12px] border border-border p-5 shadow-sm animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-10" />
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-14 h-14 bg-muted rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background rounded-[12px] border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-10">
        <h3 className="type-subtitle font-extrabold text-primary min-w-0 truncate">
          Upcoming Events
        </h3>
        <Link href="/calendar" className="shrink-0">
          <button className="type-detail text-primary hover:underline hover:cursor-pointer whitespace-nowrap">
            View Calendar
          </button>
        </Link>
      </div>

      {upcomingEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 opacity-40 w-full">
          <div className="p-4 bg-grey-100 rounded-2xl mb-4 shrink-0">
            <Calendar size={48} className="text-grey-400" />
          </div>
          <p className="type-detail font-medium text-muted-foreground text-center">
            No upcoming events.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
          {upcomingEvents.map((event) => (
            <Link
              key={event.id}
              href={`/group/${groupid}/event/${event.id}`}
              className="cursor-pointer hover:bg-primary/5 p-2 rounded-2xl duration-300"
            >
              <div className="flex items-center gap-4 min-w-0 w-full">
                <div
                  className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl shrink-0 select-none ${
                    event.variant === "blue"
                      ? "bg-[#EFF6FF] text-[#1E40AF]"
                      : "bg-[#ECFDF5] text-[#047857]"
                  }`}
                >
                  <span className="text-[10px] font-bold tracking-wider uppercase opacity-90">
                    {event.month}
                  </span>
                  <span className="text-2xl font-bold leading-none mt-0.5">
                    {event.day}
                  </span>
                </div>

                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <h4 className="text-base font-bold text-grey-900 leading-snug truncate">
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-grey-400 min-w-0">
                    <Clock size={14} className="shrink-0" />
                    <span className="truncate">{event.time}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

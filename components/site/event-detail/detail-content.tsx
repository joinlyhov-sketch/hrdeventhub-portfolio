"use client";
import { useEffect, useState } from "react";
import { CalendarMinus2, Clock, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import { postService } from "@/service/post.service";

interface DetailContentProps {
  title?: string;
  content?: string;
  eventStart?: string;
  eventEnd?: string;
  locationName?: string;
  postId?: string;
}

export default function DetailContentComponent({
  title = "",
  content = "",
  eventStart = "",
  eventEnd = "",
  locationName = "",
  postId,
}: DetailContentProps) {
  const [joinedCount, setJoinedCount] = useState<number | null>(null);
  const { data: session } = useSession();

  const fetchRegistrants = async () => {
    if (!postId || !session?.accessToken) return;
    try {
      const data = await postService.getParticipants(postId, session.accessToken, 1, 100);
      setJoinedCount(data?.payload?.length ?? 0);
    } catch {
      setJoinedCount(0);
    }
  };

  useEffect(() => {
    if (!postId || !session?.accessToken) return;
    fetchRegistrants();
  }, [postId, session?.accessToken]);

  const parts = eventStart ? eventStart.split(",").map((s) => s.trim()) : [];
  const dateSegment =
    parts.length >= 3
      ? `${parts[1]}, ${parts[2]}`
      : (parts[0] ?? "Date Pending");
  const timeSegment = parts.length >= 4 ? parts[parts.length - 1] : "";

  return (
    <section className="flex flex-col justify-between gap-y-3.2 h-full w-full ml-1">
      <section className="space-y-1">
        <p className="text-subtitle font-semibold text-secondary">
          {title || "No Title Specified"}
        </p>
        <p className="text-desc text-grey-500">
          {content || "No content details provided."}
        </p>
      </section>

      <section className="flex flex-col gap-y-2">
        <span className="flex items-center gap-x-3">
          <CalendarMinus2 size={18} className="text-grey-500" />
          <p className="text-detail-semibold font-semibold text-grey-700">
            {dateSegment || "Date Pending"}
          </p>
        </span>
        <span className="flex items-center gap-x-3">
          <Clock size={18} className="text-grey-500" />
          <p className="text-detail-semibold font-semibold text-grey-700">
            {timeSegment
              ? `${timeSegment} - ${eventEnd}`
              : eventEnd || "Time Pending"}
          </p>
        </span>
        <span className="flex items-center gap-x-3">
          <MapPin size={20} className="text-grey-500" />
          <p className="text-detail-semibold font-semibold text-grey-700">
            {locationName || "No location provided"}
          </p>
        </span>
      </section>

      <section className="flex flex-col gap-y-2">
        <section className="flex items-center gap-x-2.5 pt-2">
          <p className="text-detail text-grey-600">
            Joined by{" "}
            <span className="font-semibold">
              {joinedCount === null ? "—" : joinedCount}
            </span>{" "}
            others
          </p>
          <section className="flex -space-x-2.5 isolation-auto" />
        </section>
      </section>
    </section>
  );
}
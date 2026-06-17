"use client";
import { useEffect, useState } from "react";
import { CalendarMinus2, Clock, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { postService } from "@/service/post.service";

interface DetailContentProps {
  title?: string;
  content?: string;
  eventStart?: string;
  eventEnd?: string;
  locationName?: string;
  postId?: string;
}

interface ParticipantUser {
  appUserId: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
}

interface Participant {
  user: ParticipantUser;
}

const MAX_AVATARS = 4;

export default function DetailContentComponent({
  title = "",
  content = "",
  eventStart = "",
  eventEnd = "",
  locationName = "",
  postId,
}: DetailContentProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [joinedCount, setJoinedCount] = useState<number | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!postId || !session?.accessToken) return;
    const token = session.accessToken;
    const fetchRegistrants = async () => {
      try {
        const data = (await postService.getParticipants(
          postId,
          token,
          1,
          100,
        )) as { payload?: Participant[] };
        const list = data.payload ?? [];
        setParticipants(list);
        setJoinedCount(list.length);
      } catch {
        setParticipants([]);
        setJoinedCount(0);
      }
    };
    fetchRegistrants();
  }, [postId, session?.accessToken]);

  const parts = eventStart ? eventStart.split(",").map((s) => s.trim()) : [];
  const dateSegment =
    parts.length >= 3
      ? `${parts[1]}, ${parts[2]}`
      : (parts[0] ?? "Date Pending");
  const timeSegment = parts.length >= 4 ? parts[parts.length - 1] : "";

  const visibleParticipants = participants.slice(0, MAX_AVATARS);
  const overflowCount = Math.max(participants.length - MAX_AVATARS, 0);

  return (
    <section className="flex flex-col justify-between gap-y-3.2 h-full w-full ml-1">
      <section className="space-y-1">
        <p className="text-subtitle font-semibold text-secondary">
          {title || "No Title Specified"}
        </p>
        <p className="text-desc text-grey-500 line-clamp-3">
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

      <section className="flex flex-col gap-y-2 mb-4">
        <section className="flex items-center gap-x-2.5 pt-2">
          <p className="text-detail text-grey-600">
            Joined by{" "}
            <span className="font-semibold">
              {joinedCount === null ? "—" : joinedCount}
            </span>{" "}
            others
          </p>
          <section className="flex -space-x-2.5 isolation-auto">
            {visibleParticipants.map(({ user }) => {
              const fullName =
                [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                user.username;

              const avatar = (
                <span className="relative h-7 w-7 rounded-full ring-2 ring-white overflow-hidden bg-grey-200 flex items-center justify-center">
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      alt={fullName}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-semibold text-grey-600">
                      {fullName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
              );

              return (
                <Link
                  key={user.appUserId}
                  href={`/profile/${user.appUserId}`}
                  className="relative"
                >
                  {avatar}
                </Link>
              );
            })}
            {overflowCount > 0 && (
              <span className="relative h-7 w-7 rounded-full ring-2 ring-white bg-grey-100 flex items-center justify-center text-[10px] font-semibold text-grey-600">
                +{overflowCount}
              </span>
            )}
          </section>
        </section>
      </section>
    </section>
  );
}
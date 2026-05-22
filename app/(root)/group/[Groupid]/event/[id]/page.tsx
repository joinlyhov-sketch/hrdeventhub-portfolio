import { MOCK_EVENTS, CURRENT_USER } from "../../../../../../data/event-detail";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import EventDetailClient from "../../../../../../components/site/event-detail/event-detail-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Detail",
};

export default function EventDetailPage() {
  const event = MOCK_EVENTS[0];
  const isAdminOrOrganizer = CURRENT_USER.role === "Student" || CURRENT_USER.role === "Admin";

  return (
    <section className="w-full flex flex-col gap-y-4 bg-background">
      <section className="flex gap-x-1 items-center text-grey-400 type-detail">
        <Link href="/group/1">Events</Link>
        <ChevronRight size={14} />
        <span className="text-action type-detail-semibold">Sport Reunion Events</span>
      </section>

      <EventDetailClient event={event} isAdminOrOrganizer={isAdminOrOrganizer} />
    </section>
  );
}
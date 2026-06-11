import Link from "next/link";
import { ChevronRight } from "lucide-react";
import EventDetailClient from "@/components/site/event-detail/event-detail-client";
import { getPostDetailAction } from "@/actions/post.action";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Event Detail" };

interface PageProps {
  params: Promise<{
    groupid: string;
    id: string;
  }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const groupid = resolvedParams?.groupid;
  const postId = resolvedParams?.id;

  if (!groupid || !postId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <p className="text-grey-500 type-desc-semibold">Invalid route parameters provided.</p>
      </div>
    );
  }

  let eventData = null;
  try {
    eventData = await getPostDetailAction(groupid, postId);
  } catch (error) {
    console.error("Failed to fetch event payload properties:", error);
  }

  if (!eventData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <p className="text-grey-500 type-desc-semibold">Event detail records could not be found.</p>
        <Link href={`/group/${groupid}`} className="text-primary underline type-detail">
          Return to home feed
        </Link>
      </div>
    );
  }

  return (
    <section className="w-full flex flex-col gap-y-4 bg-background">
      <section className="flex gap-x-1 items-center text-grey-400 type-detail">
        <Link href={`/group/${groupid}`} className="hover:text-primary transition-colors">
          Events
        </Link>
        <ChevronRight size={14} />
        <span className="text-action type-detail-semibold">
          {eventData.title}
        </span>
      </section>
      <EventDetailClient event={eventData} workspaceId={groupid} />
    </section>
  );
}

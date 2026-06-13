import { Metadata } from "next";
import GroupMemberCard from "@/components/site/event/GroupMemberCard";
import UpComingEventCard from "@/components/site/event/UpComingEventCard";
import FilteredFeed from "@/components/site/event/FilteredFeed";

export const metadata: Metadata = {
  title: "Event Feed",
};

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ groupid: string }>;
  searchParams: Promise<{ postId?: string; type?: string }>;
}) {
  const { groupid } = await params;
  const { postId, type } = await searchParams;

  return (
    <main className="min-h-screen w-full bg-background">
      <div className="w-full">
        <div className="flex flex-col gap-4 sm:gap-6 xl:flex-row">
          <section className="min-w-0 flex-1">
            <FilteredFeed
              groupid={groupid}
              deepLinkPostId={postId}
              deepLinkType={type}
            />
          </section>
          <aside className="hidden xl:block xl:w-85 shrink-0">
            <div className="sticky top-20 space-y-4">
              <UpComingEventCard groupid={groupid} />
              <GroupMemberCard groupid={groupid} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
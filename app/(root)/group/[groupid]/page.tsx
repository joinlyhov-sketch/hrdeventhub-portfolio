import { Suspense } from "react";
import { Metadata } from "next";
import GroupMemberCard from "@/components/site/event/GroupMemberCard";
import UpComingEventCard from "@/components/site/event/UpComingEventCard";
import FilteredFeed from "@/components/site/event/FilteredFeed";
import MobileFeedTabs from "@/components/site/event/MobileFeedTabs";

export const metadata: Metadata = {
  title: "Event Feed",
};

export default async function Page({
  params,
}: {
  params: Promise<{ groupid: string }>;
}) {
  const { groupid } = await params;

  return (
    <main className="min-h-screen w-full bg-background">
      <div className="w-full">
        <MobileFeedTabs
          groupid={groupid}
        />
        <div className="hidden xl:flex flex-col gap-6 xl:flex-row">
          <section className="min-w-0 flex-1">
            <Suspense>
              <FilteredFeed
                groupid={groupid}
              />
            </Suspense>
          </section>
          <aside className="xl:w-85 shrink-0">
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
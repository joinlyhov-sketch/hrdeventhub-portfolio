import { Metadata } from "next";
import GroupMemberCard from "../../../../components/site/event/GroupMemberCard";
import UpComingEventCard from "../../../../components/site/event/UpComingEventCard";
import FilteredFeed from "../../../../components/site/event/FilteredFeed";

export const metadata: Metadata = {
  title: "Event Feed",
};

export default async function Page({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  return (
    <main className="min-h-screen w-full bg-background">
      <div className="mx-auto w-full max-w-420">
        <div className="flex flex-col gap-6 xl:flex-row">
          <section className="w-full flex-1">
            <FilteredFeed groupId={groupId} />
          </section>
          <aside className="w-full xl:sticky xl:right-10 xl:top-20 xl:w-85 xl:self-start">
            <div className="space-y-4 fixed right-4">
              <UpComingEventCard />
              <GroupMemberCard />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
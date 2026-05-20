import { Metadata } from "next";
import GroupMemberCard from "../../../../components/site/event/GroupMemberCard";
import UpComingEventCard from "../../../../components/site/event/UpComingEventCard";
import FilteredFeed from "../../../../components/site/event/FilteredFeed";

export const metadata: Metadata = {
  title: "Event Hub Platform",
};

export default function Page() {
  return (
    <main className="min-h-screen">
      <div className="grid grid-cols-11 gap-5">
        <section className="col-span-8 space-y-4">
          <FilteredFeed role="admin" />
        </section>
        
        <aside className="col-span-3 space-y-2">
          <UpComingEventCard />
          <GroupMemberCard />
        </aside>
      </div>
    </main>
  );
}
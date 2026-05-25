import { Metadata } from "next";
import GroupMemberCard from "../../../../components/site/event/GroupMemberCard";
import UpComingEventCard from "../../../../components/site/event/UpComingEventCard";
import FilteredFeed from "../../../../components/site/event/FilteredFeed";
import { MOCK_CURRENT_USER } from "../../../../data/mock-user";

export const metadata: Metadata = {
  title: "Event Feed",
};

export default function Page() {
  return (
    <main className="min-h-screen w-full">
      <div className="mx-auto max-w-full">
        <div className="flex flex-col gap-6 2xl:flex-row">
          <section className="w-full 2xl:max-w-4xl flex-1">
            <FilteredFeed role={MOCK_CURRENT_USER.role} />
          </section>

          <aside className="hidden 2xl:block">
            <div className="fixed right-6 top-24 w-80 space-y-4">
              <UpComingEventCard />
              <GroupMemberCard />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

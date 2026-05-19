import { Search, Filter, Folder } from "lucide-react";
import { Metadata } from "next";
import { AnnouncementCard } from "../../../../components/site/event/AnnouncementCard";
import { ArticleCard } from "../../../../components/site/event/ArticleCard";
import { EventCard } from "../../../../components/site/event/EventCard";
import { PollCard } from "../../../../components/site/event/PollCard";
import { SurveyCard } from "../../../../components/site/event/SurveyCard";
import { PinnedCard } from "../../../../components/site/event/PinnedCard";
import GroupMemberCard from "../../../../components/site/event/GroupMemberCard";
import UpComingEventCard from "../../../../components/site/event/UpComingEventCard";

export const metadata: Metadata = {
  title: "Event Hub Platform",
};

export default function Page() {
  return (
    <main className=" min-h-screen">
      <div className="grid grid-cols-11 gap-5">
        <section className="col-span-8 space-y-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative grow">
              <input
                type="text"
                placeholder="Search for events..."
                className="w-full pl-6 pr-12 py-3 border border-grey-100 rounded-full type-detail outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                <Search size={18} />
              </button>
            </div>
            <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full type-detail-semibold hover:bg-primary-hover transition-all cursor-pointer shadow-sm">
              <Filter size={18} />
              Filter by category
            </button>
          </div>
          <p>Pinned</p>
          <PinnedCard />
          <EventCard />
          <AnnouncementCard />
          <PollCard />
          <SurveyCard />
          <ArticleCard />
        </section>
        <aside className="col-span-3 space-y-2">
          <UpComingEventCard />
          <GroupMemberCard />
        </aside>
      </div>
    </main>
  );
}

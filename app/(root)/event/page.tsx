import { Search, Filter } from "lucide-react";
import { Metadata } from "next";
import { AnnouncementCard } from "../../../components/site/event/AnnouncementCard";
import { ArticleCard } from "../../../components/site/event/ArticleCard";
import { EventCard } from "../../../components/site/event/EventCard";
import { PollCard } from "../../../components/site/event/PollCard";
import { SurveyCard } from "../../../components/site/event/SurveyCard";
import { PinnedCard } from "../../../components/site/event/PinnedCard";
import GroupMemberCard from "../../../components/site/event/GroupMemberCard";
import UpComingEventCard from "../../../components/site/event/UpComingEventCard";
export const metadata: Metadata = {
  title: "Event Hub Platform",
};

export default function Page() {
  return (
    <main className=" min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary p-2 rounded-lg text-white">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        </div>
        <div>
          <span className="type-desc-small-semibold text-primary bg-muted px-2 py-0.5 rounded uppercase">
            Internal
          </span>
          <h1 className="type-subtitle text-primary">14th Generation Group</h1>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-[57px]">
        <section className="col-span-8 space-y-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-grow">
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
          <PinnedCard />
          <EventCard />
          <AnnouncementCard/>
          <PollCard />
          <SurveyCard />
          <ArticleCard/>
        </section>

        <aside className="col-span-4 space-y-8">
          <UpComingEventCard />
          <GroupMemberCard />
        </aside>
      </div>
    </main>
  );
}

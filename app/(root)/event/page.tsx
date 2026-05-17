import { Search, Filter, Calendar } from "lucide-react";
import { Metadata } from "next";
import { AnnouncementCard } from "../../../components/site/event/AnnouncementCard";
import { ArticleCard } from "../../../components/site/event/ArticleCard";
import { EventCard } from "../../../components/site/event/EventCard";
import { PollCard } from "../../../components/site/event/PollCard";
import { SurveyCard } from "../../../components/site/event/SurveyCard";
export const metadata: Metadata = {
  title: "Event Hub Platform",
};

export default function Page() {
  return (
    <main className=" min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary p-2 rounded-lg text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
        <div>
          <span className="type-desc-small-semibold text-primary bg-muted px-2 py-0.5 rounded uppercase">
            Internal
          </span>
          <h1 className="type-subtitle text-primary">14th Generation Group</h1>
        </div>
      </div>

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

      <div className="grid grid-cols-12 gap-[57px]">
        <section className="col-span-8 space-y-8">
          <EventCard
            author={{
              name: "Leng Chingmony",
              avatar: "https://i.pravatar.cc/150?u=leng",
              role: "Admin",
              date: "01/05/2026 20:25",
            }}
            title="AI Evolution in Modern Technology Era"
            description="Discover how Artificial Intelligence is transforming industries and everyday life. This workshop explores the evolution of AI, modern innovations like machine learning and generative AI, and the future impact of intelligent technologies in the digital era."
            location="Royal University of Phnom Penh"
            dateString="26th May 2026, 2pm-5pm"
            purpose="Enhance student's Knowledge in the field of Artificial Intelligence"
            bannerImage="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200"
            innerBannerTitle="AI Evolution in Modern Technology Era"
            innerBannerMeta="CKCC Seminar Room B • Sept 15, 2026"
            likes={124}
            comments={18}
          />
          <AnnouncementCard
            announcementLabel="Main Stage Announcement"
            postedTimeText="Posted 45 mins ago"
            author={{
              name: "Dita Rector",
              avatar: "https://i.pravatar.cc/150?u=dita",
              role: "Organizer",
              date: "01/05/2026 20:25",
            }}
            title="Upcoming Special Lecture !"
            description="Join us to explore the fundamentals of Zero Trust Security and how organizations protect digital systems in today's evolving threat landscape. Learn key principles, modern security strategies, and real-world applications for building safer and smarter networks."
            location="Royal University of Phnom Penh"
            dateString="26th May 2026, 2pm–5pm"
            purpose="Enhance student's Knowledge in the field of Artificial Intelligence"
            bannerImage="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200"
            innerBannerTitle="AI Evolution in Modern Technology Era"
            innerBannerMeta="CKCC Seminar Room B • Sept 15, 2026"
            likes={124}
            comments={18}
          />
          <PollCard />
          <SurveyCard />

          <ArticleCard
            author={{
              name: "Dita Rector",
              avatar: "https://i.pravatar.cc/150?u=dita",
              role: "Organizer",
              date: "01/05/2026 20:25",
            }}
            title="Khmer Food Competition & Sangkran"
            bodyText="Dear everyone, You can find your photo of the event today here. Thank you."
            attachmentLink="https://drive.google.com/drive/folders/1U12M0y6B9uH_cWObkR_zpgm5iopHLYX6"
            likes={124}
            comments={18}
          />

        </section>

        <aside className="col-span-4 space-y-8">
          <div className="bg-background rounded-[12px] border border-border p-8 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="type-subtitle font-extrabold text-primary">Upcoming Events</h3>
              <button className="type-detail-small-semibold text-primary hover:underline">
                View Calendar
              </button>
            </div>
            <div className="flex flex-col items-center justify-center py-10 opacity-40">
              <div className="p-4 bg-grey-100 rounded-2xl mb-4">
                <Calendar size={48} className="text-grey-400" />
              </div>
              <p className="type-detail font-medium text-muted-foreground">No upcoming events.</p>
            </div>
          </div>

          <div className="bg-background rounded-[12px] border border-border p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="type-subtitle font-extrabold text-primary leading-tight">
                  Group Member
                </h3>
                <p className="type-detail-small-medium text-grey-400">60 Members</p>
              </div>
              <div className="flex items-center -space-x-2">
                <img src="https://i.pravatar.cc/100?u=1" className="w-8 h-8 rounded-full border-2 border-white" alt="m1" />
                <img src="https://i.pravatar.cc/100?u=2" className="w-8 h-8 rounded-full border-2 border-white" alt="m2" />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-primary type-detail-small-medium text-white flex items-center justify-center font-bold">
                  +57
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {[
                { name: "Hiem Sreynit", img: "https://i.pravatar.cc/100?u=s" },
                { name: "Hort Soknika", img: "https://i.pravatar.cc/100?u=n" },
                { name: "Chham Kaknika", img: "https://i.pravatar.cc/100?u=k" },
              ].map((member, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={member.img} className="w-10 h-10 rounded-full object-cover" alt={member.name} />
                  <span className="type-detail-semibold text-primary grow">
                    {member.name}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full bg-primary text-white py-3 rounded-2xl type-detail-semibold hover:bg-primary-hover transition-all">
              View All Members
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}
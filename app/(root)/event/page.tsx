import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Target,
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event",
};

export default function page() {
  return (
    <main>
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
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full type-detail-semibold">
          <Filter size={18} />
          Filter by category
        </button>
      </div>
      <div className="grid grid-cols-12 gap-[57px]">
        <section className="col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary type-desc-semibold">
              <MapPin size={16} />
              <span>Pinned</span>
            </div>
            <button className="type-detail text-muted-foreground hover:underline">
              View All
            </button>
          </div>
          <div className="bg-background rounded-[12px] border border-border p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-grey-200 overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=leng" alt="Author"
                    className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="type-desc-semibold text-secondary">Leng Chingmony</h3>
                  <p className="type-detail-small-medium text-grey-400">01/05/2026 20:25</p>
                </div>
              </div>
              <span className="bg-[#EBF5FB] text-[#3FA6DC] type-desc-small-semibold px-3 py-1 rounded-full uppercase">
                Admin
              </span>
            </div>
            <h2 className="type-title text-primary mb-4">
              AI Evolution in Modern Technology Era
            </h2>
            <p className="type-desc text-muted-foreground leading-relaxed mb-6">
              Discover how Artificial Intelligence is transforming industries and everyday life.
              This workshop explores the evolution of AI, modern innovations like machine learning
              and generative AI...
            </p>
            <div className="bg-grey-50 rounded-[12px] p-6 space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-grey-400 mt-1" />
                <p className="type-detail text-grey-500">
                  <span className="type-detail-semibold text-foreground">LOCATION:</span>{" "}
                  Royal University of Phnom Penh
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-grey-400 mt-1" />
                <p className="type-detail text-grey-500">
                  <span className="type-detail-semibold text-foreground">DATE:</span>{" "}
                  26th May 2026, 2pm–5pm
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Target size={18} className="text-grey-400 mt-1" />
                <p className="type-detail text-grey-500">
                  <span className="type-detail-semibold text-foreground">PURPOSE:</span>{" "}
                  Enhance student&apos;s Knowledge in the field of Artificial Intelligence
                </p>
              </div>
            </div>

            {/* Event Banner Image */}
            <div className="relative rounded-[12px] overflow-hidden mb-6 h-64">
              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995"
                alt="AI banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <span className="bg-action text-foreground type-detail-small-medium font-black px-2 py-0.5 rounded mb-2 inline-block uppercase">
                  New Event
                </span>
                <h4 className="type-desc-semibold">AI Evolution in Modern Technology Era</h4>
                <p className="type-detail-small-medium opacity-80">CKCC Seminar Room B • Sept 15, 2026</p>
              </div>
            </div>

            {/* Reactions */}
            <div className="flex items-center gap-6 py-4 border-b border-border type-detail text-grey-500">
              <button className="flex items-center gap-2 hover:text-primary">
                <ThumbsUp size={18} /> 124
              </button>
              <button className="flex items-center gap-2 hover:text-primary">
                <MessageSquare size={18} /> 18
              </button>
              <button className="flex items-center gap-2 hover:text-primary">
                <Share2 size={18} /> Share
              </button>
            </div>

            {/* Comment Input */}
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-grey-200 overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=user" alt="Me"
                  className="w-full h-full object-cover" />
              </div>
              <div className="relative grow">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full bg-grey-50 border-none rounded-full py-3 px-6 type-detail focus:ring-1 focus:ring-blue-100 outline-none"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Sidebar */}
        <aside className="col-span-4 space-y-8">

          {/* Upcoming Events */}
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
                <img src="https://i.pravatar.cc/100?u=1"
                  className="w-8 h-8 rounded-full border-2 border-white" />
                <img src="https://i.pravatar.cc/100?u=2"
                  className="w-8 h-8 rounded-full border-2 border-white" />
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
                  <img src={member.img}
                    className="w-10 h-10 rounded-full object-cover" />
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
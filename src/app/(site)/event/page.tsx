import React from "react";
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
  MoreHorizontal,
} from "lucide-react";

export default function page() {
  return (
    <main>
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
          <span className="text-xs font-bold text-primary bg-[#F0F2F5] px-2 py-0.5 rounded uppercase">
            Internal
          </span>
          <h1 className="text-lg font-bold text-primary">
            14th Generation Group
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search for events..."
            className="w-full pl-6 pr-12 py-3 border border-grey-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
            <Search size={18} />
          </button>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-bold">
          <Filter size={18} />
          Filter by category
        </button>
      </div>
      <div className="grid grid-cols-12 gap-[57px]">
        <section className="col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-bold">
              <MapPin size={16} />
              <span>Pinned</span>
            </div>
            <button className="text-sm text-gray-500 hover:underline">
              View All
            </button>
          </div>
          <div className="bg-white rounded-[12px] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src="https://i.pravatar.cc/150?u=leng"
                    alt="Author"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-secondary">Leng Chingmony</h3>
                  <p className="text-xs text-gray-400 font-medium">
                    01/05/2026 20:25
                  </p>
                </div>
              </div>
              <span className="bg-[#EBF5FB] text-[#3FA6DC] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                Admin
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-primary mb-4">
              AI Evolution in Modern Technology Era
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Discover how Artificial Intelligence is transforming industries
              and everyday life. This workshop explores the evolution of AI,
              modern innovations like machine learning and generative AI...
            </p>
            <div className="bg-[#F8FAFC] rounded-[12px] p-6 space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-gray-400 mt-1" />
                <p className="text-sm text-gray-600">
                  <span className="font-bold">LOCATION:</span> Royal University
                  of Phnom Penh
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-gray-400 mt-1" />
                <p className="text-sm text-gray-600">
                  <span className="font-bold">DATE:</span> 26th May 2026,
                  2pm-5pm
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Target size={18} className="text-gray-400 mt-1" />
                <p className="text-sm text-gray-600">
                  <span className="font-bold">PURPOSE:</span> Enhance student's
                  Knowledge in the field of Artificial Intelligence
                </p>
              </div>
            </div>
            <div className="relative rounded-[12px] overflow-hidden mb-6 h-64">
              <img
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995"
                alt="AI banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <span className="bg-[#FFA02E] text-black text-[10px] font-black px-2 py-0.5 rounded mb-2 inline-block uppercase">
                  New Event
                </span>
                <h4 className="font-bold">
                  AI Evolution in Modern Technology Era
                </h4>
                <p className="text-xs opacity-80">
                  CKCC Seminar Room B • Sept 15, 2026
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 py-4 border-b border-gray-100 text-gray-500 text-sm">
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

            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <img
                  src="https://i.pravatar.cc/150?u=user"
                  alt="Me"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative grow">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full bg-[#F8FAFC] border-none rounded-full py-3 px-6 text-sm focus:ring-1 focus:ring-blue-100 outline-none"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="col-span-4 space-y-8">
          <div className="bg-white rounded-[12px] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-extrabold text-primary text-lg">
                Upcoming Events
              </h3>
              <button className="text-xs font-bold text-primary hover:underline">
                View Calendar
              </button>
            </div>
            <div className="flex flex-col items-center justify-center py-10 opacity-40">
              <div className="p-4 bg-gray-100 rounded-2xl mb-4">
                <Calendar size={48} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                No upcoming events.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[12px] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-extrabold text-primary text-lg leading-tight">
                  Group Member
                </h3>
                <p className="text-[10px] text-gray-400 font-bold">
                  60 Members
                </p>
              </div>
              <div className="flex items-center -space-x-2">
                <img
                  src="https://i.pravatar.cc/100?u=1"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="https://i.pravatar.cc/100?u=2"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <div className="w-8 h-8 rounded-full border-2 border-white bg-primary text-[8px] text-white flex items-center justify-center font-bold">
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
                  <img
                    src={member.img}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-sm font-bold text-primary grow">
                    {member.name}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full bg-primary text-white py-3 rounded-2xl text-sm font-bold hover:bg-[#25437a] transition-all">
              View All Members
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

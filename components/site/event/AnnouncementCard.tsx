"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Target,
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
  MoreVertical,
  Megaphone,
} from "lucide-react";

const data = {
  announcementLabel: "Main Stage Announcement",
  postedTimeText: "Posted 45 mins ago",
  author: {
    name: "Dita Rector",
    avatar: "https://i.pravatar.cc/150?u=dita",
    role: "Organizer",
    date: "01/05/2026 20:25",
  },
  title: "Upcoming Special Lecture !",
  description:
    "Join us to explore the fundamentals of Zero Trust Security and how organizations protect digital systems in today's evolving threat landscape. Learn key principles, modern security strategies, and real-world applications for building safer and smarter networks.",
  location: "Royal University of Phnom Penh",
  dateString: "26th May 2026, 2pm–5pm",
  purpose:
    "Enhance student's Knowledge in the field of Artificial Intelligence",
  bannerImage:
    "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1200",
  innerBannerTitle: "AI Evolution in Modern Technology Era",
  innerBannerMeta: "CKCC Seminar Room B • Sept 15, 2026",
  likes: 124,
  comments: 18,
};

const mockComments = [
  {
    id: "c1",
    author: {
      name: "Lyhov",
      avatar: "https://i.pravatar.cc/150?u=lyhov",
      initials: "LY",
    },
    date: "2h ago",
    text: "Really excited for this event. Is anyone else joining from 12th gen?",
    replies: [
      {
        id: "r1",
        author: {
          name: "Dine",
          avatar: "https://i.pravatar.cc/150?u=dine",
        },
        date: "1h ago",
        text: "Is there a live stream link? @rectordita",
        isOwn: true,
      },
      {
        id: "r2",
        author: {
          name: "Dita Rector",
          avatar: "https://i.pravatar.cc/150?u=dita",
        },
        date: "30min ago",
        text: "@dinety I think there is",
        isOwn: true,
      },
    ],
  },
];

// Added onVisibilityChange callback required by parent container matching logic
interface AnnouncementCardProps {
  searchQuery: string;
  onVisibilityChange: (hasItems: boolean) => void;
  onViewDetail?: () => void;
}

export function AnnouncementCard({
  searchQuery,
  onVisibilityChange,
  onViewDetail,
}: AnnouncementCardProps) {
  const [showComments, setShowComments] = useState(false);

  // Checks if the typed input value matches the card title property
  const isMatch = data.title
    .toLowerCase()
    .includes((searchQuery || "").toLowerCase().trim());

  // Notify parent container of visibility state changes when search updates
  useEffect(() => {
    onVisibilityChange(isMatch);
  }, [isMatch, onVisibilityChange]);

  // If there's a mismatch, hide the card from layout cleanly
  if (!isMatch) {
    return null;
  }

  return (
    <div className="bg-background rounded-[12px] border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#EBF5FB] p-2 rounded-lg text-primary">
            <Megaphone size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-grey-900 leading-tight">
              {data.announcementLabel}
            </h4>
            <p className="text-xs font-medium text-grey-400">
              {data.postedTimeText}
            </p>
          </div>
        </div>
        <button className="text-grey-400 hover:text-grey-500 cursor-pointer">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-grey-200 overflow-hidden">
            <img
              src={data.author.avatar}
              alt={data.author.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="type-desc-semibold text-secondary">
              {data.author.name}
            </h3>
            <p className="type-detail-small-medium text-grey-400">
              {data.author.date}
            </p>
          </div>
        </div>
        <span className="bg-[#FFF7ED] text-[#F97316] type-desc-small-semibold px-3 py-1 rounded-full uppercase">
          {data.author.role}
        </span>
      </div>

      <h2 className="type-title text-primary mb-2">{data.title}</h2>
      <p className="type-desc text-muted-foreground leading-relaxed mb-2">
        {data.description}
      </p>

      <div className="bg-grey-50 rounded-[12px] p-6 space-y-3 mb-2">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-grey-400 mt-1 shrink-0" />
          <p className="type-detail text-grey-500">
            <span className="type-detail-semibold text-foreground">
              LOCATION:
            </span>{" "}
            {data.location}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Calendar size={18} className="text-grey-400 mt-1 shrink-0" />
          <p className="type-detail text-grey-500">
            <span className="type-detail-semibold text-foreground">DATE:</span>{" "}
            {data.dateString}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Target size={18} className="text-grey-400 mt-1 shrink-0" />
          <p className="type-detail text-grey-500">
            <span className="type-detail-semibold text-foreground">
              PURPOSE:
            </span>{" "}
            {data.purpose}
          </p>
        </div>
      </div>

      <div className="relative rounded-[12px] overflow-hidden mb-6 h-64">
        <img
          src={data.bannerImage}
          alt={data.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <span className="bg-action text-foreground type-detail-small-medium font-black px-2 py-0.5 rounded mb-2 inline-block uppercase">
            New Event
          </span>
          <h4 className="type-desc-semibold">{data.innerBannerTitle}</h4>
          <p className="type-detail-small-medium opacity-80">
            {data.innerBannerMeta}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center -space-x-2">
          <img
            src="https://i.pravatar.cc/100?u=a"
            className="w-6 h-6 rounded-full border border-white"
            alt="v1"
          />
          <img
            src="https://i.pravatar.cc/100?u=b"
            className="w-6 h-6 rounded-full border border-white"
            alt="v2"
          />
          <img
            src="https://i.pravatar.cc/100?u=c"
            className="w-6 h-6 rounded-full border border-white"
            alt="v3"
          />
          <div className="w-6 h-6 rounded-full border border-white bg-secondary text-[9px] font-bold text-white flex items-center justify-center">
            +80
          </div>
        </div>
        <button
          onClick={onViewDetail}
          className="bg-[#0F2854] hover:bg-[#1C4D8D] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          View Detail
        </button>
      </div>

      <div className="flex items-center gap-6 py-4 border-b border-border type-detail text-grey-500">
        <button className="flex items-center gap-2 hover:text-primary cursor-pointer">
          <ThumbsUp size={18} /> {data.likes}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 hover:text-primary cursor-pointer"
        >
          <MessageSquare size={18} /> {data.comments}
        </button>
        <button className="flex items-center gap-2 hover:text-primary cursor-pointer">
          <Share2 size={18} /> Share
        </button>
      </div>

      <div
        className={`flex items-center gap-3 mt-6 ${showComments ? "mb-8" : ""}`}
      >
        <div className="w-10 h-10 rounded-full bg-grey-200 overflow-hidden shrink-0">
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
            className="w-full bg-grey-50 border-none rounded-full py-3 px-6 type-detail focus:ring-1 focus:ring-blue-100 outline-none text-grey-900"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary p-1 cursor-pointer">
            <Send size={18} />
          </button>
        </div>
      </div>

      {showComments && (
        <div className="space-y-6 pt-2">
          {mockComments.map((comment) => (
            <div key={comment.id} className="relative flex flex-col">
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#EBF5FB] flex items-center justify-center shrink-0 text-[#3FA6DC] font-semibold text-sm">
                  {comment.author.initials}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-1.5 text-sm">
                    <span className="font-bold text-grey-900">
                      {comment.author.name}
                    </span>
                    <span className="text-grey-400 text-xs font-normal">
                      · {comment.date}
                    </span>
                  </div>
                  <p className="text-sm text-grey-900 leading-normal">
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-bold text-grey-900 pt-1">
                    <button className="hover:underline cursor-pointer">
                      Reply
                    </button>
                    <button className="hover:underline cursor-pointer">
                      Like
                    </button>
                  </div>
                </div>
              </div>

              {comment.replies && comment.replies.length > 0 && (
                <div className="relative pl-10 mt-4 space-y-5">
                  <div
                    className="absolute left-[20px] top-[-24px] w-[20px] border-l border-b border-grey-200 rounded-bl-[12px]"
                    style={{ bottom: "24px" }}
                  />

                  {comment.replies.map((reply, index) => (
                    <div
                      key={reply.id}
                      className="relative flex items-start gap-3"
                    >
                      {index > 0 && (
                        <div className="absolute left-[-20px] top-[-24px] bottom-[24px] border-l border-grey-200" />
                      )}
                      <div className="absolute left-[-20px] top-5 w-[20px] border-t border-grey-200" />

                      <div className="w-10 h-10 rounded-full bg-grey-200 overflow-hidden shrink-0 relative z-10">
                        <img
                          src={reply.author.avatar}
                          alt={reply.author.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1.5 text-sm">
                          <span className="font-bold text-grey-900">
                            {reply.author.name}
                          </span>
                          <span className="text-grey-400 text-xs font-normal">
                            · {reply.date}
                          </span>
                        </div>
                        <p className="text-sm text-grey-900 leading-normal">
                          {reply.text.split(" ").map((word, i) =>
                            word.startsWith("@") ? (
                              <span
                                key={i}
                                className="text-blue-600 font-medium"
                              >
                                {word}{" "}
                              </span>
                            ) : (
                              word + " "
                            ),
                          )}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-bold text-grey-900 pt-1">
                          <button className="hover:underline cursor-pointer">
                            Reply
                          </button>
                          {reply.isOwn && (
                            <>
                              <button className="hover:underline cursor-pointer">
                                Edit
                              </button>
                              <button className="hover:underline cursor-pointer">
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

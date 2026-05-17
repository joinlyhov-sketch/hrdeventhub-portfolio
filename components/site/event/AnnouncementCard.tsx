"use client";

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

interface Author {
  name: string;
  avatar: string;
  role: "Admin" | "Organizer" | "Student" | string;
  date: string;
}

interface AnnouncementCardProps {
  announcementLabel?: string;
  postedTimeText?: string;
  author: Author;
  title: string;
  description: string;
  location: string;
  dateString: string;
  purpose: string;
  bannerImage: string;
  innerBannerTitle: string;
  innerBannerMeta: string;
  likes: number;
  comments: number;
  onViewDetail?: () => void;
}

export function AnnouncementCard({
  announcementLabel = "Main Stage Announcement",
  postedTimeText = "Posted 45 mins ago",
  author,
  title,
  description,
  location,
  dateString,
  purpose,
  bannerImage,
  innerBannerTitle,
  innerBannerMeta,
  likes,
  comments,
  onViewDetail,
}: AnnouncementCardProps) {
  return (
    <div className="bg-background rounded-[12px] border border-border p-8 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#EBF5FB] p-2 rounded-lg text-primary">
            <Megaphone size={18} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-grey-900 leading-tight">
              {announcementLabel}
            </h4>
            <p className="text-xs font-medium text-grey-400">
              {postedTimeText}
            </p>
          </div>
        </div>
        <button className="text-grey-400 hover:text-grey-500 cursor-pointer">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-grey-200 overflow-hidden">
            <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="type-desc-semibold text-secondary">{author.name}</h3>
            <p className="type-detail-small-medium text-grey-400">{author.date}</p>
          </div>
        </div>
        <span className="bg-[#FFF7ED] text-[#F97316] type-desc-small-semibold px-3 py-1 rounded-full uppercase">
          {author.role}
        </span>
      </div>

      <h2 className="type-title text-primary mb-4">{title}</h2>
      <p className="type-desc text-muted-foreground leading-relaxed mb-6">{description}</p>

      <div className="bg-grey-50 rounded-[12px] p-6 space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-grey-400 mt-1 shrink-0" />
          <p className="type-detail text-grey-500">
            <span className="type-detail-semibold text-foreground">LOCATION:</span> {location}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Calendar size={18} className="text-grey-400 mt-1 shrink-0" />
          <p className="type-detail text-grey-500">
            <span className="type-detail-semibold text-foreground">DATE:</span> {dateString}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Target size={18} className="text-grey-400 mt-1 shrink-0" />
          <p className="type-detail text-grey-500">
            <span className="type-detail-semibold text-foreground">PURPOSE:</span> {purpose}
          </p>
        </div>
      </div>

      <div className="relative rounded-[12px] overflow-hidden mb-6 h-64">
        <img src={bannerImage} alt={title} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <span className="bg-action text-foreground type-detail-small-medium font-black px-2 py-0.5 rounded mb-2 inline-block uppercase">
            New Event
          </span>
          <h4 className="type-desc-semibold">{innerBannerTitle}</h4>
          <p className="type-detail-small-medium opacity-80">{innerBannerMeta}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center -space-x-2">
          <img src="https://i.pravatar.cc/100?u=a" className="w-6 h-6 rounded-full border border-white" alt="v1" />
          <img src="https://i.pravatar.cc/100?u=b" className="w-6 h-6 rounded-full border border-white" alt="v2" />
          <img src="https://i.pravatar.cc/100?u=c" className="w-6 h-6 rounded-full border border-white" alt="v3" />
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
          <ThumbsUp size={18} /> {likes}
        </button>
        <button className="flex items-center gap-2 hover:text-primary cursor-pointer">
          <MessageSquare size={18} /> {comments}
        </button>
        <button className="flex items-center gap-2 hover:text-primary cursor-pointer">
          <Share2 size={18} /> Share
        </button>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <div className="w-10 h-10 rounded-full bg-grey-200 overflow-hidden shrink-0">
          <img src="https://i.pravatar.cc/150?u=user" alt="Me" className="w-full h-full object-cover" />
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
    </div>
  );
}
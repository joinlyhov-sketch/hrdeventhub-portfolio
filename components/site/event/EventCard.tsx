"use client";

import React from "react";
import {
  MapPin,
  Calendar,
  Target,
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
  MoreVertical,
  Volume2
} from "lucide-react";

interface Author {
  name: string;
  avatar: string;
  role: "Admin" | "Organizer" | "Student" | string;
  date: string;
}

interface EventCardProps {
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
}

export function EventCard({
  author,
  title,
  description,
  location,
  dateString,
  purpose,
  bannerImage,
  innerBannerTitle,
  innerBannerMeta,
}: EventCardProps) {
  return (
    <div className="bg-background rounded-[12px] border border-border p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-grey-200 overflow-hidden">
            <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-secondary">{author.name}</h3>
            <p className="text-xs font-medium text-grey-400">{author.date}</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${
          author.role.toLowerCase() === "admin" 
            ? "bg-[#EBF5FB] text-[#3FA6DC]" 
            : "bg-[#FFF7ED] text-[#F97316]"
        }`}>
          {author.role}
        </span>
      </div>

      {/* Title & Body */}
      <h2 className="text-xl font-bold text-primary mb-4">{title}</h2>
      <p className="text-sm text-grey-500 leading-relaxed mb-6">{description}</p>

      {/* Info Panel */}
      <div className="bg-grey-50 rounded-[12px] p-6 space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-grey-400 mt-0.5 shrink-0" />
          <p className="text-sm text-grey-500">
            <span className="font-semibold text-grey-900">LOCATION:</span> {location}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Calendar size={18} className="text-grey-400 mt-0.5 shrink-0" />
          <p className="text-sm text-grey-500">
            <span className="font-semibold text-grey-900">DATE:</span> {dateString}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Target size={18} className="text-grey-400 mt-0.5 shrink-0" />
          <p className="text-sm text-grey-500">
            <span className="font-semibold text-grey-900">PURPOSE:</span> {purpose}
          </p>
        </div>
      </div>

      {/* Embedded Rich Image Banner */}
      <div className="relative rounded-[12px] overflow-hidden mb-6 h-64">
        <img src={bannerImage} alt="Event Banner" className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 text-white">
          <span className="bg-action text-grey-900 text-[10px] font-black px-2 py-0.5 rounded mb-2 inline-block uppercase tracking-wider">
            New Event
          </span>
          <h4 className="text-base font-semibold">{innerBannerTitle}</h4>
          <p className="text-xs opacity-80">{innerBannerMeta}</p>
        </div>
      </div>

      {/* Engagement Actions */}
      <div className="flex items-center gap-6 py-4 border-b border-border text-sm font-medium text-grey-500">
        <button className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
          <ThumbsUp size={18} /> 124
        </button>
        <button className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
          <MessageSquare size={18} /> 18
        </button>
        <button className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
          <Share2 size={18} /> Share
        </button>
      </div>

      {/* Bottom Comment Input */}
      <div className="flex items-center gap-3 mt-6">
        <div className="w-10 h-10 rounded-full bg-grey-200 overflow-hidden shrink-0">
          <img src="https://i.pravatar.cc/150?u=user" alt="Me" className="w-full h-full object-cover" />
        </div>
        <div className="relative grow">
          <input
            type="text"
            placeholder="Add a comment..."
            className="w-full bg-grey-50 border-none rounded-full py-3 pl-6 pr-12 text-sm text-grey-900 placeholder:text-grey-400 focus:ring-1 focus:ring-primary/20 outline-none"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary p-1 hover:opacity-80 transition-opacity cursor-pointer">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
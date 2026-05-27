"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import image from "../../../public/images/PinnedCardTest.jpg";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
} from "lucide-react";
import ShareModal from "@/components/site/pop-up/action-button/ShareModal";

const initialMockData = {
  id: "evt-9921",
  badge: "NEW EVENT",
  title: "Songkran Festival Celebration",
  schedule: "Tomorrow, 1:30 PM - 5:00 PM • HRD Center",
  author: {
    name: "Dita Rector",
    avatar: "https://i.pravatar.cc/150?u=hr",
    role: "Admin",
    date: "Posted 2 hours ago",
  },
  description:
    "Join us for our annual Songkran Festival Celebration! Enjoy traditional water festivities, delicious food, and cultural performances with your colleagues.",
  location: "HRD Center",
  dateString: "Tomorrow, 1:30 PM - 5:00 PM",
  purpose: "Cultural Celebration & Team Bonding",
  innerBannerTitle: "Songkran Festival Celebration",
  innerBannerMeta: "Tomorrow, 1:30 PM - 5:00 PM • HRD Center",
  likesCount: 124,       
  isLikedByUser: false, 
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

interface EventCardProps {
  searchQuery: string;
  onVisibilityChange: (hasItems: boolean) => void;
}

export function EventCard({ searchQuery, onVisibilityChange }: EventCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [eventData, setEventData] = useState(initialMockData);
  const handleLikeToggle = () => {
    setEventData((prev) => {
      const updatedIsLiked = !prev.isLikedByUser;
      return {
        ...prev,
        isLikedByUser: updatedIsLiked,
        likesCount: updatedIsLiked ? prev.likesCount + 1 : prev.likesCount - 1,
      };
    });
  };

  const isMatch = eventData.title
    .toLowerCase()
    .includes((searchQuery || "").toLowerCase().trim());

  useEffect(() => {
    onVisibilityChange(isMatch);
  }, [isMatch, onVisibilityChange]);

  if (!isMatch) {
    return null;
  }

  return (
    <>
      <div className="bg-background rounded-[12px] border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-grey-200 overflow-hidden">
              <img
                src={eventData.author.avatar}
                alt={eventData.author.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-secondary">
                {eventData.author.name}
              </h3>
              <p className="text-xs font-medium text-grey-400">
                {eventData.author.date}
              </p>
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${
              eventData.author.role.toLowerCase() === "admin"
                ? "bg-[#EBF5FB] text-[#3FA6DC]"
                : "bg-[#FFF7ED] text-[#F97316]"
            }`}
          >
            {eventData.author.role}
          </span>
        </div>

        <h2 className="text-xl font-bold text-primary mb-2">{eventData.title}</h2>
        <p className="text-sm text-grey-500 leading-relaxed mb-2">
          {eventData.description}
        </p>

        <div className="bg-grey-50 rounded-[12px] p-3 space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <p className="text-sm text-grey-500">
              <span className="font-semibold text-grey-900">LOCATION:</span>{" "}
              {eventData.location}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <p className="text-sm text-grey-500">
              <span className="font-semibold text-grey-900">DATE:</span>{" "}
              {eventData.dateString}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <p className="text-sm text-grey-500">
              <span className="font-semibold text-grey-900">PURPOSE:</span>{" "}
              {eventData.purpose}
            </p>
          </div>
        </div>

        <div className="relative rounded-[12px] overflow-hidden mb-6 h-64">
          <Image
            src={image}
            alt="Pinned Event Banner"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-primary/90 to-primary/0 p-6 text-white">
            <span className="inline-flex bg-subtle text-secondary type-desc-small-semibold px-3 py-1 rounded-md tracking-wide mb-2">
              {eventData.badge}
            </span>
            <h4 className="text-base font-semibold">{eventData.innerBannerTitle}</h4>
            <p className="text-xs opacity-80">{eventData.innerBannerMeta}</p>
          </div>
        </div>

        <div className="flex items-center gap-6 py-4 border-b border-border text-sm font-medium text-grey-500">
          <button 
            onClick={handleLikeToggle}
            className={`flex items-center gap-2 transition-colors cursor-pointer ${
              eventData.isLikedByUser 
                ? "text-blue-600 font-semibold" 
                : "hover:text-primary"
            }`}
          >
            <ThumbsUp size={18} className={eventData.isLikedByUser ? "fill-blue-600 stroke-blue-600" : ""} /> 
            {eventData.likesCount}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
          >
            <MessageSquare size={18} /> 18
          </button>
          
          <button 
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
          >
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
              className="w-full bg-grey-50 border-none rounded-full py-3 pl-6 pr-12 text-sm text-grey-900 placeholder:text-grey-400 focus:ring-1 focus:ring-primary/20 outline-none"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary p-1 hover:opacity-80 transition-opacity cursor-pointer">
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

      <ShareModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        shareUrl={`hrdeventhub.app/events/${eventData.id}`}
      />
    </>
  );
}
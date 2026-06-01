"use client";

import { useState } from "react";
import { ThumbsUp, MessageSquare, Share2, Send, Megaphone } from "lucide-react";
import Link from "next/link";
import ShareModal from "@/components/site/pop-up/action-button/ShareModal";
import EditPostDropDown from "@/components/site/pop-up/action-button/action-edit-post";
import { ReactionPopover, REACTIONS } from "@/components/site/pop-up/comment/reaction";
import { mockComments } from "@/data/announcementData";
import { UserRole } from "@/context/user-context";
import { Post } from "@/types/posts";

interface AnnouncementCardProps {
  role: UserRole;
  posts: Post[];
  searchQuery: string;
}

function AnnouncementItem({ post, role }: { post: Post; role: UserRole }) {
  const [showComments, setShowComments] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(0);

  const activeReaction = REACTIONS.find((r) => r.id === selectedReaction);
  const coverImage = post.media?.find((m) => m.isCover) ?? post.media?.[0];
  const hasImage = coverImage?.fileType === "image";

  const handleLikeToggle = () => {
    if (selectedReaction) {
      setSelectedReaction(null);
      setLikesCount((prev) => prev - 1);
    } else {
      setSelectedReaction("like");
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleReactionSelect = (reactionId: string) => {
    if (!selectedReaction) setLikesCount((prev) => prev + 1);
    setSelectedReaction(reactionId);
  };

  return (
    <>
      <div className="bg-background rounded-[12px] border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#EBF5FB] p-2 rounded-lg text-primary">
              <Megaphone size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-grey-900 leading-tight">
                Announcement
              </h4>
              <p className="text-xs font-medium text-grey-400">
                {post.scheduledAt}
              </p>
            </div>
          </div>
          {(role === "admin" || role === "organizer") && (
            <EditPostDropDown
              title={post.title}
              editUrl={`/event-management/edition/announcement`}
              onDelete={() => console.log("Deleting announcement ID:", post.postId)}
            />
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-grey-200 overflow-hidden">
              <img
                src="https://i.pravatar.cc/150?u=user"
                alt="Author"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="type-desc-semibold text-secondary">
                {post.appUserId}
              </h3>
              <p className="type-detail-small-medium text-grey-400">
                {post.createdAt}
              </p>
            </div>
          </div>
          <span className="bg-[#FFF7ED] text-[#F97316] type-desc-small-semibold px-3 py-1 rounded-full uppercase">
            Admin
          </span>
        </div>

        <h2 className="type-title text-primary mb-2">{post.title}</h2>
        <p className="type-desc text-muted-foreground leading-relaxed mb-2">
          {post.content}
        </p>

        <div className="bg-grey-50 rounded-[12px] p-6 space-y-3 mb-2">
          <div className="flex items-start gap-3">
            <p className="type-detail text-grey-500">
              <span className="type-detail-semibold text-foreground">LOCATION: </span>
              {post.location ? (
                <a
                  href={post.location.googleMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-primary"
                >
                  View on map
                </a>
              ) : (
                "—"
              )}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <p className="type-detail text-grey-500">
              <span className="type-detail-semibold text-foreground">DATE: </span>
              {post.eventStart || "—"}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <p className="type-detail text-grey-500">
              <span className="type-detail-semibold text-foreground">PURPOSE: </span>—
            </p>
          </div>
        </div>

        <div className="relative rounded-[12px] overflow-hidden mb-6 h-64 bg-grey-100">
          {hasImage ? (
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${coverImage!.filePath}`}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-grey-400">
              <div className="w-12 h-12 rounded-full bg-grey-200 flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 19.5h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"
                  />
                </svg>
              </div>
              <span className="text-xs font-medium">No image available</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <span className="bg-action text-foreground type-detail-small-medium font-black px-2 py-0.5 rounded mb-2 inline-block uppercase">
              New Event
            </span>
            <h4 className="type-desc-semibold">{post.title}</h4>
            <p className="type-detail-small-medium opacity-80">
              {post.eventStart || "—"}
            </p>
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
          <Link
            href={`/event-management/announcements/view/${post.postId}`}
            className="bg-[#0F2854] hover:bg-[#1C4D8D] text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer inline-block text-center"
          >
            View Detail
          </Link>
        </div>

        <div className="flex items-center gap-6 py-4 border-b border-border type-detail text-grey-500">
          <ReactionPopover selectedValue={selectedReaction} onReactionSelect={handleReactionSelect}>
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-2 transition-colors cursor-pointer select-none ${
                activeReaction
                  ? `${activeReaction.color} font-semibold`
                  : "hover:text-primary"
              }`}
            >
              <ThumbsUp
                size={18}
                className={activeReaction?.id === "like" ? "fill-blue-500 stroke-blue-500" : ""}
              />
              <span>{activeReaction ? activeReaction.displayText : "Like"}</span>
              <span className="text-xs font-normal text-grey-400">
                ({likesCount})
              </span>
            </button>
          </ReactionPopover>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 hover:text-primary cursor-pointer"
          >
            <MessageSquare size={18} /> {post.comments.length}
          </button>

          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-2 hover:text-primary cursor-pointer"
          >
            <Share2 size={18} /> Share
          </button>
        </div>

        <div className={`flex items-center gap-3 mt-6 ${showComments ? "mb-8" : ""}`}>
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
                      <span className="font-bold text-grey-900">{comment.author.name}</span>
                      <span className="text-grey-400 text-xs font-normal">· {comment.date}</span>
                    </div>
                    <p className="text-sm text-grey-900 leading-normal">{comment.text}</p>
                    <div className="flex items-center gap-4 text-xs font-bold text-grey-900 pt-1">
                      <button className="hover:underline cursor-pointer">Reply</button>
                      <button className="hover:underline cursor-pointer">Like</button>
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
                      <div key={reply.id} className="relative flex items-start gap-3">
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
                            <span className="font-bold text-grey-900">{reply.author.name}</span>
                            <span className="text-grey-400 text-xs font-normal">· {reply.date}</span>
                          </div>
                          <p className="text-sm text-grey-900 leading-normal">
                            {reply.text.split(" ").map((word, i) =>
                              word.startsWith("@") ? (
                                <span key={i} className="text-blue-600 font-medium">{word} </span>
                              ) : (
                                word + " "
                              )
                            )}
                          </p>
                          <div className="flex items-center gap-4 text-xs font-bold text-grey-900 pt-1">
                            <button className="hover:underline cursor-pointer">Reply</button>
                            {reply.isOwn && (
                              <>
                                <button className="hover:underline cursor-pointer">Edit</button>
                                <button className="hover:underline cursor-pointer">Delete</button>
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
        shareUrl={`hrdeventhub.app/event-management/announcements/${post.postId}`}
      />
    </>
  );
}

export function AnnouncementCard({ role, posts }: AnnouncementCardProps) {
  return (
    <>
      {posts.map((post) => (
        <AnnouncementItem key={post.postId} post={post} role={role} />
      ))}
    </>
  );
}
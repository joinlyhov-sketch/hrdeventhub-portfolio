"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  SendHorizontal,
} from "lucide-react";
import ShareModal from "@/components/site/pop-up/action-button/ShareModal";
import GenericPostDropDown from "@/components/site/pop-up/action-button/action-edit-post";
import { ReactionPopover, REACTIONS } from "@/components/site/pop-up/comment/reaction";
import { mockComments } from "@/data/articleData";
import { UserRole } from "@/context/user-context";
import { Post } from "@/types/posts";
import { getMediaUrl } from "@/libs/media";

interface ArticleCardProps {
  role: UserRole;
  posts: Post[];
  searchQuery: string;
  onDeletePost: (postId: string) => Promise<void> | void;
}

function ArticleItem({ post, role, onDelete }: { post: Post; role: UserRole; onDelete: () => Promise<void> | void }) {
  const [showComments, setShowComments] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(0);

  const activeReaction = REACTIONS.find((r) => r.id === selectedReaction);

  const creator = post.creator;
  const profilePictureUrl = getMediaUrl(creator?.profilePicture);
  const hasProfilePicture = !!profilePictureUrl;

  const initials = creator?.fullName
    ? creator.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-grey-200 overflow-hidden shrink-0 flex items-center justify-center">
              {hasProfilePicture ? (
                <Image
                  src={profilePictureUrl!}
                  alt={creator!.fullName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="type-desc-semibold text-primary uppercase">
                  {initials}
                </span>
              )}
            </div>
            <div>
              <h3 className="type-detail-semibold text-secondary">
                {creator?.fullName ?? "—"}
              </h3>
              <p className="type-detail-small-medium text-grey-400">
                {post.scheduledAt ?? post.createdAt}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {creator?.role && (
              <span
                className={`type-desc-small-semibold px-3 py-1 rounded-full uppercase ${
                  creator.role.toLowerCase() === "admin"
                    ? "bg-[#EBF5FB] text-[#3FA6DC]"
                    : creator.role.toLowerCase() === "organizer"
                    ? "bg-[#FFF7ED] text-[#F97316]"
                    : "bg-grey-100 text-grey-500"
                }`}
              >
                {creator.role}
              </span>
            )}
            {(role === "admin" || role === "organizer") && (
              <GenericPostDropDown
                title={post.title}
                editUrl={`/event-management/edition/article`}
                onDelete={onDelete}
              />
            )}
          </div>
        </div>

        <h2 className="type-title text-primary mb-2">
          {post.title}
        </h2>
        <p className="type-desc text-muted-foreground leading-relaxed mb-4">
          {post.content}
        </p>

        <div className="flex items-center gap-6 py-4 border-b border-border type-detail-medium text-grey-500">
          <ReactionPopover selectedValue={selectedReaction} onReactionSelect={handleReactionSelect}>
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-2 transition-colors cursor-pointer select-none ${
                activeReaction ? `${activeReaction.color} font-semibold` : "hover:text-primary"
              }`}
            >
              <ThumbsUp
                size={18}
                className={activeReaction?.id === "like" ? "fill-blue-500" : ""}
              />
              <span>{activeReaction ? activeReaction.displayText : "Like"}</span>
              <span className="type-detail-small-medium font-normal text-grey-400">({likesCount})</span>
            </button>
          </ReactionPopover>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
          >
            <MessageSquare size={18} /> {post.comments.length}
          </button>

          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
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
          <div className="relative grow flex items-center bg-grey-50 rounded-full pr-1.5 pl-6 py-1.5">
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full bg-transparent border-none py-1.5 type-detail text-grey-900 placeholder:text-grey-400 outline-none"
            />
            <button className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white hover:bg-secondary transition-colors cursor-pointer shrink-0">
              <SendHorizontal size={16} className="relative left-[-0.5px]" />
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
                      <span className="type-detail-semibold text-grey-900">{comment.author.name}</span>
                      <span className="text-grey-400 type-desc-small-semibold font-normal">· {comment.date}</span>
                    </div>
                    <p className="type-detail text-grey-900 leading-normal">{comment.text}</p>
                    <div className="flex items-center gap-4 type-desc-small-semibold text-grey-900 pt-1">
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
                            <span className="type-detail-semibold text-grey-900">{reply.author.name}</span>
                            <span className="text-grey-400 type-desc-small-semibold font-normal">· {reply.date}</span>
                          </div>
                          <p className="type-detail text-grey-900 leading-normal">
                            {reply.text.split(" ").map((word, i) =>
                              word.startsWith("@") ? (
                                <span key={i} className="text-blue-600 type-detail-medium">{word} </span>
                              ) : (
                                word + " "
                              )
                            )}
                          </p>
                          <div className="flex items-center gap-4 type-desc-small-semibold text-grey-900 pt-1">
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
        shareUrl={`hrdeventhub.app/event-management/articles/${post.postId}`}
      />
    </>
  );
}

export function ArticleCard({ role, posts, onDeletePost }: ArticleCardProps) {
  return (
    <>
      {posts.map((post) => (
        <ArticleItem 
          key={post.postId} 
          post={post} 
          role={role} 
          onDelete={() => onDeletePost(post.postId)} 
        />
      ))}
    </>
  );
}
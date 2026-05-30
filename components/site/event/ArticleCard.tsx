"use client";

import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageSquare, Share2, Send } from "lucide-react";
import ShareModal from "@/components/site/pop-up/action-button/ShareModal";
import EditPostDropDown from "@/components/site/pop-up/action-button/action-edit-post";
import {
  ReactionPopover,
  REACTIONS,
} from "@/components/site/pop-up/comment/reaction";
import {
  ArticleData,
  Reaction,
  initialArticleMockData,
  mockComments,
} from "@/data/articleData";
import { UserRole } from "@/context/user-context";

interface ArticleCardProps {
  role: UserRole;
  searchQuery: string;
  onVisibilityChange: (hasItems: boolean) => void;
}

export function ArticleCard({
  role,
  searchQuery,
  onVisibilityChange,
}: ArticleCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [articleData, setArticleData] = useState<ArticleData>(
    initialArticleMockData,
  );
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const activeReaction = REACTIONS.find(
    (r: Reaction) => r.id === selectedReaction,
  );

  const handleLikeToggle = () => {
    setArticleData((prev) => {
      const isCurrentlyActive = !!selectedReaction;
      if (isCurrentlyActive) {
        setSelectedReaction(null);
        return {
          ...prev,
          isLikedByUser: false,
          likesCount: prev.likesCount - 1,
        };
      } else {
        setSelectedReaction("like");
        return {
          ...prev,
          isLikedByUser: true,
          likesCount: prev.likesCount + 1,
        };
      }
    });
  };

  const handleReactionSelect = (reactionId: string) => {
    const wasAlreadyActive = !!selectedReaction;
    setSelectedReaction(reactionId);
    setArticleData((prev) => ({
      ...prev,
      isLikedByUser: true,
      likesCount: wasAlreadyActive ? prev.likesCount : prev.likesCount + 1,
    }));
  };

  const handleExecuteDelete = () => {
    console.log("Deleting article ID:", articleData.id);
  };

  const isMatch =
    articleData.title
      .toLowerCase()
      .includes((searchQuery || "").toLowerCase().trim()) ||
    articleData.bodyText
      .toLowerCase()
      .includes((searchQuery || "").toLowerCase().trim()) ||
    articleData.author.name
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
                src={articleData.author.avatar}
                alt={articleData.author.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="type-desc-semibold text-secondary">
                {articleData.author.name}
              </h3>
              <p className="type-detail-small-medium text-grey-400">
                {articleData.author.date}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {articleData.author.role && (
              <span className="bg-[#FFF7ED] text-[#F97316] type-desc-small-semibold px-3 py-1 rounded-full uppercase">
                {articleData.author.role}
              </span>
            )}
            {(role === "admin" || role === "organizer") && (
              <EditPostDropDown
                id={articleData.id}
                title={articleData.title}
                editUrl={`/event-management/edition/article`}
                onDelete={handleExecuteDelete}
              />
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-grey-900 mb-2 tracking-tight leading-tight">
          {articleData.title}
        </h2>
        <p className="type-desc text-grey-500 leading-relaxed mb-2">
          {articleData.bodyText}
        </p>

        <div className="mb-6">
          <a
            href={articleData.attachmentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-600 hover:underline break-all block leading-normal"
          >
            {articleData.attachmentLink}
          </a>
        </div>

        <div className="flex items-center gap-6 py-4 border-b border-border type-detail text-grey-500">
          <ReactionPopover
            selectedValue={selectedReaction}
            onReactionSelect={handleReactionSelect}
          >
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
                className={
                  activeReaction?.id === "like"
                    ? "fill-blue-500 stroke-blue-500"
                    : ""
                }
              />
              <span>
                {activeReaction ? activeReaction.displayText : "Like"}
              </span>
              <span className="text-xs font-normal text-grey-400">
                ({articleData.likesCount})
              </span>
            </button>
          </ReactionPopover>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 hover:text-primary cursor-pointer"
          >
            <MessageSquare size={18} /> {articleData.commentsCount}
          </button>

          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-2 hover:text-primary cursor-pointer"
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
              className="w-full bg-grey-50 border-none rounded-full py-3 px-12 type-detail focus:ring-1 focus:ring-blue-100 outline-none text-grey-900"
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

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        shareUrl={`hrdeventhub.app/event-management/articles/${articleData.id}`}
      />
    </>
  );
}
"use client";

import { useState } from "react";
import Image from "next/image";
import { ThumbsUp, MessageSquare, Share2, SendHorizontal } from "lucide-react";
import ShareModal from "@/components/site/pop-up/action-button/ShareModal";
import GenericPostDropDown from "@/components/site/pop-up/action-button/action-edit-post";
import {
  ReactionPopover,
  REACTIONS,
} from "@/components/site/pop-up/comment/reaction";
import { UserRole, useCurrentUser } from "@/context/user-context";
import { Post } from "@/types/posts";
import { getMediaUrl } from "@/libs/media";
import { usePostComments } from "@/hooks/use-post-comments";
import { createCommentAction } from "@/actions/comment.action";
import { CommentNode } from "@/components/site/pop-up/comment/comment-node";

interface ArticleCardProps {
  role: UserRole;
  posts: Post[];
  searchQuery: string;
  onDeletePost: (postId: string) => Promise<void> | void;
}

function ArticleItem({
  post,
  role,
  onDelete,
}: {
  post: Post;
  role: UserRole;
  onDelete: () => Promise<void> | void;
}) {
  const { currentUser } = useCurrentUser();
  const [showComments, setShowComments] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { comments, refetch } = usePostComments(post.postId);
  const activeReaction = REACTIONS.find((r) => r.id === selectedReaction);

  const creator = post.creator;
  const profilePictureUrl = getMediaUrl(creator?.profilePicture);
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
      setLikesCount((p) => p - 1);
    } else {
      setSelectedReaction("like");
      setLikesCount((p) => p + 1);
    }
  };

  const handleReactionSelect = (reactionId: string) => {
    if (!selectedReaction) setLikesCount((p) => p + 1);
    setSelectedReaction(reactionId);
  };

  const handleSubmitComment = async () => {
    if (!commentInput.trim()) return;
    setIsSubmittingComment(true);
    try {
      const result = await createCommentAction(post.postId, commentInput);
      if (result.ok) {
        setCommentInput("");
        await refetch();
      }
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <>
      <div className="bg-background rounded-[12px] border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-grey-200 overflow-hidden shrink-0 flex items-center justify-center">
              {profilePictureUrl ? (
                <Image
                  src={profilePictureUrl}
                  alt={creator?.fullName ?? "User"}
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
                {post.createdAt}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {creator?.role && (
              <span
                className={`type-desc-small-semibold px-3 py-1 rounded-full uppercase ${creator.role.toLowerCase() === "admin" ? "bg-[#EBF5FB] text-[#3FA6DC]" : creator.role.toLowerCase() === "organizer" ? "bg-[#FFF7ED] text-[#F97316]" : "bg-grey-100 text-grey-500"}`}
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

        <h2 className="type-title text-primary mb-2">{post.title}</h2>
        <p className="type-desc text-muted-foreground leading-relaxed mb-4">
          {post.content}
        </p>

        <div className="flex items-center gap-6 py-4 border-b border-border type-detail-medium text-grey-500">
          <ReactionPopover
            selectedValue={selectedReaction}
            onReactionSelect={handleReactionSelect}
          >
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-2 transition-colors cursor-pointer select-none ${activeReaction ? `${activeReaction.color} font-semibold` : "hover:text-primary"}`}
            >
              <ThumbsUp
                size={18}
                className={activeReaction?.id === "like" ? "fill-blue-500" : ""}
              />
              <span>
                {activeReaction ? activeReaction.displayText : "Like"}
              </span>
              <span className="type-detail-small-medium font-normal text-grey-400">
                ({likesCount})
              </span>
            </button>
          </ReactionPopover>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
          >
            <MessageSquare size={18} /> {comments?.length ?? 0}
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
          <div className="w-10 h-10 rounded-full bg-grey-200 overflow-hidden shrink-0 flex items-center justify-center">
            {currentUser?.profilePicture ? (
              <Image
                src={currentUser.profilePicture}
                alt={currentUser.name || "profile"}
                width={40}
                height={40}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="type-desc-small-semibold text-primary uppercase">
                {currentUser?.avatarInitials ?? "?"}
              </span>
            )}
          </div>
          <div className="relative grow flex items-center bg-grey-50 rounded-full pr-1.5 pl-6 py-1.5">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
              className="w-full bg-transparent border-none py-1.5 type-detail text-grey-900 placeholder:text-grey-400 outline-none"
            />
            <button
              onClick={handleSubmitComment}
              disabled={!commentInput.trim() || isSubmittingComment}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white hover:bg-secondary transition-colors cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SendHorizontal size={16} className="relative left-[-0.5px]" />
            </button>
          </div>
        </div>

        {showComments && (
          <div className="space-y-4 pt-2">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentNode
                  key={comment.commentId}
                  comment={comment}
                  currentUserId={currentUser?.id}
                  currentUserPicture={currentUser?.profilePicture}
                  currentUserInitials={currentUser?.avatarInitials}
                  onRefetch={refetch}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-grey-400 type-detail-medium">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            )}
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

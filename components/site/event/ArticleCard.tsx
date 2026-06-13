"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ThumbsUp,
  Share2,
  MessageCircleMore,
} from "lucide-react";
import ShareModal from "@/components/site/pop-up/action-button/ShareModal";
import GenericPostDropDown from "@/components/site/pop-up/action-button/action-edit-post";
import {
  ReactionPopover,
  REACTIONS,
  TwemojiImg,
} from "@/components/site/pop-up/comment/reaction";
import { UserRole, useCurrentUser } from "@/context/user-context";
import { Post } from "@/types/posts";
import { getMediaUrl } from "@/libs/media";
import ExpandableText from "./ExpandableText";
import { usePostComments } from "@/hooks/use-post-comments";
import { createCommentAction } from "@/actions/comment.action";
import { CommentNode } from "@/components/site/pop-up/comment/comment-node";
import { MentionInput } from "@/components/site/pop-up/comment/MentionInput";
import { usePostReaction } from "@/hooks/use-post-reaction";
import { ReactionSummary } from "./ReactionSummary";
import { formatEventDate } from "@/libs/format-date";
import Link from "next/link";

interface ArticleCardProps {
  role: UserRole;
  posts: Post[];
  searchQuery: string;
  onDeletePost: (postId: string) => Promise<void> | void;
  groupId: string;
  members: any[];
}

const getTotalCommentsCount = (commentsList: any[] | undefined | null): number => {
  if (!commentsList || commentsList.length === 0) return 0;
  let total = 0;
  for (const comment of commentsList) {
    total += 1;
    if (comment.replies && comment.replies.length > 0) {
      total += getTotalCommentsCount(comment.replies);
    }
  }
  return total;
};

function ArticleItem({
  post,
  role,
  onDelete,
  groupId,
  members,
}: {
  post: Post;
  role: UserRole;
  onDelete: () => Promise<void> | void;
  groupId: string;
  members: any[];
}) {
  const { currentUser } = useCurrentUser();
  const [showComments, setShowComments] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const {
    selectedReaction,
    reactionPayload,
    handleLikeToggle,
    handleReactionSelect,
  } = usePostReaction(post.postId);

  const [commentInput, setCommentInput] = useState("");
  const [mentionedIds, setMentionedIds] = useState<string[]>([]);

  const { comments, refetch, loading } = usePostComments(post.postId, showComments);
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

  const handleSubmitComment = async () => {
    if (!commentInput.trim()) return;
    const result = await createCommentAction(post.postId, commentInput, mentionedIds);
    if (result.ok) {
      setCommentInput("");
      setMentionedIds([]);
      if (!showComments) setShowComments(true);
      await refetch();
    }
  };
  
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/group/${groupId}?postId=${post.postId}&type=article`
    : `https://hrdevent.app/group/${groupId}?postId=${post.postId}&type=article`;

  return (
    <>
      <div
        id={`post-${post.postId}`}
        className="bg-background rounded-[12px] border border-border p-5 shadow-sm transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <Link href={`/profile/${currentUser?.id}`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-grey-200 overflow-hidden shrink-0 flex items-center justify-center">
                {profilePictureUrl ? (
                  <Image
                    src={profilePictureUrl}
                    alt={creator?.fullName ?? "User"}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover rounded-full border-2 border-primary"
                  />
                ) : (
                  <span className="type-desc-semibold text-primary uppercase">
                    {initials}
                  </span>
                )}
              </div>
              <div>
                <h3 className="type-desc-semibold text-secondary">
                  {creator?.fullName ?? "—"}
                </h3>
                <p className="text-desc-small-semibold text-grey-500">
                  {formatEventDate(post.createdAt ?? "")}
                </p>
              </div>
            </div>
          </Link>
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
                editUrl={`/event-management/edition/article?groupId=${groupId}&postId=${post.postId}`}
                onDelete={onDelete}
              />
            )}
          </div>
        </div>

        <h2 className="type-title text-primary mb-2">{post.title}</h2>
        <ExpandableText text={post.content} />

        <div className="flex items-center justify-between border-b border-border type-detail-medium text-grey-500">
          <section className="flex items-center gap-6 py-4">
            <ReactionPopover selectedValue={selectedReaction} onReactionSelect={handleReactionSelect}>
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-2 transition-colors cursor-pointer select-none ${activeReaction ? `${activeReaction.color} font-semibold` : "hover:text-primary"}`}
              >
                {activeReaction ? (
                  <TwemojiImg emoji={activeReaction.emoji} size={20} />
                ) : (
                  <ThumbsUp size={20} />
                )}
                {activeReaction?.displayText ?? "Like"}
              </button>
            </ReactionPopover>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
            >
              <MessageCircleMore size={20} /> 
              {showComments ? getTotalCommentsCount(comments) : getTotalCommentsCount(post.comments)}
            </button>
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
            >
              <Share2 size={20} /> Share
            </button>
          </section>

          <ReactionSummary payload={reactionPayload} />
        </div>

        <div className={`flex items-center gap-3 mt-6 ${showComments ? "mb-8" : ""}`}>
          <div className="w-10 h-10 rounded-full bg-grey-200 overflow-hidden shrink-0 flex items-center justify-center border">
            <Link href={`/profile/${currentUser?.id}`}>
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
            </Link>
          </div>
          <div className="flex-1">
            <MentionInput
              value={commentInput}
              onChange={(val, ids) => { setCommentInput(val); setMentionedIds(ids); }}
              onSubmit={handleSubmitComment}
              placeholder="Add a comment..."
              members={members}
              mentionedIds={mentionedIds}
            />
          </div>
        </div>

        {showComments && (
          <div className="space-y-4 pt-2">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, idx) => (
                  <div key={idx} className="flex gap-3 items-start px-1">
                    <div className="w-10 h-10 rounded-full bg-grey-200 shrink-0" />
                    <div className="flex-1 bg-grey-50 rounded-xl p-3 space-y-2">
                      <div className="h-4 bg-grey-200 rounded w-1/4" />
                      <div className="h-3 bg-grey-200 rounded w-3/4" />
                      <div className="h-3 bg-grey-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <CommentNode
                  key={comment.commentId}
                  comment={comment}
                  currentUserId={currentUser?.id}
                  currentUserPicture={currentUser?.profilePicture}
                  currentUserInitials={currentUser?.avatarInitials}
                  onRefetch={refetch}
                  workspaceId={groupId}
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
        shareUrl={shareUrl}
      />
    </>
  );
}

export function ArticleCard({
  role,
  posts,
  onDeletePost,
  groupId,
  members,
}: ArticleCardProps) {
  return (
    <>
      {posts.map((post) => (
        <ArticleItem
          key={post.postId}
          post={post}
          role={role}
          onDelete={() => onDeletePost(post.postId)}
          groupId={groupId}
          members={members}
        />
      ))}
    </>
  );
}
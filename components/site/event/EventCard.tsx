"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThumbsUp, Share2, MessageCircleMore } from "lucide-react";
import { UserRole, useCurrentUser } from "@/context/user-context";
import ShareModal from "@/components/site/pop-up/action-button/ShareModal";
import EditPostDropDown from "@/components/site/pop-up/action-button/action-edit-post";
import {
  ReactionPopover,
  REACTIONS,
  TwemojiImg,
} from "@/components/site/pop-up/comment/reaction";
import { Post } from "@/types/posts";
import { getMediaUrl } from "@/libs/media";
import ExpandableText from "./ExpandableText";
import { usePostReaction } from "@/hooks/use-post-reaction";
import { usePostComments } from "@/hooks/use-post-comments";
import { createCommentAction } from "@/actions/comment.action";
import { CommentNode } from "@/components/site/pop-up/comment/comment-node";
import { MentionInput } from "@/components/site/pop-up/comment/MentionInput";
import { ReactionSummary } from "./ReactionSummary";
import { formatEventDate } from "@/libs/format-date";
import { WorkspaceMember } from "@/types/workspace-type/workspace-members";
import { Comment } from "@/types/file-types";

interface EventCardProps {
  role: UserRole;
  posts: Post[];
  searchQuery: string;
  onDeletePost: (postId: string) => Promise<void> | void;
  groupid: string;
  pinnedCount: number;
  onTogglePin: (
    postId: string,
    currentPinStatus: boolean,
  ) => Promise<void> | void;
  members: WorkspaceMember[];
}

const getTotalCommentsCount = (
  commentsList: Comment[] | undefined | null,
): number => {
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

function EventItem({
  post,
  role,
  onDelete,
  groupid,
  pinnedCount,
  onTogglePin,
  members,
}: {
  post: Post;
  role: UserRole;
  onDelete: () => Promise<void> | void;
  groupid: string;
  pinnedCount: number;
  onTogglePin: (
    postId: string,
    currentPinStatus: boolean,
  ) => Promise<void> | void;
  members: WorkspaceMember[];
}) {
  const { currentUser } = useCurrentUser();
  const [showComments, setShowComments] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const {
    selectedReaction,
    handleLikeToggle,
    handleReactionSelect,
    reactionPayload,
  } = usePostReaction(post.postId);

  const [commentInput, setCommentInput] = useState("");
  const [mentionedIds, setMentionedIds] = useState<string[]>([]);

  const { comments, refetch, loading } = usePostComments(
    post.postId,
    showComments,
  );
  const activeReaction = REACTIONS.find((r) => r.id === selectedReaction);

  const coverImage = post.media?.find((m) => m.isCover) ?? post.media?.[0];
  const imageUrl = getMediaUrl(coverImage?.filePath);
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
    const result = await createCommentAction(
      post.postId,
      commentInput,
      mentionedIds,
    );
    if (result.ok) {
      setCommentInput("");
      setMentionedIds([]);
      if (!showComments) setShowComments(true);
      await refetch();
    }
  };

  return (
    <>
      <div className="bg-background rounded-[12px] border border-border p-3 sm:p-4 md:p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3 sm:mb-4">
          <Link href={`/profile/${currentUser?.id}`}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-grey-200 overflow-hidden shrink-0 flex items-center justify-center">
                {profilePictureUrl ? (
                  <Image
                    src={profilePictureUrl}
                    alt={creator!.fullName}
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
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm md:type-desc-semibold text-secondary truncate">
                  {creator?.fullName ?? "—"}
                </h3>
                <p className="text-[10px] sm:text-desc-small-semibold text-grey-500">
                  {formatEventDate(post.createdAt ?? "")}
                </p>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            {creator?.role && (
              <span
                className={`type-desc-small-semibold px-2 py-0.5 sm:px-4 sm:py-3 rounded-xl uppercase shrink-0 ${creator.role.toLowerCase() === "admin" ? "bg-[#EBF5FB] text-primary" : creator.role.toLowerCase() === "organizer" ? "bg-[#FFF7ED] text-[#F97316]" : "bg-grey-100 text-grey-500"}`}
              >
                {creator.role}
              </span>
            )}
            {(role === "admin" || role === "organizer") && (
              <EditPostDropDown
                title={post.title}
                editUrl={`/event-management/edition/event?groupId=${groupid}&postId=${post.postId}`}
                onDelete={onDelete}
                isPinned={post.pinned ?? false}
                pinnedCount={pinnedCount}
                onTogglePin={(currentStatus) =>
                  onTogglePin(post.postId, currentStatus)
                }
              />
            )}
          </div>
        </div>

        <h2 className="text-md sm:text-xl md:text-2xl lg:text-2xl font-bold text-primary mb-2">
          {post.title}
        </h2>

        <ExpandableText text={post.content} />

        <div className="bg-grey-50 rounded-[6px] p-2 sm:p-3 md:p-4 space-y-1.5 sm:space-y-3 mb-3 sm:mb-6 border-l-4 sm:border-l-5 border-primary break-words">
          {post.location && (
            <p className="text-[11px] sm:text-sm text-grey-500 leading-snug">
              <span className="text-[11px] sm:text-sm font-semibold text-foreground">
                LOCATION:{" "}
              </span>
              <a
                href={post.location.googleMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {post.location.locationName ?? "View on map"}
              </a>
            </p>
          )}
          {post.eventStart && (
            <p className="text-[11px] sm:text-sm text-grey-500 leading-snug">
              <span className="text-[11px] sm:text-sm font-semibold text-foreground">
                DATE:{" "}
              </span>
              {post.eventStart}
              {post.eventEnd && ` — ${post.eventEnd}`}
            </p>
          )}
          {post.purpose && (
            <p className="text-[11px] sm:text-sm text-grey-500 leading-snug">
              <span className="text-[11px] sm:text-sm font-semibold text-foreground">
                PURPOSE:{" "}
              </span>
              {post.purpose}
            </p>
          )}
        </div>

        <div className="relative rounded-[12px] overflow-hidden mb-4 sm:mb-6 h-40 sm:h-56 md:h-64 bg-grey-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 700px"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-grey-400">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-grey-200 flex items-center justify-center">
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
              <span className="type-desc-small-semibold">
                No image available
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-primary/90 to-primary/0 p-3 sm:p-6 text-white z-10 flex items-end justify-between gap-2 sm:gap-4">
            <div className="min-w-0 flex-1">
              <span className="inline-flex bg-subtle text-secondary type-desc-small-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-md tracking-wide mb-1 sm:mb-2 text-[10px] sm:text-xs">
                Event
              </span>
              <h4 className="text-xs sm:text-sm md:text-base font-semibold line-clamp-1">
                {post.title}
              </h4>
              <p className="text-[10px] sm:text-xs opacity-80 truncate">
                {post.eventStart ?? "—"}
              </p>
            </div>
            <Link
              href={`/group/${groupid}/event/${post.postId}`}
              className="bg-[#0F2854] hover:bg-[#1C4D8D] text-white type-desc-small-semibold px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg transition-colors cursor-pointer shrink-0 text-center shadow-md mb-0.5 text-[10px] sm:text-xs whitespace-nowrap"
            >
              View Detail
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border type-detail-medium text-grey-500">
          <section className="flex items-center flex-wrap gap-2 sm:gap-3 md:gap-6 py-3 sm:py-4 text-xs sm:text-sm md:text-base">
            <ReactionPopover
              selectedValue={selectedReaction}
              onReactionSelect={handleReactionSelect}
            >
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-2 transition-colors cursor-pointer select-none ${activeReaction ? `${activeReaction.color} font-semibold` : "hover:text-primary"}`}
              >
                {activeReaction ? (
                  <TwemojiImg emoji={activeReaction.emoji} size={20} />
                ) : (
                  <ThumbsUp size={20} />
                )}
                <span>
                  {activeReaction ? activeReaction.displayText : "Like"}
                </span>
              </button>
            </ReactionPopover>
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer"
            >
              <MessageCircleMore size={20} />
              {showComments
                ? getTotalCommentsCount(comments)
                : getTotalCommentsCount(comments) > 0
                  ? `${getTotalCommentsCount(comments)} Comment${getTotalCommentsCount(comments) > 1 ? "s" : ""}`
                  : "Comment"}
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

        <div
          className={`flex items-center gap-2 sm:gap-3 mt-4 sm:mt-6 ${showComments ? "mb-6 sm:mb-8" : ""}`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-grey-200 overflow-hidden shrink-0 flex items-center justify-center border">
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
          <div className="flex-1 min-w-0">
            <MentionInput
              value={commentInput}
              onChange={(val, ids) => {
                setCommentInput(val);
                setMentionedIds(ids);
              }}
              onSubmit={handleSubmitComment}
              placeholder="Add a comment..."
              members={members}
              mentionedIds={mentionedIds}
            />
          </div>
        </div>

        {showComments && (
          <div className="space-y-3 sm:space-y-4 pt-2">
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
                  workspaceId={groupid}
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
        postId={post.postId}
      />
    </>
  );
}

export function EventCard({
  role,
  posts,
  onDeletePost,
  groupid,
  pinnedCount,
  onTogglePin,
  members,
}: EventCardProps) {
  return (
    <>
      {posts.map((post) => (
        <EventItem
          key={post.postId}
          post={post}
          role={role}
          onDelete={() => onDeletePost(post.postId)}
          groupid={groupid}
          pinnedCount={pinnedCount}
          onTogglePin={onTogglePin}
          members={members}
        />
      ))}
    </>
  );
}

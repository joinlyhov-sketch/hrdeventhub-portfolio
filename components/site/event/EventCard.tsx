"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ThumbsUp,
  Share2,
  SendHorizontal,
  MessageCircleMore,
  Smile,
} from "lucide-react";
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
import { ReactionSummary } from "./ReactionSummary";

interface EventCardProps {
  role: UserRole;
  posts: Post[];
  searchQuery: string;
  onDeletePost: (postId: string) => Promise<void> | void;
  groupid: string;
}

function EventItem({
  post,
  role,
  onDelete,
  groupid,
}: {
  post: Post;
  role: UserRole;
  onDelete: () => Promise<void> | void;
  groupid: string;
}) {
  const { currentUser } = useCurrentUser();
  const [showComments, setShowComments] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const {
    selectedReaction,
    likesCount,
    handleLikeToggle,
    handleReactionSelect,
    reactionPayload,
  } = usePostReaction(post.postId);

  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { comments, refetch } = usePostComments(post.postId);
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

  const EMOJI_LIST = [
  "😀","😂","😍","🥰","😎","🤔","😢","😡","👍","👎",
  "❤️","🔥","🎉","✨","💯","🙏","😭","🤣","😊","😅",
  "😆","🥲","😇","🤩","😏","😒","😳","🤯","😱","😴",
  "🤗","🫡","🫠","😬","🙄","😤","🤬","💀","👀","💪",
  ];

  const [showEmoji, setShowEmoji] = useState(false);

  return (
    <>
      <div className="bg-background rounded-[12px] border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-grey-200 overflow-hidden shrink-0 flex items-center justify-center">
              {profilePictureUrl ? (
                <Image
                  src={profilePictureUrl}
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
              <h3 className="type-desc-semibold text-secondary">
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
              <EditPostDropDown
                title={post.title}
                editUrl={`/event-management/edition/event?groupId=${groupid}&postId=${post.postId}`}
                onDelete={onDelete}
              />
            )}
          </div>
        </div>

        <h2 className="type-title text-primary mb-2">{post.title}</h2>

        <ExpandableText text={post.content} />

        <div className="bg-grey-50 rounded-[12px] p-4 space-y-3 mb-6">
          {post.location && (
            <p className="type-detail text-grey-500">
              <span className="type-detail-semibold text-foreground">
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
            <p className="type-detail text-grey-500">
              <span className="type-detail-semibold text-foreground">
                DATE:{" "}
              </span>
              {post.eventStart}
              {post.eventEnd && ` — ${post.eventEnd}`}
            </p>
          )}
          {post.purpose && (
            <p className="type-detail text-grey-500">
              <span className="type-detail-semibold text-foreground">
                PURPOSE:{" "}
              </span>
              {post.purpose}
            </p>
          )}
        </div>

        <div className="relative rounded-[12px] overflow-hidden mb-6 h-64 bg-grey-100">
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
              <span className="type-desc-small-semibold">
                No image available
              </span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-primary/90 to-primary/0 p-6 text-white z-10 flex items-end justify-between gap-4">
            <div>
              <span className="inline-flex bg-subtle text-secondary type-desc-small-semibold px-3 py-1 rounded-md tracking-wide mb-2">
                Event
              </span>
              <h4 className="type-desc-semibold">{post.title}</h4>
              <p className="type-detail-small-medium opacity-80">
                {post.eventStart ?? "—"}
              </p>
            </div>
            <Link
              href={`/group/${groupid}/event/${post.postId}`}
              className="bg-[#0F2854] hover:bg-[#1C4D8D] text-white type-desc-small-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0 text-center shadow-md mb-0.5"
            >
              View Detail
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-border type-detail-medium text-grey-500">
          <section className="flex items-center gap-6 py-4">
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
              <MessageCircleMore size={20} /> {comments?.length ?? 0}
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

            <section className="flex items-center gap-x-2">
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowEmoji((v) => !v)}
                  className="text-grey-400 hover:text-grey-600 flex items-center transition-colors cursor-pointer"
                >
                  <Smile size={20} />
                </button>
                {showEmoji && (
                  <div className="absolute bottom-full mb-2 right-0 z-50 bg-background border border-border rounded-2xl shadow-lg p-3 w-64">
                    <div className="grid grid-cols-8 gap-1">
                      {EMOJI_LIST.map((e) => (
                        <button
                          key={e}
                          onClick={() => {
                            setCommentInput((v) => v + e);
                            setShowEmoji(false);
                          }}
                          className="text-lg hover:scale-125 transition-transform cursor-pointer flex items-center justify-center h-7 w-7"
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleSubmitComment}
                disabled={!commentInput.trim() || isSubmittingComment}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white hover:bg-secondary transition-colors cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendHorizontal size={16} className="relative left-[-0.5px]" />
              </button>
            </section>
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
        />
      ))}
    </>
  );
}

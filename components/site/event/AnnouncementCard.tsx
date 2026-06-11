"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ThumbsUp,
  Share2,
  SendHorizontal,
  Megaphone,
  X,
  MessageCircleMore,
  Smile,
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
import { usePostReaction } from "@/hooks/use-post-reaction";
import { usePostComments } from "@/hooks/use-post-comments";
import { createCommentAction } from "@/actions/comment.action";
import { CommentNode } from "@/components/site/pop-up/comment/comment-node";
import { ReactionSummary } from "./ReactionSummary";
import { formatEventDate } from "@/libs/format-date";
import { createPortal } from "react-dom";
import Link from "next/link";

interface AnnouncementCardProps {
  role: UserRole;
  posts: Post[];
  searchQuery: string;
  onDeletePost: (postId: string) => Promise<void> | void;
  groupid: string;
}

function MediaGrid({ media }: { media: NonNullable<Post["media"]> }) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const images = media.filter((m) => !m.filePath.endsWith(".pdf"));
  const displayImages = images.slice(0, 4);
  const remaining = images.length - 4;
  if (images.length === 0) return null;
  const gridClass = images.length === 1 ? "grid-cols-1" : "grid-cols-2";

  return (
    <>
      <div
        className={`grid ${gridClass} gap-1 rounded-[12px] overflow-hidden mb-6`}
      >
        {displayImages.map((item, index) => {
          const url = getMediaUrl(item.filePath);
          const isLast = index === 3 && remaining > 0;
          const heightClass =
            images.length === 1
              ? "h-80"
              : images.length === 3 && index === 0
                ? "row-span-2 h-full min-h-48"
                : "h-48";
          return (
            <div
              key={item.mediaId}
              className={`relative ${heightClass} cursor-pointer overflow-hidden bg-grey-100`}
              onClick={() => setPreviewIndex(index)}
            >
              {url ? (
                <Image
                  src={url}
                  alt={`media-${index}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 350px"
                />
              ) : (
                <div className="w-full h-full bg-grey-200" />
              )}
              {isLast && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    +{remaining + 1}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {previewIndex !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
            onClick={() => setPreviewIndex(null)}
          >
            <button
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
              onClick={() => setPreviewIndex(null)}
            >
              <X size={24} />
            </button>
            <div className="flex items-center gap-4 px-4 w-full max-w-4xl">
              <button
                className="text-white text-4xl p-2 hover:bg-white/10 rounded-full shrink-0 disabled:opacity-30"
                disabled={previewIndex === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewIndex((p) => (p ?? 0) - 1);
                }}
              >
                ‹
              </button>
              <div
                className="relative flex-1 h-[70vh]"
                onClick={(e) => e.stopPropagation()}
              >
                {getMediaUrl(images[previewIndex]?.filePath) && (
                  <Image
                    src={getMediaUrl(images[previewIndex].filePath)!}
                    alt={`preview-${previewIndex}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                )}
              </div>
              <button
                className="text-white text-4xl p-2 hover:bg-white/10 rounded-full shrink-0 disabled:opacity-30"
                disabled={previewIndex === images.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewIndex((p) => (p ?? 0) + 1);
                }}
              >
                ›
              </button>
            </div>
            <div className="absolute bottom-4 text-white text-sm">
              {previewIndex + 1} / {images.length}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function AnnouncementItem({
  post,
  role,
  onDelete,
  groupId,
}: {
  post: Post;
  role: UserRole;
  onDelete: () => Promise<void> | void;
  groupId: string;
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

  const hasLocation = !!post.location?.locationName;
  const hasDate = !!post.eventStart;
  const hasPurpose = !!post.purpose;
  const hasMetaInfo = hasLocation || hasDate || hasPurpose;

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
        <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#EBF5FB] p-2 rounded-lg text-primary">
              <Megaphone size={18} />
            </div>
            <div>
              <h3 className="type-desc-semibold text-secondary">
                Announcement
              </h3>
            </div>
          </div>
          {(role === "admin" || role === "organizer") && (
            <GenericPostDropDown
              title={post.title}
              editUrl={`/event-management/edition/announcement?groupId=${groupId}&postId=${post.postId}`}
              onDelete={onDelete}
            />
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <Link href={`/profile/${currentUser?.id}`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-grey-200 overflow-hidden shrink-0 flex items-center justify-center">
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
          {creator?.role && (
            <span
              className={`type-desc-small-semibold px-3 py-1 rounded-full uppercase ${creator.role.toLowerCase() === "admin" ? "bg-[#EBF5FB] text-[#3FA6DC]" : creator.role.toLowerCase() === "organizer" ? "bg-[#FFF7ED] text-[#F97316]" : "bg-grey-100 text-grey-500"}`}
            >
              {creator.role}
            </span>
          )}
        </div>

        <h2 className="type-title text-primary mb-2">{post.title}</h2>

        <ExpandableText text={post.content} />

        {hasMetaInfo && (
          <div className="bg-grey-50 rounded-[6px] p-4 space-y-3 mb-6 border-l-5 border-primary">
            {hasLocation && (
              <p className="type-detail text-grey-500">
                <span className="type-detail-semibold text-foreground">
                  LOCATION:{" "}
                </span>
                <a
                  href={post.location!.googleMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-primary"
                >
                  {post.location!.locationName}
                </a>
              </p>
            )}
            {hasDate && (
              <p className="type-detail text-grey-500">
                <span className="type-detail-semibold text-foreground">
                  DATE:{" "}
                </span>
                {post.eventStart}
                {post.eventEnd && ` — ${post.eventEnd}`}
              </p>
            )}
            {hasPurpose && (
              <p className="type-detail text-grey-500">
                <span className="type-detail-semibold text-foreground">
                  PURPOSE:{" "}
                </span>
                {post.purpose}
              </p>
            )}
          </div>
        )}

        {post.media && post.media.length > 0 && (
          <MediaGrid media={post.media} />
        )}

        {post.payment && (
          <div className="mb-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 font-medium">
            {post.payment.paymentType === "fixed"
              ? `Registration fee: $${post.payment.paymentAmount}`
              : `Donation goal: $${post.payment.donationGoal}`}
          </div>
        )}

        <div className="flex items-center justify-between border-b border-border type-detail-medium text-grey-500">
          <section className="flex items-center gap-6 py-4">
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
                <span className="flex items-center gap-1.5">
                  {activeReaction ? (
                    <TwemojiImg emoji={activeReaction.emoji} size={20} />
                  ) : (
                    <ThumbsUp size={20} />
                  )}
                  {activeReaction?.displayText ?? "Like"}
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
                  onRefetch={refetch} workspaceId={groupId}                 
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
        shareUrl={`hrdeventhub.app/event-management/announcements/${post.postId}`}
      />
    </>
  );
}

export function AnnouncementCard({
  role,
  posts,
  onDeletePost,
  groupid,
}: AnnouncementCardProps) {
  return (
    <>
      {posts.map((post) => (
        <AnnouncementItem
          key={post.postId}
          post={post}
          role={role}
          onDelete={() => onDeletePost(post.postId)}
          groupId={groupid}
        />
      ))}
    </>
  );
}

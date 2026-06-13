"use client";

import { useState } from "react";
import Image from "next/image";
import { ThumbsUp, Share2, MessageCircleMore } from "lucide-react";
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
import { useWorkspaceMembers } from "@/hooks/use-workspace-members";
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
}

function ArticleItem({
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
    reactionPayload,
    handleLikeToggle,
    handleReactionSelect,
  } = usePostReaction(post.postId);

  const [commentInput, setCommentInput] = useState("");
  const [mentionedIds, setMentionedIds] = useState<string[]>([]);

  const { comments, refetch } = usePostComments(post.postId);
  const { members } = useWorkspaceMembers(groupId ?? "");
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
    const result = await createCommentAction(
      post.postId,
      commentInput,
      mentionedIds,
    );
    if (result.ok) {
      setCommentInput("");
      setMentionedIds([]);
      await refetch();
    }
  };
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/group/${groupId}?postId=${post.postId}&type=article`
    : `https://hrdevent.app/group/${groupId}?postId=${post.postId}&type=article`;

  return (
    <>
      <div className="bg-background rounded-[12px] border border-border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <Link href={`/profile/${currentUser?.id}`}>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-grey-200 overflow-hidden shrink-0 flex items-center justify-center">
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
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-secondary truncate">
                  {creator?.fullName ?? "—"}
                </h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-grey-500">
                  {formatEventDate(post.createdAt ?? "")}
                </p>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {creator?.role && (
              <span
                className={`type-desc-small-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase shrink-0 ${creator.role.toLowerCase() === "admin" ? "bg-[#EBF5FB] text-[#3FA6DC]" : creator.role.toLowerCase() === "organizer" ? "bg-[#FFF7ED] text-[#F97316]" : "bg-grey-100 text-grey-500"}`}
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

        <h2 className="text-md sm:text-xl md:text-2xl lg:text-2xl font-bold text-primary mb-2">
          {post.title}
        </h2>
        <ExpandableText text={post.content} />

        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border type-detail-medium text-grey-500">
          <section className="flex items-center flex-wrap gap-2 sm:gap-3 md:gap-6 py-3 sm:py-4 text-xs sm:text-sm md:text-base">
            <ReactionPopover
              selectedValue={selectedReaction}
              onReactionSelect={handleReactionSelect}
            >
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-2 transition-colors cursor-pointer select-none text-sm sm:text-base ${activeReaction ? `${activeReaction.color} font-semibold` : "hover:text-primary"}`}
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
            {comments.length > 0 ? (
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
              <div className="text-center py-6 sm:py-8">
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
        />
      ))}
    </>
  );
}

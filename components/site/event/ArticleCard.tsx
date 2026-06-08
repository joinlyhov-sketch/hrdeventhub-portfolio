"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ThumbsUp,
  Share2,
  SendHorizontal,
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
import { usePostComments } from "@/hooks/use-post-comments";
import { createCommentAction } from "@/actions/comment.action";
import { CommentNode } from "@/components/site/pop-up/comment/comment-node";
import { usePostReaction } from "@/hooks/use-post-reaction";
import { ReactionSummary } from "./ReactionSummary";

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
    likesCount,
    reactionPayload,
    handleLikeToggle,
    handleReactionSelect,
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
        shareUrl={`hrdeventhub.app/event-management/articles/${post.postId}`}
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

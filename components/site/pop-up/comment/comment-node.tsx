"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Trash2, ThumbsUp, Smile, SendHorizontal } from "lucide-react";
import { Comment } from "@/types/comment";
import {
  createReplyAction,
  editCommentAction,
  deleteCommentAction,
} from "@/actions/comment.action";
import {
  ReactionPopover,
  REACTIONS,
} from "@/components/site/pop-up/comment/reaction";
import { useCommentReaction } from "@/hooks/use-comment-reaction";
import { ReactionSummary } from "../../event/ReactionSummary";
import { MentionInput } from "./MentionInput";
import { EmojiPopover } from "./EmojiPopover";
import { useWorkspaceMembers } from "@/hooks/use-workspace-members";
import Link from "next/link";
import { toast } from "sonner";
import DeleteCommentModal from "./modals/delete-comment-modal";

interface CommentNodeProps {
  comment: Comment;
  currentUserId?: string;
  currentUserPicture?: string;
  currentUserInitials?: string;
  isNested?: boolean;
  forceShowReplies?: boolean;
  workspaceId: string;
  onRefetch: () => Promise<void>;
}

function countAllReplies(replies: Comment[]): number {
  return replies.reduce(
    (total, reply) => total + 1 + countAllReplies(reply.replies ?? []),
    0,
  );
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, Math.floor((now - then) / 1000));
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function Avatar({
  src,
  alt,
  initials,
  size,
  userId,
}: {
  src?: string;
  alt: string;
  initials: string;
  size: number;
  userId?: string;
}) {
  const inner = src ? (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="w-full h-full object-cover"
    />
  ) : (
    <span
      style={{ fontSize: size < 32 ? 10 : 12 }}
      className="font-bold text-primary uppercase"
    >
      {initials || "?"}
    </span>
  );

  return (
    <div
      style={{ width: size, height: size, minWidth: size }}
      className="rounded-full bg-[#EBF5FB] overflow-hidden flex items-center justify-center border text-[#3FA6DC] font-semibold shrink-0"
    >
      {userId ? <Link href={`/profile/${userId}`}>{inner}</Link> : inner}
    </div>
  );
}

export function CommentNode({
  comment,
  currentUserId,
  currentUserPicture,
  currentUserInitials,
  isNested = false,
  forceShowReplies = false,
  workspaceId,
  onRefetch,
}: CommentNodeProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [showEditEmoji, setShowEditEmoji] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyMentionedIds, setReplyMentionedIds] = useState<string[]>([]);

  const [showReplies, setShowReplies] = useState(false);

  const { members } = useWorkspaceMembers(workspaceId ?? "");

  const {
    selectedReaction,
    handleLikeToggle,
    handleReactionSelect,
    reactionPayload,
  } = useCommentReaction(comment.commentId);

  const activeReaction = REACTIONS.find((r) => r.id === selectedReaction);
  const initials =
    `${comment.appUser.firstName?.[0] ?? ""}${comment.appUser.lastName?.[0] ?? ""}`.toUpperCase();
  const isOwner = currentUserId === comment.appUser.appUserId;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const replyCount = countAllReplies(comment.replies ?? []);
  const repliesVisible = isNested ? forceShowReplies : showReplies;

  const bubbleRef = useRef<HTMLDivElement>(null);

  const handleEdit = async () => {
    if (!editText.trim()) return;
    const result = await editCommentAction(comment.commentId, editText);
    if (result.ok) {
      setEditingId(null);
      setEditText("");
      await onRefetch();
    }
  };

  const handleDelete = async () => {
    const result = await deleteCommentAction(comment.commentId);
    if (result.ok) await onRefetch();
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    const result = await createReplyAction(
      comment.commentId,
      replyText,
      replyMentionedIds,
    );
    if (result.ok) {
      setShowReplyInput(false);
      setReplyText("");
      setReplyMentionedIds([]);
      setShowReplies(true);
      await onRefetch();
    }
  };

  const handleReplyClick = () => {
    const targetUser = comment.appUser;
    const matchingMember = members.find(
      (m) => m.appUserId === targetUser.appUserId,
    );
    const exactUsername = matchingMember?.username || targetUser.username;

    const handle = exactUsername
      ? `@${exactUsername}`
      : `@${targetUser.firstName.toLowerCase()}${targetUser.lastName.toLowerCase()}`;

    setReplyText(`${handle} `);
    setReplyMentionedIds([targetUser.appUserId]);
    setShowReplyInput(true);
  };

  const closeReplyInput = useCallback(() => {
    setShowReplyInput(false);
    setReplyText("");
    setReplyMentionedIds([]);
  }, []);
  const handleConfirmDelete = async () => {
    const res = await deleteCommentAction(comment.commentId);
    if (res?.ok) {
      toast.success("Comment deleted successfully");
      await onRefetch();
    } else {
      throw new Error(res?.error || "Failed to delete comment");
    }
  };

  return (
    <div className="flex gap-2.5">
      <div
        className="flex flex-col items-center shrink-0"
        style={{ width: 36 }}
      >
        <Avatar
          src={comment.appUser.profilePicture}
          alt={`${comment.appUser.firstName} ${comment.appUser.lastName}`}
          initials={initials}
          size={36}
          userId={comment.appUser.appUserId}
        />
        {hasReplies && repliesVisible && (
          <div className="w-px bg-grey-200 mt-1.5 mb-1 flex-1" />
        )}
      </div>

      <div className="flex-1 w-full pb-1">
        <div className="inline-block max-w-full min-w-0">
          <div
            ref={bubbleRef}
            className={`relative bg-grey-100 rounded-2xl px-3 py-2 ${
              editingId === comment.commentId
                ? "block w-full bg-transparent p-0!"
                : "w-full"
            }`}
          >
            <div className="flex items-center gap-2 justify-between">
              <Link
                href={`/profile/${comment.appUser.appUserId}`}
                className="type-detail-semibold text-grey-900 text-sm leading-tight hover:underline hover:text-primary transition-colors"
              >
                {comment.appUser.firstName} {comment.appUser.lastName}
              </Link>
              {isOwner && editingId !== comment.commentId && (
                <section className="flex gap-x-1.5 items-baseline ml-4 shrink-0">
                  <button
                    onClick={() => {
                      setEditingId(comment.commentId);
                      setEditText(comment.comment);
                    }}
                    className="text-grey-400 hover:text-primary transition-colors text-xs cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-grey-400 hover:text-destructive transition-colors cursor-pointer"
                    aria-label="Delete comment"
                  >
                    <Trash2 size={13} />
                  </button>
                </section>
              )}
            </div>

            {editingId === comment.commentId ? (
              <div className="mt-2 space-y-2 w-full">
                <div className="flex items-center justify-between bg-[#F8F9FA] focus-within:bg-grey-50 rounded-full transition-all py-1.5 pl-4 pr-2 w-full h-11">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder="Edit your comment..."
                    className="flex-1 bg-transparent text-sm outline-none text-grey-900 placeholder-grey-400 h-full min-w-0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (editText.trim()) handleEdit();
                      }
                      if (e.key === "Escape") {
                        setEditingId(null);
                        setEditText("");
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="relative shrink-0">
                      <button
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => setShowEditEmoji((v) => !v)}
                        className="text-grey-400 hover:text-grey-600 flex items-center transition-colors cursor-pointer"
                      >
                        <Smile size={20} />
                      </button>
                      {showEditEmoji && (
                        <EmojiPopover
                          onPick={(emoji) =>
                            setEditText((prev) => prev + emoji)
                          }
                          onClose={() => setShowEditEmoji(false)}
                        />
                      )}
                    </div>
                    <button
                      onClick={handleEdit}
                      disabled={!editText.trim()}
                      className="p-2 bg-primary text-white rounded-full hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center w-8 h-8"
                    >
                      <SendHorizontal
                        size={16}
                        className="relative left-[-0.5px]"
                      />
                    </button>
                  </div>
                </div>
                <div className="flex justify-start pl-4">
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditText("");
                    }}
                    className="text-xs font-medium text-grey-400 hover:text-grey-900 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-grey-900 leading-normal mt-0.5 whitespace-pre-wrap">
                {comment.comment.split(" ").map((word, i) => {
                  if (word.startsWith("@")) {
                    const cleanHandle = word
                      .replace(/^@+/, "")
                      .replace(/[^a-zA-Z0-9_-]/g, "");
                    const trailingPunctuation = word.slice(
                      cleanHandle.length + 1,
                    );
                    const matchedUser = members.find(
                      (m) =>
                        m.username?.toLowerCase() === cleanHandle.toLowerCase(),
                    );

                    if (matchedUser) {
                      return (
                        <span key={i}>
                          <Link
                            href={`/profile/${matchedUser.appUserId}`}
                            className="text-blue-600 font-semibold hover:underline transition-colors cursor-pointer"
                          >
                            @{cleanHandle}
                          </Link>
                          {trailingPunctuation}{" "}
                        </span>
                      );
                    }
                  }
                  return word + " ";
                })}
              </p>
            )}
          </div>

          {editingId !== comment.commentId && (
            <div className="flex items-center gap-3 mt-1 pl-1 text-xs font-semibold text-grey-400">
              <span className="font-normal">{timeAgo(comment.createdAt)}</span>
              <ReactionPopover
                selectedValue={selectedReaction}
                onReactionSelect={handleReactionSelect}
              >
                <button
                  onClick={handleLikeToggle}
                  className={`flex items-center gap-1 transition-colors cursor-pointer select-none ${
                    activeReaction
                      ? `${activeReaction.color} font-semibold`
                      : "hover:text-grey-900"
                  }`}
                >
                  {activeReaction ? (
                    activeReaction.displayText
                  ) : (
                    <ThumbsUp size={13} />
                  )}
                  {!activeReaction && "Like"}
                </button>
              </ReactionPopover>
              <button
                onClick={handleReplyClick}
                className="hover:text-grey-900 transition-colors cursor-pointer"
              >
                Reply
              </button>
              <div className="ml-auto">
                <ReactionSummary payload={reactionPayload} />
              </div>
            </div>
          )}
        </div>

        {hasReplies && !isNested && (
          <button
            onClick={() => setShowReplies((v) => !v)}
            className="flex items-center gap-1.5 mt-1.5 pl-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            <div className="w-5 h-px bg-grey-300" />
            {showReplies
              ? `Hide replies (${replyCount})`
              : `View ${replyCount} ${replyCount === 1 ? "reply" : "replies"}`}
          </button>
        )}

        {showReplyInput && (
          <div className="flex gap-2 items-center mt-2">
            <Avatar
              src={currentUserPicture}
              alt="Your avatar"
              initials={currentUserInitials ?? "?"}
              size={28}
              userId={currentUserId}
            />
            <div className="flex-1">
              <MentionInput
                value={replyText}
                onChange={(val, ids) => {
                  setReplyText(val);
                  setReplyMentionedIds(ids);
                }}
                onSubmit={handleReply}
                onClose={closeReplyInput}
                onBlurClose
                placeholder={
                  comment.appUser.username
                    ? `Reply to @${comment.appUser.username.toLowerCase()}…`
                    : `Reply to ${comment.appUser.firstName} ${comment.appUser.lastName}…`
                }
                members={members}
                mentionedIds={replyMentionedIds}
                autoFocus
              />
            </div>
          </div>
        )}

        {hasReplies && repliesVisible && (
          <div className="mt-2 space-y-3">
            {comment.replies.map((reply) => (
              <CommentNode
                key={reply.commentId}
                comment={reply}
                currentUserId={currentUserId}
                currentUserPicture={currentUserPicture}
                currentUserInitials={currentUserInitials}
                isNested={true}
                forceShowReplies={true}
                workspaceId={workspaceId}
                onRefetch={onRefetch}
              />
            ))}
          </div>
        )}
      </div>
      <DeleteCommentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

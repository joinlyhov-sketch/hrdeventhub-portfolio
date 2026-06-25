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


function CommentBubble({
  comment,
  currentUserId,
  currentUserPicture,
  currentUserInitials,
  workspaceId,
  onRefetch,
  onReply,
}: {
  comment: Comment;
  currentUserId?: string;
  currentUserPicture?: string;
  currentUserInitials?: string;
  workspaceId: string;
  onRefetch: () => Promise<void>;
  onReply: (targetUser: Comment["appUser"]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [showEditEmoji, setShowEditEmoji] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const handleEdit = async () => {
    if (!editText.trim()) return;
    const result = await editCommentAction(comment.commentId, editText);
    if (result.ok) {
      setEditingId(null);
      setEditText("");
      await onRefetch();
    }
  };

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
    <>
      <div className="flex gap-2">
        <Avatar
          src={comment.appUser.profilePicture}
          alt={`${comment.appUser.firstName} ${comment.appUser.lastName}`}
          initials={initials}
          size={32}
          userId={comment.appUser.appUserId}
        />

        <div className="flex-1 min-w-0">
          {editingId === comment.commentId ? (
            <div className="space-y-1.5">
              <div className="flex items-center bg-grey-100 focus-within:bg-grey-50 rounded-full transition-all py-1.5 pl-4 pr-2 h-10">
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
                      <Smile size={18} />
                    </button>
                    {showEditEmoji && (
                      <EmojiPopover
                        onPick={(emoji) => setEditText((prev) => prev + emoji)}
                        onClose={() => setShowEditEmoji(false)}
                      />
                    )}
                  </div>
                  <button
                    onClick={handleEdit}
                    disabled={!editText.trim()}
                    className="p-1.5 bg-primary text-white rounded-full hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center w-7 h-7"
                  >
                    <SendHorizontal size={14} className="relative left-[-0.5px]" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => { setEditingId(null); setEditText(""); }}
                className="ml-4 text-xs font-medium text-grey-400 hover:text-grey-900 cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="inline-block max-w-full">
              <div className="bg-grey-100 rounded-2xl px-3 py-2">
                <div className="flex items-center gap-2 justify-between">
                  <Link
                    href={`/profile/${comment.appUser.appUserId}`}
                    className="text-sm font-semibold text-grey-900 leading-tight hover:underline hover:text-primary transition-colors"
                  >
                    {comment.appUser.firstName} {comment.appUser.lastName}
                  </Link>
                  {isOwner && (
                    <section className="flex gap-x-1.5 items-center ml-4 shrink-0">
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

                <p className="text-sm text-grey-900 leading-normal mt-0.5 whitespace-pre-wrap">
                  {comment.comment.split(" ").map((word, i) => {
                    if (word.startsWith("@")) {
                      const cleanHandle = word
                        .replace(/^@+/, "")
                        .replace(/[^a-zA-Z0-9_-]/g, "");
                      const trailingPunctuation = word.slice(cleanHandle.length + 1);
                      const matchedUser = members.find(
                        (m) => m.username?.toLowerCase() === cleanHandle.toLowerCase(),
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
              </div>

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
                  onClick={() => onReply(comment.appUser)}
                  className="hover:text-grey-900 transition-colors cursor-pointer"
                >
                  Reply
                </button>
                <div className="ml-auto">
                  <ReactionSummary payload={reactionPayload} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteCommentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
export function CommentNode({
  comment,
  currentUserId,
  currentUserPicture,
  currentUserInitials,
  isNested = false,
  workspaceId,
  onRefetch,
}: CommentNodeProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyMentionedIds, setReplyMentionedIds] = useState<string[]>([]);

  const { members } = useWorkspaceMembers(workspaceId ?? "");
  function flattenReplies(replies: Comment[]): Comment[] {
    const result: Comment[] = [];
    for (const r of replies) {
      result.push(r);
      if (r.replies?.length) result.push(...flattenReplies(r.replies));
    }
    return result;
  }

  const flatReplies = flattenReplies(comment.replies ?? []);
  const replyCount = flatReplies.length;
  const hasReplies = replyCount > 0;

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

  const handleReplyClick = (targetUser: Comment["appUser"]) => {
    const matchingMember = members.find((m) => m.appUserId === targetUser.appUserId);
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

  if (isNested) {
    return (
      <CommentBubble
        comment={comment}
        currentUserId={currentUserId}
        currentUserPicture={currentUserPicture}
        currentUserInitials={currentUserInitials}
        workspaceId={workspaceId}
        onRefetch={onRefetch}
        onReply={handleReplyClick}
      />
    );
  }

  return (
    <div>
      <CommentBubble
        comment={comment}
        currentUserId={currentUserId}
        currentUserPicture={currentUserPicture}
        currentUserInitials={currentUserInitials}
        workspaceId={workspaceId}
        onRefetch={onRefetch}
        onReply={handleReplyClick}
      />

      {hasReplies && (
        <button
          onClick={() => setShowReplies((v) => !v)}
          className="flex items-center gap-1.5 mt-1.5 ml-10 text-xs font-semibold text-primary hover:underline cursor-pointer"
        >
          <div className="w-5 h-px bg-grey-300" />
          {showReplies
            ? `Hide replies (${replyCount})`
            : `View ${replyCount} ${replyCount === 1 ? "reply" : "replies"}`}
        </button>
      )}

      {showReplies && hasReplies && (
        <div className="mt-2 ml-10 relative">
          <div className="absolute left-[-20px] top-4 bottom-20 w-px bg-grey-200" />

          <div className="space-y-3">
            {flatReplies.map((reply) => (
              <div key={reply.commentId} className="relative">
                <div className="absolute left-[-20px] top-0 w-4 h-6 border-l-2 border-b-2 border-grey-200 rounded-bl-lg" />
                <CommentBubble
                  comment={reply}
                  currentUserId={currentUserId}
                  currentUserPicture={currentUserPicture}
                  currentUserInitials={currentUserInitials}
                  workspaceId={workspaceId}
                  onRefetch={onRefetch}
                  onReply={handleReplyClick}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {showReplyInput && (
        <div className="flex gap-2 items-center mt-2 ml-10">
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
    </div>
  );
}
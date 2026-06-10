"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Trash2, Smile, ThumbsUp, SendHorizontal } from "lucide-react";
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

interface CommentNodeProps {
  comment: Comment;
  currentUserId?: string;
  currentUserPicture?: string;
  currentUserInitials?: string;
  isNested?: boolean;
  onRefetch: () => Promise<void>;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
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
}: {
  src?: string;
  alt: string;
  initials: string;
  size: number;
}) {
  return (
    <div
      style={{ width: size, height: size, minWidth: size }}
      className="rounded-full bg-[#EBF5FB] overflow-hidden flex items-center justify-center border text-[#3FA6DC] font-semibold shrink-0"
    >
      {src ? (
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
      )}
    </div>
  );
}

const EMOJI_LIST = [
  "😀",
  "😂",
  "😍",
  "🥰",
  "😎",
  "🤔",
  "😢",
  "😡",
  "👍",
  "👎",
  "❤️",
  "🔥",
  "🎉",
  "✨",
  "💯",
  "🙏",
  "😭",
  "🤣",
  "😊",
  "😅",
  "😆",
  "🥲",
  "😇",
  "🤩",
  "😏",
  "😒",
  "😳",
  "🤯",
  "😱",
  "😴",
  "🤗",
  "🫡",
  "🫠",
  "😬",
  "🙄",
  "😤",
  "🤬",
  "💀",
  "👀",
  "💪",
];

function EmojiPopover({
  onPick,
  onClose,
}: {
  onPick: (e: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full mb-2 right-0 z-50 bg-background border border-border rounded-2xl shadow-lg p-3 w-64"
    >
      <div className="grid grid-cols-8 gap-1">
        {EMOJI_LIST.map((e) => (
          <button
            key={e}
            onMouseDown={(ev) => ev.preventDefault()}
            onClick={() => {
              onPick(e);
              onClose();
            }}
            className="text-lg hover:scale-125 transition-transform cursor-pointer flex items-center justify-center h-7 w-7"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReplyInput({
  currentUserPicture,
  currentUserInitials,
  replyText,
  onReplyTextChange,
  onSubmit,
  onClose,
  targetName,
}: {
  currentUserPicture?: string;
  currentUserInitials?: string;
  replyText: string;
  onReplyTextChange: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  targetName?: string;
}) {
  const [showEmoji, setShowEmoji] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      if (
        containerRef.current &&
        !containerRef.current.contains(document.activeElement)
      ) {
        if (!showEmoji) onClose();
      }
    }, 150);
  }, [onClose, showEmoji]);

  return (
    <div
      ref={containerRef}
      className="flex gap-2 items-start mt-2"
      onBlur={handleBlur}
    >
      <Avatar
        src={currentUserPicture}
        alt="Your avatar"
        initials={currentUserInitials ?? "?"}
        size={28}
      />
      <div className="flex-1">
        <div className="relative flex items-center bg-grey-100 rounded-2xl px-3 py-3 gap-2">
          <input
            autoFocus
            placeholder={
              targetName ? `Reply to ${targetName}…` : "Write a reply…"
            }
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit();
              }
              if (e.key === "Escape") onClose();
            }}
            className="flex-1 bg-transparent outline-none type-detail text-grey-900 placeholder:text-grey-400 text-sm"
          />
          <div className="relative shrink-0">
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowEmoji((v) => !v)}
              className="text-grey-400 hover:text-grey-600 flex items-center transition-colors cursor-pointer"
            >
              <Smile size={20} />
            </button>
            {showEmoji && (
              <EmojiPopover
                onPick={(emoji) => {
                  onReplyTextChange(replyText + emoji);
                }}
                onClose={() => setShowEmoji(false)}
              />
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-1.5 pl-1">
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => replyText.trim() && onSubmit()}
            className={`text-xs font-semibold transition-colors cursor-pointer ${
              replyText.trim()
                ? "text-primary hover:underline"
                : "text-grey-300 cursor-not-allowed"
            }`}
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

export function CommentNode({
  comment,
  currentUserId,
  currentUserPicture,
  currentUserInitials,
  isNested = false,
  onRefetch,
}: CommentNodeProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [showEditEmoji, setShowEditEmoji] = useState(false);

  const {
    selectedReaction,
    likesCount,
    handleLikeToggle,
    handleReactionSelect,
    reactionPayload,
  } = useCommentReaction(comment.commentId);

  const activeReaction = REACTIONS.find((r) => r.id === selectedReaction);

  const initials =
    `${comment.appUser.firstName?.[0] ?? ""}${comment.appUser.lastName?.[0] ?? ""}`.toUpperCase();
  const isOwner = currentUserId === comment.appUser.appUserId;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const replyCount = comment.replies?.length ?? 0;

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
    const result = await createReplyAction(comment.commentId, replyText);
    if (result.ok) {
      setShowReplyInput(false);
      setReplyText("");
      setShowReplies(true);
      await onRefetch();
    }
  };

  const closeReplyInput = useCallback(() => {
    setShowReplyInput(false);
    setReplyText("");
  }, []);

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
        />
        {hasReplies && showReplies && (
          <div className="w-px bg-grey-200 mt-1.5 mb-1 flex-1" />
        )}
      </div>

      <div className="flex-col w-fit pb-1">
        <div
          className={`bg-grey-100 rounded-2xl px-3 py-2  ${
            editingId === comment.commentId
              ? "block w-full bg-transparent p-0!"
              : "inline-block max-w-full"
          }`}
        >
          <div className="flex items-center gap-2 justify-between">
            <span className="type-detail-semibold text-grey-900 text-sm leading-tight">
              {comment.appUser.firstName} {comment.appUser.lastName}
            </span>
            {isOwner && (
              <div className="flex gap-1.5 items-baseline shrink-0">
                {editingId !== comment.commentId && (
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
                      onClick={handleDelete}
                      className="text-grey-400 hover:text-destructive transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </section>
                )}
              </div>
            )}
          </div>

          {editingId === comment.commentId ? (
            <div className="mt-2 space-y-2 w-full">
              <div className="flex items-center justify-between bg-[#F8F9FA] focus-within:border-grey-200 focus-within:bg-grey-50 rounded-full transition-all py-1.5 pl-4 pr-2 w-full h-11">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 bg-transparent text-sm outline-none text-grey-900 placeholder-grey-400 h-full min-w-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (editText.trim()) handleEdit();
                    }
                  }}
                  autoFocus
                />

                <div className="flex items-center gap-1.5 shrink-0">
                  <section className="relative shrink-0">
                    <button
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowEditEmoji((v) => !v)}
                      className="text-grey-400 hover:text-grey-600 flex items-center transition-colors cursor-pointer"
                    >
                      <Smile size={20} />
                    </button>
                  </section>
                  {showEditEmoji && (
                    <EmojiPopover
                      onPick={(emoji) => setEditText((prev) => prev + emoji)}
                      onClose={() => setShowEditEmoji(false)}
                    />
                  )}

                  <button
                    onClick={handleEdit}
                    disabled={!editText.trim()}
                    className="p-2 bg-primary text-white rounded-full hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center w-8 h-8"
                    title="Save comment"
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
                  onClick={() => setEditingId(null)}
                  className="text-xs font-medium text-grey-400 hover:text-grey-900 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-grey-900 leading-normal mt-0.5">
              {comment.comment.split(" ").map((word, i) =>
                word.startsWith("@") ? (
                  <span key={i} className="text-blue-600 font-semibold">
                    {word}{" "}
                  </span>
                ) : (
                  word + " "
                ),
              )}
            </p>
          )}
        </div>

        {editingId !== comment.commentId && (
          <div className="flex items-center justify-between mt-1 pl-1 text-xs font-semibold text-grey-400 min-w-[180px]">
            <section className="flex items-center gap-3">
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
                  {activeReaction ? activeReaction.displayText : "Like"}
                </button>
              </ReactionPopover>
              <button
                onClick={() => {
                  setShowReplyInput((v) => !v);
                  setReplyText("");
                }}
                className="hover:text-grey-900 transition-colors cursor-pointer"
              >
                Reply
              </button>
            </section>

            <ReactionSummary payload={reactionPayload} />
          </div>
        )}

        {hasReplies && (
          <button
            onClick={() => setShowReplies((v) => !v)}
            className="flex items-center gap-1.5 mt-1.5 pl-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            <div className="w-5 h-px bg-grey-300" />
            {showReplies
              ? "Hide replies"
              : `View ${replyCount} ${replyCount === 1 ? "reply" : "replies"}`}
          </button>
        )}

        {showReplyInput && (
          <ReplyInput
            currentUserPicture={currentUserPicture}
            currentUserInitials={currentUserInitials}
            replyText={replyText}
            onReplyTextChange={setReplyText}
            onSubmit={handleReply}
            onClose={closeReplyInput}
            targetName={`${comment.appUser.firstName} ${comment.appUser.lastName}`}
          />
        )}

        {hasReplies && showReplies && (
          <div className="mt-2 space-y-3">
            {comment.replies.map((reply) => (
              <CommentNode
                key={reply.commentId}
                comment={reply}
                currentUserId={currentUserId}
                currentUserPicture={currentUserPicture}
                currentUserInitials={currentUserInitials}
                isNested={true}
                onRefetch={onRefetch}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

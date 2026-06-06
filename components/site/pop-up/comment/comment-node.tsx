"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Trash2, Smile, Send } from "lucide-react";
import { Comment } from "@/types/comment";
import {
  createReplyAction,
  editCommentAction,
  deleteCommentAction,
} from "@/actions/comment.action";
import Link from "next/link";

interface CommentNodeProps {
  comment: Comment;
  currentUserId?: string;
  currentUserPicture?: string;
  currentUserInitials?: string;
  isNested?: boolean;
  index?: number;
  totalReplies?: number;
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
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Avatar({ src, alt, initials, size }: { src?: string; alt: string; initials: string; size: number }) {
  return (
    <div
      style={{ width: size, height: size, minWidth: size }}
      className="rounded-full bg-[#EBF5FB] overflow-hidden flex items-center justify-center border text-[#3FA6DC] font-semibold shrink-0"
    >
      {src ? (
        <Image src={src} alt={alt} width={size} height={size} className="w-full h-full object-cover" />
      ) : (
        <span style={{ fontSize: size < 32 ? 10 : 12 }} className="font-bold text-primary uppercase">
          {initials || "?"}
        </span>
      )}
    </div>
  );
}

const EMOJI_LIST = [
  "😀","😂","😍","🥰","😎","🤔","😢","😡","👍","👎",
  "❤️","🔥","🎉","✨","💯","🙏","😭","🤣","😊","😅",
  "😆","🥲","😇","🤩","😏","😒","😳","🤯","😱","😴",
  "🤗","🫡","🫠","😬","🙄","😤","🤬","💀","👀","💪",
];

function EmojiPopover({ onPick, onClose }: { onPick: (e: string) => void; onClose: () => void }) {
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
            onClick={() => { onPick(e); onClose(); }}
            className="text-lg hover:scale-125 transition-transform cursor-pointer flex items-center justify-center h-7 w-7"
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}

function InlineInputBar({
  value,
  onChange,
  onSubmit,
  onCancel,
  onClose,
  placeholder,
  submitIcon,
  autoFocus = true,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  placeholder?: string;
  submitIcon?: React.ReactNode;
  autoFocus?: boolean;
}) {
  const [showEmoji, setShowEmoji] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
        if (!showEmoji && onClose) onClose();
      }
    }, 150);
  }, [onClose, showEmoji]);

  return (
    <div ref={containerRef} onBlur={handleBlur}>
      <div className="flex items-center bg-grey-100 rounded-2xl px-3 py-1.5 gap-2">
        <input
          autoFocus={autoFocus}
          placeholder={placeholder ?? "Write something…"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(); }
            if (e.key === "Escape" && onClose) onClose();
          }}
          className="flex-1 bg-transparent outline-none text-sm text-grey-900 placeholder:text-grey-400"
        />

        <div className="relative shrink-0">
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setShowEmoji((v) => !v)}
            className="text-grey-400 hover:text-grey-600 transition-colors cursor-pointer"
          >
            <Smile size={16} />
          </button>
          {showEmoji && (
            <EmojiPopover
              onPick={(emoji) => onChange(value + emoji)}
              onClose={() => setShowEmoji(false)}
            />
          )}
        </div>

        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={onSubmit}
          disabled={!value.trim()}
          className="shrink-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitIcon ?? (
            <Send size={26} className="bg-primary rounded-full p-1.5 text-primary-foreground hover:opacity-90 transition-opacity" />
          )}
        </button>
      </div>

      {onCancel && (
        <div className="mt-1.5 pl-1">
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={onCancel}
            className="text-xs text-primary font-semibold hover:underline cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}
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
  return (
    <div className="flex gap-2 items-start mt-2">
      <Avatar src={currentUserPicture} alt="Your avatar" initials={currentUserInitials ?? "?"} size={28} />
      <div className="flex-1">
        <InlineInputBar
          value={replyText}
          onChange={onReplyTextChange}
          onSubmit={onSubmit}
          onCancel={onClose}
          onClose={onClose}
          placeholder={targetName ? `Reply to ${targetName}…` : "Write a reply…"}
        />
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
  index = 0,
  totalReplies = 0,
  onRefetch,
}: CommentNodeProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  const initials = `${comment.appUser.firstName?.[0] ?? ""}${comment.appUser.lastName?.[0] ?? ""}`.toUpperCase();
  const isOwner = currentUserId === comment.appUser.appUserId;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const replyCount = comment.replies?.length ?? 0;
  const isEditing = editingId === comment.commentId;

  const handleEdit = async () => {
    if (!editText.trim()) return;
    const result = await editCommentAction(comment.commentId, editText);
    if (result.ok) { setEditingId(null); setEditText(""); await onRefetch(); }
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

  const closeEdit = useCallback(() => {
    setEditingId(null);
    setEditText("");
  }, []);

  return (
    <div className="relative flex flex-col">
      {isNested && (
        <>
          {index > 0 && (
            <div className="absolute left-[-20px] top-[-24px] bottom-[24px] border-l border-grey-200" />
          )}
          <div className="absolute left-[-20px] top-5 w-[20px] border-t border-grey-200" />
        </>
      )}

      <div className="flex gap-2.5 relative z-10 items-start">
        <div className="flex flex-col items-center shrink-0" style={{ width: 36 }}>
          <Link href={`/profile/${comment.appUser.appUserId}`}>
            <Avatar
              src={comment.appUser.profilePicture}
              alt={`${comment.appUser.firstName} ${comment.appUser.lastName}`}
              initials={initials}
              size={36}
            />
          </Link>
        </div>

        <div className="flex-1 min-w-0 pb-1">
          {isEditing ? (
            <div className="space-y-1">
              <span className="text-xs text-grey-400 pl-1">
                Editing comment by{" "}
                <span className="font-semibold text-grey-700">
                  {comment.appUser.firstName} {comment.appUser.lastName}
                </span>
              </span>
              <InlineInputBar
                value={editText}
                onChange={setEditText}
                onSubmit={handleEdit}
                onCancel={closeEdit}
                onClose={closeEdit}
                placeholder="Edit your comment…"
              />
            </div>
          ) : (
            <div className="inline-block bg-grey-100 rounded-2xl px-3 py-2 max-w-full">
              <div className="flex items-center gap-2 justify-between">
                <Link
                  href={`/profile/${comment.appUser.appUserId}`}
                  className="type-detail-semibold text-grey-900 text-sm leading-tight hover:underline hover:text-primary transition-colors"
                >
                  {comment.appUser.firstName} {comment.appUser.lastName}
                </Link>
                {isOwner && (
                  <div className="flex gap-2 items-center ml-4 shrink-0">
                    <button
                      onClick={() => { setEditingId(comment.commentId); setEditText(comment.comment); }}
                      className="text-grey-400 hover:text-primary transition-colors text-xs cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDelete}
                      className="text-grey-400 hover:text-destructive transition-colors cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm text-grey-900 leading-normal mt-0.5">
                {comment.comment.split(" ").map((word, i) =>
                  word.startsWith("@") ? (
                    <span key={i} className="text-blue-600 font-semibold">{word} </span>
                  ) : (word + " ")
                )}
              </p>
            </div>
          )}

          {!isEditing && (
            <>
              <div className="flex items-center gap-3 mt-1 pl-1 text-xs font-semibold text-grey-400">
                <span className="font-normal">{timeAgo(comment.createdAt)}</span>
                <button className="hover:text-grey-900 transition-colors cursor-pointer">Like</button>
                <button
                  onClick={() => { setShowReplyInput((v) => !v); setReplyText(""); }}
                  className="hover:text-grey-900 transition-colors cursor-pointer"
                >
                  Reply
                </button>
              </div>

              {hasReplies && (
                <button
                  onClick={() => setShowReplies((v) => !v)}
                  className="flex items-center gap-1.5 mt-1.5 pl-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                >
                  <div className="w-5 h-px bg-grey-300" />
                  {showReplies ? "Hide replies" : `View ${replyCount} ${replyCount === 1 ? "reply" : "replies"}`}
                </button>
              )}
            </>
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
            <div className="relative pl-10 mt-4 space-y-5">
              <div
                className="absolute left-[20px] top-[-24px] w-[20px] border-l border-b border-grey-200 rounded-bl-[12px]"
                style={{ bottom: "24px" }}
              />
              {comment.replies.map((reply, idx) => (
                <CommentNode
                  key={reply.commentId}
                  comment={reply}
                  currentUserId={currentUserId}
                  currentUserPicture={currentUserPicture}
                  currentUserInitials={currentUserInitials}
                  isNested={true}
                  index={idx}
                  totalReplies={comment.replies.length}
                  onRefetch={onRefetch}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
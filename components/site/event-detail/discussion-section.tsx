"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, Smile } from "lucide-react";
import { Post } from "@/types/posts";
import { usePostComments } from "@/hooks/use-post-comments";
import { createCommentAction } from "@/actions/comment.action";
import { useCurrentUser } from "@/context/user-context";
import { CommentNode } from "@/components/site/pop-up/comment/comment-node";

const EMOJI_LIST = [
  "😀","😂","😍","🥰","😎","🤔","😢","😡","👍","👎",
  "❤️","🔥","🎉","✨","💯","🙏","😭","🤣","😊","😅",
  "😆","🥲","😇","🤩","😏","😒","😳","🤯","😱","😴",
  "🤗","🫡","🫠","😬","🙄","😤","🤬","💀","👀","💪",
];

interface DiscussionSectionProps {
  event: Post;
}

export function DiscussionSection({ event }: DiscussionSectionProps) {
  const { currentUser } = useCurrentUser();
  const [commentInput, setCommentInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const { comments, refetch } = usePostComments(event.postId);

  const handleSubmitComment = async () => {
    if (!commentInput.trim()) return;
    const result = await createCommentAction(event.postId, commentInput);
    if (result.ok) {
      setCommentInput("");
      await refetch();
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex items-center gap-x-2.5">
        <div className="w-10 h-10 rounded-full bg-grey-200 overflow-hidden shrink-0 flex items-center justify-center border">
          {currentUser?.profilePicture ? (
            <Image
              src={currentUser.profilePicture}
              alt={currentUser.name || "User avatar"}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-primary uppercase">
              {currentUser?.avatarInitials ?? "?"}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center bg-grey-100 rounded-2xl pl-4 pr-2 py-2 w-full gap-2">
          <input
            type="text"
            placeholder="Write a comment…"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
            className="text-sm bg-transparent outline-none w-full text-grey-900 placeholder:text-grey-400"
          />

          <div className="relative shrink-0">
            <button
              onClick={() => setShowEmoji((v) => !v)}
              className="text-grey-400 hover:text-grey-600 transition-colors cursor-pointer"
            >
              <Smile size={18} />
            </button>
            {showEmoji && (
              <div className="absolute bottom-full mb-2 right-0 z-50 bg-background border border-border rounded-2xl shadow-lg p-3 w-64">
                <div className="grid grid-cols-8 gap-1">
                  {EMOJI_LIST.map((e) => (
                    <button
                      key={e}
                      onClick={() => { setCommentInput((v) => v + e); setShowEmoji(false); }}
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
            disabled={!commentInput.trim()}
            className="disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send
              size={28}
              className="bg-primary rounded-full p-1.5 text-primary-foreground cursor-pointer hover:opacity-90 transition-opacity"
            />
          </button>
        </div>
      </section>

      <div className="space-y-5">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentNode
              key={comment.commentId}
              comment={comment}
              currentUserId={currentUser?.id}
              currentUserPicture={currentUser?.profilePicture}
              currentUserInitials={currentUser?.avatarInitials}
              isNested={false}
              onRefetch={refetch}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-grey-400 text-sm">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}
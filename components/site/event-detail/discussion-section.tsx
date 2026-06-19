"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Post } from "@/types/posts";
import { usePostComments } from "@/hooks/use-post-comments";
import { createCommentAction } from "@/actions/comment.action";
import { useCurrentUser } from "@/context/user-context";
import { CommentNode } from "@/components/site/pop-up/comment/comment-node";
import { MentionInput } from "@/components/site/pop-up/comment/MentionInput";
import { useWorkspaceMembers } from "@/hooks/use-workspace-members";
import Link from "next/link";
import { Comment } from "@/types/comment";

interface DiscussionSectionProps {
  event: Post;
  workspaceId: string;
  onCommentsCountChange?: (count: number) => void;
}

function countAllComments(comments: Comment[] = []): number {
  return comments.reduce(
    (total, comment) => total + 1 + countAllComments(comment.replies ?? []),
    0,
  );
}

export function DiscussionSection({ event, workspaceId, onCommentsCountChange }: DiscussionSectionProps) {
  const { currentUser } = useCurrentUser();
  const [commentInput, setCommentInput] = useState("");
  const [mentionedIds, setMentionedIds] = useState<string[]>([]);

  const { comments, refetch, loading } = usePostComments(event.postId, true);
  const { members } = useWorkspaceMembers(workspaceId ?? "");

  useEffect(() => {
    if (loading) return;
    onCommentsCountChange?.(countAllComments(comments));
  }, [comments, loading, onCommentsCountChange]);

  const handleSubmitComment = async () => {
    if (!commentInput.trim()) return;
    const result = await createCommentAction(event.postId, commentInput, mentionedIds);
    if (result.ok) {
      setCommentInput("");
      setMentionedIds([]);
      await refetch();
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex items-center gap-x-2.5">
        <div className="w-10 h-10 rounded-full bg-grey-200 overflow-hidden shrink-0 flex items-center justify-center border">
          <Link href={`/profile/${currentUser?.id}`}>
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
          </Link>
        </div>

        <div className="flex-1">
          <MentionInput
            value={commentInput}
            onChange={(val, ids) => { setCommentInput(val); setMentionedIds(ids); }}
            onSubmit={handleSubmitComment}
            placeholder="Write a comment…"
            members={members}
            mentionedIds={mentionedIds}
          />
        </div>
      </section>

      <div className="space-y-5">
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
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentNode
              key={comment.commentId}
              comment={comment}
              currentUserId={currentUser?.id}
              currentUserPicture={currentUser?.profilePicture}
              currentUserInitials={currentUser?.avatarInitials}
              isNested={false}
              workspaceId={workspaceId}
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
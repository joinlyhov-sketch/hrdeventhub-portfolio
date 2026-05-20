"use client";

import { MessageCircle, MoreHorizontal } from "lucide-react";
import type { CommentItem } from "../../../../types/comment";
import { useCommentModalStore } from "../../../../store/useCommentModalStore";

type CommentCardProps = {
  comment: CommentItem;
};

export default function CommentCard({ comment }: CommentCardProps) {
  const { openEdit, openDelete, openReply } = useCommentModalStore();

  return (
    <article className="rounded-lg border border-border bg-background p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground type-detail-semibold">
          {comment.authorName.charAt(0)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="type-detail-semibold text-secondary">
                {comment.authorName}
              </h3>

              <p className="mt-1 type-detail-small-medium text-muted-foreground">
                {comment.createdAt}
              </p>
            </div>

            <MoreHorizontal size={16} className="text-muted-foreground" />
          </div>

          <p className="mt-3 type-detail text-foreground">{comment.comment}</p>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => openReply(comment)}
              className="flex items-center gap-1 type-detail-small-medium text-primary"
            >
              <MessageCircle size={13} />
              Reply
            </button>

            <button
              onClick={() => openEdit(comment)}
              className="type-detail-small-medium text-primary"
            >
              Edit
            </button>

            <button
              onClick={() => openDelete(comment)}
              className="type-detail-small-medium text-destructive"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

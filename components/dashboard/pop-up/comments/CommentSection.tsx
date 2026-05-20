"use client";

import type { CommentItem } from "../../../../types/comment";
import CommentCard from "./CommentCard";
import CommentModalController from "./CommentModalController";

type CommentSectionProps = {
  comments: CommentItem[];
};

export default function CommentSection({ comments }: CommentSectionProps) {
  return (
    <section className="w-full rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h2 className="type-subtitle text-secondary">Comments</h2>
        <p className="mt-1 type-detail-small-medium text-muted-foreground">
          Manage comment actions: edit, delete, and reply.
        </p>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>

      <CommentModalController />
    </section>
  );
}

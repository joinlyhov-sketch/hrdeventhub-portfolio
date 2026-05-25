"use client";

import { useState } from "react";
import CommentActions from "./CommentAction";
import DeleteCommentModal from "./modals/delete-comment-modal";
import EditCommentModal from "./modals/edit-comment-modal";
import ReplyCommentModal from "./modals/reply-comment-modal";
import { CommentItem } from "@/types/comment";

export default function CommentDemo() {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const comments: CommentItem[] = [
    {
      id: 1,
      user: {
        id: 1,
        authorName: "Alex Rivera",
      },
      content: "Is there a live stream link?",
    },
    {
      id: 2,
      user: {
        id: 2,
        authorName: "Sarah Chen",
      },
      content: "Great event! Looking forward to it.",
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      {comments.map((comment) => (
        <div key={comment.id}>
          <p className="type-detail-medium text-secondary">{comment.user.authorName}</p>
          <p className="mt-2 type-detail text-muted-foreground">{comment.content}</p>

          <div className="mt-4">
            <CommentActions
              onEdit={() => setEditOpen(true)}
              onDelete={() => setDeleteOpen(true)}
              onReply={() => setReplyOpen(true)}
            />
          </div>

          <EditCommentModal open={editOpen} onOpenChange={setEditOpen} />
          <DeleteCommentModal open={deleteOpen} onOpenChange={setDeleteOpen} />
          <ReplyCommentModal open={replyOpen} onOpenChange={setReplyOpen} />
        </div>
      ))}
    </div>
  );
}

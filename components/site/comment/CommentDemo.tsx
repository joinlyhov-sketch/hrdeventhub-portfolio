"use client";

import { useState } from "react";
import CommentActions from "./CommentAction";
import DeleteCommentModal from "./modals/delete-comment-modal";
import EditCommentModal from "./modals/edit-comment-modal";
import ReplyCommentModal from "./modals/reply-comment-modal";

export default function CommentDemo() {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="type-detail-medium text-secondary">Alex Rivera</p>
      <p className="mt-2 type-detail text-muted-foreground">
        Is there a live stream link?
      </p>

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
  );
}

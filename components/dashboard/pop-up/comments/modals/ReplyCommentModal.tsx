"use client";

import { X } from "lucide-react";
import { useCommentModalStore } from "../../../../../store/useCommentModalStore";

export default function ReplyCommentModal() {
  const { selectedComment, replyValue, setReplyValue, closeModal } =
    useCommentModalStore();

  if (!selectedComment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-grey-900/20">
      <div className="w-[520px] overflow-hidden rounded-md border border-border bg-card shadow-xl">
        <div className="flex h-10 items-center justify-between border-b border-border px-4">
          <h3 className="type-detail-semibold text-secondary">
            Reply to comment
          </h3>

          <button
            onClick={closeModal}
            className="text-foreground"
            title="Close modal"
            aria-label="Close modal"
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-4 py-4">
          <div className="rounded-md bg-muted px-4 py-3">
            <p className="type-detail-small-medium text-muted-foreground">
              Replying to {selectedComment.authorName}
            </p>

            <p className="mt-1 type-detail-small-medium text-secondary">
              “{selectedComment.comment}”
            </p>
          </div>

          <textarea
            value={replyValue}
            onChange={(e) => setReplyValue(e.target.value)}
            placeholder="Type your response..."
            className="mt-3 h-[88px] w-full resize-none rounded-md border border-input bg-muted px-4 py-3 type-detail-small-medium text-foreground outline-none focus:ring-1 focus:ring-ring"
          />

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={closeModal}
              className="h-9 w-[92px] rounded-md border border-primary bg-card type-detail-small-medium text-primary"
            >
              Cancel
            </button>

            <button
              onClick={closeModal}
              className="h-9 w-[92px] rounded-md bg-primary type-detail-small-medium text-primary-foreground"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

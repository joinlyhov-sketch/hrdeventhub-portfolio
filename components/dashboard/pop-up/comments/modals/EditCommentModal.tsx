"use client";

import { CircleIcon, X } from "lucide-react";
import { useCommentModalStore } from "../../../../../store/useCommentModalStore";

export default function EditCommentModal() {
  const { editValue, setEditValue, closeModal } = useCommentModalStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-grey-900/20">
      <div className="w-[520px] overflow-hidden rounded-md border border-border bg-card shadow-xl">
        <div className="flex h-10 items-center justify-between border-b border-border px-4">
          <h3 className="type-detail-semibold text-secondary">Edit Comment</h3>

          <button
            type="button"
            onClick={closeModal}
            className="text-foreground"
            title="Close modal"
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-8 py-5">
          <label className="type-detail-small-medium text-secondary">
            Your Comment
          </label>

          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Enter your comment"
            title="Your Comment"
            className="mt-2 h-[82px] w-full resize-none rounded-md border border-input bg-muted px-4 py-3 type-detail-small-medium text-foreground outline-none focus:ring-1 focus:ring-ring"
          />

          <p className="mt-3 flex items-center gap-1 type-detail-small-medium text-foreground">
            <CircleIcon size={10} />
            Editing will mark your comment as “Edited”.
          </p>

          <div className="mt-5 flex justify-end gap-2">
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

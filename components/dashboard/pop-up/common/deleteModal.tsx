"use client";

import { TriangleAlert } from "lucide-react";
import { useDeleteModalStore } from "../../../../store/useDeleteModalStore";

export default function DeleteModal() {
  const { isOpen, title, description, onConfirm, closeModal } =
    useDeleteModalStore();

  if (!isOpen) return null;

  function handleDelete() {
    onConfirm?.();
    closeModal();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="flex w-[430px] flex-col items-center rounded-md border border-border bg-card px-10 py-10 text-center shadow-xl">
        <div className="flex size-11 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <TriangleAlert size={22} />
        </div>

        <h3 className="mt-4 type-subtitle text-secondary">{title}</h3>

        <p className="mt-2 max-w-[260px] type-detail-small-medium text-muted-foreground">
          {description}
        </p>

        <div className="mt-6 flex gap-2">
          <button
            onClick={closeModal}
            className="h-9 w-[92px] rounded-md border border-primary bg-card type-detail-small-medium text-primary"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="h-9 w-[92px] rounded-md bg-destructive type-detail-small-medium text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

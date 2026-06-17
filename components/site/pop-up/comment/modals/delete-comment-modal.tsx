"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/comment-modal/dialog";
import { AlertTriangle } from "lucide-react";

type Props = {
  isOpen: boolean | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function DeleteCommentModal({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      setError(null);
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (err: unknown) {
      setError(
        (err as { message?: string })?.message ||
          "Failed to delete the comment.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[640px] max-w-none rounded-xl border-0 bg-card px-10 py-[40px] text-center shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
        showCloseButton={false}
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle size={22} />
        </div>

        <DialogTitle className="mt-5 type-title text-secondary">
          Delete Comment
        </DialogTitle>

        <p className="mx-auto mt-2 max-w-[300px] type-detail text-muted-foreground">
          Are you sure you want to delete this comment? This action cannot be
          undone.
        </p>

        {error && (
          <div className="w-full mt-4 p-3 text-xs bg-red-50 text-red-600 rounded-lg font-mono text-center">
            {error}
          </div>
        )}

        <div className="mt-5 flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="h-[42px] w-[128px] rounded-[10px] border-primary text-primary hover:bg-gray-100 hover:text-primary"
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="h-[42px] w-[128px] rounded-[10px] bg-destructive text-white hover:bg-destructive/90 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

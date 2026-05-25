"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/comment-modal/dialog";
import { AlertTriangle } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeleteCommentModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[640px] max-w-none rounded-[10px] border-0 bg-card px-10 py-[70px] text-center shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
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

        <div className="mt-5 flex justify-center gap-2">
          <Button
            variant="outline"
            className="h-[42px] w-[128px] rounded-[10px] border-primary text-primary"
          >
            Cancel
          </Button>

          <Button className="h-[42px] w-[128px] rounded-[10px] bg-destructive text-white hover:bg-destructive/90">
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

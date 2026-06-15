"use client";

import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/comment-modal/dialog";
import { Textarea } from "@/components/ui/comment-modal/textarea";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EditCommentModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[700px] max-w-none rounded-[8px] border border-border bg-card p-0 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <DialogHeader className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="type-detail-semibold text-secondary">
              Edit Comment
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-[42px] py-[32px]">
          <label className="type-detail-small-medium text-secondary">
            Your Comment
          </label>

          <Textarea
            defaultValue="Is there a live stream link?"
            className="mt-2 h-[110px] resize-none rounded-[6px] border-0 bg-muted px-6 py-5 type-detail text-foreground shadow-none focus-visible:ring-0"
          />

          <p className="mt-4 type-detail-small-medium text-foreground">
            <Info size={10} className="inline-block mr-1" /> Editing will mark
            your comment as ‘Edited’.
          </p>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="outline"
              className="h-[42px] w-[128px] rounded-[10px] border-primary text-primary"
            >
              Cancel
            </Button>

            <Button className="h-[42px] w-[128px] rounded-[10px] bg-primary text-primary-foreground hover:bg-primary-hover">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

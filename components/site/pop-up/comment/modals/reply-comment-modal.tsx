"use client";

import {
  Dialog,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/comment-modal/dialog";
import { DialogContent } from "@/components/ui/comment-modal/dialog";
import { Textarea } from "@/components/ui/comment-modal/textarea";
import { Button } from "@/components/ui/button";
type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ReplyCommentModal({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[640px] max-w-none rounded-[8px] border border-border bg-card p-0 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
        <DialogHeader className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="type-detail-semibold text-secondary">
              Reply to comment
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 py-6">
          <div className="rounded-[6px] bg-muted px-4 py-3 type-detail-small-medium text-muted-foreground">
            <p>Replying to Alex Rivera</p>
            <p>“Is there a live stream link?”</p>
          </div>

          <Textarea
            placeholder="Type your response..."
            className="mt-4 h-[100px] resize-none rounded-[6px] border-0 bg-muted px-4 py-4 type-detail text-foreground shadow-none focus-visible:ring-0"
          />

          <div className="mt-4 flex justify-end gap-2">
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

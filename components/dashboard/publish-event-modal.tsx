"use client";

import React from "react";
import { Globe, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PublishEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  onConfirm: () => Promise<void>;
}

export function PublishEventModal({
  isOpen,
  onClose,
  eventTitle,
  onConfirm,
}: PublishEventModalProps) {
  const [isPublishing, setIsPublishing] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setIsPublishing(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Failed to publish event:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-106.25 rounded-xl bg-white p-6">
        <DialogHeader className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-primary border bg-primary/10">
            <Globe className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-secondary">
              Publish Draft Event
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-[15px] text-slate-500 max-w-[320px]">
              Are you sure you want to go live with{" "}
              <span className="font-semibold text-slate-800">
                “{eventTitle}”
              </span>
              ? This event will be visible to everyone instantly.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="flex sm:flex-row gap-2 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPublishing}
            className="flex-1 h-11 sm:h-12 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-secondary font-medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPublishing}
            className="flex-1 h-11 sm:h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium"
          >
            {isPublishing ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Live"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

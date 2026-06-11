"use client";

import React from "react";
import { FileX, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName?: string;
  onConfirm: () => Promise<void>;
}

export function DeleteResumeModal({
  isOpen,
  onClose,
  fileName,
  onConfirm,
}: DeleteResumeModalProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Failed to delete CV:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-105 rounded-xl bg-white p-6">
        <DialogHeader className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-destructive border border-destructive/20 bg-destructive/10">
            <FileX size={24} />
          </div>

          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold text-slate-900">
              Delete Resume
            </DialogTitle>

            <DialogDescription className="text-sm text-slate-500 max-w-[320px]">
              Are you sure you want to remove
              {fileName ? (
                <>
                  {" "}
                  <span className="font-semibold text-slate-800">
                    &quot;{fileName}&quot;
                  </span>
                </>
              ) : (
                " your uploaded resume"
              )}
              ? This action cannot be undone.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="flex sm:flex-row gap-2 mt-4">
          <Button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-xl bg-white text-black hover:bg-primary/10"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-xl bg-destructive hover:bg-destructive/90 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Resume"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

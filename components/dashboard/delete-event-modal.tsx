"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-modal/alert-dialog";
import { Button } from "@/components/ui/button";
import { TriangleAlert, X } from "lucide-react";

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  onConfirm: () => Promise<void>;
}

export function DeleteEventModal({
  isOpen,
  onClose,
  eventTitle,
  onConfirm,
}: DeleteEventModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      setError(null);
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || "Failed to delete the event post.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-[92%] xs:max-w-[88%] sm:max-w-[480px] w-full max-h-[92vh] flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 xs:p-8 sm:p-10 shadow-2xl gap-0 overflow-y-auto outline-none">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer border-none bg-transparent outline-none z-10"
          aria-label="Close dialog"
        >
          <X size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
        </button>

        <div className="flex items-center justify-center bg-red-50 text-red-700 rounded-full w-14 h-14 sm:w-16 sm:h-16 mb-4 sm:mb-5 mt-2 sm:mt-0 shrink-0 mx-auto">
          <TriangleAlert className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
        </div>

        <AlertDialogHeader className="!flex !flex-col !items-center !text-center w-full space-y-2 sm:space-y-3 mb-5 sm:mb-6 gap-0">
          <AlertDialogTitle className="text-xl sm:text-2xl font-bold text-secondary w-full text-center block">
            Delete Event Post
          </AlertDialogTitle>
          
          <AlertDialogDescription className="text-sm sm:text-[15px] text-[#4A5568] leading-relaxed font-normal max-w-[380px] w-full text-center block">
            Are you sure you want to permanently remove{" "}
            <span className="font-bold text-[#0B192C]">
              &apos;{eventTitle}&apos;
            </span>
            ? All standard student analytics, interactions, and metrics tied to
            this post will be erased from the workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <div className="w-full mb-4 p-3 text-xs bg-red-50 text-red-600 rounded-lg font-mono text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 w-full mt-auto">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="h-11 sm:h-12 w-full px-4 border border-primary text-primary hover:bg-slate-50 hover:text-primary font-medium rounded-xl text-sm sm:text-[15px] transition-colors"
            >
              Cancel
            </Button>
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="h-11 sm:h-12 w-full px-4 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-medium rounded-xl text-sm sm:text-[15px] shadow-md shadow-red-100 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogAction>
        </div>

      </AlertDialogContent>
    </AlertDialog>
  );
}
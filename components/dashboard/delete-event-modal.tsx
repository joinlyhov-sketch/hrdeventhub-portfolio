"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
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

export function DeleteEventModal({ isOpen, onClose, eventTitle, onConfirm }: DeleteEventModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    try {
      setError(null);
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to delete the event post.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-[600px] w-full rounded-2xl border border-gray-100 bg-white p-0 shadow-2xl overflow-hidden gap-0">
        <div className="relative border-b border-gray-100 bg-white px-8 pt-7 pb-6">
          <AlertDialogHeader className="flex flex-row items-center gap-4 space-y-0">
            <AlertDialogMedia className="flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-full w-12 h-12 shrink-0">
              <TriangleAlert size={24} />
            </AlertDialogMedia>
            <div className="space-y-1">
              <AlertDialogTitle className="text-2xl font-bold text-slate-900">
                Delete Event Post
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-500 font-normal">
                This action is permanent and cannot be undone.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <button
            onClick={onClose}
            className="absolute right-7 top-7 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer border-none bg-transparent"
            aria-label="Close dialog"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-8 py-6 bg-white space-y-3">
          <p className="text-[15px] text-gray-600 leading-relaxed">
            Are you sure you want to permanently remove{" "}
            <span className="font-semibold text-gray-900">&apos;{eventTitle}&apos;</span>? 
            All standard student analytics, interactions, and metrics tied to this post will be erased from the workspace.
          </p>
          
          {error && (
            <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg font-mono">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-end items-center gap-3 bg-gray-50 px-8 py-4 border-t border-gray-100">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="h-10 px-5 border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium rounded-lg text-sm transition-colors"
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm shadow-sm transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete Event"}
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
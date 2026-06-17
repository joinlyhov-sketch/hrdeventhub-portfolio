"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-modal/alert-dialog";
import { Button } from "@/components/ui/button";
import { XCircle, X } from "lucide-react";

interface CloseEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  onConfirm: (reason: string) => Promise<void>;
}

export function CloseEventModal({
  isOpen,
  onClose,
  eventTitle,
  onConfirm,
}: CloseEventModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [reason, setReason] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setValidationError(
        "Please specify an official reason for closing this event.",
      );
      return;
    }

    try {
      setValidationError(null);
      setIsProcessing(true);
      await onConfirm(reason.trim());
      setReason("");
      onClose();
    } catch (err: unknown) {
      setValidationError(
        (err as { message?: string })?.message || "Failed to alter event status parameters.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setValidationError(null);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialogContent className="sm:max-w-[600px] w-full rounded-2xl border border-gray-100 bg-white p-0 shadow-2xl overflow-hidden gap-0">
        <div className="relative border-b border-gray-100 bg-white px-8 pt-7 pb-6">
          <AlertDialogHeader className="flex flex-row items-center gap-4 space-y-0">
            <AlertDialogMedia className="flex items-center justify-center bg-red-50 text-red-600 rounded-full w-12 h-12 shrink-0">
              <XCircle size={24} />
            </AlertDialogMedia>
            <div className="space-y-1">
              <AlertDialogTitle className="text-2xl font-bold text-slate-900">
                Close Event Post
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-500 font-normal">
                This shifts status values to closed. This action is
                irreversible.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <button
            onClick={handleClose}
            className="absolute right-7 top-7 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer border-none bg-transparent"
            aria-label="Close dialog"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-8 py-6 bg-white space-y-4">
          <p className="text-[15px] text-gray-600 leading-relaxed">
            Are you sure you want to change status transitions for{" "}
            <span className="font-semibold text-gray-900">
              &apos;{eventTitle}&apos;
            </span>{" "}
            to <span className="font-semibold text-red-600">Closed</span>?
            Please submit an explicit operational rationale below:
          </p>

          <div className="flex flex-col gap-1">
            <textarea
              className="w-full min-h-[100px] px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-red-500 text-sm transition-all text-gray-700 resize-none"
              placeholder="e.g., Venue changes, maximum attendance criteria exceeded, rescheduling goals..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setValidationError(null);
              }}
              disabled={isProcessing}
            />
          </div>

          {validationError && (
            <div className="p-3 text-xs bg-destructive/10 text-destructive rounded-lg font-mono">
              {validationError}
            </div>
          )}
        </div>

        <div className="flex justify-end items-center gap-3 bg-gray-50 px-8 py-4 border-t border-gray-100">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
              className="h-10 px-5 border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-black font-medium rounded-lg text-sm transition-colors"
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="h-10 px-5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm shadow-sm transition-colors disabled:opacity-50"
          >
            {isProcessing ? "Closing..." : "Close Event"}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";
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
import { TriangleAlert } from "lucide-react";
import { useState } from "react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
}

export function DeleteModal({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-[420px] w-full rounded-2xl border-none bg-white p-8 shadow-2xl gap-0">
        <div className="flex justify-center mb-5">
          <div className="flex items-center justify-center bg-red-100 rounded-full w-16 h-16">
            <TriangleAlert size={32} className="text-red-600" />
          </div>
        </div>

        <AlertDialogHeader className="text-center space-y-3 mb-6">
          <AlertDialogTitle className="text-[26px] font-bold text-secondary text-center w-full">
            Delete {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px] text-gray-600 font-normal text-center">
            {description ?? (
              <>
                Are you sure you want to delete{" "}
                <span className="font-bold text-gray-900">
                  &apos;{title}&apos;
                </span>
                ? This action cannot be undone.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex items-center gap-3">
          <AlertDialogCancel asChild className="flex-1 m-0">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-[48px] w-full border border-primary text-primary hover:bg-gray-50 hover:text-primary type-desc rounded-xl text-[15px] transition-colors"
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild className="flex-1">
            <Button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="h-[48px] w-full bg-red-700 hover:bg-red-600 text-white type-desc rounded-xl text-[15px] shadow-sm transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

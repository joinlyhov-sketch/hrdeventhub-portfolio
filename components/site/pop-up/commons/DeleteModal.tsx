"use client";

import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogMedia, 
  AlertDialogTitle 
} from "@/components/ui/alert-modal/alert-dialog";
import { Button } from "@/components/ui/button";
import { TriangleAlert, X } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: { title: string; id: string | number };
  onConfirm: () => void;
}

export function DeleteModal({ isOpen, onClose, group, onConfirm }: DeleteModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-[800px] w-full rounded-2xl border-none bg-white p-0 shadow-2xl overflow-hidden gap-0">
        <div className="relative border-b border-gray-100 bg-white px-8 pt-7 pb-6">
          <AlertDialogHeader className="flex flex-row items-center gap-4 space-y-0">
            <AlertDialogMedia className="flex items-center justify-center bg-destructive/10 text-destructive rounded-full w-12 h-12 shrink-0">
              <TriangleAlert size={24} />
            </AlertDialogMedia>
            
            <div className="space-y-1">
              <AlertDialogTitle className="text-[26px] font-bold text-[#1e3a8a]">
                Delete Group
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[15px] text-gray-500 font-normal">
                This action is permanent and cannot be reversed.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <button
            onClick={onClose}
            className="absolute right-7 top-7 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close dialog"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>
        <div className="px-8 py-8 bg-white">
          <p className="text-[16px] text-gray-700 leading-relaxed font-medium">
            Are you sure you want to delete <span className="font-bold text-gray-900">&apos;{group?.title || "this group"}&apos;</span>? 
            All data linked to this group will be permanently scrubbed from the network.
          </p>
        </div>

        <div className="flex justify-end items-center gap-3 bg-[#f8fafc] px-8 py-5 border-t border-gray-50">
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              onClick={onClose}
              className="h-[46px] px-7 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-lg text-[15px] transition-colors"
            >
              Cancel
            </Button>
          </AlertDialogCancel>
          
          <AlertDialogAction asChild>
            <Button
              onClick={onConfirm}
              className="h-[46px] px-7 bg-destructive hover:bg-destructive/90 text-white font-semibold rounded-lg text-[15px] shadow-sm transition-colors"
            >
              Delete
            </Button>
          </AlertDialogAction>
        </div>

      </AlertDialogContent>
    </AlertDialog>
  );
}
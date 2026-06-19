"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog-payments/dialog";
import { Button } from "@/components/ui/button";
import { X, LogOut } from "lucide-react";
import { Workspace } from "@/types/workspace-type/group";

interface LeaveWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace;
  onConfirm: () => Promise<void>;
  isPending: boolean;
}

export default function LeaveWorkspaceModal({
  isOpen,
  onClose,
  workspace,
  onConfirm,
  isPending,
}: LeaveWorkspaceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] w-full rounded-2xl border-none bg-white p-0 shadow-2xl overflow-hidden [&>button]:hidden gap-0">
        <div className="relative border-b border-gray-100 bg-white px-8 pt-7 pb-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-[26px] font-bold text-[#1e3a8a]">
              Leave Workspace
            </DialogTitle>
            <DialogDescription className="text-[15px] text-gray-500 font-normal">
              You are about to leave{" "}
              <span className="font-semibold text-gray-700">{workspace.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={onClose}
            className="absolute right-7 top-7 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="px-8 py-6 bg-white">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-red-50 border border-red-100">
            <div className="mt-0.5 shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-red-100">
              <LogOut size={18} className="text-red-500" />
            </div>
            <div className="space-y-1">
              <p className="text-[15px] font-semibold text-red-700">
                Are you sure you want to leave?
              </p>
              <p className="text-[13px] text-red-500 leading-relaxed">
                You will lose access to all content and discussions in this workspace. 
                You can only rejoin if you receive a new invitation.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center gap-3 bg-[#f8fafc] px-8 py-5 border-t border-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="h-[44px] px-8 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl text-[15px] transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="h-[44px] px-8 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-[15px] shadow-sm transition-colors disabled:opacity-50"
          >
            {isPending ? "Leaving..." : "Leave Workspace"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
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
import { LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="sm:max-w-[420px] w-full rounded-2xl border-none bg-white p-8 shadow-2xl gap-0">
        {/* Centered icon */}
        <div className="flex justify-center mb-5">
          <div className="flex items-center justify-center bg-red-100 rounded-full w-16 h-16">
            <LogOut size={28} className="text-red-600" />
          </div>
        </div>

        {/* Centered header */}
        <AlertDialogHeader className="text-center space-y-3 mb-6">
          <AlertDialogTitle className="text-[26px] font-bold text-seco text-center w-full">
            Log Out
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px] text-gray-600 font-normal text-center leading-relaxed">
            Are you sure you want to log out? You will need to sign in again to
            access your admin dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Buttons */}
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
              onClick={onConfirm}
              className="h-[48px] w-full bg-red-700 hover:bg-red-600 text-white type-desc rounded-xl text-[15px] shadow-sm transition-colors"
            >
              Logout
            </Button>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

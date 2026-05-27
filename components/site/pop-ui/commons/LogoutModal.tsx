"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-modal/alert-dialog";
import { LogOut } from "lucide-react";



type LogoutModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export default function LogoutModal({
  open,
  onOpenChange,
  onConfirm,
}: LogoutModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="logout-modal-card">
        <div className="logout-modal-center flex flex-col items-center text-center">
          <div className="logout-modal-icon">
            <LogOut size={28} strokeWidth={2.5} className="text-destructive" />
          </div>

          <AlertDialogTitle className="logout-modal-title">
            Log out of HRD EventHub?
          </AlertDialogTitle>

          <AlertDialogDescription className="logout-modal-desc">
            You will need to sign in again to access your admin dashboard.
          </AlertDialogDescription>

          <div className="logout-modal-actions mt-8 flex items-center gap-3">
            <AlertDialogCancel
              className="logout-modal-btn logout-modal-cancel"
              variant="outline"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={onConfirm}
              className="logout-modal-btn logout-modal-confirm "
              variant="destructive"
            >
              Logout
            </AlertDialogAction>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

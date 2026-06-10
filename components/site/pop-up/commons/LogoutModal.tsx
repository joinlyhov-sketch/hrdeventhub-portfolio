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
import { LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent size="sm" className="max-w-[380px] rounded-2xl p-6">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <AlertDialogMedia className="bg-red-50 text-red-500 rounded-full p-3 dark:bg-red-950/50 dark:text-red-400 mb-2">
            <LogOut size={20} />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Log out of HRD EventHub?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground mt-1 px-2">
            You will need to sign in again to access your admin dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
           <AlertDialogCancel
            onClick={onClose}
            style={{
              flex: 1,
              height: "52px",
              borderRadius: "16px",
              border: "1.5px solid #1E4C8B",
              color: "#1E4C8B",
              backgroundColor: "transparent",
              fontSize: "1rem",
              fontWeight: 500,
            }}
          >
            Cancel
          </AlertDialogCancel>
           <AlertDialogAction
            onClick={onConfirm}
            style={{
              flex: 1,
              height: "52px",
              borderRadius: "16px",
              backgroundColor: "#B91C1C",
              color: "#FFFFFF",
              fontSize: "1rem",
              fontWeight: 600,
              border: "none",
              boxShadow: "0 8px 20px rgba(185, 28, 28, 0.3)",
            }}
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
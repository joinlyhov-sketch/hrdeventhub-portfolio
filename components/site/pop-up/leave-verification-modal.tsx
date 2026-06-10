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
import { AlertTriangle } from "lucide-react";

interface LeaveVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LeaveVerificationModal({ isOpen, onClose, onConfirm }: LeaveVerificationModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent size="sm" className="max-w-[400px] rounded-2xl p-6 bg-white shadow-xl border-none">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <AlertDialogMedia className="bg-amber-50 rounded-full p-3 mb-2 border-none">
            <AlertTriangle size={22} className="text-amber-600" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-lg font-bold text-slate-900">
            Leave Verification?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-slate-600 mt-1 max-w-[300px]">
            If you leave now, your verification progress will be canceled, and security session data will be cleared. Are you sure you want to go back?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="bg-transparent border-none p-0 m-0 shadow-none flex flex-row gap-3 mt-5 w-full sm:space-x-0">
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
            Yes, Leave
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
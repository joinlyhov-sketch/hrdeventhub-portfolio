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
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-50 text-red-500 rounded-full dark:bg-red-950/50 dark:text-red-400">
            <LogOut size={22} />
          </AlertDialogMedia>
          <AlertDialogTitle>Account Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out of your account? You will need to sign back in to access your dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} variant="outline">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} variant="destructive">
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
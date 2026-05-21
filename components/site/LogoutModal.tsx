"use client";

import { LogOut } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "../../components/ui/alert-logout/alert-dialog";

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
      <AlertDialogContent
        className="
    w-[1100px]
    h-[368px]
    rounded-[20px]
    border-0
    bg-card
    px-9
    py-10
    shadow-[0px_24px_60px_rgba(0,0,0,0.12)]
    "
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="
          flex
          size-[58px]
          items-center
          justify-center
          rounded-full
          bg-destructive/10
        "
          >
            <LogOut size={28} strokeWidth={2.5} className="text-destructive" />
          </div>

          <AlertDialogTitle
            className="
          mt-5
          text-[22px]
          font-bold
          leading-none
          tracking-tight
          text-secondary
        "
          >
            Log out of HRD EventHub?
          </AlertDialogTitle>

          <AlertDialogDescription
            className="
          mt-4
          max-w-[420px]
          text-center
          text-[16px]
          font-medium
          leading-8
          text-muted-foreground
        "
          >
            You will need to sign in again to access your admin dashboard.
          </AlertDialogDescription>

          <div className="mt-8 flex items-center gap-3">
            <AlertDialogCancel
              className="
      h-[50px]
      w-[150px]
      rounded-[14px]
      border
      border-primary
      !bg-card
      text-[18px]
      font-medium
      !text-primary
      hover:!bg-primary/5
      hover:!text-primary
      cursor-pointer
    "
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={onConfirm}
              className="
      h-[50px]
      w-[150px]
      rounded-[14px]
      !bg-destructive
      text-[18px]
      font-medium
      !text-white
      hover:!bg-destructive/90
      cursor-pointer
    "
            >
              Logout
            </AlertDialogAction>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { UserData } from "../../../../types/user-management-type/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../ui/modal-user-management/dialog";
import { CancelButton } from "../../../site/user-mangement/button/CancelButton";
import { ReactivateButton } from "../../../site/user-mangement/button/ReactivateButton";
import { toast } from "sonner";

interface ReactivateModalProps {
  user: UserData;
  onClose: () => void;
  onConfirm: (userId: string | number) => void;
}

export default function ReactivateModal({
  user,
  onClose,
  onConfirm,
}: ReactivateModalProps) {
  const profileSrc =
    user.profilePicture && user.profilePicture.trim() !== ""
      ? user.profilePicture
      : null;

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white w-full max-w-[50%] sm:max-w-none md:max-w-[50%] rounded-[15px] p-0 overflow-hidden border-none gap-0 shadow-xl animate-in fade-in zoom-in-95 duration-150 [&>button]:top-9 [&>button]:hover:text-red-500 [&>button]:-translate-y-1/2 [&>button]:!bg-transparent [&>button]:focus:ring-0">
        <div className="bg-grey-100 px-3 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            {profileSrc ? (
              <img
                src={profileSrc}
                alt={user.username}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-xl font-medium text-white">
                {user.firstName?.charAt(0).toUpperCase()}
                {user.lastName?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="font-bold text-slate-800 text-base">
                {user ? `${user.firstName} ${user.lastName}` : "User"}
              </h4>
              <p className="text-xs text-slate-400 font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-1 text-center">
          <div className="w-18 h-18 bg-[#E6F9F1] rounded-full flex items-center justify-center border border-[#CCF4E3] mx-auto">
            <CheckCircle2 className="w-13 h-13 text-accent" />
          </div>

          <div className="space-y-3 w-full">
            <DialogHeader className="space-y-1.5 text-center">
              <DialogTitle className="text-2xl  text-primary tracking-tight">
                Reactivate User
              </DialogTitle>
            </DialogHeader>

            <DialogDescription className="text-sm text-grey-600 max-w-2xl mx-auto">
              <span className="text-lg">
                Are you sure you want to reactivate{" "}
                <span className="font-bold text-black">
                  &ldquo;{user ? `${user.firstName} ${user.lastName}` : "User"}
                  &rdquo;
                </span>
                ?
              </span>
              <br />
              This will restore full access to the platform. The user will be
              able to log in and register for <br />
              events immediately.
            </DialogDescription>
          </div>

          <div className="flex items-center justify-center gap-4 py-2 w-full">
            <CancelButton onClick={onClose} />
            <ReactivateButton
              onClick={() => {
                console.log(
                  `Reactivate — User: ${user.username} (ID: ${user.no})`,
                );
                onConfirm(user.no);
                toast.success("user has been reactivate back");
              }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

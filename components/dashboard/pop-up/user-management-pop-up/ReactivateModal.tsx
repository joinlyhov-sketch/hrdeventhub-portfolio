"use client";

import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { UserData } from "../../../../data/UserData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../ui/modal-user-management/dialog";
import { CancelButton } from "../../../site/user-mangement/button/CancelButton";
import { ReactivateButton } from "../../../site/user-mangement/button/ReactivateButton";

interface ReactivateModalProps {
  user: UserData;
  onClose: () => void;
  onConfirm: (userId: number) => void;
}

export default function ReactivateModal({
  user,
  onClose,
  onConfirm,
}: ReactivateModalProps) {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white w-full max-w-[30%] sm:max-w-none md:max-w-[30%] rounded-4xl p-0 overflow-hidden border-none gap-0 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#F8FAFC] px-8 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* <img
              src={user.avatar}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            /> */}
            <Image 
            src={user.avatar}
              alt="avatar"
              width ={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-bold text-slate-800 text-base">
                {user.username}
              </h4>
              <p className="text-xs text-slate-400 font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5 text-center">
          <div className="w-12 h-12 bg-[#E6F9F1] rounded-full flex items-center justify-center border border-[#CCF4E3] mx-auto">
            <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
          </div>

          <div className="space-y-3 w-full">
            <DialogHeader className="space-y-1.5 text-center">
              <DialogTitle className="text-2xl font-bold text-[#1B2A4A] tracking-tight">
                Reactivate User
              </DialogTitle>
            </DialogHeader>

            <DialogDescription className="text-sm text-slate-500 max-w-md mx-auto">
              Are you sure you want to reactivate{" "}
              <span className="font-bold text-slate-700">
                &ldquo;{user.username}&rdquo;
              </span>
              ?
              <span className="block mt-1 text-slate-400">
                This will restore full access to the platform. The user will be
                able to log in and register for events immediately.
              </span>
            </DialogDescription>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 w-full">
            <CancelButton onClick={onClose} />
            <ReactivateButton onClick={() => onConfirm(user.no)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

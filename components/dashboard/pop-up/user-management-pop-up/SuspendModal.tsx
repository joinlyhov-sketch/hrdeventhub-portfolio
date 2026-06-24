"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AlertOctagon } from "lucide-react";
import { UserData } from "../../../../types/user-management-type/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../ui/modal-user-management/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/modal-user-management/select";
import { CancelButton } from "../../../site/user-mangement/button/CancelButton";
import { SuspendButton } from "../../../site/user-mangement/button/SuspendButton";
import { toast } from "sonner";

interface SuspendModalProps {
  user: UserData;
  onClose: () => void;
  onConfirm: (userId: string | number, reason: string) => void;
  isCurrentUser?: boolean;
}

const REASON_MAPPING = [
  { value: "SPAM", label: "Spam Activity" },
  { value: "POLICY_VIOLATION", label: "Policy Violation" },
  { value: "INAPPROPRIATE_BEHAVIOR", label: "Inappropriate Behavior" },
  { value: "INAPPROPRIATE_MEDIA", label: "Inappropriate Media" },
  { value: "OTHER", label: "Other" },
];

export default function SuspendModal({
  user,
  onClose,
  onConfirm,
  isCurrentUser = false,
}: SuspendModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const profileSrc =
    user.profilePicture && user.profilePicture.trim() !== ""
      ? user.profilePicture
      : null;

  const handleSuspendSubmit = () => {
    if (isCurrentUser) {
      toast.error("You cannot suspend yourself.");
      return;
    }

    onConfirm(user.no, selectedReason || "OTHER");
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white w-full max-w-[700px] sm:max-w-none md:max-w-[700px] rounded-[15px] p-0 overflow-hidden border-none gap-0 shadow-xl animate-in fade-in zoom-in-95 duration-150 [&>button]:top-10 [&>button]:hover:text-red-500 [&>button]:-translate-y-1/2 [&>button]:!bg-transparent [&>button]:focus:ring-0">
        <div className="bg-[#F2F4F7] px-3 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            {profileSrc ? (
              <Image
                src={profileSrc}
                alt={user.username}
                width={48}
                height={48}
                unoptimized
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-xl font-medium text-white">
                {user.firstName?.charAt(0).toUpperCase()}
                {user.lastName?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="font-semibold text-slate-700 text-base">
                {user ? `${user.firstName} ${user.lastName}` : "User"}
              </h4>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5 text-center">
          <div className="space-y-5 w-full relative">
            <DialogHeader className="space-y-1.5 text-center">
              <div className="w-18 h-18 bg-red-100 rounded-full flex items-center justify-center border border-red-100 mx-auto">
                <AlertOctagon className="w-13 h-13 text-red-500" />
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-800 tracking-tight">

                Are you sure you want to suspend{" "}
                <span className="font-bold text-gray-900">
                  &ldquo;{user ? `${user.firstName} ${user.lastName}` : "User"}
                  &rdquo;
  
                ?
              </span>
              </DialogTitle>
            </DialogHeader>
              <span className="text-lg"> You will need to manually reactivate them <br />
                to restore access.</span>
          </div>

          <div className="max-w-md mx-auto flex items-center justify-center">
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger className="w-[70%] bg-grey-100 hover:bg-gray-200/80 text-black rounded-2xl px-3 py-6 font-bold flex items-center justify-between border-none outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer">
                <SelectValue placeholder="Reason" />
              </SelectTrigger>
              <SelectContent
                side="bottom"
                position="popper"
                className="bg-white rounded-2xl shadow-xl border border-gray-100 px-2 py-2 z-50 text-left max-h-50 overflow-y-auto w-[var(--radix-select-trigger-width)] -mt-1"
              >
                {REASON_MAPPING.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="px-3 py-3 text-sm font-semibold rounded-md text-slate-800 hover:bg-grey-200 transition-colors cursor-pointer focus:bg-slate-50 focus:text-slate-800"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center gap-4 py-2 w-full">
            <CancelButton onClick={onClose} />
            <div className="inline-block shrink-0">
              <SuspendButton onClick={handleSuspendSubmit} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
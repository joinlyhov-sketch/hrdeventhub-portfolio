"use client";

import React, { useState } from "react";
import { AlertOctagon } from "lucide-react";
import { UserData } from "../../../../types/user-management-type/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

interface SuspendModalProps {
  user: UserData;
  onClose: () => void;
  onConfirm: (userId: string | number, reason: string) => void;
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
}: SuspendModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white w-full max-w-[30%] sm:max-w-none md:max-w-[30%] rounded-4xl p-0 overflow-hidden border-none gap-0 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#F8FAFC] px-8 py-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt=""
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
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center border border-red-100 mx-auto">
            <AlertOctagon className="w-8 h-8 text-red-500" />
          </div>

          <div className="space-y-5 w-full relative">
            <DialogHeader className="space-y-1.5 text-center">
              <DialogTitle className="text-2xl font-bold text-slate-800 tracking-tight">
                Suspend this user?
              </DialogTitle>
            </DialogHeader>

            <div className="max-w-md mx-auto">
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger className="w-full bg-[#EFEFEF] hover:bg-gray-200/80 text-black rounded-2xl px-6 py-6 text-base font-bold flex items-center justify-between border-none outline-none focus:ring-0 focus:ring-offset-0 cursor-pointer">
                  <SelectValue placeholder="Reason" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 text-left max-h-50 overflow-y-auto">
                  {REASON_MAPPING.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value} 
                      className="px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer focus:bg-slate-50 focus:text-slate-800"
                    >
                      {option.label} 
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogDescription className="text-sm text-slate-500 max-w-md mx-auto">
              Are you sure you want to suspend{" "}
              <span className="font-bold text-gray-900">
                &ldquo;{user.username}&rdquo;
              </span>
              ?<br />
              This user will be barred from login and registration. You will
              need to manually reactivate them to restore access.
            </DialogDescription>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 w-full">
            <CancelButton onClick={onClose} />
            
            <div 
              className="inline-block shrink-0"
              onMouseDown={(e) => {
                e.preventDefault();
                onConfirm(user.no, selectedReason || "OTHER");
              }}
            >
              <SuspendButton onClick={() => {}} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
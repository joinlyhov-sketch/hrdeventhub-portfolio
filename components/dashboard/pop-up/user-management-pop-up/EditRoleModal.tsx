"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { UserData } from "../../../../data/UserData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../../ui/modal-user-management/dialog";
import { CancelButton } from "../../../site/user-mangement/button/CancelButton";
import { SaveButton } from "../../../site/user-mangement/button/SaveButton";

interface EditRoleModalProps {
  user: UserData;
  onClose: () => void;
  onSave: (userId: number, newRole: string) => void;
}

export default function EditRoleModal({
  user,
  onClose,
  onSave,
}: EditRoleModalProps) {
  const [role, setRole] = useState("Student");

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white w-full max-w-[30%] sm:max-w-none md:max-w-[30%] rounded-[32px] p-0 overflow-hidden border-none gap-0 shadow-xl animate-in fade-in zoom-in-95 duration-150">
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
          <DialogHeader className="space-y-1.5 text-center">
            <DialogTitle className="text-2xl font-bold text-primary">
              Edit User Role
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 max-w-md mx-auto">
              Quick role management for keeping the community organized and
              secure.
            </DialogDescription>
          </DialogHeader>

          <div className="text-left max-w-md mx-auto space-y-2">
            <label className="text-sm font-semibold text-slate-600">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-5 py-3.5 rounded-2xl border border-blue-200 outline-none focus:border-blue-900 text-slate-600 text-sm transition-colors"
            />
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <CancelButton onClick={onClose} />
            <SaveButton onClick={() => onSave(user.no, role)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

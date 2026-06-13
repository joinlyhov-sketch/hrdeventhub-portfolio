"use client";

import React, { useState, useEffect } from "react";
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
} from "../../../ui/select";
import { CancelButton } from "../../../site/user-mangement/button/CancelButton";
import { SaveButton } from "../../../site/user-mangement/button/SaveButton";
import { getUserByIdAction } from "../../../../actions/user.action";

type RoleType = "ADMIN" | "ORGANIZER" | "ALUMNI" | "STUDENT";

interface EditRoleModalProps {
  user: UserData;
  onClose: () => void;
  onSave: (userId: string | number, newRole: RoleType) => void;
}

export default function EditRoleModal({
  user,
  onClose,
  onSave,
}: EditRoleModalProps) {
  const [role, setRole] = useState<RoleType>("STUDENT");
  const [loading, setLoading] = useState(true);

  const profileSrc =
    user.profilePicture && user.profilePicture.trim() !== ""
      ? user.profilePicture
      : null;

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      try {
        const result = await getUserByIdAction(String(user.no));
        if (result && "payload" in result && result.payload?.role) {
          setRole(result.payload.role as RoleType);
        } else {
          setRole((user.role as RoleType) || "ADMIN");
        }
      } catch {
        setRole((user.role as RoleType) || "ADMIN");
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user.no]);

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white w-full max-w-[700px] sm:max-w-none md:max-w-[700px] rounded-[15px] p-0 overflow-hidden border-none gap-0 shadow-xl animate-in fade-in zoom-in-95 duration-150 [&>button]:top-10 [&>button]:hover:text-red-500 [&>button]:-translate-y-1/2 [&>button]:!bg-transparent [&>button]:focus:ring-0">
        <div className="bg-[#F2F4F7] px-3 py-4 flex items-center justify-between border-b border-gray-100">
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
              <h4 className="font-semibold text-slate-700 text-base">
                {user ? `${user.firstName} ${user.lastName}` : "User"}
              </h4>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-5 text-center">
          <DialogHeader className="space-y-1.5 text-center">
            <DialogTitle className="text-2xl font-medium text-primary">
              Edit User Role
            </DialogTitle>
            <DialogDescription className="text-lg text-grey-500 max-w-md mx-auto">
              Quick role management for keeping the community organized and
              secure.
            </DialogDescription>
          </DialogHeader>

          <div className="text-left max-w-lg mx-auto space-y-5">
            <label className="type-desc text-grey-500">Role</label>

            <Select
              value={role}
              onValueChange={(val) => setRole(val as RoleType)}
            >
              <SelectTrigger className="w-full px-5 py-7 rounded-2xl border border-primary outline-none text-secondary text-sm  hover:bg-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                side="bottom"
                position="popper"
                className="bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 text-left max-h-35 overflow-y-auto w-[var(--radix-select-trigger-width)] -mt-1"
              >
                {" "}
                <SelectItem
                  value="ADMIN"
                  className="px-3 py-2 type-desc rounded-md text-secondary hover:bg-grey-200 transition-colors cursor-pointer focus:bg-slate-50"
                >
                  ADMIN
                </SelectItem>
                <SelectItem
                  value="ORGANIZER"
                  className="px-3 py-2 type-desc rounded-md text-secondary hover:bg-grey-200 transition-colors cursor-pointer focus:bg-slate-50 "
                >
                  ORGANIZER
                </SelectItem>
                <SelectItem
                  value="ALUMNI"
                  className="px-3 py-2 type-desc rounded-md text-secondary hover:bg-grey-200 transition-colors cursor-pointer focus:bg-slate-50 "
                >
                  ALUMNI
                </SelectItem>
                <SelectItem
                  value="STUDENT"
                  className="px-3 py-2 type-desc rounded-md text-secondary hover:bg-grey-200 transition-colors cursor-pointer focus:bg-slate-50"
                >
                  STUDENT
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            <CancelButton onClick={onClose} />
            <div className={loading ? "pointer-events-none opacity-50" : ""}>
              <SaveButton
                onClick={() => {
                  console.log(
                    `Role update triggered — User: ${user.username} (ID: ${user.no}) | New Role: ${role}`,
                  );
                  onSave(user.no, role);
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

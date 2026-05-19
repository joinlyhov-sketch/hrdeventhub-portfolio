import React, { useState } from "react";
import { X } from "lucide-react";
import { UserData } from "../../../data/UserData";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#F8FAFC] px-8 py-5 flex items-center justify-between border-b border-gray-100">
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
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-10 space-y-8 text-center">
          <div>
            <h3 className="text-2xl font-bold text-[#1E3A8A]">
              Edit User Role
            </h3>
            <p className="text-sm text-slate-500 mt-1.5">
              Quick role management for keeping the community organized and
              secure.
            </p>
          </div>

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
            <button
              type="button"
              onClick={onClose}
              className="px-10 py-3 rounded-2xl border border-[#1E3A8A] text-[#1E3A8A] font-bold text-sm hover:bg-slate-50 transition-colors min-w-[140px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave(user.no, role)}
              className="px-10 py-3 rounded-2xl bg-[#1E3A8A] text-white font-bold text-sm hover:bg-blue-800 transition-colors min-w-[140px]"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

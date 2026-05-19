"use client";

import React from "react";
import { X, CheckCircle2 } from "lucide-react";
import { UserData } from "../../../data/UserData";

interface ReactivateModalProps {
  user: UserData;
  onClose: () => void;
  onConfirm: (userId: number) => void;
}

export default function ReactivateModal({ user, onClose, onConfirm }: ReactivateModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="bg-[#F8FAFC] px-8 py-5 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src={user.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h4 className="font-bold text-slate-800 text-base">{user.username}</h4>
              <p className="text-xs text-slate-400 font-medium">{user.email}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-10 flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-[#E6F9F1] rounded-full flex items-center justify-center border border-[#CCF4E3]">
            <CheckCircle2 className="w-8 h-8 text-[#00B074]" />
          </div>

          <div className="space-y-3 w-full">
            <h3 className="text-2xl font-bold text-[#1B2A4A] tracking-tight">Reactivate User</h3>
            
            <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Are you sure you want to reactivate <span className="font-bold text-slate-700">'{user.username}'</span>?
            </p>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              This will restore full access to the platform. The user will be able to log in and register for events immediately.
            </p>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4 w-full">
            <button
              type="button"
              onClick={onClose}
              className="px-10 py-3 rounded-2xl border border-[#1B2A4A] text-[#1B2A4A] font-bold text-sm hover:bg-slate-50 transition-colors min-w-[140px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(user.no)}
              className="px-10 py-3 rounded-2xl bg-[#1B2A4A] text-white font-bold text-sm hover:bg-blue-900 transition-colors min-w-[140px]"
            >
              Reactivate
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
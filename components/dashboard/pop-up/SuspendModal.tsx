"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, AlertOctagon, ChevronDown, ChevronUp } from "lucide-react";
import { UserData } from "../../../data/UserData";

interface SuspendModalProps {
  user: UserData;
  onClose: () => void;
  onConfirm: (userId: number, reason: string) => void;
}

const REASON_OPTIONS = [
  "Spam Activity",
  "Policy Violation",
  "Inappropriate Behavior",
  "Inappropriate Media",
  "Other",
];

export default function SuspendModal({
  user,
  onClose,
  onConfirm,
}: SuspendModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("Reason");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside of the element
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        <div className="p-10 flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center border border-red-100">
            <AlertOctagon className="w-8 h-8 text-[#EF4444]" />
          </div>

          <div className="space-y-5 w-full relative">
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">
              Suspend this user?
            </h3>

            <div className="max-w-xs mx-auto relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[#EFEFEF] hover:bg-gray-200/80 text-black rounded-2xl px-6 py-3.5 text-base font-bold flex items-center justify-between transition-colors outline-none"
              >
                <span>{selectedReason}</span>
                {isOpen ? (
                  <ChevronUp size={20} className="text-black" />
                ) : (
                  <ChevronDown size={20} className="text-black" />
                )}
              </button>

              {isOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                  
                  <div className="max-h-[200px] overflow-y-auto scrollbar-thin pr-1">
                    {REASON_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSelectedReason(option);
                          setIsOpen(false);
                        }}
                        className="w-full px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors text-left block"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="text-detail text-slate-500 max-w-md mx-auto leading-relaxed pt-2">
              Are you sure you want to suspend{" "}
              <span className="font-bold text-gray-900">
                '{user.username}'
              </span>
              ?<br />
              This user will be barred from login and registration. You will
              need to manually reactivate them to restore access.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4 w-full">
            <button
              type="button"
              onClick={onClose}
              className="px-10 py-3 rounded-2xl border border-[#1E3A8A] text-primary font-bold text-sm hover:bg-slate-50 transition-colors min-w-[140px]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedReason === "Reason"}
              onClick={() => onConfirm(user.no, selectedReason)}
              className="px-10 py-3 rounded-2xl bg-[#EF4444] text-white font-bold text-sm hover:bg-red-600 transition-colors min-w-[140px] disabled:opacity-300 disabled:cursor-not-allowed"
            >
              Suspend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

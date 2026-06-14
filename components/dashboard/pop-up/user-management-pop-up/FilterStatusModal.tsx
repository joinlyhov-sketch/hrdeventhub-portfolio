"use client";

import React, { useState } from "react";
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
} from "../../../ui/select";

interface FilterStatusModalProps {
  onClose: () => void;
  onClear: () => void;
  onFilterChange: (status: string) => void;
  initialStatus?: string;
}

export default function FilterStatusModal({
  onClose,
  onClear,
  onFilterChange,
  initialStatus = "",
}: FilterStatusModalProps) {
  const [localStatus, setLocalStatus] = useState<string>(initialStatus);

  const handleClear = () => {
    setLocalStatus("");
    onClear();
  };

  const handleValueChange = (value: string) => {
    setLocalStatus(value);
    onFilterChange(value);
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="bg-white w-full max-w-[700px] sm:max-w-none md:max-w-[700px] rounded-[15px] p-8 md:p-10 overflow-hidden border-none gap-0 shadow-xl animate-in fade-in zoom-in-95 duration-150 outline-none
        [&>button]:top-10 [&>button]:right-5 [&>button]:text-gray-700 [&>button]:hover:text-red-500 [&>button]:-translate-y-1/2 [&>button]:!bg-transparent [&>button]:focus:ring-0"
      >
        <DialogHeader className="space-y-0 mt-6 text-center mb-6">
          <DialogTitle className="text-[22px] font-semibold text-primary">
            Filter By Status
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 mb-8 text-left">
          <label className="text-sm font-medium text-gray-700 block">
            Status
          </label>
          <Select value={localStatus} onValueChange={handleValueChange}>
            <SelectTrigger className="w-full px-5 py-7 rounded-[16px] border border-slate-200  focus:ring-0 outline-none text-[#2d3748] text-base transition-colors bg-white hover:bg-slate-100 flex items-center justify-between">
              <SelectValue placeholder="Enter status (active)..." />
            </SelectTrigger>

            <SelectContent
              side="bottom"
              position="popper"
              className="bg-white rounded-[16px] shadow-xl border border-[#d6e4f0] py-1 z-50 text-left max-h-35 overflow-y-auto w-[var(--radix-select-trigger-width)] -mt-1"
            >
              <SelectItem
                value="all"
                className="px-5 py-2 text-base text-[#2d3748] hover:bg-slate-50 transition-colors cursor-pointer focus:bg-slate-50 outline-none"
              >
                All
              </SelectItem>
              <SelectItem
                value="active"
                className="px-5 py-2 text-base text-[#2d3748] hover:bg-slate-50 transition-colors cursor-pointer focus:bg-slate-50 outline-none"
              >
                Active
              </SelectItem>
              <SelectItem
                value="suspended"
                className="px-5 py-2 text-base text-[#2d3748] hover:bg-slate-50 transition-colors cursor-pointer focus:bg-slate-50 outline-none"
              >
                Suspended
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <button
            type="button"
            onClick={handleClear}
            className="w-full py-3.5 border-1 border-primary text-primary font-medium text-lg rounded-[20px] bg-white hover:bg-grey-100 transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

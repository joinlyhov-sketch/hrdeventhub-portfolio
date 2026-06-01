"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog-payments/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, CalendarIcon, ChevronUp, ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/reaction/popover";

interface CreateInvitationLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateInvitationLinkModal({
  isOpen,
  onClose,
}: CreateInvitationLinkModalProps) {
  const [expireDate, setExpireDate] = React.useState("");
  const [inviteUrl, setInviteUrl] = React.useState(
    "http://96.9.81.187:3001/join/Y9xjMfJLoqty6DJVm3tLw7vdWTwogb8N",
  );

  const [date, setDate] = React.useState<Date | undefined>();
  const [open, setOpen] = React.useState(false);

  const handleCreateLink = () => {
    console.log(
      "Generating dynamic secure link for:",
      expireDate || "expireDate",
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px] w-full rounded-2xl border-none bg-white p-0 shadow-2xl overflow-hidden [&>button]:hidden gap-0">
        <div className="relative border-b border-gray-100 bg-white px-8 pt-7 pb-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-[26px] font-bold text-[#1e3a8a]">
              Create Invitation Link
            </DialogTitle>
            <DialogDescription className="text-[15px] text-gray-500 font-normal">
              Generate a secure link and optionally scope who can join.
            </DialogDescription>
          </DialogHeader>

          <button
            onClick={onClose}
            className="absolute right-7 top-7 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>
        <div className="px-8 py-6 space-y-6 bg-white">
          <div className="space-y-2">
            <label className="text-[17px] font-bold text-[#1e3a8a] block">
              Link Expiration (required)
            </label>

            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <CalendarIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                  size={18}
                />

                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-[52px] justify-start pl-11 rounded-xl border border-blue-100 bg-white text-left font-normal text-gray-500 hover:bg-white"
                    >
                      <div className="w-full flex items-center justify-between">
                        {date ? format(date, "PPP") : "Select Expire Date"}

                        {open ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </div>
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    className="w-auto p-0 rounded-xl border border-blue-100 shadow-lg"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        setDate(selectedDate);
                        setOpen(false); 
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                onClick={handleCreateLink}
                className="h-[52px] px-8 bg-[#2b4c8c] hover:bg-[#1e3563] text-white font-semibold rounded-xl text-[15px] shadow-sm transition-colors shrink-0"
              >
                Create Link
              </Button>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <label className="text-[17px] font-bold text-[#1e3a8a] block">
              Invite URL
            </label>
            <Input
              type="text"
              readOnly
              value={inviteUrl}
              className="h-[52px] px-4 rounded-xl border border-blue-100 bg-white text-[15px] text-gray-400 select-all focus-visible:ring-1 focus-visible:ring-blue-400 transition-all"
            />
          </div>
        </div>
        <div className="flex justify-end items-end bg-[#f8fafc] px-8 py-5 border-t border-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-[44px] px-8 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl text-[15px] transition-colors"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

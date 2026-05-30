"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog-payments/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Users2 } from "lucide-react";

interface CreateInvitationLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateInvitationLinkModal({
  isOpen,
  onClose,
}: CreateInvitationLinkModalProps) {
  const [generation, setGeneration] = React.useState("");
  const [inviteUrl, setInviteUrl] = React.useState(
    "http://96.9.81.187:3001/join/Y9xjMfJLoqty6DJVm3tLw7vdWTwogb8N"
  );

  const handleCreateLink = () => {
    console.log("Generating dynamic secure link for:", generation || "All generations");
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
              Target Generation (optional)
            </label>

            <div className="flex gap-3 items-center">
              <div className="relative flex-1 flex items-center">
                <Users2 className="absolute left-4 text-gray-400 pointer-events-none z-10" size={18} />
                
                <Select value={generation} onValueChange={setGeneration}>
                  <SelectTrigger className="w-full h-[52px] pl-11 pr-4 rounded-xl border border-blue-100 bg-white text-[15px] text-left placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 text-gray-500 transition-all">
                    <SelectValue placeholder="Select generation" />
                  </SelectTrigger>
                  
                  <SelectContent className="rounded-xl border border-blue-100 bg-white shadow-lg">
                    <SelectItem value="gen-1" className="text-[15px] text-gray-700 focus:bg-blue-50">Generation 1</SelectItem>
                    <SelectItem value="gen-2" className="text-[15px] text-gray-700 focus:bg-blue-50">Generation 2</SelectItem>
                    <SelectItem value="gen-3" className="text-[15px] text-gray-700 focus:bg-blue-50">Generation 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={handleCreateLink}
                className="h-[52px] px-8 bg-[#2b4c8c] hover:bg-[#1e3563] text-white font-semibold rounded-xl text-[15px] shadow-sm transition-colors shrink-0"
              >
                Create Link
              </Button>
            </div>
            
            <p className="text-[13px] text-gray-400 font-normal pl-0.5">
              Leave empty to allow all generations.
            </p>
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
        <div className="flex justify-between items-center bg-[#f8fafc] px-8 py-5 border-t border-gray-50">
          <span className="text-sm text-gray-400 font-medium">
            Expires at: 5/15/2026, 3:58:38 AM
          </span>
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
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
import { Textarea } from "@/components/ui/comment-modal/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, PenLine, Users2 } from "lucide-react";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = React.useState("");
  const [generation, setGeneration] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleCreate = () => {
    console.log("Initializing new group payload:", { groupName, generation, description });
    setGroupName("");
    setGeneration("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px] w-full rounded-2xl border-none bg-white p-0 shadow-2xl overflow-hidden [&>button]:hidden gap-0">
        <div className="relative border-b border-gray-100 bg-white px-8 pt-7 pb-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-[26px] font-bold text-[#1e3a8a]">
              Create Group
            </DialogTitle>
            <DialogDescription className="text-[15px] text-gray-500 font-normal">
              Fill in details below to initialize a new group.
            </DialogDescription>
          </DialogHeader>
          
          <button
            onClick={onClose}
            className="absolute right-7 top-7 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close dialog"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>
        <div className="px-8 py-6 space-y-6 bg-white">
          <div className="space-y-2.5">
            <label className="text-[17px] font-bold text-[#1e3a8a] block">
              Group Name
            </label>
            <div className="relative flex items-center">
              <PenLine className="absolute left-4 text-gray-400 pointer-events-none" size={18} />
              <Input
                type="text"
                placeholder="Enter Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="h-[52px] pl-11 pr-4 rounded-xl border border-blue-100 bg-white text-[15px] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="space-y-2.5">
            <label className="text-[17px] font-bold text-[#1e3a8a] block">
              Generation
            </label>
            <Select value={generation} onValueChange={setGeneration}>
              <div className="relative flex items-center">
                <Users2 className="absolute left-4 text-gray-400 pointer-events-none z-10" size={18} />
                <SelectTrigger className="w-full h-[52px] pl-11 pr-4 rounded-xl border border-blue-100 bg-white text-[15px] text-left placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 text-gray-500 transition-all">
                  <SelectValue placeholder="Select generation" />
                </SelectTrigger>
              </div>
              <SelectContent className="rounded-xl border border-blue-100 bg-white shadow-lg">
                <SelectItem value="gen-1" className="text-[15px] text-gray-700 focus:bg-blue-50">Generation 1</SelectItem>
                <SelectItem value="gen-2" className="text-[15px] text-gray-700 focus:bg-blue-50">Generation 2</SelectItem>
                <SelectItem value="gen-3" className="text-[15px] text-gray-700 focus:bg-blue-50">Generation 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2.5">
            <label className="text-[17px] font-bold text-[#1e3a8a] block">
              Description
            </label>
            <Textarea
              placeholder="Describe your group's details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] resize-none p-4 rounded-xl border border-blue-100 bg-white text-[15px] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all"
            />
          </div>
        </div>
        <div className="flex justify-end items-center gap-3 bg-[#f8fafc] px-8 py-5 border-t border-gray-50">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-[46px] px-7 border border-[#2563eb] text-[#2563eb] hover:bg-blue-50 font-semibold rounded-lg text-[15px] transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            className="h-[46px] px-6 bg-[#2b4c8c] hover:bg-[#1e3563] text-white font-semibold rounded-lg text-[15px] shadow-sm transition-colors"
          >
            Create Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
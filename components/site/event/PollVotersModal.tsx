"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { OptionVotersDTO } from "@/types/poll-voter";

interface PollVotersModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: OptionVotersDTO[];
}

export function PollVotersModal({ isOpen, onClose, payload }: PollVotersModalProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  if (!payload || payload.length === 0) return null;

  const allVotersMap = new Map();
  for (const opt of payload) {
    for (const v of opt.voters) {
      if (!allVotersMap.has(v.appUserId)) {
        allVotersMap.set(v.appUserId, v);
      }
    }
  }
  const allVoters = Array.from(allVotersMap.values());

  const displayVoters = activeFilter
    ? payload.find((opt) => opt.optionId === activeFilter)?.voters || []
    : allVoters;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
      if (!open) setActiveFilter(null);
    }}>
      <DialogContent
        className="w-[92vw] min-w-0 sm:w-fit sm:min-w-110 max-w-[95vw] p-2 bg-background border border-border rounded-2xl shadow-xl max-h-[75vh] sm:max-h-120 flex flex-col gap-0 [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Poll Voters</DialogTitle>

        <div className="w-full flex items-center gap-1 px-3 pt-3 pb-0 border-b border-border">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveFilter(null)}
              className={`relative -mb-px flex items-center gap-1.5 px-3 pb-2 pt-1 text-sm font-semibold rounded-t-lg transition-colors shrink-0 border-b-2 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ${!activeFilter
                  ? "border-primary text-primary"
                  : "border-transparent text-grey-400 hover:text-grey-700"
                }`}
            >
              All
              <span className="text-md font-medium">{allVoters.length}</span>
            </button>

            {payload.map((opt) => (
              <button
                key={opt.optionId}
                onClick={() => setActiveFilter(opt.optionId)}
                className={`relative -mb-px flex items-center gap-1.5 px-3 pb-2 pt-1 text-sm font-semibold rounded-t-lg transition-colors shrink-0 border-b-2 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ${activeFilter === opt.optionId
                    ? "border-primary text-primary"
                    : "border-transparent text-grey-400 hover:text-grey-700"
                  }`}
              >
                <span className="truncate max-w-[100px]">{opt.optionText}</span>
                <span className="text-md font-medium">{opt.voters.length}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              onClose();
              setActiveFilter(null);
            }}
            className="ml-auto mb-2 p-1.5 text-grey-400 hover:text-grey-700 transition-colors cursor-pointer shrink-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-3 space-y-3 scrollbar-none">
          {displayVoters.length === 0 ? (
            <div className="text-center text-sm text-grey-500 py-4">No voters for this option</div>
          ) : (
            displayVoters.map((reactor) => {
              const fullName = [reactor.firstName, reactor.lastName]
                .filter(Boolean)
                .join(" ") || "Unknown";
              const profileImage = reactor.profilePicture;

              return (
                <Link
                  key={reactor.appUserId}
                  href={`/profile/${reactor.appUserId}`}
                  className="block hover:bg-grey-50 p-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-grey-200 overflow-hidden flex items-center justify-center border">
                        {profileImage ? (
                          <Image
                            src={profileImage}
                            alt={fullName}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-primary uppercase">
                            {fullName.slice(0, 2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="flex-1 text-sm font-medium text-grey-900 truncate">
                      {fullName}
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

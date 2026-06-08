"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { TwemojiImg, REACTIONS } from "@/components/site/pop-up/comment/reaction";
import { ReactionItem } from "@/hooks/use-post-reaction";
import { CommentReactionItem } from "@/hooks/use-comment-reaction";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AnyReactionItem = ReactionItem | CommentReactionItem;

interface ReactionSummaryProps {
  payload: AnyReactionItem[];
}

function groupReactions(payload: AnyReactionItem[]) {
  const map: Record<string, number> = {};
  for (const r of payload) {
    map[r.type] = (map[r.type] ?? 0) + 1;
  }
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => ({
      type,
      count,
      reaction: REACTIONS.find((r) => r.id === type),
    }));
}

export function ReactionSummary({ payload }: ReactionSummaryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  if (!payload || payload.length === 0) return null;

  const grouped = groupReactions(payload);
  const total = payload.length;
  const filteredReactors = activeFilter
    ? payload.filter((r) => r.type === activeFilter)
    : payload;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setActiveFilter(null);
    }}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer select-none">
          <span className="flex items-center -space-x-0.5">
            {grouped.slice(0, 3).map(({ type, reaction }) => (
              <span key={type} className="inline-flex">
                {reaction ? (
                  <TwemojiImg emoji={reaction.emoji} size={20} />
                ) : (
                  <span className="text-sm">👍</span>
                )}
              </span>
            ))}
          </span>
          <span className="text-sm font-medium text-grey-500 ml-1">{total}</span>
        </button>
      </DialogTrigger>

      <DialogContent 
        className="p-2 bg-background border border-border rounded-2xl shadow-xl w-80 max-h-120 flex flex-col overflow-hidden gap-0 [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Reaction Summary</DialogTitle>

        <div className="flex items-center gap-1 px-3 pt-3 pb-0 border-b border-border overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveFilter(null)}
            className={`relative -mb-px flex items-center gap-1.5 px-3 pb-2 pt-1 text-md font-semibold rounded-t-lg transition-colors shrink-0 border-b-2 ${
              !activeFilter
                ? "border-primary text-primary"
                : "border-transparent text-grey-400 hover:text-grey-700"
            }`}
          >
            All
            <span className="text-md font-medium">{total}</span>
          </button>

          {grouped.map(({ type, count, reaction }) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`relative -mb-px flex items-center gap-1.5 px-3 pb-2 pt-1 text-sm font-semibold rounded-t-lg transition-colors shrink-0 border-b-2 ${
                activeFilter === type
                  ? "border-primary text-primary"
                  : "border-transparent text-grey-400 hover:text-grey-700"
              }`}
            >
              {reaction ? (
                <TwemojiImg emoji={reaction.emoji} size={20} />
              ) : (
                <span>👍</span>
              )}
              <span className="text-md font-medium">{count}</span>
            </button>
          ))}

          <button
            onClick={() => {
              setIsOpen(false);
              setActiveFilter(null);
            }}
            className="ml-auto mb-2 p-1.5 text-grey-400 hover:text-grey-700 transition-colors cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-3 space-y-3">
          {filteredReactors.map((r) => {
            const reaction = REACTIONS.find((rx) => rx.id === r.type);
            const fullName = [r.reactor.firstName, r.reactor.lastName]
              .filter(Boolean)
              .join(" ") || "Unknown";
            const profileImage = r.reactor.profileImage;

            return (
              <div key={r.reactionId} className="flex items-center gap-3">
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
                  <div className="absolute -bottom-1 -right-1">
                    {reaction ? (
                      <TwemojiImg emoji={reaction.emoji} size={16} />
                    ) : (
                      <span className="text-xs">👍</span>
                    )}
                  </div>
                </div>
                <span className="flex-1 text-sm font-medium text-grey-900 truncate">
                  {fullName}
                </span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
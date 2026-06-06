"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { TwemojiImg, REACTIONS } from "@/components/site/pop-up/comment/reaction";
import { ReactionItem } from "@/hooks/use-post-reaction";
import { CommentReactionItem } from "@/hooks/use-comment-reaction";

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

const MAX_TOOLTIP_NAMES = 10;

export function ReactionSummary({ payload }: ReactionSummaryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  if (!payload || payload.length === 0) return null;

  const grouped = groupReactions(payload);
  const total = payload.length;
  const filteredReactors = activeFilter
    ? payload.filter((r) => r.type === activeFilter)
    : payload;

  const tooltipNames = payload
    .slice(0, MAX_TOOLTIP_NAMES)
    .map((r) =>
      [r.reactor.firstName, r.reactor.lastName].filter(Boolean).join(" ") || "Unknown"
    );
  const remaining = total - MAX_TOOLTIP_NAMES;

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer select-none"
      >
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

      {isHovered && !isOpen && (
        <div className="absolute bottom-full mb-2 left-0 z-50 bg-grey-900 text-white text-xs rounded-xl px-3 py-2 shadow-lg pointer-events-none w-max max-w-48">
          {tooltipNames.map((name, i) => (
            <p key={i} className="leading-5">{name}</p>
          ))}
          {remaining > 0 && (
            <p className="leading-5 text-grey-400">and {remaining} more...</p>
          )}
        </div>
      )}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => { setIsOpen(false); setActiveFilter(null); }}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-background border border-border rounded-2xl shadow-xl w-80 max-h-120 flex flex-col overflow-hidden">
            <div className="flex items-center gap-1 px-3 pt-3 pb-0 border-b border-border overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveFilter(null)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-t-lg transition-colors shrink-0 border-b-2 ${
                  !activeFilter ? "border-primary text-primary" : "border-transparent text-grey-400 hover:text-grey-700"
                }`}
              >
                All
                <span className="text-xs font-normal">{total}</span>
              </button>

              {grouped.map(({ type, count, reaction }) => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-t-lg transition-colors shrink-0 border-b-2 ${
                    activeFilter === type ? "border-primary text-primary" : "border-transparent text-grey-400 hover:text-grey-700"
                  }`}
                >
                  {reaction ? (
                    <TwemojiImg emoji={reaction.emoji} size={16} />
                  ) : (
                    <span>👍</span>
                  )}
                  <span className="text-xs font-normal">{count}</span>
                </button>
              ))}

              <button
                onClick={() => { setIsOpen(false); setActiveFilter(null); }}
                className="ml-auto p-1.5 text-grey-400 hover:text-grey-700 transition-colors cursor-pointer shrink-0"
              >
                <X size={16} />
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
                          <TwemojiImg emoji={reaction.emoji} size={14} />
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
          </div>
        </>
      )}
    </div>
  );
}
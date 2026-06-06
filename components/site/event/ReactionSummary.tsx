"use client";

import { useState } from "react";
import {
  TwemojiImg,
  REACTIONS,
} from "@/components/site/pop-up/comment/reaction";

type ReactionItem = {
  reactionId: string;
  type: string;
  appUserId: string;
  appUser?: {
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  };
};

interface ReactionSummaryProps {
  payload: ReactionItem[];
}

function groupReactions(payload: ReactionItem[]) {
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

  if (!payload || payload.length === 0) return null;

  const grouped = groupReactions(payload);
  const total = payload.length;

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer select-none"
      >
        <span className="flex items-center -space-x-0.5">
          {grouped.slice(0, 3).map(({ type, reaction }) => (
            <span key={type} className="inline-flex">
              {reaction ? (
                <TwemojiImg emoji={reaction.emoji} size={18} />
              ) : (
                <span className="text-sm">👍</span>
              )}
            </span>
          ))}
        </span>
        <span className="text-detail font-medium text-grey-500 ml-1">{total}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full mb-2 left-0 z-50 bg-background border border-border rounded-2xl shadow-lg p-3 min-w-48">
            <p className="text-md font-semibold text-grey-400 mb-2 px-1">
              Reactions · {total}
            </p>
            <div className="space-y-1.5">
              {grouped.map(({ type, count, reaction }) => (
                <div
                  key={type}
                  className="flex items-center justify-between gap-3 px-1"
                >
                  <div className="flex items-center gap-2">
                    {reaction ? (
                      <TwemojiImg emoji={reaction.emoji} size={24} />
                    ) : (
                      <span className="text-base">👍</span>
                    )}
                    <span className="text-md font-medium text-grey-700">
                      {reaction?.displayText ?? type}
                    </span>
                  </div>
                  <span className="text-[18px] font-medium text-grey-500">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

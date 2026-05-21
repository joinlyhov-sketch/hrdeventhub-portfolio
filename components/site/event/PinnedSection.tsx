"use client";
import { useState } from "react";
import { Pin } from "lucide-react";
import { PinnedCard } from "./PinnedCard";

export function PinnedSection() {
  const [showAllPinned, setShowAllPinned] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4 text-primary">
        <div className="flex items-center gap-2">
          <Pin size={20} />
          <h2 className="text-primary">Pinned</h2>
        </div>
        <button
          onClick={() => setShowAllPinned(!showAllPinned)}
          className="text-desc cursor-pointer hover:text-primary-hover transition-colors"
        >
          {showAllPinned ? "Show Less" : "View All"}
        </button>
      </div>

      <div className="space-y-4">
        <PinnedCard />
        
        {showAllPinned && (
          <div className="grid grid-cols-1 gap-4 pt-2">
            <PinnedCard />
          </div>
        )}
      </div>
    </div>
  );
}
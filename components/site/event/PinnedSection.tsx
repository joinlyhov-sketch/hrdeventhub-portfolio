"use client";

import { useState } from "react";
import { Pin } from "lucide-react";
import { PinnedCard } from "./PinnedCard";
import { Post } from "@/types/posts";

interface PinnedSectionProps {
  posts: Post[];
}

export function PinnedSection({ posts }: PinnedSectionProps) {
  const [showAllPinned, setShowAllPinned] = useState(false);

  const pinnedPosts = posts.filter((p) => p.pinned);

  if (pinnedPosts.length === 0) return null;

  const visiblePosts = showAllPinned ? pinnedPosts : pinnedPosts.slice(0, 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4 text-primary">
        <div className="flex items-center gap-2">
          <Pin size={20} />
          <h2 className="text-primary">Pinned</h2>
        </div>
        {pinnedPosts.length > 1 && (
          <button
            onClick={() => setShowAllPinned(!showAllPinned)}
            className="text-desc cursor-pointer hover:text-primary-hover transition-colors"
          >
            {showAllPinned ? "Show Less" : `View All (${pinnedPosts.length})`}
          </button>
        )}
      </div>

      <div className="space-y-4">
        {visiblePosts.map((post) => (
          <PinnedCard key={post.postId} post={post} />
        ))}
      </div>
    </div>
  );
}
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FeedItemWrapper } from "@/types/UnifiedFeedItem";

interface FeedCache {
  feeds: Record<string, FeedItemWrapper[]>;
  setFeed: (groupid: string, items: FeedItemWrapper[]) => void;
  getFeed: (groupid: string) => FeedItemWrapper[] | undefined;
}

export const useFeedStore = create<FeedCache>()(
  persist(
    (set, get) => ({
      feeds: {},

      setFeed: (groupid, items) =>
        set((state) => ({
          feeds: { ...state.feeds, [groupid]: items },
        })),

      getFeed: (groupid) => get().feeds[groupid],
    }),
    {
      name: "workspace-feed-cache",
      partialize: (state) => ({ feeds: state.feeds }),
    }
  )
);
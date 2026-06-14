import { create } from "zustand";
import { persist } from "zustand/middleware";

type FeedItem = Record<string, unknown>;

interface FeedCache {
  feeds: Record<string, FeedItem[]>;
  setFeed: (groupid: string, items: FeedItem[]) => void;
  getFeed: (groupid: string) => FeedItem[] | undefined;
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
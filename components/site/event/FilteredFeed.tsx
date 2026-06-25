"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { mutate as globalMutate } from "swr";
import dynamic from "next/dynamic";
import SearchEvent from "./SearchEvent";
import { PinnedSection } from "./PinnedSection";

const EventCard = dynamic(() => import("./EventCard").then(mod => mod.EventCard));
const AnnouncementCard = dynamic(() => import("./AnnouncementCard").then(mod => mod.AnnouncementCard));
const PollCard = dynamic(() => import("./PollCard").then(mod => mod.PollCard));
const SurveyCard = dynamic(() => import("./SurveyCard").then(mod => mod.SurveyCard));
const ArticleCard = dynamic(() => import("./ArticleCard").then(mod => mod.ArticleCard));

import { useCurrentUser } from "@/context/user-context";
import { useWorkspaceFeed } from "@/hooks/use-workspace-hook";
import { useWorkspaceMembers } from "@/hooks/use-workspace-members";
import { deletePostAction, togglePinAction } from "@/actions/post.action";
import { useFeedStore } from "@/store/useFeedStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useDebounce } from "@/hooks/use-debounce";
import { CalendarX } from "lucide-react";
import { FeedItemWrapper } from "@/types/UnifiedFeedItem";
import { Post } from "@/types/posts";
import { Poll } from "@/types/poll";
import { Survey } from "@/types/survey";

interface FilteredFeedProps {
  groupid: string;
}

const commentCacheKey = (postId: string) => [`/comments`, postId];

export default function FilteredFeed({
  groupid,
}: FilteredFeedProps) {
  const searchParams = useSearchParams();
  const deepLinkPostId = searchParams.get("postId");
  const _deepLinkType = searchParams.get("type");

  const [mounted, setMounted] = useState(false);
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const role = currentUser?.role ?? "student";

  const { getFeed, setFeed } = useFeedStore();
  const cachedFeed = useMemo(() => getFeed(groupid) ?? [], [groupid, getFeed]);

  const {
    feedItems: swrItems,
    isLoading: feedLoading,
    mutate,
  } = useWorkspaceFeed(groupid);

  useEffect(() => {
    setMounted(true);
  }, []);

  const feedItems = useMemo(() => {
    let rawItems: FeedItemWrapper[] = [];
    if (swrItems && swrItems.length > 0) {
      rawItems = swrItems;
    } else {
      rawItems = mounted ? cachedFeed : [];
    }

    return [...rawItems].sort((a, b) => {
      const aData = a.data as Record<string, unknown> | undefined;
      const bData = b.data as Record<string, unknown> | undefined;
      const dateA = aData?.createdAt || a.createdAt || aData?.postedAt || a.postedAt;
      const dateB = bData?.createdAt || b.createdAt || bData?.postedAt || b.postedAt;

      const timeA = dateA ? new Date(dateA as string).getTime() : 0;
      const timeB = dateB ? new Date(dateB as string).getTime() : 0;

      const validA = isNaN(timeA) ? 0 : timeA;
      const validB = isNaN(timeB) ? 0 : timeB;

      if (validB !== validA) {
        return validB - validA;
      }

      const idA = String(aData?.postId || aData?.pollId || aData?.surveyId || a.id || "");
      const idB = String(bData?.postId || bData?.pollId || bData?.surveyId || b.id || "");
      return idB.localeCompare(idA);
    });
  }, [swrItems, cachedFeed, mounted]);

  useEffect(() => {
    if (swrItems && swrItems.length > 0) {
      setFeed(groupid, swrItems);
    }
  }, [swrItems, groupid, setFeed]);



  const { members } = useWorkspaceMembers(groupid);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 250);

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const removeNotificationByPostId = useNotificationStore(state => state.removeNotificationByPostId);

  const lastScrolledId = useRef<string | null>(null);

  useEffect(() => {
    if (!deepLinkPostId) return;
    if (lastScrolledId.current === deepLinkPostId) return;
    if (feedLoading) return; // Wait until feed finishes loading

    const doScroll = () => {
      const elements = document.querySelectorAll(`[id="post-${deepLinkPostId}"]`);
      let foundVisible = false;

      elements.forEach((el) => {
        if (el instanceof HTMLElement && el.offsetParent !== null) {
          foundVisible = true;
          lastScrolledId.current = deepLinkPostId;
          setTimeout(() => {
            el.style.scrollMarginTop = "100px";
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("deep-link-highlight");
            setTimeout(() => el.classList.remove("deep-link-highlight"), 2600);
          }, 300);
        }
      });
      return foundVisible;
    };

    if (doScroll()) return;

    // Check if the post even exists in our loaded feed
    const existsInFeed = feedItems.some(item => {
      const id = String((item.data as Record<string, unknown>)?.postId || (item.data as Record<string, unknown>)?.pollId || (item.data as Record<string, unknown>)?.surveyId || item.id);
      return id === deepLinkPostId;
    });

    if (!existsInFeed) {
      toast.error("The post has been removed or is no longer available.");
      removeNotificationByPostId(deepLinkPostId);
      lastScrolledId.current = deepLinkPostId;
      return;
    }

    const observer = new MutationObserver(() => {
      if (doScroll()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const timeout = setTimeout(() => {
      observer.disconnect();
    }, 5000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [deepLinkPostId, feedLoading, feedItems]);

  const pinnedCount = useMemo(
    () => feedItems.filter((item) => item.type === "POST" && (item.data as Record<string, unknown>)?.pinned).length,
    [feedItems]
  );

  const pinnedPosts = useMemo(
    () => feedItems
      .filter((item) => item.type === "POST" && (item.data as Record<string, unknown>)?.pinned)
      .map((item) => item.data as Post),
    [feedItems]
  );

  const processedTimeline = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    if (!feedItems || feedItems.length === 0) return [];

    const categoryFiltered = activeFilter
      ? feedItems.filter((item) => {
        const itemType = (item.subType || item.type || "").toLowerCase();
        return itemType === activeFilter.toLowerCase();
      })
      : feedItems;

    if (!q) return categoryFiltered;

    return categoryFiltered.filter((item) => {
      const d = item.data as Record<string, unknown> | undefined;
      const targetTitle = ((d?.title as string) || item.title || "").toLowerCase();
      const targetDesc = ((d?.description as string) || item.description || "").toLowerCase();
      const rawContent = d?.content || "";

      const titleMatch = targetTitle.includes(q);
      const descMatch = targetDesc.includes(q);
      const contentMatch = typeof rawContent === "string"
        ? rawContent.toLowerCase().includes(q)
        : false;

      return titleMatch || descMatch || contentMatch;
    });
  }, [feedItems, activeFilter, debouncedSearch]);

  const handleTogglePin = async (postId: string, currentPinStatus: boolean) => {
    const nextPinState = !currentPinStatus;
    await mutate(
      (current) =>
        current?.map((item) =>
          item.id === postId || (item.type === "POST" && (item.data as Record<string, unknown>)?.postId === postId)
            ? { ...item, data: { ...(item.data as Record<string, unknown>), pinned: nextPinState } }
            : item
        ) ?? [],
      { revalidate: false }
    );
    try {
      const response = await togglePinAction(groupid, postId, nextPinState);
      if (!response || !response.ok) mutate();
    } catch (error) {
      console.error(error);
      mutate();
    }
  };

  const handleDeletePost = async (postId: string) => {
    mutate(
      (current) =>
        current?.filter((item) => item.id !== postId && (item.data as Record<string, unknown>)?.postId !== postId) ?? [],
      false
    );
    try {
      await deletePostAction(groupid, postId);
      mutate();
    } catch (error) {
      console.error(error);
      mutate();
    }
  };

  const handleDeletePoll = (pollId: string) => {
    mutate(
      (current) =>
        current?.filter((item) => item.id !== pollId && (item.data as Record<string, unknown>)?.pollId !== pollId) ?? [],
      false
    );
    setTimeout(() => mutate(), 800);
  };

  const handleDeleteSurvey = (surveyId: string) => {
    mutate(
      (current) =>
        current?.filter((item) => item.id !== surveyId && (item.data as Record<string, unknown>)?.surveyId !== surveyId) ?? [],
      false
    );
    setTimeout(() => mutate(), 800);
  };

  const showSkeleton = !mounted || ((feedLoading || userLoading) && feedItems.length === 0);

  const isFeedEmpty = processedTimeline.length === 0;
  const isSearchingOrFiltering = debouncedSearch.trim() !== "" || activeFilter !== null;

  if (showSkeleton) {
    return (
      <div className="space-y-5 animate-in fade-in duration-300">
        <div className="w-full h-11 bg-muted rounded-lg animate-pulse" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-background rounded-xl border border-border/60 p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-sm relative overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2 grow">
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/6 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-5 bg-muted rounded w-2/3 animate-pulse" />
                <div className="h-4 bg-muted rounded w-full animate-pulse" />
                <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
              </div>
              <div className="flex gap-4 pt-2 border-t border-border/40">
                <div className="h-4 bg-muted rounded w-12 animate-pulse" />
                <div className="h-4 bg-muted rounded w-12 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SearchEvent
        role={role}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {!debouncedSearch && pinnedPosts.length > 0 && (
        <PinnedSection posts={pinnedPosts} groupid={groupid} />
      )}

      <div className="space-y-4">
        {isFeedEmpty ? (
          <div className="p-6 sm:p-12 text-center flex flex-col items-center justify-center min-h-65 mt-4 sm:mt-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-100 flex items-center justify-center text-gray-400 mb-3 sm:mb-4">
              <CalendarX size={30} className="text-red-500" />
            </div>
            {isSearchingOrFiltering ? (
              <>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
                  No Results Found
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
                  We couldn&apos;t find any records matching &ldquo;
                  <span className="font-semibold text-gray-800">{debouncedSearch}</span>&rdquo;
                  {activeFilter && (
                    <span>
                      {" "}within the{" "}
                      <span className="font-semibold text-gray-800">{activeFilter}</span> category
                    </span>
                  )}
                  . Please verify your spelling or adjust your options.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter(null);
                  }}
                  className="mt-4 sm:mt-5 text-xs font-bold text-primary hover:text-primary-hover uppercase tracking-wider underline underline-offset-4 cursor-pointer"
                >
                  Clear Filters & Reset
                </button>
              </>
            ) : (
              <>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
                  No Posts Available
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-xs sm:max-w-sm mx-auto leading-relaxed">
                  There are currently no announcements, events, or posts published here. Check back later for updates.
                </p>
              </>
            )}
          </div>
        ) : (
          processedTimeline.map((item, index) => {
            const resolvedType = (item.subType || item.type || "").toLowerCase();
            const staggerStyle = {
              animationDelay: `${index * 60}ms`,
            };

            switch (resolvedType) {
              case "event":
                return (
                  <div
                    key={item.id}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
                    style={staggerStyle}
                  >
                    <EventCard
                      role={role}
                      posts={[item.data as Post]}
                      searchQuery={debouncedSearch}
                      onDeletePost={handleDeletePost}
                      groupid={groupid}
                      pinnedCount={pinnedCount}
                      onTogglePin={handleTogglePin}
                      members={members}
                    />
                  </div>
                );

              case "announcement":
                return (
                  <div
                    key={item.id}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
                    style={staggerStyle}
                  >
                    <AnnouncementCard
                      role={role}
                      posts={[item.data as Post]}
                      searchQuery={debouncedSearch}
                      onDeletePost={handleDeletePost}
                      groupid={groupid}
                      members={members}
                    />
                  </div>
                );

              case "poll":
                return (
                  <div
                    key={item.id}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
                    style={staggerStyle}
                  >
                    <PollCard
                      role={role}
                      polls={[item.data as Poll]}
                      searchQuery={debouncedSearch}
                      onDeletePoll={handleDeletePoll}
                    />
                  </div>
                );

              case "survey":
                return (
                  <div
                    key={item.id}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
                    style={staggerStyle}
                  >
                    <SurveyCard
                      survey={item.data as Survey}
                      role={role}
                      searchQuery={debouncedSearch}
                      onVisibilityChange={() => { }}
                      onDelete={handleDeleteSurvey}
                    />
                  </div>
                );

              case "article":
                return (
                  <div
                    key={item.id}
                    className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
                    style={staggerStyle}
                  >
                    <ArticleCard
                      role={role}
                      posts={[item.data as Post]}
                      searchQuery={debouncedSearch}
                      onDeletePost={handleDeletePost}
                      groupId={groupid}
                      members={members}
                    />
                  </div>
                );

              default:
                return null;
            }
          })
        )}
      </div>
    </div>
  );
}
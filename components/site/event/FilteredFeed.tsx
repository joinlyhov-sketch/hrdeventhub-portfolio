"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { mutate as globalMutate } from "swr";
import SearchEvent from "./SearchEvent";
import { PinnedSection } from "./PinnedSection";
import { EventCard } from "./EventCard";
import { AnnouncementCard } from "./AnnouncementCard";
import { PollCard } from "./PollCard";
import { SurveyCard } from "./SurveyCard";
import { ArticleCard } from "./ArticleCard";
import { useCurrentUser } from "@/context/user-context";
import { useWorkspaceFeed } from "@/hooks/use-workspace-hook";
import { useWorkspaceMembers } from "@/hooks/use-workspace-members";
import { deletePostAction, togglePinAction } from "@/actions/post.action";
import { useFeedStore } from "@/store/useFeedStore";
import { useDebounce } from "@/hooks/use-debounce";
import { CalendarX } from "lucide-react";

interface FilteredFeedProps {
  groupid: string;
  deepLinkPostId?: string;
  deepLinkType?: string;
}

const commentCacheKey = (postId: string) => [`/comments`, postId];

export default function FilteredFeed({
  groupid,
  deepLinkPostId,
  deepLinkType,
}: FilteredFeedProps) {
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
    let rawItems: any[] = [];
    if (swrItems && swrItems.length > 0) {
      rawItems = swrItems as any[];
    } else {
      rawItems = mounted ? cachedFeed : [];
    }

    return [...rawItems].sort((a, b) => {
      const dateA = a.data?.createdAt || a.createdAt || a.data?.postedAt || a.postedAt;
      const dateB = b.data?.createdAt || b.createdAt || b.data?.postedAt || b.postedAt;

      const timeA = dateA ? new Date(dateA).getTime() : 0;
      const timeB = dateB ? new Date(dateB).getTime() : 0;

      const validA = isNaN(timeA) ? 0 : timeA;
      const validB = isNaN(timeB) ? 0 : timeB;

      if (validB !== validA) {
        return validB - validA; 
      }

      const idA = String(a.data?.postId || a.data?.pollId || a.data?.surveyId || a.id || "");
      const idB = String(b.data?.postId || b.data?.pollId || b.data?.surveyId || b.id || "");
      return idB.localeCompare(idA);
    });
  }, [swrItems, cachedFeed, mounted]);

  useEffect(() => {
    if (swrItems && swrItems.length > 0) {
      setFeed(groupid, swrItems as any);
    }
  }, [swrItems, groupid, setFeed]);

  const commentsSeedDone = useRef(false);
  useEffect(() => {
    if (commentsSeedDone.current) return;
    if (!feedItems || feedItems.length === 0) return;

    feedItems.forEach((item) => {
      const postId = item.data?.postId ?? item.data?.pollId ?? item.data?.surveyId;
      const comments = item.data?.comments;
      if (postId && Array.isArray(comments)) {
        globalMutate(commentCacheKey(postId), comments, { revalidate: false });
      }
    });

    commentsSeedDone.current = true;
  }, [feedItems]);

  const { members } = useWorkspaceMembers(groupid);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 250);

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const hasScrolled = useRef(false);
  const isDataReady = !feedLoading || feedItems.length > 0;

  useEffect(() => {
    if (!isDataReady || userLoading || !mounted) return;
    if (hasScrolled.current || !deepLinkPostId) return;

    hasScrolled.current = true;

    const tryScroll = (attemptsLeft: number) => {
      const el = document.getElementById(`post-${deepLinkPostId}`);
      if (el) {
        const TOP_OFFSET = 100;
        const y = el.getBoundingClientRect().top + window.scrollY - TOP_OFFSET;
        window.scrollTo({ top: y, behavior: "smooth" });
        el.classList.add("deep-link-highlight");
        setTimeout(() => el.classList.remove("deep-link-highlight"), 2600);
        return;
      }
      if (attemptsLeft > 0) setTimeout(() => tryScroll(attemptsLeft - 1), 150);
    };

    requestAnimationFrame(() => tryScroll(10));
  }, [isDataReady, userLoading, deepLinkPostId, deepLinkType, mounted]);

  const pinnedCount = useMemo(
    () => feedItems.filter((item) => item.type === "POST" && item.data?.pinned).length,
    [feedItems]
  );

  const pinnedPosts = useMemo(
    () => feedItems.filter((item) => item.type === "POST" && item.data?.pinned).map((item) => item.data),
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
      const targetTitle = (item.data?.title || item.title || "").toLowerCase();
      const targetDesc = (item.data?.description || item.description || "").toLowerCase();
      const rawContent = item.data?.content || "";

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
        (current as any[])?.map((item) =>
          item.id === postId || (item.type === "POST" && item.data?.postId === postId)
            ? { ...item, data: { ...item.data, pinned: nextPinState } }
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
        (current as any[])?.filter((item) => item.id !== postId && item.data?.postId !== postId) ?? [],
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

  const handleDeleteSurvey = (surveyId: string) => {
    mutate(
      (current) =>
        (current as any[])?.filter((item) => item.id !== surveyId && item.data?.surveyId !== surveyId) ?? [],
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
              className="bg-background rounded-xl border border-border/60 p-6 space-y-4 shadow-sm"
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
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-65 mt-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-gray-400 mb-4">
              <CalendarX size={30} className="text-red-500" />
            </div>
            {isSearchingOrFiltering ? (
              <>
                <h3 className="text-base font-bold text-gray-900 mb-1">No Results Found</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
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
                  onClick={() => { setSearchQuery(""); setActiveFilter(null); }}
                  className="mt-5 text-xs font-bold text-primary hover:text-primary-hover uppercase tracking-wider underline underline-offset-4 cursor-pointer"
                >
                  Clear Filters & Reset
                </button>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-gray-900 mb-1">No Posts Available</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
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
                      posts={[item.data]}
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
                      posts={[item.data]}
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
                      polls={[item.data]}
                      searchQuery={debouncedSearch}
                      onDeletePoll={(pollId) => console.log(pollId)}
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
                      survey={item.data}
                      role={role}
                      searchQuery={debouncedSearch}
                      onVisibilityChange={() => {}}
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
                      posts={[item.data]}
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
"use client";

import { useState, useMemo } from "react";
import SearchEvent from "./SearchEvent";
import { PinnedSection } from "./PinnedSection";
import { EventCard } from "./EventCard";
import { AnnouncementCard } from "./AnnouncementCard";
import { PollCard } from "./PollCard";
import { SurveyCard } from "./SurveyCard";
import { ArticleCard } from "./ArticleCard";
import { useCurrentUser } from "@/context/user-context";
import { useWorkspaceFeed } from "@/hooks/use-workspace-hook";
import { deletePostAction, togglePinAction } from "@/actions/post.action";
import { CalendarX } from "lucide-react";

interface FilteredFeedProps {
  groupid: string;
}

export default function FilteredFeed({ groupid }: FilteredFeedProps) {
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const role = currentUser?.role ?? "student";

  const { feedItems = [], isLoading: feedLoading, mutate } = useWorkspaceFeed(groupid, 1, 20);

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const pinnedCount = useMemo(() => {
    return feedItems.filter(item => item.type === "POST" && item.data?.pinned).length;
  }, [feedItems]);

  const handleTogglePin = async (postId: string, currentPinStatus: boolean) => {
    const nextPinState = !currentPinStatus;

    await mutate(
      (current) =>
        current?.map((item) =>
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
    mutate((current) => current?.filter((item) => item.id !== postId && item.data?.postId !== postId) ?? [], false);
    try {
      await deletePostAction(groupid, postId);
      mutate();
    } catch (error) {
      console.error(error);
      mutate();
    }
  };

  const handleDeleteSurvey = (surveyId: string) => {
    mutate((current) => current?.filter((item) => item.id !== surveyId && item.data?.surveyId !== surveyId) ?? [], false);
    setTimeout(() => mutate(), 800);
  };

  const processedTimeline = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (!feedItems || feedItems.length === 0) return [];

    const categoryFiltered = activeFilter
      ? feedItems.filter((item) => {
          const itemType = (item.subType || item.type || "").toLowerCase();
          return itemType === activeFilter.toLowerCase();
        })
      : feedItems;

    if (!q) return categoryFiltered;

    return categoryFiltered.filter((item) => {
      const titleMatch = item.title?.toLowerCase().includes(q);
      const descMatch = item.description?.toLowerCase().includes(q);
      
      const rawContent = item.data?.content;
      const contentMatch = typeof rawContent === "string" 
        ? rawContent.toLowerCase().includes(q) 
        : false;

      return titleMatch || descMatch || contentMatch;
    });
  }, [feedItems, activeFilter, searchQuery]);

  const pinnedPosts = useMemo(() => {
    return feedItems
      .filter((item) => item.type === "POST" && item.data?.pinned)
      .map((item) => item.data);
  }, [feedItems]);

  const isFeedEmpty = processedTimeline.length === 0;
  const isSearchingOrFiltering = searchQuery.trim() !== "" || activeFilter !== null;
  const isComponentLoading = feedLoading || userLoading;

  if (isComponentLoading) {
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

      {!searchQuery && pinnedPosts.length > 0 && (
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
                  <span className="font-semibold text-gray-800">{searchQuery}</span>
                  &rdquo;
                  {activeFilter && (
                    <span>
                      {" "}within the{" "}
                      <span className="font-semibold text-gray-800">
                        {activeFilter}
                    </span>{" "}
                      category
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
          processedTimeline.map((item) => {
            const resolvedType = (item.subType || item.type || "").toLowerCase();

            switch (resolvedType) {
              case "event":
                return (
                  <EventCard
                    key={item.id}
                    role={role}
                    posts={[item.data]}
                    searchQuery={searchQuery}
                    onDeletePost={handleDeletePost}
                    groupid={groupid}
                    pinnedCount={pinnedCount}
                    onTogglePin={handleTogglePin}
                  />
                );

              case "announcement":
                return (
                  <AnnouncementCard
                    key={item.id}
                    role={role}
                    posts={[item.data]}
                    searchQuery={searchQuery}
                    onDeletePost={handleDeletePost}
                    groupid={groupid}
                  />
                );

              case "poll":
                return (
                  <PollCard
                    key={item.id}
                    role={role}
                    polls={[item.data]}
                    searchQuery={searchQuery}
                    onDeletePoll={(pollId) => console.log(pollId)}
                  />
                );

              case "survey":
                return (
                  <SurveyCard
                    key={item.id}
                    survey={item.data}
                    role={role}
                    searchQuery={searchQuery}
                    onVisibilityChange={() => {}}
                    onDelete={handleDeleteSurvey}
                  />
                );

              case "article":
                return (
                  <ArticleCard
                    key={item.id}
                    role={role}
                    posts={[item.data]}
                    searchQuery={searchQuery}
                    onDeletePost={handleDeletePost}
                    groupId={groupid}
                  />
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
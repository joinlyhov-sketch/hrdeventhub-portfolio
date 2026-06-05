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
import { useWorkspacePosts } from "@/hooks/use-workspace-posts";
import { useWorkspacePolls } from "@/hooks/use-workspace-polls";
import { deletePostAction } from "@/actions/post.action";
import { Post } from "@/types/posts";

interface FilteredFeedProps {
  groupid: string;
}

export default function FilteredFeed({ groupid }: FilteredFeedProps) {
  const { currentUser } = useCurrentUser();
  const role = currentUser?.role ?? "student";

  const { posts, isLoading: postsLoading, mutate } = useWorkspacePosts(groupid);
  const { polls, isLoading: pollsLoading } = useWorkspacePolls(groupid);

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleDeletePost = async (postId: string) => {
    mutate(
      (current) => current?.filter((p) => p.postId !== postId) ?? [],
      false,
    );
    try {
      await deletePostAction(groupid, postId);
      mutate();
    } catch (error) {
      console.error("Failed to delete post:", error);
      mutate();
    }
  };

  const chronologicalPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [posts]);

  const postsByCategory = useMemo(
    () => ({
      event: chronologicalPosts.filter((p) => p.category === "event"),
      announcement: chronologicalPosts.filter(
        (p) => p.category === "announcement",
      ),
      poll: chronologicalPosts.filter((p) => p.category === "poll"),
      survey: chronologicalPosts.filter((p) => p.category === "survey"),
      article: chronologicalPosts.filter((p) => p.category === "article"),
    }),
    [chronologicalPosts],
  );

  const filteredPolls = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return polls;
    return polls.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q)
    );
  }, [polls, searchQuery]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return postsByCategory;
    const filterPosts = (list: Post[]) =>
      list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q),
      );
    return {
      event: filterPosts(postsByCategory.event),
      announcement: filterPosts(postsByCategory.announcement),
      survey: filterPosts(postsByCategory.survey),
      article: filterPosts(postsByCategory.article),
    };
  }, [postsByCategory, searchQuery]);

  const isCategoryActive = (type: string) =>
    !activeFilter || activeFilter === type;

  const isFeedEmpty =
    (!isCategoryActive("event") || filtered.event.length === 0) &&
    (!isCategoryActive("announcement") || filtered.announcement.length === 0) &&
    (!isCategoryActive("poll") || filteredPolls.length === 0) &&
    (!isCategoryActive("survey") || filtered.survey.length === 0) &&
    (!isCategoryActive("article") || filtered.article.length === 0);

  const pinnedPosts = useMemo(
    () => chronologicalPosts.filter((p) => p.pinned),
    [chronologicalPosts],
  );

  const isLoading = postsLoading || pollsLoading;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-background rounded-xl border border-border p-5 h-48 animate-pulse"
          />
        ))}
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
        isEmpty={isFeedEmpty}
      />


      {!searchQuery && !isFeedEmpty && <PinnedSection posts={pinnedPosts} groupid={groupid} />}

      <div className="space-y-4">
        {isCategoryActive("event") && filtered.event.length > 0 && (
          <EventCard
            role={role}
            posts={filtered.event}
            searchQuery={searchQuery}
            onDeletePost={handleDeletePost}
            groupid={groupid}
          />
        )}
        {isCategoryActive("announcement") &&
          filtered.announcement.length > 0 && (
            <AnnouncementCard
              role={role}
              posts={filtered.announcement}
              searchQuery={searchQuery}
              onDeletePost={handleDeletePost}
            />
          )}
     {/* {isCategoryActive("poll") && filtered.poll.length > 0 && (
          <PollCard
            role={role}
            polls={filteredPolls}
            searchQuery={searchQuery}
            onDeletePoll={(pollId) => console.log("delete poll", pollId)}
          />
        )} */}
        {/* {isCategoryActive("article") && filtered.article.length > 0 && (
          <ArticleCard
            role={role}
            posts={filtered.article}
            searchQuery={searchQuery}
            onDeletePost={handleDeletePost}
          />
        )}  */}
      </div>
    </div>
  );
}
"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import SearchEvent from "./SearchEvent";
import { PinnedSection } from "./PinnedSection";
import { EventCard } from "./EventCard";
import { AnnouncementCard } from "./AnnouncementCard";
import { PollCard } from "./PollCard";
import { SurveyCard } from "./SurveyCard";
import { ArticleCard } from "./ArticleCard";
import { useCurrentUser } from "@/context/user-context";
import { useWorkspacePosts } from "@/hooks/use-workspace-posts";
import { Post } from "@/types/posts";

export default function FilteredFeed() {
  const { currentUser } = useCurrentUser();
  const role = currentUser?.role ?? "student";
  const params = useParams();
  const workspaceId = params.groupId as string;

  const { posts, isLoading } = useWorkspacePosts(workspaceId);

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Split posts by category
  const postsByCategory = useMemo(() => {
    return {
      event: posts.filter((p) => p.category === "event"),
      announcement: posts.filter((p) => p.category === "announcement"),
      poll: posts.filter((p) => p.category === "poll"),
      survey: posts.filter((p) => p.category === "survey"),
      article: posts.filter((p) => p.category === "article"),
    };
  }, [posts]);

  // Filter by search query
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return postsByCategory;
    const filterPosts = (list: Post[]) =>
      list.filter((p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));
    return {
      event: filterPosts(postsByCategory.event),
      announcement: filterPosts(postsByCategory.announcement),
      poll: filterPosts(postsByCategory.poll),
      survey: filterPosts(postsByCategory.survey),
      article: filterPosts(postsByCategory.article),
    };
  }, [postsByCategory, searchQuery]);

  const isCategoryActive = (type: string) => !activeFilter || activeFilter === type;

  const isFeedEmpty =
    (!isCategoryActive("event") || filtered.event.length === 0) &&
    (!isCategoryActive("announcement") || filtered.announcement.length === 0) &&
    (!isCategoryActive("poll") || filtered.poll.length === 0) &&
    (!isCategoryActive("survey") || filtered.survey.length === 0) &&
    (!isCategoryActive("article") || filtered.article.length === 0);

  const pinnedPosts = useMemo(() => posts.filter((p) => p.pinned), [posts]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-background rounded-xl border border-border p-5 h-48 animate-pulse" />
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

      {/* {!searchQuery && !isFeedEmpty && <PinnedSection posts={pinnedPosts} />} */}

      <div className="space-y-4">
        {isCategoryActive("event") && filtered.event.length > 0 && (
          <EventCard role={role} posts={filtered.event} searchQuery={searchQuery} />
        )}
        {isCategoryActive("announcement") && filtered.announcement.length > 0 && (
          <AnnouncementCard role={role} posts={filtered.announcement} searchQuery={searchQuery} />
        )}
        {/* {isCategoryActive("poll") && filtered.poll.length > 0 && (
          <PollCard role={role} posts={filtered.poll} searchQuery={searchQuery} />
        )}
        {isCategoryActive("survey") && filtered.survey.length > 0 && (
          <SurveyCard role={role} posts={filtered.survey} searchQuery={searchQuery} />
        )} */}
        {isCategoryActive("article") && filtered.article.length > 0 && (
          <ArticleCard role={role} posts={filtered.article} searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
}
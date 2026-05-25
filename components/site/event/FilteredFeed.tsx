"use client";

import { useState, useEffect } from "react";
import type { UserRole } from "../../../data/mock-user";
import SearchEvent from "./SearchEvent";
import { PinnedSection } from "./PinnedSection";
import { EventCard } from "./EventCard";
import { AnnouncementCard } from "./AnnouncementCard";
import { PollCard } from "./PollCard";
import { SurveyCard } from "./SurveyCard";
import { ArticleCard } from "./ArticleCard";

interface FilteredFeedProps {
  role: UserRole;
}

export default function FilteredFeed({ role }: FilteredFeedProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [visibleCards, setVisibleCards] = useState<{ [key: string]: boolean }>({
    event: true,
    announcement: true,
    poll: true,
    survey: true,
    article: true,
  });

  useEffect(() => {
    setVisibleCards({
      event: true,
      announcement: true,
      poll: true,
      survey: true,
      article: true,
    });
  }, [searchQuery, activeFilter]);

  const handleCardVisibility = (type: string, hasResults: boolean) => {
    if (visibleCards[type] !== hasResults) {
      setVisibleCards((prev) => ({ ...prev, [type]: hasResults }));
    }
  };

  const isCategoryActive = (type: string) => !activeFilter || activeFilter === type;

  const isFeedEmpty = 
    (!isCategoryActive("event") || !visibleCards.event) &&
    (!isCategoryActive("announcement") || !visibleCards.announcement) &&
    (!isCategoryActive("poll") || !visibleCards.poll) &&
    (!isCategoryActive("survey") || !visibleCards.survey) &&
    (!isCategoryActive("article") || !visibleCards.article);

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
      
      {!searchQuery && !isFeedEmpty && <PinnedSection />}
      
      <div className="space-y-4">
        {isCategoryActive("event") && (
          <EventCard 
            searchQuery={searchQuery} 
            onVisibilityChange={(hasItems) => handleCardVisibility("event", hasItems)}
          />
        )}
        {isCategoryActive("announcement") && (
          <AnnouncementCard 
            searchQuery={searchQuery} 
            onVisibilityChange={(hasItems) => handleCardVisibility("announcement", hasItems)}
          />
        )}
        {isCategoryActive("poll") && (
          <PollCard 
            searchQuery={searchQuery} 
            onVisibilityChange={(hasItems) => handleCardVisibility("poll", hasItems)}
          />
        )}
        {isCategoryActive("survey") && (
          <SurveyCard 
            searchQuery={searchQuery} 
            onVisibilityChange={(hasItems) => handleCardVisibility("survey", hasItems)}
          />
        )}
        {isCategoryActive("article") && (
          <ArticleCard 
            searchQuery={searchQuery} 
            onVisibilityChange={(hasItems) => handleCardVisibility("article", hasItems)}
          />
        )}
      </div>
    </div>
  );
}
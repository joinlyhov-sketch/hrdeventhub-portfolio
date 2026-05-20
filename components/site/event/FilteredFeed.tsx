"use client";

import { useState } from "react";
import SearchEvent from "./SearchEvent";
import { PinnedSection } from "./PinnedSection";
import { EventCard } from "./EventCard";
import { AnnouncementCard } from "./AnnouncementCard";
import { PollCard } from "./PollCard";
import { SurveyCard } from "./SurveyCard";
import { ArticleCard } from "./ArticleCard";

interface FilteredFeedProps {
  role: "admin" | "student";
}

export default function FilteredFeed({ role }: FilteredFeedProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <SearchEvent 
        role={role} 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />
      <PinnedSection />
      <div className="space-y-4">
        {(!activeFilter || activeFilter === "event") && <EventCard />}
        {(!activeFilter || activeFilter === "announcement") && <AnnouncementCard />}
        {(!activeFilter || activeFilter === "poll") && <PollCard />}
        {(!activeFilter || activeFilter === "survey") && <SurveyCard />}
        {(!activeFilter || activeFilter === "article") && <ArticleCard />}
      </div>
    </div>
  );
}
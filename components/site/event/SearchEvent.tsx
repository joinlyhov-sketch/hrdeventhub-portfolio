"use client";

import { useParams } from "next/navigation";
import {
  FileText,
  Megaphone,
  Calendar,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import type { UserRole } from "@/context/user-context";
import Search from "../../site/search/Search";
import ContentTypePopover from "../pop-up/contents/pop-over-content";
import { PopoverItem } from "../pop-up/contents/pop-over-content";
import CategoryFilterPopover, {
  FilterOption,
} from "@/components/site/pop-up/contents/CategoryFilterPopover";

interface SearchEventProps {
  role: UserRole;
  onFilterChange: (category: string | null) => void;
  activeFilter: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function SearchEvent({
  role,
  onFilterChange,
  activeFilter,
  searchQuery,
  onSearchChange,
}: SearchEventProps) {
  const params = useParams();
  const groupId = params.groupid;
  
  const getCreationRoute = (value: string) => {
    if (groupId && groupId !== "null") {
      return `/event-management/creation/${value}?groupId=${groupId}`;
    }
    return `/event-management/creation/${value}`;
  };

  const filterCategories: FilterOption[] = [
    { label: "Announcement", value: "announcement", icon: Megaphone },
    { label: "Article", value: "article", icon: FileText },
    { label: "Event", value: "event", icon: Calendar },
    { label: "Survey", value: "survey", icon: CheckCircle2 },
    { label: "Poll", value: "poll", icon: BarChart3 },
  ];

  const contentMenuOptions: PopoverItem[] = [
    {
      label: "Announcement",
      icon: Megaphone,
      href: getCreationRoute("announcement"),
    },
    { label: "Article", icon: FileText, href: getCreationRoute("article") },
    { label: "Event", icon: Calendar, href: getCreationRoute("event") },
    { label: "Survey", icon: CheckCircle2, href: getCreationRoute("survey") },
    { label: "Poll", icon: BarChart3, href: getCreationRoute("poll") },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 sm:gap-2 relative">
        <div className="relative grow">
          <Search
            value={searchQuery || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search for events..."
          />
        </div>

        <CategoryFilterPopover
          options={filterCategories}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
        {role === "admin" || role === "organizer" && <ContentTypePopover items={contentMenuOptions} />}
      </div>
    </div>
  );
}
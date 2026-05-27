"use client";

import { useParams } from "next/navigation";
import {
  FileText,
  Megaphone,
  Calendar,
  CheckCircle2,
  BarChart3,
  CalendarX,
} from "lucide-react";
import type { UserRole } from "../../../data/mock-user";
import Search from "../../site/search/Search";
import ContentTypePopover from "../pop-up/contents/pop-over-content";
import { PopoverItem } from "../pop-up/contents/pop-over-content";
import CategoryFilterPopover, { FilterOption } from "@/components/site/pop-up/contents/CategoryFilterPopover";

interface SearchEventProps {
  role: UserRole;
  onFilterChange: (category: string | null) => void;
  activeFilter: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isEmpty?: boolean;
}

export default function SearchEvent({
  role,
  onFilterChange,
  activeFilter,
  searchQuery,
  onSearchChange,
  isEmpty = false,
}: SearchEventProps) {
  const params = useParams();
  const groupId = params.groupId;
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
  { label: "Announcement", icon: Megaphone, href: getCreationRoute("announcement") },
  { label: "Article", icon: FileText, href: getCreationRoute("article") },
  { label: "Event", icon: Calendar, href: getCreationRoute("event") },
  { label: "Survey", icon: CheckCircle2, href: getCreationRoute("survey") },
  { label: "Poll", icon: BarChart3, href: getCreationRoute("poll") }
];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center gap-2 relative">
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
        {role === "admin" && (
          <ContentTypePopover items={contentMenuOptions}/>
        )}
      </div>

      {isEmpty && (
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-65 mt-6 animate-in fade-in zoom-in-95 duration-150">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-gray-400 mb-4">
            <CalendarX size={30} className="text-red-500" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            No matching items found
          </h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
            We couldn&apos;t find any results matching &ldquo;
            <span className="font-medium text-gray-700">{searchQuery}</span>
            &rdquo;
            {activeFilter && (
              <span>
                {" "}
                in{" "}
                <span className="font-medium text-gray-700">
                  {activeFilter}
                </span>
              </span>
            )}
            . Try checking your spelling or changing options.
          </p>
          {(searchQuery || activeFilter) && (
            <button
              onClick={() => {
                onSearchChange("");
                onFilterChange(null);
              }}
              className="mt-5 text-xs font-bold text-primary hover:text-primary-hover uppercase tracking-wider underline underline-offset-4 cursor-pointer"
            >
              Reset Search Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
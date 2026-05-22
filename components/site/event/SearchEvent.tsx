"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Filter,
  Plus,
  FileText,
  Megaphone,
  Calendar,
  CheckCircle2,
  BarChart3,
  CalendarX,
} from "lucide-react";
import type { UserRole } from "../../../data/mock-user";
import Search from "../../site/search/Search";

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  const groupId = params.groupId;

  const categories = [
    { label: "Announcement", value: "announcement", icon: Megaphone },
    { label: "Article", value: "article", icon: FileText },
    { label: "Event", value: "event", icon: Calendar },
    { label: "Survey", value: "survey", icon: CheckCircle2 },
    { label: "Poll", value: "poll", icon: BarChart3 },
  ];

  const closeDetailsDropdown = (e: React.MouseEvent<HTMLElement>) => {
    const details = e.currentTarget.closest("details");
    if (details) details.removeAttribute("open");
  };

  const handleCreateNavigation = (value: string) => {
    setIsCreateOpen(false);
    if (groupId && groupId !== "null") {
      router.push(`/event-management/creation/${value}?groupId=${groupId}`);
    } else {
      router.push(`/event-management/creation/${value}`);
    }
  };

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

        <details className="relative group [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex items-center gap-2 bg-primary text-white px-3 py-3 rounded-full type-detail-semibold hover:bg-primary-hover transition-all cursor-pointer shadow-sm whitespace-nowrap list-none select-none">
            <Filter size={18} />
            {activeFilter ? `Category: ${activeFilter}` : "Filter by category"}
          </summary>
          <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={(e) =>
              e.currentTarget.closest("details")?.removeAttribute("open")
            }
          />

          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {activeFilter && (
              <button
                onClick={(e) => {
                  onFilterChange(null);
                  closeDetailsDropdown(e);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-xl transition-all mb-1 cursor-pointer"
              >
                Clear Filter
              </button>
            )}
            {categories.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={(e) => {
                    onFilterChange(option.value);
                    closeDetailsDropdown(e);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:cursor-pointer font-medium rounded-xl transition-all duration-150 relative z-50 ${
                    activeFilter === option.value
                      ? "bg-blue-50 text-primary font-semibold"
                      : "text-gray-600 hover:bg-blue-50/50 hover:text-blue-900"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      activeFilter === option.value
                        ? "text-primary"
                        : "text-gray-500"
                    }
                  />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </details>
        {role === "admin" && (
          <div className="relative">
            <button
              onClick={() => setIsCreateOpen(!isCreateOpen)}
              className="bg-primary  text-white rounded-full hover:bg-primary-hover transition-all cursor-pointer shadow-sm flex items-center justify-center overflow-hidden w-[40px] h-[40px] relative z-50"
            >
              <div
                className={`transform transition-transform duration-300 flex items-center justify-center ${isCreateOpen ? "rotate-45" : "rotate-0"}`}
              >
                <Plus size={20} />
              </div>
            </button>

            {isCreateOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsCreateOpen(false)}
                />

                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {categories.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleCreateNavigation(option.value)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50/50 hover:text-blue-900 rounded-xl transition-all duration-150 relative z-50 cursor-pointer"
                      >
                        <Icon
                          size={18}
                          className="text-gray-500 group-hover:text-blue-900"
                        />
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {isEmpty && (
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[260px] mt-6 animate-in fade-in zoom-in-95 duration-150">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-gray-400 mb-4">
            <CalendarX size={30} className="text-red-500" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            No matching items found
          </h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
            We couldn't find any results matching &ldquo;
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
